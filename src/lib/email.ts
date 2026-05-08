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

export const sendEventApplicationEmail = async (email: string, designerName: string, eventTitle: string, eventLocation: string, eventDate: string) => {
  const mailOptions = {
    from: `"PPFashion Events" <${process.env.EMAIL_FROM || 'noreply@ppfashion.com'}>`,
    to: email,
    subject: `Application Received: ${eventTitle}`,
    html: `
      <div style="font-family: 'serif', 'Times New Roman', serif; background-color: #050505; color: #ffffff; padding: 60px; max-width: 600px; margin: 0 auto; border: 1px solid #e8d19620;">
        <h1 style="color: #e8d196; text-transform: uppercase; letter-spacing: 0.4em; font-size: 10px; margin-bottom: 20px;">Event Application</h1>
        <h2 style="font-size: 32px; font-weight: bold; margin-bottom: 30px; letter-spacing: -0.05em;">Dossier Transmitted</h2>
        <p style="color: rgba(255,255,255,0.6); font-size: 14px; line-height: 1.6; margin-bottom: 40px;">
          Respected ${designerName}, your application for <strong>${eventTitle}</strong> has been received by the elite jury.
        </p>
        <div style="background-color: rgba(232,209,150,0.05); border-left: 4px solid #e8d196; padding: 30px; margin-bottom: 40px;">
          <p style="font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em; color: rgba(255,255,255,0.4); margin: 0 0 10px 0;">Event Logistics</p>
          <p style="font-size: 18px; color: #ffffff; margin: 0;">Show: ${eventTitle}</p>
          <p style="font-size: 18px; color: #ffffff; margin: 5px 0 0 0;">Venue: ${eventLocation}</p>
          <p style="font-size: 14px; color: rgba(255,255,255,0.6); margin: 10px 0 0 0;">Schedule: ${eventDate}</p>
        </div>
        <p style="color: rgba(255,255,255,0.4); font-size: 12px; line-height: 1.6;">
          Our curation team will review your portfolio and digital dossier. You will receive a formal notification once a decision has been reached.
        </p>
        <div style="margin-top: 60px; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 20px;">
          <p style="color: #e8d196; font-size: 12px; font-weight: bold;">PASSION FOR PAKISTANI FASHION</p>
          <p style="color: rgba(255,255,255,0.4); font-size: 10px;">Global Showcases & Exhibitions</p>
        </div>
      </div>
    `,
  };
  return transporter.sendMail(mailOptions);
};

