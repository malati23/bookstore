const nodemailer = require('nodemailer');
const Setting = require('../models/Setting');

// Get transporter dynamically from Settings or ENV
const getTransporter = async () => {
  let user = process.env.EMAIL_USER;
  let pass = process.env.EMAIL_PASS;

  if (!user || !pass) {
    console.error("Email configuration missing.");
    throw new Error("Email service is not configured. Please set EMAIL_USER and EMAIL_PASS inside the .env file.");
  }

  console.log("Connecting to Gmail...");
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: user,
      pass: pass
    }
  });
};

const sendMailWrapper = async (mailOptions) => {
  try {
    const transporter = await getTransporter();
    if (!transporter) return; // Notifications disabled or missing credentials
    
    const settings = await Setting.findOne();
    mailOptions.from = `"${settings?.storeName || 'Modern BookStore'}" <${transporter.options.auth.user}>`;
    
    console.log(`Sending reset email...`);
    const info = await transporter.sendMail(mailOptions);
    console.log(`Reset email sent successfully. (Message ID: ${info.messageId})`);
    return info;
  } catch (error) {
    if (error.message.includes("Email service is not configured")) {
      console.error(error.message);
    } else if (error.message.includes("Invalid login") || error.message.includes("Authentication")) {
      console.error("SMTP authentication failed.");
    } else {
      console.error("Error sending email:", error.message);
    }
    throw error; // Re-throw to be caught by the caller if needed
  }
};

// 1. Welcome Email
const sendWelcomeEmail = async (email, name) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;">
      <div style="background-color: #ec4899; padding: 20px; text-align: center;">
        <h1 style="color: white; margin: 0;">Welcome to Modern BookStore!</h1>
      </div>
      <div style="padding: 30px;">
        <p style="font-size: 16px; color: #333;">Hi ${name},</p>
        <p style="font-size: 16px; color: #333;">Thank you for joining us! We are thrilled to have you on board.</p>
        <p style="font-size: 16px; color: #333;">Explore our wide collection of books and discover your next great read today.</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="http://localhost:5173/Course" style="background-color: #ec4899; color: white; padding: 12px 24px; text-decoration: none; font-weight: bold; border-radius: 5px;">Start Browsing</a>
        </div>
        <p style="font-size: 14px; color: #777;">Happy Reading,<br>The Modern BookStore Team</p>
      </div>
    </div>
  `;
  
  await sendMailWrapper({
    to: email,
    subject: "Welcome to Modern BookStore!",
    html
  });
};

// 2. Password Reset
const sendPasswordResetEmail = async (email, resetToken, name) => {
  const resetUrl = `${process.env.CLIENT_URL || 'http://localhost:5173'}/reset-password/${resetToken}`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;">
      <div style="background-color: #3b82f6; padding: 20px; text-align: center;">
        <img src="https://via.placeholder.com/150x50?text=BookStore+Logo" alt="BookStore Logo" style="max-height: 50px; margin-bottom: 10px;" />
        <h1 style="color: white; margin: 0;">BookStore</h1>
      </div>
      <div style="padding: 30px;">
        <p style="font-size: 16px; color: #333;">Hello ${name || ''},</p>
        <p style="font-size: 16px; color: #333;">We received a request to reset your password. Click the button below to choose a new one:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" style="background-color: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; font-weight: bold; border-radius: 5px;">Reset Password</a>
        </div>
        <p style="font-size: 14px; color: #333;">Or copy and paste this link into your browser:</p>
        <p style="font-size: 14px; color: #3b82f6; word-break: break-all;"><a href="${resetUrl}">${resetUrl}</a></p>
        <div style="background-color: #fef08a; padding: 15px; border-left: 4px solid #eab308; margin: 20px 0;">
          <p style="margin: 0; color: #854d0e;"><strong>Security Message:</strong> The link will expire in 1 hour. If you did not request this, please ignore this email and your password will remain unchanged.</p>
        </div>
      </div>
    </div>
  `;
  
  await sendMailWrapper({
    to: email,
    subject: "Reset Your BookStore Password",
    html
  });
};

