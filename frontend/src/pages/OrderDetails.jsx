import React, { useState, useEffect } from 'react';
import { formatCurrency } from '../utils/currency';

import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { FiBox, FiCheckCircle, FiTruck, FiPackage, FiMapPin, FiNavigation, FiArrowLeft } from 'react-icons/fi';
import Navebar from '../component/Navebar';
import Footer from '../component/Footer';

const OrderDetails = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchOrderDetails = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/orders/${orderId}`);
        setOrder(response.data);
      } catch (error) {
        console.error('Error fetching order details:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrderDetails();
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col pt-16 font-sans">
        <Navebar />
        <main className="flex-grow container mx-auto px-4 py-16 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col pt-16 font-sans">
        <Navebar />
        <main className="flex-grow container mx-auto px-4 py-16 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Order Not Found</h2>
          <Link to="/my-orders" className="text-pink-500 hover:underline">Return to My Orders</Link>
        </main>
        <Footer />
      </div>
    );
  }

  const steps = [
    { label: 'Order Placed', icon: FiBox, activeStatus: ['Pending', 'Order Placed', 'Confirmed', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered'] },
    { label: 'Confirmed', icon: FiCheckCircle, activeStatus: ['Confirmed', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered'] },
    { label: 'Processing', icon: FiPackage, activeStatus: ['Processing', 'Shipped', 'Out for Delivery', 'Delivered'] },
    { label: 'Shipped', icon: FiTruck, activeStatus: ['Shipped', 'Out for Delivery', 'Delivered'] },
    { label: 'Out for Delivery', icon: FiNavigation, activeStatus: ['Out for Delivery', 'Delivered'] },
    { label: 'Delivered', icon: FiMapPin, activeStatus: ['Delivered'] },
  ];

  const currentStatus = order.orderStatus || order.status || 'Pending';

  const estimatedDelivery = new Date(order.createdAt || Date.now());
  estimatedDelivery.setDate(estimatedDelivery.getDate() + 5);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pt-16 font-sans">
      <Navebar />
      
      <main className="flex-grow container mx-auto px-4 py-10 max-w-4xl">
        <Link to="/my-orders" className="inline-flex items-center text-gray-500 hover:text-pink-600 mb-6 transition-colors font-semibold text-sm">
          <FiArrowLeft className="mr-2" /> Back to My Orders
        </Link>
        
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          
          {/* Header */}
          <div className="bg-gray-900 text-white p-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-2xl font-bold mb-1">Order #{order._id.substring(0,8).toUpperCase()}</h1>
                <p className="text-gray-400 text-sm">Placed on {new Date(order.createdAt || Date.now()).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
              </div>
              <div className="text-right">
                <p className="text-gray-400 text-sm mb-1">Total Amount</p>
                <p className="text-3xl font-extrabold text-pink-400">{formatCurrency(order.totalAmount || 0)}</p>
              </div>
            </div>
          </div>

          <div className="p-8 space-y-10">
            
            {/* Timeline */}
            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-6 uppercase tracking-wider text-center">Order Status</h3>
              
              <div className="relative">
                {/* Connecting Line */}
                <div className="absolute top-6 left-0 w-full h-1 bg-gray-100 -z-10 rounded-full"></div>
                
                {/* Active Line */}
                {currentStatus !== 'Cancelled' && (
                  <div 
                    className="absolute top-6 left-0 h-1 bg-pink-500 -z-10 rounded-full transition-all duration-1000"
                    style={{ width: `${(steps.findIndex(s => !s.activeStatus.includes(currentStatus)) === -1 ? 5 : steps.findIndex(s => !s.activeStatus.includes(currentStatus)) - 1) * 20}%` }}
                  ></div>
                )}
                
                <div className="flex justify-between relative">
                  {steps.map((step, index) => {
                    const isActive = currentStatus !== 'Cancelled' && step.activeStatus.includes(currentStatus);
                    const isCancelled = currentStatus === 'Cancelled';
                    
                    return (
                      <div key={index} className="flex flex-col items-center">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center border-4 border-white shadow-sm mb-3 transition-colors ${
                          isCancelled && index === 0 ? 'bg-red-500 text-white' : 
                          isActive ? 'bg-pink-500 text-white' : 'bg-gray-100 text-gray-400'
                        }`}>
                          <step.icon size={20} />
                        </div>
                        <span className={`text-xs font-bold ${isActive ? 'text-gray-900' : 'text-gray-400'}`}>
                          {isCancelled && index === 0 ? 'Cancelled' : step.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              {currentStatus !== 'Cancelled' && currentStatus !== 'Delivered' && (
                <div className="mt-8 text-center text-sm text-gray-600 bg-blue-50 p-3 rounded-lg border border-blue-100">
                  <span className="font-semibold text-blue-800">Estimated Delivery:</span> {estimatedDelivery.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-gray-100 pt-8">
              
              {/* Shipping & Payment Info */}
              <div className="space-y-8">
                
                <div>
                  <h3 className="text-sm font-bold text-gray-800 mb-3 uppercase tracking-wider">Shipping Address</h3>
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 text-sm text-gray-600 leading-relaxed">
                    <p className="font-bold text-gray-900 mb-1">{order.customerName}</p>
                    <p>{order.shippingAddress}</p>
                    <p className="mt-2 text-gray-500">Phone: {order.phoneNumber}</p>
                    <p className="text-gray-500">Email: {order.customerEmail}</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-gray-800 mb-3 uppercase tracking-wider">Payment Information</h3>
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 text-sm space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Method</span>
                      <span className="font-bold text-gray-900">{order.paymentMethod}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Status</span>
                      <span className={`font-bold ${order.paymentStatus === 'Paid' ? 'text-green-600' : 'text-orange-600'}`}>{order.paymentStatus || 'Pending'}</span>
                    </div>
                    {order.transactionId && (
                      <div className="flex justify-between">
                        <span className="text-gray-500">Transaction ID</span>
                        <span className="font-mono font-bold text-gray-900">{order.transactionId}</span>
                      </div>
                    )}
                  </div>
                </div>

              </div>

              {/* Order Items */}
              <div>
                <h3 className="text-sm font-bold text-gray-800 mb-3 uppercase tracking-wider">Order Summary</h3>
                <div className="bg-gray-50 rounded-xl border border-gray-100 overflow-hidden">
                  <div className="max-h-80 overflow-y-auto p-4 space-y-4">
                    {order.books ? order.books.map((item, index) => (
                      <div key={index} className="flex gap-4 items-center">
                        <div className="w-12 h-16 bg-white rounded border border-gray-200 flex items-center justify-center shrink-0">
                          <span className="text-gray-300 text-[10px]">BOOK</span>
                        </div>
                        <div className="flex-1">
                          <p className="font-bold text-gray-900 text-sm line-clamp-1">{item.title}</p>
                          <p className="text-gray-500 text-xs mt-1">Qty: {item.quantity}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-gray-900 text-sm">{formatCurrency(item.price * item.quantity)}</p>
                        </div>
                      </div>
                    )) : null}
                  </div>
                  
                  <div className="bg-gray-100 p-4 border-t border-gray-200 space-y-2">
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Subtotal</span>
                      <span className="font-semibold">{formatCurrency(order.totalAmount || 0)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Shipping</span>
                      <span className="font-semibold text-green-600">Free</span>
                    </div>
                    <div className="flex justify-between text-lg font-black text-gray-900 pt-2 border-t border-gray-200 mt-2">
                      <span>Total</span>
                      <span className="text-pink-600">{formatCurrency(order.totalAmount || 0)}</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default OrderDetails;
