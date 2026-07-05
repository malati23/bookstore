import React, { useState, useEffect } from 'react';
import { formatCurrency } from '../utils/currency';

import { useAuth } from '../context/AuthProvider';
import { Link } from 'react-router-dom';
import { FiBox, FiCheckCircle, FiTruck, FiPackage, FiMapPin, FiNavigation } from 'react-icons/fi';
import Navebar from '../component/Navebar';
import Footer from '../component/Footer';
import axios from 'axios';

const Orders = () => {
  const { authUser } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching orders from the backend API for the logged in user
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const userStr = localStorage.getItem('Users');
        let userId = '';
        if (userStr) {
          const userObj = JSON.parse(userStr);
          userId = userObj._id;
        }
        
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/orders${userId ? `?userId=${userId}` : ''}`);
        setOrders(response.data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    if (authUser) {
      fetchOrders();
    } else {
      setLoading(false);
    }
  }, [authUser]);

  const getStatusColor = (status) => {
    switch(status.toLowerCase()) {
      case 'delivered': return 'bg-green-100 text-green-700';
      case 'out for delivery': return 'bg-teal-100 text-teal-700';
      case 'shipped': return 'bg-purple-100 text-purple-700';
      case 'processing': return 'bg-blue-100 text-blue-700';
      case 'confirmed': return 'bg-indigo-100 text-indigo-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      case 'order placed': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const steps = [
    { label: 'Order Placed', icon: FiBox, activeStatus: ['pending', 'order placed', 'confirmed', 'processing', 'shipped', 'out for delivery', 'delivered'] },
    { label: 'Confirmed', icon: FiCheckCircle, activeStatus: ['confirmed', 'processing', 'shipped', 'out for delivery', 'delivered'] },
    { label: 'Processing', icon: FiPackage, activeStatus: ['processing', 'shipped', 'out for delivery', 'delivered'] },
    { label: 'Shipped', icon: FiTruck, activeStatus: ['shipped', 'out for delivery', 'delivered'] },
    { label: 'Out for Delivery', icon: FiNavigation, activeStatus: ['out for delivery', 'delivered'] },
    { label: 'Delivered', icon: FiMapPin, activeStatus: ['delivered'] },
  ];

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'Paid': return 'bg-green-100 text-green-700';
      case 'Failed': return 'bg-red-100 text-red-700';
      case 'Verification Pending': return 'bg-orange-100 text-orange-700';
      case 'Pending': default: return 'bg-yellow-100 text-yellow-700';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pt-16 font-sans">
      <Navebar />
      
      <main className="flex-grow container mx-auto px-4 py-10 max-w-screen-xl">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-8">My Orders</h1>

        {!authUser ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Please log in to view your orders</h2>
            <Link to="/" onClick={() => setTimeout(() => document.getElementById("my_modal_3")?.showModal(), 100)} className="bg-pink-500 text-white px-6 py-2 rounded-md font-semibold hover:bg-pink-600 transition-colors">
              Log In
            </Link>
          </div>
        ) : loading ? (
          // Skeleton Loader for Orders
          <div className="space-y-6">
            {[1, 2].map((i) => (
              <div key={i} className="animate-pulse bg-white p-6 rounded-xl border border-gray-100">
                <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
                <div className="h-20 bg-gray-200 rounded w-full mb-4"></div>
              </div>
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-100">
            <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
            </svg>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">No orders found</h2>
            <p className="text-gray-500 mb-6">You have not placed any orders yet.</p>
            <Link to="/Course" className="bg-pink-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-pink-600 transition-all shadow-md">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order._id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                
                {/* Order Header */}
                <div className="bg-gray-50 p-6 border-b border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <p className="text-sm text-gray-500 font-medium mb-1">Order <span className="text-gray-800 font-bold">#{order._id.substring(0, 8).toUpperCase()}</span></p>
                    <p className="text-sm text-gray-500">Placed on {new Date(order.createdAt || order.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm text-gray-500 font-medium mb-1">Total Amount</p>
                      <p className="font-extrabold text-pink-600">{formatCurrency(order.totalAmount || 0)}</p>
                    </div>
                    <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${getStatusColor(order.orderStatus || order.status)}`}>
                      {order.orderStatus || order.status}
                    </span>
                  </div>
                </div>

                {/* Mini Timeline */}
                {order.orderStatus !== 'Cancelled' && order.status !== 'Cancelled' && (
                  <div className="px-6 pt-6 pb-2 border-b border-gray-100 hidden md:block">
                    <div className="relative">
                      <div className="absolute top-4 left-0 w-full h-1 bg-gray-100 -z-10 rounded-full"></div>
                      <div 
                        className="absolute top-4 left-0 h-1 bg-pink-500 -z-10 rounded-full transition-all duration-1000"
                        style={{ width: `${(steps.findIndex(s => !s.activeStatus.includes((order.orderStatus || order.status || '').toLowerCase())) === -1 ? 5 : steps.findIndex(s => !s.activeStatus.includes((order.orderStatus || order.status || '').toLowerCase())) - 1) * 20}%` }}
                      ></div>
                      <div className="flex justify-between relative">
                        {steps.map((step, index) => {
                          const isActive = step.activeStatus.includes((order.orderStatus || order.status || '').toLowerCase());
                          return (
                            <div key={index} className="flex flex-col items-center">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 border-white shadow-sm mb-1 ${isActive ? 'bg-pink-500 text-white' : 'bg-gray-100 text-gray-400'}`}>
                                <step.icon size={14} />
                              </div>
                              <span className={`text-[10px] font-bold ${isActive ? 'text-gray-900' : 'text-gray-400'}`}>{step.label}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {/* Order Body */}
                <div className="p-6">
                  <div className="flex flex-col md:flex-row justify-between gap-6">
                    
                    {/* Items List */}
                    <div className="flex-1 space-y-4">
                      <h4 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-3">Items Ordered</h4>
                      {order.books ? order.books.map((item, index) => (
                        <div key={index} className="flex items-center gap-4">
                          {item.image ? (
                            <img src={item.image} alt={item.title} className="w-12 h-16 object-cover rounded shadow-sm border border-gray-200" />
                          ) : (
                            <div className="w-12 h-16 bg-gray-100 rounded border border-gray-200 flex items-center justify-center shadow-sm shrink-0">
                              <span className="text-gray-400 text-[10px]">No Img</span>
                            </div>
                          )}
                          <div>
                            <p className="font-bold text-gray-800 text-sm line-clamp-1">{item.title}</p>
                            <p className="text-gray-500 text-xs mt-1">Qty: {item.quantity} {item.price ? `× ${formatCurrency(item.price)}` : ''}</p>
                          </div>
                        </div>
                      )) : order.items?.map((item, index) => (
                        <div key={index} className="flex items-center gap-4">
                          <img src={item.image} alt={item.title} className="w-12 h-16 object-cover rounded shadow-sm border border-gray-200 shrink-0" />
                          <div>
                            <p className="font-bold text-gray-800 text-sm line-clamp-1">{item.title}</p>
                            <p className="text-gray-500 text-xs mt-1">Qty: {item.quantity}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Payment Info & Actions */}
                    <div className="md:w-1/3 flex flex-col justify-between md:border-l md:border-gray-100 md:pl-6">
                      <div className="mb-6 md:mb-0 space-y-4">
                        <div>
                          <h4 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-2">Payment Method</h4>
                          <p className="text-gray-600 text-sm flex items-center gap-2">
                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path></svg>
                            {order.paymentMethod}
                          </p>
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-2">Payment Status</h4>
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${getPaymentStatusColor(order.paymentStatus)}`}>
                            {order.paymentStatus || 'Paid'}
                          </span>
                        </div>
                        {order.transactionId && (
                          <div>
                            <h4 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-1">Transaction ID</h4>
                            <p className="text-gray-500 font-mono text-xs break-all">{order.transactionId}</p>
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2 w-full mt-4 flex-col sm:flex-row">
                        <Link 
                          to={`/orders/${order._id}`} 
                          className="flex-1 py-2.5 px-4 border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 hover:border-pink-500 hover:text-pink-600 transition-colors text-center block text-sm"
                        >
                          View Details
                        </Link>
                        <Link 
                          to={`/orders/${order._id}`} 
                          className="flex-1 py-2.5 px-4 bg-pink-500 text-white font-bold rounded-xl hover:bg-pink-600 transition-colors text-center block text-sm shadow-sm"
                        >
                          Track Order
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default Orders;
