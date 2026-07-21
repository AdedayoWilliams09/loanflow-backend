// FILE: backend/src/services/emailService.js
import nodemailer from 'nodemailer';
import { google } from 'googleapis';
import dotenv from 'dotenv';

// Ensure environment variables are loaded immediately
dotenv.config();

/**
 * Email Service
 * 
 *  Child Explanation:
 * "This is the mailroom that sends emails to customers and support team."
 * 
 *  Technical Explanation:
 * "Email service using Nodemailer with Google OAuth2 for sending emails."
 */

/**
 * Create Email Transporter
 * 
 * 🧒 Child Explanation:
 * "This sets up the connection to Gmail so we can send emails."
 * 
 * 👨‍💻 Technical Explanation:
 * "Creates a Nodemailer transporter with OAuth2 authentication."
 */
const createTransporter = async () => {
  try {
    const oAuth2Client = new google.auth.OAuth2(
      process.env.GMAIL_CLIENT_ID,
      process.env.GMAIL_CLIENT_SECRET,
      process.env.GMAIL_CALLBACK_URL || 'https://developers.google.com/oauthplayground'
    );

    oAuth2Client.setCredentials({
      refresh_token: process.env.GMAIL_REFRESH_TOKEN,
    });

    const accessToken = await oAuth2Client.getAccessToken();

    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: process.env.GMAIL_USER,
        clientId: process.env.GMAIL_CLIENT_ID,
        clientSecret: process.env.GMAIL_CLIENT_SECRET,
        refreshToken: process.env.GMAIL_REFRESH_TOKEN,
        accessToken: accessToken.token,
      },
    });
  } catch (error) {
    console.error('❌ Email transporter creation failed:', error.message);
    throw new Error('Failed to create email transporter');
  }
};

/**
 * Send Contact Form Email
 */
export const sendContactEmail = async (data, ipAddress, userAgent) => {
  try {
    const transporter = await createTransporter();
    
    // Send to support team
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
              ${data.phone ? `
              <div class="field">
                <div class="label">Phone:</div>
                <div class="value">${data.phone}</div>
              </div>
              ` : ''}
              <div class="field">
                <div class="label">Subject:</div>
                <div class="value">${data.subject}</div>
              </div>
              <div class="field">
                <div class="label">Message:</div>
                <div class="value">${data.message.replace(/\n/g, '<br>')}</div>
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
    
    await transporter.sendMail(supportMailOptions);
    console.log('✅ Support notification email sent');

    // Send auto-reply to user
    const replyMailOptions = {
      from: `"LoanFlow Support" <${process.env.GMAIL_USER}>`,
      to: data.email,
      subject: 'Thank You for Contacting LoanFlow',
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
    
    await transporter.sendMail(replyMailOptions);
    console.log('✅ Auto-reply email sent to user');

    return { success: true };
  } catch (error) {
    console.error('❌ Email sending failed:', error.message);
    throw new Error(`Failed to send email: ${error.message}`);
  }
};

/**
 * Send Test Email
 */
export const sendTestEmail = async (to) => {
  try {
    const transporter = await createTransporter();
    
    const mailOptions = {
      from: `"LoanFlow" <${process.env.GMAIL_USER}>`,
      to: to || process.env.GMAIL_USER,
      subject: 'LoanFlow Email Test',
      html: `
        <h1>Email Configuration Test</h1>
        <p>If you're receiving this email, your email configuration is working correctly!</p>
        <p>Sent at: ${new Date().toISOString()}</p>
      `,
    };
    
    await transporter.sendMail(mailOptions);
    console.log('✅ Test email sent successfully');
    return { success: true };
  } catch (error) {
    console.error('❌ Test email failed:', error.message);
    throw new Error(`Failed to send test email: ${error.message}`);
  }
};

export default {
  sendContactEmail,
  sendTestEmail,
};