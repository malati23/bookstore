const mongoose = require('mongoose');

const settingSchema = new mongoose.Schema({
  // General
  storeName: { type: String, default: 'Modern BookStore' },
  storeEmail: { type: String, default: 'contact@bookstore.com' },
  storePhone: { type: String, default: '+1 (555) 123-4567' },
  storeAddress: { type: String, default: '123 Book Lane, Reading City, NY 10001' },
  
  // Business
  currency: { type: String, default: 'USD' },
  timezone: { type: String, default: 'America/New_York' },
  language: { type: String, default: 'English' },
  
  // Orders
  defaultOrderStatus: { type: String, default: 'Pending' },
  enableCOD: { type: Boolean, default: true },
  enableOnlinePayment: { type: Boolean, default: true },
  
  // Email (SMTP)
  adminEmail: { type: String, default: 'admin@bookstore.com' },
  smtpHost: { type: String, default: '' },
  smtpPort: { type: String, default: '' },
  smtpEmail: { type: String, default: '' },
  smtpPassword: { type: String, default: '' },
  emailNotifications: { type: Boolean, default: true },
  
  // Security
  sessionTimeout: { type: String, default: '60' },
  twoFactorAuth: { type: Boolean, default: false },
  
  // Theme
  themeMode: { type: String, default: 'light' },
  primaryColor: { type: String, default: '#ec4899' },
  
  // Notifications
  notifyEmails: { type: Boolean, default: true },
  notifyOrders: { type: Boolean, default: true },
  notifyRegistration: { type: Boolean, default: false }
}, { timestamps: true });

const Setting = mongoose.model('Setting', settingSchema);
module.exports = Setting;