export const sendEventStatusEmail = async (email: string, designerName: string, eventTitle: string, status: 'APPROVED' | 'REJECTED', eventLocation?: string, eventDate?: string, feedback?: string) => {
  const isApproved = status === 'APPROVED';
  const mailOptions = {
    from: `"PPFashion Selection Jury" <${process.env.EMAIL_FROM || 'noreply@ppfashion.com'}>`,
    to: email,
    subject: isApproved ? `Congratulations: Selected for ${eventTitle}` : `Update: Your Application for ${eventTitle}`,
    html: `
      <div style="font-family: 'serif', 'Times New Roman', serif; background-color: #050505; color: #ffffff; padding: 60px; max-width: 600px; margin: 0 auto; border: 1px solid ${isApproved ? '#00ff9d20' : '#ff4d4d20'};">
        <h1 style="color: ${isApproved ? '#00ff9d' : '#ff4d4d'}; text-transform: uppercase; letter-spacing: 0.4em; font-size: 10px; margin-bottom: 20px;">Jury Decision</h1>
        <h2 style="font-size: 32px; font-weight: bold; margin-bottom: 30px; letter-spacing: -0.05em;">${isApproved ? 'You are Selected' : 'Application Update'}</h2>
        
        <p style="color: rgba(255,255,255,0.6); font-size: 14px; line-height: 1.6; margin-bottom: 40px;">
          Respected ${designerName}, the elite jury has concluded the review of your portfolio for <strong>${eventTitle}</strong>.
        </p>

        <div style="background-color: ${isApproved ? 'rgba(0,255,157,0.05)' : 'rgba(255,77,77,0.05)'}; border-left: 4px solid ${isApproved ? '#00ff9d' : '#ff4d4d'}; padding: 30px; margin-bottom: 40px;">
          <p style="font-size: 16px; color: #ffffff; margin: 0;">Status: <strong>${isApproved ? 'SELECTED FOR SHOWCASE' : 'NOT SELECTED'}</strong></p>
          ${feedback ? `<p style="font-size: 12px; color: rgba(255,255,255,0.4); margin-top: 15px; font-style: italic;">Jury Feedback: ${feedback}</p>` : ''}
        </div>

        ${isApproved ? `
          <div style="background-color: rgba(232,209,150,0.05); border-left: 4px solid #e8d196; padding: 30px; margin-bottom: 40px;">
            <p style="font-size: 10px; text-transform: uppercase; letter-spacing: 0.2em; color: rgba(255,255,255,0.4); margin: 0 0 10px 0;">Confirmed Logistics</p>
            <p style="font-size: 18px; color: #ffffff; margin: 0;">Venue: ${eventLocation || 'TBA'}</p>
            <p style="font-size: 14px; color: rgba(255,255,255,0.6); margin: 10px 0 0 0;">Schedule: ${eventDate || 'TBA'}</p>
          </div>

          <p style="color: rgba(255,255,255,0.6); font-size: 14px; line-height: 1.6; margin-bottom: 30px;">
            Our production team will contact you shortly to coordinate your collection's delivery and rehearsal schedule. Welcome to the spotlight.
          </p>
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" style="display: inline-block; background-color: #e8d196; color: #000; padding: 15px 30px; text-decoration: none; font-weight: bold; font-size: 12px; text-transform: uppercase; letter-spacing: 0.2em;">View Application Details</a>
        ` : `
          <p style="color: rgba(255,255,255,0.6); font-size: 14px; line-height: 1.6; margin-bottom: 30px;">
            While your work is commendable, our jury has curated a limited number of slots for this specific showcase. We encourage you to apply for our upcoming global exhibitions.
          </p>
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/events" style="display: inline-block; border: 1px solid rgba(255,255,255,0.2); color: #fff; padding: 15px 30px; text-decoration: none; font-weight: bold; font-size: 12px; text-transform: uppercase; letter-spacing: 0.2em;">Explore Other Events</a>
        `}

        <div style="margin-top: 60px; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 20px;">
          <p style="color: #e8d196; font-size: 12px; font-weight: bold;">PASSION FOR PAKISTANI FASHION</p>
          <p style="color: rgba(255,255,255,0.4); font-size: 10px;">The Global Collective of Excellence</p>
        </div>
      </div>
    `,
  };
  return transporter.sendMail(mailOptions);
};

