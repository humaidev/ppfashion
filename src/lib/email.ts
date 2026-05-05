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
