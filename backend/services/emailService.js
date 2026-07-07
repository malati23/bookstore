const { Resend } = require('resend');

if (!process.env.RESEND_API_KEY) {
  throw new Error('RESEND_API_KEY is missing. Please add it to your .env file.');
}

const resend = new Resend(process.env.RESEND_API_KEY);

async function sendResetEmail(toEmail, resetLink) {
  try {
    await resend.emails.send({
      from: 'BookStore <onboarding@resend.dev>',
      to: toEmail,
      subject: 'Password Reset Request',
      html: `<p>You requested a password reset. Click <a href="${resetLink}">here</a> to reset your password.</p>`,
    });
    console.log('Password reset email sent successfully to', toEmail);
  } catch (error) {
    console.error('Failed to send password reset email:', error);
    throw error;
  }
}

module.exports = { sendResetEmail };
