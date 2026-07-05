import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiSearch, FiTrash2, FiMail, FiCheckCircle } from 'react-icons/fi';

const ManageContact = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [toast, setToast] = useState(null);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/contact`);
      setMessages(response.data);
    } catch (error) {
      console.error('Error fetching contact messages:', error);
      showToast('Failed to load messages', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      try {
        await axios.delete(`${import.meta.env.VITE_API_URL}/contact/${id}`);
        setMessages(messages.filter((msg) => msg._id !== id));
        showToast('Message deleted successfully');
      } catch (error) {
        console.error('Error deleting message:', error);
        showToast('Failed to delete message', 'error');
      }
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'Unread' ? 'Read' : 'Unread';
    try {
      const response = await axios.put(`${import.meta.env.VITE_API_URL}/contact/${id}`, { status: newStatus });
      setMessages(messages.map((msg) => (msg._id === id ? response.data : msg)));
      showToast(`Message marked as ${newStatus}`);
    } catch (error) {
      console.error('Error updating status:', error);
      showToast('Failed to update status', 'error');
    }
  };

  const filteredMessages = messages.filter((msg) =>
    msg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    msg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    msg.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {toast && (
        <div className={`fixed top-24 right-8 px-6 py-3 rounded-lg shadow-lg font-bold z-50 animate-fade-in-down ${toast.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
          {toast.message}
        </div>
      )}

      {/* Header & Search */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Contact Messages</h1>
          <p className="text-gray-500 text-sm mt-1">Manage customer inquiries and feedback</p>
        </div>
        <div className="relative w-full md:w-72">
          <input
            type="text"
            placeholder="Search messages..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all"
          />
          <FiSearch className="absolute left-3 top-3 text-gray-400" size={18} />
        </div>
      </div>

      {/* Message List */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-8 space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse flex space-x-4">
                <div className="flex-1 space-y-4 py-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredMessages.length === 0 ? (
          <div className="text-center py-16">
            <FiMail className="mx-auto h-12 w-12 text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900">No messages found</h3>
            <p className="text-gray-500 mt-1">Check back later for new inquiries.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredMessages.map((msg) => (
              <div key={msg._id} className={`p-6 transition-colors hover:bg-gray-50 ${msg.status === 'Unread' ? 'bg-pink-50/30' : ''}`}>
                <div className="flex flex-col lg:flex-row justify-between gap-6">
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-bold text-gray-900 text-lg">{msg.subject}</h3>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${msg.status === 'Unread' ? 'bg-pink-100 text-pink-700' : 'bg-gray-100 text-gray-600'}`}>
                        {msg.status}
                      </span>
                    </div>
                    <p className="text-gray-700 text-sm mb-4 leading-relaxed whitespace-pre-wrap">{msg.message}</p>
                    
                    <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-500">
                      <p><span className="font-medium">From:</span> {msg.name}</p>
                      <p><span className="font-medium">Email:</span> <a href={`mailto:${msg.email}`} className="text-pink-600 hover:underline">{msg.email}</a></p>
                      <p><span className="font-medium">Date:</span> {new Date(msg.createdAt).toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="flex items-center lg:flex-col gap-3 justify-end lg:justify-start lg:w-32 lg:border-l lg:border-gray-100 lg:pl-6">
                    <button
                      onClick={() => handleToggleStatus(msg._id, msg.status)}
                      className={`flex items-center justify-center gap-2 w-full py-2 px-3 rounded-lg text-sm font-semibold transition-colors border ${msg.status === 'Unread' ? 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50' : 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100'}`}
                      title={msg.status === 'Unread' ? 'Mark as Read' : 'Mark as Unread'}
                    >
                      <FiCheckCircle size={16} />
                      <span className="lg:hidden">{msg.status === 'Unread' ? 'Mark Read' : 'Read'}</span>
                    </button>
                    <button
                      onClick={() => handleDelete(msg._id)}
                      className="flex items-center justify-center gap-2 w-full py-2 px-3 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg text-sm font-semibold transition-colors border border-red-100"
                    >
                      <FiTrash2 size={16} />
                      <span className="lg:hidden">Delete</span>
                    </button>
                  </div>

                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageContact;