export const sendKYCStatusEmail = async (email: string, designerName: string, status: 'APPROVED' | 'REJECTED', feedback?: string) => {
  const isApproved = status === 'APPROVED';
  const mailOptions = {
    from: `"Passion for Pakistani Fashion | Security" <${process.env.EMAIL_FROM || 'noreply@ppfashion.com'}>`,
    to: email,
    subject: isApproved ? `Action Required: Your Designer Profile is Verified` : `Update Required: Your Verification Dossier`,
    html: `
      <div style="font-family: 'serif', 'Times New Roman', serif; background-color: #050505; color: #ffffff; padding: 60px; max-width: 600px; margin: 0 auto; border: 1px solid ${isApproved ? '#00ff9d20' : '#ff4d4d20'};">
        <h1 style="color: ${isApproved ? '#e8d196' : '#ff4d4d'}; text-transform: uppercase; letter-spacing: 0.4em; font-size: 10px; margin-bottom: 20px;">Identity & Security</h1>
        <h2 style="font-size: 32px; font-weight: bold; margin-bottom: 30px; letter-spacing: -0.05em;">${isApproved ? 'Verification Complete' : 'Verification Update Needed'}</h2>
        
        <p style="color: rgba(255,255,255,0.6); font-size: 14px; line-height: 1.6; margin-bottom: 40px;">
          Respected ${designerName}, our security and compliance team has finalized the review of your professional credentials.
        </p>

        <div style="background-color: ${isApproved ? 'rgba(0,255,157,0.05)' : 'rgba(255,77,77,0.05)'}; border-left: 4px solid ${isApproved ? '#00ff9d' : '#ff4d4d'}; padding: 30px; margin-bottom: 40px;">
          <p style="font-size: 16px; color: #ffffff; margin: 0;">KYC Status: <strong>${isApproved ? 'VERIFIED' : 'REVISION REQUIRED'}</strong></p>
          ${feedback ? `<p style="font-size: 12px; color: rgba(255,255,255,0.4); margin-top: 15px; font-style: italic;">Note: ${feedback}</p>` : ''}
        </div>

        ${isApproved ? `
          <p style="color: rgba(255,255,255,0.6); font-size: 14px; line-height: 1.6; margin-bottom: 30px;">
            Your profile is now officially part of the elite collective. You can now apply for global showcases and exhibitions directly from your dashboard.
          </p>
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" style="display: inline-block; background-color: #e8d196; color: #000; padding: 15px 30px; text-decoration: none; font-weight: bold; font-size: 12px; text-transform: uppercase; letter-spacing: 0.2em;">Enter Dashboard</a>
        ` : `
          <p style="color: rgba(255,255,255,0.6); font-size: 14px; line-height: 1.6; margin-bottom: 30px;">
            Unfortunately, some details in your dossier require correction before we can grant you full access to the collective. Please re-upload the necessary documents.
          </p>
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/kyc" style="display: inline-block; background-color: #ff4d4d; color: #fff; padding: 15px 30px; text-decoration: none; font-weight: bold; font-size: 12px; text-transform: uppercase; letter-spacing: 0.2em;">Re-submit KYC</a>
        `}

        <div style="margin-top: 60px; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 20px;">
          <p style="color: #e8d196; font-size: 12px; font-weight: bold;">PASSION FOR PAKISTANI FASHION</p>
          <p style="color: rgba(255,255,255,0.4); font-size: 10px;">The Global Collective of Excellence</p>
        </div>
      </div>
    `,
  };
  return transporter.sendMail(mailOptions);
};

export const sendMembershipEmail = async (email: string, designerName: string, planName: string, status: 'PURCHASED' | 'EXPIRED' | 'RENEWED') => {
  const isAction = status === 'PURCHASED' || status === 'RENEWED';
  const mailOptions = {
    from: `"Passion for Pakistani Fashion | Membership" <${process.env.EMAIL_FROM || 'noreply@ppfashion.com'}>`,
    to: email,
    subject: isAction ? `Welcome to the ${planName} Collective` : `Urgent: Your Membership has Expired`,
    html: `
      <div style="font-family: 'serif', 'Times New Roman', serif; background-color: #050505; color: #ffffff; padding: 60px; max-width: 600px; margin: 0 auto; border: 1px solid ${isAction ? '#e8d19620' : '#ff4d4d20'};">
        <h1 style="color: #e8d196; text-transform: uppercase; letter-spacing: 0.4em; font-size: 10px; margin-bottom: 20px;">Membership Registry</h1>
        <h2 style="font-size: 32px; font-weight: bold; margin-bottom: 30px; letter-spacing: -0.05em;">${isAction ? 'Access Granted' : 'Access Suspended'}</h2>
        
        <p style="color: rgba(255,255,255,0.6); font-size: 14px; line-height: 1.6; margin-bottom: 40px;">
          Respected ${designerName}, your status within the global collective has been updated.
        </p>

        <div style="background-color: ${isAction ? 'rgba(232,209,150,0.05)' : 'rgba(232,209,150,0.05)'}; border-left: 4px solid ${isAction ? '#e8d196' : '#ff4d4d'}; padding: 30px; margin-bottom: 40px;">
          <p style="font-size: 16px; color: #ffffff; margin: 0;">Plan: <strong>${planName}</strong></p>
          <p style="font-size: 12px; color: rgba(255,255,255,0.4); margin-top: 10px; text-transform: uppercase; letter-spacing: 0.1em;">Status: ${status}</p>
        </div>

        ${isAction ? `
          <p style="color: rgba(255,255,255,0.6); font-size: 14px; line-height: 1.6; margin-bottom: 30px;">
            Your credentials now grant you priority access to international runways, elite networking, and global press distributions.
          </p>
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" style="display: inline-block; background-color: #e8d196; color: #000; padding: 15px 30px; text-decoration: none; font-weight: bold; font-size: 12px; text-transform: uppercase; letter-spacing: 0.2em;">Enter Collective</a>
        ` : `
          <p style="color: rgba(255,255,255,0.6); font-size: 14px; line-height: 1.6; margin-bottom: 30px;">
            Your membership cycle has concluded. To maintain your digital dossier visibility and access to upcoming showcases, please renew your subscription.
          </p>
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/membership" style="display: inline-block; background-color: #ff4d4d; color: #fff; padding: 15px 30px; text-decoration: none; font-weight: bold; font-size: 12px; text-transform: uppercase; letter-spacing: 0.2em;">Renew Subscription</a>
        `}

        <div style="margin-top: 60px; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 20px;">
          <p style="color: #e8d196; font-size: 12px; font-weight: bold;">PASSION FOR PAKISTANI FASHION</p>
          <p style="color: rgba(255,255,255,0.4); font-size: 10px;">The Global Collective of Excellence</p>
        </div>
      </div>
    `,
  };
  return transporter.sendMail(mailOptions);
};

