import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Configure Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail', // or 'outlook', 'yahoo', etc.
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Email verification template
const sendVerificationEmail = async (email, verificationCode, userName) => {
  const msg = {
    to: email,
    from: process.env.FROM_EMAIL || 'noreply@ethiotutors.com',
    subject: 'Verify Your Email - Ethio Tutors',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Email Verification</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #4F46E5; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; text-align: center; }
          .code { background: #4F46E5; color: white; font-size: 32px; font-weight: bold; padding: 20px; border-radius: 8px; letter-spacing: 8px; margin: 20px 0; display: inline-block; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to Ethio Tutors!</h1>
          </div>
          <div class="content">
            <h2>Hi ${userName},</h2>
            <p>Thank you for registering with Ethio Tutors. To complete your registration and start using our platform, please verify your email address.</p>
            
            <p>Enter this verification code in the app:</p>
            
            <div class="code">${verificationCode}</div>
            
            <p><strong>This verification code will expire in 10 minutes.</strong></p>
            
            <p>If you didn't create an account with us, please ignore this email.</p>
            
            <p>Best regards,<br>The Ethio Tutors Team</p>
          </div>
          <div class="footer">
            <p>&copy; 2024 Ethio Tutors. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
      Welcome to Ethio Tutors!
      
      Hi ${userName},
      
      Thank you for registering with Ethio Tutors. To complete your registration, please verify your email address.
      
      Your verification code is: ${verificationCode}
      
      This verification code will expire in 10 minutes.
      
      If you didn't create an account with us, please ignore this email.
      
      Best regards,
      The Ethio Tutors Team
    `
  };

  try {
    await transporter.sendMail(msg);
    return { success: true };
  } catch (error) {
    console.error('❌ Nodemailer email error:', error);
    return { success: false, error: error.message };
  }
};

// Password reset email template
const sendPasswordResetEmail = async (email, resetToken, userName) => {
  const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;
  
  const msg = {
    to: email,
    from: process.env.FROM_EMAIL || 'noreply@ethiotutors.com',
    subject: 'Password Reset - Ethio Tutors',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Password Reset</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #DC2626; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
          .button { display: inline-block; background: #DC2626; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Password Reset Request</h1>
          </div>
          <div class="content">
            <h2>Hi ${userName},</h2>
            <p>We received a request to reset your password for your Ethio Tutors account.</p>
            
            <p>Click the button below to reset your password:</p>
            
            <a href="${resetUrl}" class="button">Reset Password</a>
            
            <p>Or copy and paste this link into your browser:</p>
            <p style="word-break: break-all; color: #DC2626;">${resetUrl}</p>
            
            <p><strong>This reset link will expire in 1 hour.</strong></p>
            
            <p>If you didn't request a password reset, please ignore this email or contact support if you have concerns.</p>
            
            <p>Best regards,<br>The Ethio Tutors Team</p>
          </div>
          <div class="footer">
            <p>&copy; 2024 Ethio Tutors. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
      Password Reset Request
      
      Hi ${userName},
      
      We received a request to reset your password for your Ethio Tutors account.
      
      Click the link below to reset your password:
      ${resetUrl}
      
      This reset link will expire in 1 hour.
      
      If you didn't request a password reset, please ignore this email.
      
      Best regards,
      The Ethio Tutors Team
    `
  };

  try {
    await transporter.sendMail(msg);
    console.log(`✅ Password reset email sent to ${email}`);
    return { success: true };
  } catch (error) {
    console.error('❌ Nodemailer email error:', error);
    return { success: false, error: error.message };
  }
};

export { sendVerificationEmail, sendPasswordResetEmail };
