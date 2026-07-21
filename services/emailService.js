// FILE: backend/src/services/emailService.js
import { google } from "googleapis";
import MailComposer from "nodemailer/lib/mail-composer/index.js";
import dotenv from "dotenv";

dotenv.config();

/**
 * Creates and authenticates the Gmail API Client
 */
const getGmailClient = () => {
  const oAuth2Client = new google.auth.OAuth2(
    process.env.GMAIL_CLIENT_ID,
    process.env.GMAIL_CLIENT_SECRET,
    process.env.GMAIL_CALLBACK_URL || "https://developers.google.com/oauthplayground"
  );

  oAuth2Client.setCredentials({
    refresh_token: process.env.GMAIL_REFRESH_TOKEN,
  });

  return google.gmail({ version: "v1", auth: oAuth2Client });
};

/**
 * Helper to compose raw email MIME and send via Gmail HTTP API
 */
const sendMailViaHttp = async (mailOptions) => {
  const gmail = getGmailClient();
  const composer = new MailComposer(mailOptions);
  const message = await composer.compile().build();

  // Convert email buffer to base64url format required by Gmail API
  const rawMessage = Buffer.from(message)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

  const res = await gmail.users.messages.send({
    userId: "me",
    requestBody: {
      raw: rawMessage,
    },
  });

  return res.data;
};

/**
 * Send Contact Form Email
 */
export const sendContactEmail = async (data, ipAddress, userAgent) => {
  try {
    // 1. Send Support Notification Email
    const supportMailOptions = {
      from: `"LoanFlow Contact" <${process.env.GMAIL_USER}>`,
      to: process.env.CONTACT_EMAIL || process.env.GMAIL_USER,
      replyTo: data.email,
      subject: `New Contact Form: ${data.subject}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #4f46e5; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background: #f9fafb; }
            .field { margin-bottom: 15px; }
            .label { font-weight: bold; color: #4f46e5; }
            .value { margin-top: 5px; }
            .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>New Contact Form Submission</h1>
            </div>
            <div class="content">
              <div class="field">
                <div class="label">Name:</div>
                <div class="value">${data.name}</div>
              </div>
              <div class="field">
                <div class="label">Email:</div>
                <div class="value">${data.email}</div>
              </div>
              ${
                data.phone
                  ? `
              <div class="field">
                <div class="label">Phone:</div>
                <div class="value">${data.phone}</div>
              </div>
              `
                  : ""
              }
              <div class="field">
                <div class="label">Subject:</div>
                <div class="value">${data.subject}</div>
              </div>
              <div class="field">
                <div class="label">Message:</div>
                <div class="value">${data.message.replace(/\n/g, "<br>")}</div>
              </div>
              <hr>
              <div style="font-size: 12px; color: #6b7280;">
                <p>Submitted from IP: ${ipAddress}</p>
                <p>User Agent: ${userAgent}</p>
              </div>
            </div>
            <div class="footer">
              <p>This email was sent from the LoanFlow contact form.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    await sendMailViaHttp(supportMailOptions);
    console.log("✅ Support notification email sent via HTTP API");

    // 2. Send Auto-reply to User
    const replyMailOptions = {
      from: `"LoanFlow Support" <${process.env.GMAIL_USER}>`,
      to: data.email,
      subject: "Thank You for Contacting LoanFlow",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #4f46e5; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background: #f9fafb; }
            .button { display: inline-block; padding: 10px 20px; background: #4f46e5; color: white; text-decoration: none; border-radius: 5px; }
            .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Thank You for Reaching Out!</h1>
            </div>
            <div class="content">
              <p>Dear ${data.name},</p>
              <p>We've received your message and will get back to you within 24 hours.</p>
              <p>In the meantime, you might find answers in our <a href="${process.env.FRONTEND_URL}/faq" style="color: #4f46e5;">FAQ section</a>.</p>
              <br>
              <p style="text-align: center;">
                <a href="${process.env.FRONTEND_URL}" class="button">Visit LoanFlow</a>
              </p>
              <br>
              <p>Best regards,<br><strong>The LoanFlow Team</strong></p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} LoanFlow. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    await sendMailViaHttp(replyMailOptions);
    console.log("✅ Auto-reply email sent to user via HTTP API");

    return { success: true };
  } catch (error) {
    console.error("❌ Email sending failed:", error.message);
    throw new Error(`Failed to send email: ${error.message}`);
  }
};

/**
 * Send Test Email
 */
export const sendTestEmail = async (to) => {
  try {
    const mailOptions = {
      from: `"LoanFlow" <${process.env.GMAIL_USER}>`,
      to: to || process.env.GMAIL_USER,
      subject: "LoanFlow Email Test",
      html: `
        <h1>Email Configuration Test</h1>
        <p>If you're receiving this email, your HTTP Gmail API configuration is working correctly!</p>
        <p>Sent at: ${new Date().toISOString()}</p>
      `,
    };

    await sendMailViaHttp(mailOptions);
    console.log("✅ Test email sent successfully via HTTP API");
    return { success: true };
  } catch (error) {
    console.error("❌ Test email failed:", error.message);
    throw new Error(`Failed to send test email: ${error.message}`);
  }
};

export default {
  sendContactEmail,
  sendTestEmail,
};