export const sendInquiryEmail = async (fullName: string, email: string, type: string, message: string) => {
  const mailOptions = {
    from: `"Passion for Pakistani Fashion | Registry" <${process.env.EMAIL_FROM || 'noreply@ppfashion.com'}>`,
    to: process.env.ADMIN_EMAIL || process.env.EMAIL_FROM, // Send to Admin
    subject: `New Strategic Inquiry: ${type}`,
    html: `
      <div style="font-family: 'serif', 'Times New Roman', serif; background-color: #050505; color: #ffffff; padding: 60px; max-width: 600px; margin: 0 auto; border: 1px solid #e8d19620;">
        <h1 style="color: #e8d196; text-transform: uppercase; letter-spacing: 0.4em; font-size: 10px; margin-bottom: 20px;">Registry Alert</h1>
        <h2 style="font-size: 32px; font-weight: bold; margin-bottom: 30px; letter-spacing: -0.05em;">New Inquiry Received</h2>
        
        <p style="color: rgba(255,255,255,0.6); font-size: 14px; line-height: 1.6; margin-bottom: 40px;">
          A new correspondence has been logged into the global collective registry.
        </p>

        <div style="background-color: rgba(232,209,150,0.05); border-left: 4px solid #e8d196; padding: 30px; margin-bottom: 40px;">
          <p style="font-size: 10px; uppercase; tracking: 0.2em; color: rgba(255,255,255,0.4); margin: 0 0 10px 0;">Sender Identity</p>
          <p style="font-size: 18px; color: #ffffff; margin: 0;">${fullName}</p>
          <p style="font-size: 12px; color: #e8d196; margin-top: 5px;">${email}</p>
        </div>

        <div style="margin-bottom: 40px;">
          <p style="font-size: 10px; uppercase; tracking: 0.2em; color: rgba(255,255,255,0.4); margin: 0 0 10px 0;">Inquiry Type</p>
          <p style="font-size: 14px; color: #ffffff; font-weight: bold;">${type}</p>
        </div>

        <div style="margin-bottom: 40px;">
          <p style="font-size: 10px; uppercase; tracking: 0.2em; color: rgba(255,255,255,0.4); margin: 0 0 10px 0;">Message Context</p>
          <div style="background-color: rgba(255,255,255,0.02); padding: 25px; border: 1px solid rgba(255,255,255,0.05); font-style: italic; color: rgba(255,255,255,0.8); line-height: 1.8;">
            "${message}"
          </div>
        </div>

        <div style="margin-top: 60px; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 20px;">
          <p style="color: #e8d196; font-size: 12px; font-weight: bold;">PASSION FOR PAKISTANI FASHION</p>
          <p style="color: rgba(255,255,255,0.4); font-size: 10px;">Strategic Correspondence System</p>
        </div>
      </div>
    `,
  };
  return transporter.sendMail(mailOptions);
};
