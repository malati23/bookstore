const { Resend } = require('resend');

if (!process.env.RESEND_API_KEY) {
  throw new Error('RESEND_API_KEY is missing. Please add it to your .env file.');
}

const resend = new Resend(process.env.RESEND_API_KEY);

async function sendResetEmail(toEmail, otp) {
  try {
    await resend.emails.send({
      from: 'BookStore <onboarding@resend.dev>',
      to: toEmail,
      subject: 'Your Login OTP',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;">
          <div style="background-color: #3b82f6; padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">BookStore Login</h1>
          </div>
          <div style="padding: 30px; text-align: center;">
            <p style="font-size: 16px; color: #333;">You requested a one-time password to log in. Use the following OTP to authenticate:</p>
            <h2 style="font-size: 32px; letter-spacing: 5px; color: #3b82f6; margin: 20px 0;">${otp}</h2>
            <p style="font-size: 14px; color: #777;">This OTP is valid for 5 minutes. If you did not request this, please ignore this email.</p>
          </div>
        </div>
      `,
    });
    console.log('OTP email sent successfully to', toEmail);
  } catch (error) {
    console.error('Failed to send OTP email:', error);
    throw error;
  }
}

module.exports = { sendResetEmail };