// 3. Order Confirmation
const sendOrderConfirmationEmail = async (email, order) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;">
      <div style="background-color: #10b981; padding: 20px; text-align: center;">
        <h1 style="color: white; margin: 0;">Order Confirmed!</h1>
      </div>
      <div style="padding: 30px;">
        <p style="font-size: 16px; color: #333;">Hi ${order.customerName},</p>
        <p style="font-size: 16px; color: #333;">Thank you for your order! We've received it and are processing it now.</p>
        <div style="background-color: #f9fafb; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0 0 10px 0;"><strong>Order ID:</strong> #${order._id.toString().slice(-6).toUpperCase()}</p>
          <p style="margin: 0 0 10px 0;"><strong>Total Amount:</strong> $${order.totalAmount}</p>
          <p style="margin: 0;"><strong>Payment Method:</strong> ${order.paymentMethod}</p>
        </div>
        <p style="font-size: 16px; color: #333;">You can track your order status in your account dashboard.</p>
      </div>
    </div>
  `;
  
  await sendMailWrapper({
    to: email,
    subject: "Your Order is Confirmed",
    html
  });
};

// 4. Payment Confirmation
const sendPaymentConfirmationEmail = async (email, order) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;">
      <div style="background-color: #8b5cf6; padding: 20px; text-align: center;">
        <h1 style="color: white; margin: 0;">Payment Successful!</h1>
      </div>
      <div style="padding: 30px;">
        <p style="font-size: 16px; color: #333;">Hi ${order.customerName},</p>
        <p style="font-size: 16px; color: #333;">We have successfully received your payment for order #${order._id.toString().slice(-6).toUpperCase()}.</p>
        <p style="font-size: 16px; color: #333;">We are now preparing your books for shipment.</p>
      </div>
    </div>
  `;
  
  await sendMailWrapper({
    to: email,
    subject: "Payment Received",
    html
  });
};

// 5. Order Status Update (Shipped/Delivered)
const sendOrderStatusEmail = async (email, order, status) => {
  const statusColor = status === 'Delivered' ? '#10b981' : '#f59e0b';
  const statusMsg = status === 'Delivered' 
    ? 'Great news! Your order has been delivered.'
    : `Your order is now ${status}.`;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;">
      <div style="background-color: ${statusColor}; padding: 20px; text-align: center;">
        <h1 style="color: white; margin: 0;">Order Status Update</h1>
      </div>
      <div style="padding: 30px;">
        <p style="font-size: 16px; color: #333;">Hi ${order.customerName},</p>
        <p style="font-size: 16px; color: #333;">${statusMsg}</p>
        <div style="background-color: #f9fafb; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0 0 10px 0;"><strong>Order ID:</strong> #${order._id.toString().slice(-6).toUpperCase()}</p>
          <p style="margin: 0;"><strong>Current Status:</strong> <span style="color: ${statusColor}; font-weight: bold;">${status}</span></p>
        </div>
      </div>
    </div>
  `;
  
  await sendMailWrapper({
    to: email,
    subject: `Order Update: ${status}`,
    html
  });
};

// 6. Password Change Confirmation
const sendPasswordChangeConfirmationEmail = async (email, name) => {
  const currentDate = new Date().toLocaleString();
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;">
      <div style="background-color: #ef4444; padding: 20px; text-align: center;">
        <img src="https://via.placeholder.com/150x50?text=BookStore+Logo" alt="BookStore Logo" style="max-height: 50px; margin-bottom: 10px;" />
        <h1 style="color: white; margin: 0;">Modern BookStore</h1>
      </div>
      <div style="padding: 30px;">
        <p style="font-size: 16px; color: #333;">Hi ${name},</p>
        <p style="font-size: 16px; color: #333;">This email is to confirm that your password has been changed successfully.</p>
        <p style="font-size: 16px; color: #333;"><strong>Date & Time:</strong> ${currentDate}</p>
        <div style="background-color: #fee2e2; padding: 15px; border-left: 4px solid #ef4444; margin: 20px 0;">
          <p style="margin: 0; color: #b91c1c;"><strong>Security Warning:</strong> If you did not make this change, contact support immediately.</p>
        </div>
        <p style="font-size: 14px; color: #777;">Thank you,<br>The Modern BookStore Team</p>
      </div>
    </div>
  `;
  
  await sendMailWrapper({
    to: email,
    subject: "Password Changed Successfully",
    html
  });
};

module.exports = {
  sendWelcomeEmail,
  sendPasswordResetEmail,
  sendOrderConfirmationEmail,
  sendPaymentConfirmationEmail,
  sendOrderStatusEmail,
  sendPasswordChangeConfirmationEmail
};
