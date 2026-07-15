// FILE: backend/src/seed.js


import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Testimonial } from './models/Testimonial.js';
import { FAQ } from './models/FAQ.js';
import { LoanProduct } from './models/LoanProduct.js';
import { Settings } from './models/Settings.js';

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log(' Connected to MongoDB');

    // Clear existing data
    await Testimonial.deleteMany({});
    await FAQ.deleteMany({});
    await LoanProduct.deleteMany({});
    await Settings.deleteMany({});
    console.log(' Cleared existing data');

    // Seed Testimonials
    const testimonials = [
      {
        customerName: 'Chidi Okonkwo',
        customerRole: 'Small Business Owner',
        content: 'LoanFlow helped me expand my business with quick access to funds. The approval process was seamless and I received the money within 24 hours.',
        rating: 5,
        isActive: true,
        order: 1,
      },
      {
        customerName: 'Amina Bello',
        customerRole: 'Freelance Designer',
        content: 'I needed money to upgrade my equipment and LoanFlow made it so easy. The interest rates are fair and the repayment plan is flexible.',
        rating: 5,
        isActive: true,
        order: 2,
      },
      {
        customerName: 'Emeka Okafor',
        customerRole: 'Medical Student',
        content: 'As a student, getting a loan can be challenging. LoanFlow understood my needs and provided a student loan with favorable terms.',
        rating: 4,
        isActive: true,
        order: 3,
      },
    ];

    await Testimonial.insertMany(testimonials);
    console.log(' Seeded testimonials');

    // Seed FAQs
    const faqs = [
      {
        question: 'What types of loans do you offer?',
        answer: 'We offer personal loans, business loans, salary advances, and student loans. Each product has different terms and requirements tailored to specific needs.',
        category: 'general',
        order: 1,
        isActive: true,
      },
      {
        question: 'How long does it take to get approved?',
        answer: 'Most applications are approved within 24 hours. Some applications may take up to 48 hours if additional verification is needed.',
        category: 'loans',
        order: 2,
        isActive: true,
      },
      {
        question: 'What are the interest rates?',
        answer: 'Interest rates vary by product and range from 5% to 15% per annum. The exact rate depends on your credit profile and loan amount.',
        category: 'loans',
        order: 3,
        isActive: true,
      },
      {
        question: 'How do I make repayments?',
        answer: 'You can make repayments through our secure payment system using bank transfer, card payment, or direct debit. Payments are automatically tracked.',
        category: 'repayment',
        order: 4,
        isActive: true,
      },
      {
        question: 'Is my information secure?',
        answer: 'Yes, we use bank-level security protocols including data encryption, secure authentication, and regular security audits to protect your information.',
        category: 'account',
        order: 5,
        isActive: true,
      },
      {
        question: 'Can I repay my loan early?',
        answer: 'Yes, you can repay your loan early without any penalties. This can help you save on interest charges.',
        category: 'repayment',
        order: 6,
        isActive: true,
      },
    ];

    await FAQ.insertMany(faqs);
    console.log(' Seeded FAQs');

    // Seed Loan Products
    const loanProducts = [
      {
        name: 'Personal Loan',
        description: 'Quick funding for personal needs, medical expenses, home improvements, or travel.',
        minAmount: 50000,
        maxAmount: 5000000,
        interestRate: 12,
        processingFee: 2.5,
        repaymentPeriod: 12,
        features: ['No collateral required', 'Quick approval', 'Flexible repayment'],
        iconName: 'UserIcon',
        color: 'blue',
        isActive: true,
      },
      {
        name: 'Business Loan',
        description: 'Grow your business with capital for inventory, equipment, or expansion.',
        minAmount: 100000,
        maxAmount: 50000000,
        interestRate: 10,
        processingFee: 2,
        repaymentPeriod: 24,
        features: ['Business expansion', 'Equipment purchase', 'Working capital'],
        iconName: 'BriefcaseIcon',
        color: 'green',
        isActive: true,
      },
      {
        name: 'Salary Advance',
        description: 'Access a portion of your salary before payday for urgent financial needs.',
        minAmount: 10000,
        maxAmount: 1000000,
        interestRate: 5,
        processingFee: 1,
        repaymentPeriod: 1,
        features: ['Same-day approval', 'Low interest', 'Short-term commitment'],
        iconName: 'CurrencyDollarIcon',
        color: 'purple',
        isActive: true,
      },
      {
        name: 'Student Loan',
        description: 'Affordable loans for educational expenses including tuition, books, and living costs.',
        minAmount: 20000,
        maxAmount: 2000000,
        interestRate: 8,
        processingFee: 1.5,
        repaymentPeriod: 18,
        features: ['Lower rates', 'Deferred payment option', 'Educational focus'],
        iconName: 'AcademicCapIcon',
        color: 'orange',
        isActive: true,
      },
    ];

    await LoanProduct.insertMany(loanProducts);
    console.log(' Seeded loan products');

    // Seed Settings
    const settings = [
      {
        key: 'hero',
        value: {
          heading: 'Get Fast, Flexible Loans When You Need Them Most',
          subheading: 'Apply in minutes, get approval within 24 hours, and access funds to grow your business or handle personal needs',
          ctaText: 'Apply Now',
          ctaLink: '/auth/register',
          secondaryCtaText: 'Learn More',
          secondaryCtaLink: '#features',
          imageUrl: null,
          isActive: true,
        },
      },
      {
        key: 'stats',
        value: {
          customers: '10,000+',
          disbursed: '₦50 Billion',
          approvalRate: '98%',
          processingTime: '24-Hour',
          customersLabel: 'Happy Customers',
          disbursedLabel: 'Disbursed to Date',
          approvalRateLabel: 'Approval Rate',
          processingTimeLabel: 'Average Processing',
        },
      },
      {
        key: 'features',
        value: [
          {
            title: 'Fast Approval',
            description: 'Get approved within 24 hours with our automated system',
            icon: 'RocketLaunchIcon',
            color: 'blue',
          },
          {
            title: 'Flexible Repayment',
            description: 'Choose from multiple repayment options that suit your needs',
            icon: 'CalendarIcon',
            color: 'green',
          },
          {
            title: 'Low Interest Rates',
            description: 'Competitive rates with transparent fee structure',
            icon: 'ShieldCheckIcon',
            color: 'purple',
          },
          {
            title: 'Secure & Trusted',
            description: 'Bank-level security for your peace of mind',
            icon: 'LockClosedIcon',
            color: 'orange',
          },
        ],
      },
      {
        key: 'steps',
        value: [
          {
            title: 'Create Account',
            description: 'Sign up and complete your profile in minutes',
          },
          {
            title: 'Apply for Loan',
            description: 'Choose your loan amount and submit application',
          },
          {
            title: 'Get Funded',
            description: 'Receive funds once approved',
          },
        ],
      },
    ];

    await Settings.insertMany(settings);
    console.log(' Seeded settings');

    console.log(' Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error(' Seeding failed:', error.message);
    process.exit(1);
  }
};

seedData();