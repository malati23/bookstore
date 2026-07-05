import React, { useState, useEffect } from 'react';
import { 
  FiSettings, FiBriefcase, FiShoppingCart, FiMail, 
  FiShield, FiLayout, FiBell, FiDatabase, FiSave, FiRefreshCcw, FiX, FiBook, FiUsers
} from 'react-icons/fi';
import axios from 'axios';
import AdminLayout from '../../components/admin/AdminLayout';

const defaultSettings = {
  // General
  storeName: 'Modern BookStore',
  storeEmail: 'contact@bookstore.com',
  storePhone: '+1 (555) 123-4567',
  storeAddress: '123 Book Lane, Reading City, NY 10001',
  
  // Business
  currency: 'USD',
  timezone: 'America/New_York',
  language: 'English',
  
  // Orders
  defaultOrderStatus: 'Pending',
  enableCOD: true,
  enableOnlinePayment: true,
  
  adminEmail: 'admin@bookstore.com',
  smtpHost: '',
  smtpPort: '',
  smtpEmail: '',
  smtpPassword: '',
  emailNotifications: true,
  
  // Security
  sessionTimeout: '60',
  twoFactorAuth: false,
  
  // Theme
  themeMode: 'light',
  primaryColor: '#ec4899', // pink-500
  
  // Notifications
  notifyEmails: true,
  notifyOrders: true,
  notifyRegistration: false,
};

