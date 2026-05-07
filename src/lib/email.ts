import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVER_HOST,
  port: parseInt(process.env.EMAIL_SERVER_PORT || '587'),
  secure: process.env.EMAIL_SERVER_PORT === '465', // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
});

export const sendVerificationEmail = async (email: string, code: string) => {
  const mailOptions = {
    from: `"Passion for Pakistani Fashion" <${process.env.EMAIL_FROM || 'noreply@ppfashion.com'}>`,
    to: email,
    subject: 'Action Required: Verify Your Identity',
    html: `
      <div style="font-family: 'serif', 'Times New Roman', serif; background-color: #050505; color: #ffffff; padding: 60px; max-width: 600px; margin: 0 auto; border: 1px solid #e8d19620;">
        <h1 style="color: #e8d196; text-transform: uppercase; letter-spacing: 0.4em; font-size: 10px; margin-bottom: 20px;">Identity Verification</h1>
        <h2 style="font-size: 32px; font-weight: bold; margin-bottom: 30px; letter-spacing: -0.05em;">Welcome to the Collective</h2>
        <p style="color: rgba(255,255,255,0.6); font-size: 14px; line-height: 1.6; margin-bottom: 40px;">
          Your elite designer account has been initialized. To finalize your registration and access the global collective, please enter the following 6-digit verification dossier in your dashboard.
        </p>
        <div style="background-color: rgba(232,209,150,0.1); border: 1px solid #e8d19640; padding: 40px; text-align: center; margin-bottom: 40px;">
          <span style="font-size: 48px; color: #e8d196; letter-spacing: 0.5em; font-weight: bold;">${code}</span>
        </div>
        <p style="color: rgba(255,255,255,0.2); font-size: 10px; text-transform: uppercase; letter-spacing: 0.2em;">
          This code is valid for a limited duration. If you did not initiate this registration, please disregard this transmission.
        </p>
        <div style="margin-top: 60px; border-top: 1px solid rgba(255,255,255,0.1); pt-20px;">
          <p style="color: #e8d196; font-size: 12px; font-weight: bold;">PASSION FOR PAKISTANI FASHION</p>
          <p style="color: rgba(255,255,255,0.4); font-size: 10px;">The Elite Global Collective</p>
        </div>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email dispatched: %s', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Email dispatch error:', error);
    return { success: false, error };
  }
};

export const sendPaymentConfirmationEmail = async (email: string, planName: string, amount: number, cardLast4: string) => {
  const mailOptions = {
    from: `"PPFashion Luxury" <${process.env.EMAIL_FROM || 'noreply@ppfashion.com'}>`,
    to: email,
    subject: 'Confirmation: Your Elite Membership is Active',
    html: `
      <div style="font-family: 'serif', 'Times New Roman', serif; background-color: #050505; color: #ffffff; padding: 60px; max-width: 600px; margin: 0 auto; border: 1px solid #e8d19620;">
        <h1 style="color: #e8d196; text-transform: uppercase; letter-spacing: 0.4em; font-size: 10px; margin-bottom: 20px;">Payment Confirmed</h1>
        <h2 style="font-size: 32px; font-weight: bold; margin-bottom: 30px; letter-spacing: -0.05em;">Welcome to the Inner Circle</h2>
        <p style="color: rgba(255,255,255,0.6); font-size: 14px; line-height: 1.6; margin-bottom: 40px;">
          Your transition to the <strong>${planName}</strong> plan is complete. Your status in the collective has been elevated.
        </p>
        <div style="background-color: rgba(232,209,150,0.05); border-left: 4px solid #e8d196; padding: 30px; margin-bottom: 40px;">
          <p style="font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em; color: rgba(255,255,255,0.4); margin: 0 0 10px 0;">Transaction Details</p>
          <p style="font-size: 18px; color: #ffffff; margin: 0;">Plan: ${planName}</p>
          <p style="font-size: 18px; color: #ffffff; margin: 5px 0 0 0;">Amount: £${amount}</p>
          <p style="font-size: 12px; color: rgba(255,255,255,0.3); margin: 10px 0 0 0;">Card ending in: ${cardLast4}</p>
        </div>
        <p style="color: rgba(255,255,255,0.4); font-size: 12px; line-height: 1.6;">
          Your benefits are now active. You can apply for upcoming shows and manage your digital dossier immediately.
        </p>
        <div style="margin-top: 60px; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 20px;">
          <p style="color: #e8d196; font-size: 12px; font-weight: bold;">PASSION FOR PAKISTANI FASHION</p>
          <p style="color: rgba(255,255,255,0.4); font-size: 10px;">The Elite Global Collective</p>
        </div>
      </div>
    `,
  };
  return transporter.sendMail(mailOptions);
};

export const sendExpiryReminderEmail = async (email: string, daysLeft: number) => {
  const mailOptions = {
    from: `"PPFashion Maintenance" <${process.env.EMAIL_FROM || 'noreply@ppfashion.com'}>`,
    to: email,
    subject: 'Urgent: Membership Renewal Notice',
    html: `
      <div style="font-family: 'serif', 'Times New Roman', serif; background-color: #050505; color: #ffffff; padding: 60px; max-width: 600px; margin: 0 auto; border: 1px solid #e8d19620;">
        <h1 style="color: #ff4d4d; text-transform: uppercase; letter-spacing: 0.4em; font-size: 10px; margin-bottom: 20px;">Membership Intelligence</h1>
        <h2 style="font-size: 32px; font-weight: bold; margin-bottom: 30px; letter-spacing: -0.05em;">Maintain Your Visibility</h2>
        <p style="color: rgba(255,255,255,0.6); font-size: 14px; line-height: 1.6; margin-bottom: 40px;">
          Our system indicates that your elite membership will expire in <strong>${daysLeft} days</strong>. To ensure uninterrupted access to the collective and maintain your listings, please renew your plan.
        </p>
        <div style="text-align: center; margin-bottom: 40px;">
          <a href="${process.env.NEXT_PUBLIC_URL}/membership" style="background-color: #e8d196; color: #050505; text-decoration: none; padding: 20px 40px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.2em; font-size: 12px; display: inline-block;">Renew Membership</a>
        </div>
        <p style="color: rgba(255,255,255,0.3); font-size: 11px; font-style: italic;">
          Note: Expired accounts are temporarily delisted from the public directory until renewal is completed.
        </p>
        <div style="margin-top: 60px; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 20px;">
          <p style="color: #e8d196; font-size: 12px; font-weight: bold;">PASSION FOR PAKISTANI FASHION</p>
          <p style="color: rgba(255,255,255,0.4); font-size: 10px;">The Elite Global Collective</p>
        </div>
      </div>
    `,
  };
  return transporter.sendMail(mailOptions);
};