const Settings = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState(defaultSettings);
  const [toast, setToast] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  // Load from API on mount
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/settings`);
        if (response.data) {
          setSettings({ ...defaultSettings, ...response.data });
        }
      } catch (error) {
        console.error("Error fetching settings:", error);
      }
    };
    fetchSettings();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings({
      ...settings,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/api/settings`, settings);
      showToast('Settings saved successfully!', 'success');
    } catch (error) {
      console.error("Error saving settings:", error);
      showToast('Failed to save settings.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = async () => {
    if (window.confirm("Are you sure you want to reset all settings to defaults?")) {
      try {
        setIsSaving(true);
        await axios.put(`${import.meta.env.VITE_API_URL}/api/settings`, defaultSettings);
        setSettings(defaultSettings);
        showToast('Settings reset to defaults', 'info');
      } catch (error) {
        console.error("Error resetting settings:", error);
        showToast('Failed to reset settings.', 'error');
      } finally {
        setIsSaving(false);
      }
    }
  };

  const showToast = (message, type) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleExport = (type) => {
    // Placeholder for actual export functionality
    showToast(`Exporting ${type} data... (Demo)`, 'info');
  };

  const tabs = [
    { id: 'general', label: 'General', icon: <FiSettings /> },
    { id: 'business', label: 'Business', icon: <FiBriefcase /> },
    { id: 'orders', label: 'Orders', icon: <FiShoppingCart /> },
    { id: 'email', label: 'Email', icon: <FiMail /> },
    { id: 'security', label: 'Security', icon: <FiShield /> },
    { id: 'theme', label: 'Theme', icon: <FiLayout /> },
    { id: 'notifications', label: 'Notifications', icon: <FiBell /> },
    { id: 'backup', label: 'Backup', icon: <FiDatabase /> },
  ];

  return (
    <AdminLayout>
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-20 right-8 px-6 py-3 rounded-lg shadow-lg font-bold z-50 animate-fade-in-down ${
          toast.type === 'success' ? 'bg-green-500 text-white' : 'bg-blue-500 text-white'
        }`}>
          {toast.message}
        </div>
      )}

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Settings</h2>
          <p className="text-sm text-gray-500 mt-1">Manage your store configuration</p>
        </div>
        
        <div className="flex gap-3">
          <button 
            onClick={handleReset}
            className="px-4 py-2 bg-white border border-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 flex items-center gap-2 transition-colors"
          >
            <FiRefreshCcw /> Reset
          </button>
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="px-4 py-2 bg-pink-600 text-white font-semibold rounded-lg hover:bg-pink-700 flex items-center gap-2 transition-colors disabled:opacity-70 shadow-sm"
          >
            {isSaving ? <span className="animate-spin text-xl">◌</span> : <FiSave />} 
            Save Changes
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row overflow-hidden min-h-[600px]">
        
        {/* Sidebar Navigation */}
        <div className="w-full md:w-64 bg-gray-50 border-b md:border-b-0 md:border-r border-gray-100 p-4 shrink-0">
          <ul className="space-y-1">
            {tabs.map((tab) => (
              <li key={tab.id}>
                <button
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-left ${
                    activeTab === tab.id 
                      ? 'bg-pink-100 text-pink-700 shadow-sm' 
                      : 'text-gray-600 hover:bg-white hover:text-gray-900'
                  }`}
                >
                  <span className="text-lg">{tab.icon}</span>
                  {tab.label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-6 md:p-8 overflow-y-auto">
          <form id="settings-form" onSubmit={handleSave}>
            
            {/* 1. General Settings */}
            {activeTab === 'general' && (
              <div className="space-y-6 animate-fade-in">
                <h3 className="text-xl font-bold text-gray-800 mb-6 border-b pb-2">General Settings</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Store Name</label>
                    <input type="text" name="storeName" value={settings.storeName} onChange={handleChange} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:outline-none" required />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Store Email</label>
                    <input type="email" name="storeEmail" value={settings.storeEmail} onChange={handleChange} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:outline-none" required />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Phone Number</label>
                    <input type="text" name="storePhone" value={settings.storePhone} onChange={handleChange} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:outline-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Store Address</label>
                  <textarea name="storeAddress" value={settings.storeAddress} onChange={handleChange} rows="3" className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:outline-none resize-none"></textarea>
                </div>
              </div>
            )}

            {/* 2. Business Settings */}
            {activeTab === 'business' && (
              <div className="space-y-6 animate-fade-in">
                <h3 className="text-xl font-bold text-gray-800 mb-6 border-b pb-2">Business Settings</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Currency</label>
                    <select name="currency" value={settings.currency} onChange={handleChange} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:outline-none bg-white">
                      <option value="USD">USD ($)</option>
                      <option value="EUR">EUR (€)</option>
                      <option value="GBP">GBP (£)</option>
                      <option value="INR">INR (₹)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Time Zone</label>
                    <select name="timezone" value={settings.timezone} onChange={handleChange} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:outline-none bg-white">
                      <option value="America/New_York">Eastern Time (US & Canada)</option>
                      <option value="America/Chicago">Central Time (US & Canada)</option>
                      <option value="America/Denver">Mountain Time (US & Canada)</option>
                      <option value="America/Los_Angeles">Pacific Time (US & Canada)</option>
                      <option value="UTC">UTC</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Language</label>
                    <select name="language" value={settings.language} onChange={handleChange} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:outline-none bg-white">
                      <option value="English">English</option>
                      <option value="Spanish">Spanish</option>
                      <option value="French">French</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* 3. Order Settings */}
            {activeTab === 'orders' && (
              <div className="space-y-6 animate-fade-in">
                <h3 className="text-xl font-bold text-gray-800 mb-6 border-b pb-2">Order Settings</h3>
                <div className="space-y-5">
                  <div className="max-w-xs">
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Default Order Status</label>
                    <select name="defaultOrderStatus" value={settings.defaultOrderStatus} onChange={handleChange} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:outline-none bg-white">
                      <option value="Pending">Pending</option>
                      <option value="Processing">Processing</option>
                      <option value="On Hold">On Hold</option>
                    </select>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <input type="checkbox" id="enableCOD" name="enableCOD" checked={settings.enableCOD} onChange={handleChange} className="w-5 h-5 text-pink-600 rounded focus:ring-pink-500" />
                    <label htmlFor="enableCOD" className="font-medium text-gray-700 cursor-pointer">Enable Cash on Delivery (COD)</label>
                  </div>
                  <div className="flex items-center gap-3">
                    <input type="checkbox" id="enableOnlinePayment" name="enableOnlinePayment" checked={settings.enableOnlinePayment} onChange={handleChange} className="w-5 h-5 text-pink-600 rounded focus:ring-pink-500" />
                    <label htmlFor="enableOnlinePayment" className="font-medium text-gray-700 cursor-pointer">Enable Online Payments (Stripe/PayPal)</label>
                  </div>
                </div>
              </div>
            )}

            {/* 4. Email Settings */}
            {activeTab === 'email' && (
              <div className="space-y-6 animate-fade-in">
                <h3 className="text-xl font-bold text-gray-800 mb-6 border-b pb-2">Email Configuration</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Admin Alert Email</label>
                    <input type="email" name="adminEmail" value={settings.adminEmail} onChange={handleChange} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">SMTP Host</label>
                    <input type="text" name="smtpHost" value={settings.smtpHost} onChange={handleChange} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">SMTP Port</label>
                    <input type="text" name="smtpPort" value={settings.smtpPort} onChange={handleChange} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">SMTP Email (User)</label>
                    <input type="email" name="smtpEmail" value={settings.smtpEmail} onChange={handleChange} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">SMTP Password</label>
                    <input type="password" name="smtpPassword" value={settings.smtpPassword} onChange={handleChange} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:outline-none" placeholder="••••••••" />
                  </div>
                </div>
                <div className="flex items-center gap-3 mt-4">
                  <input type="checkbox" id="emailNotifications" name="emailNotifications" checked={settings.emailNotifications} onChange={handleChange} className="w-5 h-5 text-pink-600 rounded focus:ring-pink-500" />
                  <label htmlFor="emailNotifications" className="font-medium text-gray-700 cursor-pointer">Enable Outbound System Emails</label>
                </div>
              </div>
            )}

            {/* 5. Security Settings */}
            {activeTab === 'security' && (
              <div className="space-y-6 animate-fade-in">
                <h3 className="text-xl font-bold text-gray-800 mb-6 border-b pb-2">Security Settings</h3>
                
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-xl mb-6">
                  <h4 className="font-bold text-yellow-800 mb-1">Change Admin Password</h4>
                  <p className="text-sm text-yellow-700 mb-4">To change your password, please visit your Profile page.</p>
                </div>

                <div className="max-w-xs mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Admin Session Timeout (Minutes)</label>
                  <select name="sessionTimeout" value={settings.sessionTimeout} onChange={handleChange} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:outline-none bg-white">
                    <option value="15">15 Minutes</option>
                    <option value="30">30 Minutes</option>
                    <option value="60">1 Hour</option>
                    <option value="1440">24 Hours</option>
                  </select>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-xl max-w-md">
                  <div>
                    <h4 className="font-bold text-gray-800">Two-Factor Authentication</h4>
                    <p className="text-sm text-gray-500">Require 2FA for admin logins</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" name="twoFactorAuth" checked={settings.twoFactorAuth} onChange={handleChange} className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-pink-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-600"></div>
                  </label>
                </div>
              </div>
            )}

            {/* 6. Theme Settings */}
            {activeTab === 'theme' && (
              <div className="space-y-6 animate-fade-in">
                <h3 className="text-xl font-bold text-gray-800 mb-6 border-b pb-2">Theme & Customization</h3>
                
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Store Theme Mode</label>
                  <div className="flex gap-4">
                    <label className={`flex items-center gap-2 p-4 border rounded-xl cursor-pointer transition-all ${settings.themeMode === 'light' ? 'border-pink-500 bg-pink-50 ring-2 ring-pink-200' : 'border-gray-200 hover:bg-gray-50'}`}>
                      <input type="radio" name="themeMode" value="light" checked={settings.themeMode === 'light'} onChange={handleChange} className="hidden" />
                      <div className="w-6 h-6 rounded-full bg-white border border-gray-300 flex items-center justify-center">
                        <FiSettings className="text-gray-400" />
                      </div>
                      <span className="font-bold text-gray-800">Light Mode</span>
                    </label>
                    
                    <label className={`flex items-center gap-2 p-4 border rounded-xl cursor-pointer transition-all ${settings.themeMode === 'dark' ? 'border-pink-500 bg-pink-50 ring-2 ring-pink-200' : 'border-gray-200 hover:bg-gray-50'}`}>
                      <input type="radio" name="themeMode" value="dark" checked={settings.themeMode === 'dark'} onChange={handleChange} className="hidden" />
                      <div className="w-6 h-6 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center">
                        <FiSettings className="text-white" />
                      </div>
                      <span className="font-bold text-gray-800">Dark Mode</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Primary Brand Color</label>
                  <div className="flex gap-3">
                    {['#ec4899', '#3b82f6', '#10b981', '#8b5cf6', '#f59e0b', '#000000'].map(color => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setSettings({...settings, primaryColor: color})}
                        className={`w-10 h-10 rounded-full shadow-sm transition-transform ${settings.primaryColor === color ? 'scale-125 ring-2 ring-offset-2' : 'hover:scale-110'}`}
                        style={{ backgroundColor: color, ringColor: color }}
                      ></button>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">Select the primary color used for buttons and highlights.</p>
                </div>
              </div>
            )}

            {/* 7. Notification Settings */}
            {activeTab === 'notifications' && (
              <div className="space-y-6 animate-fade-in">
                <h3 className="text-xl font-bold text-gray-800 mb-6 border-b pb-2">Admin Notifications</h3>
                
                <div className="space-y-4 max-w-md">
                  <div className="flex items-center justify-between p-4 bg-gray-50 border border-gray-100 rounded-xl">
                    <div>
                      <h4 className="font-bold text-gray-800">New Order Alerts</h4>
                      <p className="text-sm text-gray-500">Get notified when a new order is placed</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" name="notifyOrders" checked={settings.notifyOrders} onChange={handleChange} className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-pink-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-600"></div>
                    </label>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-gray-50 border border-gray-100 rounded-xl">
                    <div>
                      <h4 className="font-bold text-gray-800">User Registrations</h4>
                      <p className="text-sm text-gray-500">Alert on new customer signups</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" name="notifyRegistration" checked={settings.notifyRegistration} onChange={handleChange} className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-pink-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 border border-gray-100 rounded-xl">
                    <div>
                      <h4 className="font-bold text-gray-800">Email Updates</h4>
                      <p className="text-sm text-gray-500">Receive daily summary reports</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" name="notifyEmails" checked={settings.notifyEmails} onChange={handleChange} className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-pink-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-600"></div>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* 8. Backup Settings */}
            {activeTab === 'backup' && (
              <div className="space-y-6 animate-fade-in">
                <h3 className="text-xl font-bold text-gray-800 mb-6 border-b pb-2">Data Export & Backup</h3>
                
                <p className="text-gray-600 mb-4">Export your store's data securely for external backup or migration.</p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="p-6 border border-gray-200 rounded-xl text-center hover:border-pink-300 hover:shadow-md transition-all">
                    <div className="w-12 h-12 bg-pink-100 text-pink-600 rounded-full flex items-center justify-center mx-auto mb-3">
                      <FiBook size={24} />
                    </div>
                    <h4 className="font-bold text-gray-800 mb-1">Books Catalog</h4>
                    <p className="text-xs text-gray-500 mb-4">Export all books in CSV format</p>
                    <button type="button" onClick={() => handleExport('Books')} className="text-sm font-semibold text-pink-600 bg-pink-50 hover:bg-pink-100 px-4 py-2 rounded-lg w-full transition-colors">
                      Export Data
                    </button>
                  </div>

                  <div className="p-6 border border-gray-200 rounded-xl text-center hover:border-blue-300 hover:shadow-md transition-all">
                    <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                      <FiUsers size={24} />
                    </div>
                    <h4 className="font-bold text-gray-800 mb-1">Users List</h4>
                    <p className="text-xs text-gray-500 mb-4">Export all users in CSV format</p>
                    <button type="button" onClick={() => handleExport('Users')} className="text-sm font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-lg w-full transition-colors">
                      Export Data
                    </button>
                  </div>

                  <div className="p-6 border border-gray-200 rounded-xl text-center hover:border-green-300 hover:shadow-md transition-all">
                    <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
                      <FiShoppingCart size={24} />
                    </div>
                    <h4 className="font-bold text-gray-800 mb-1">Orders History</h4>
                    <p className="text-xs text-gray-500 mb-4">Export all orders in CSV format</p>
                    <button type="button" onClick={() => handleExport('Orders')} className="text-sm font-semibold text-green-600 bg-green-50 hover:bg-green-100 px-4 py-2 rounded-lg w-full transition-colors">
                      Export Data
                    </button>
                  </div>
                </div>
              </div>
            )}
            
          </form>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Settings;
