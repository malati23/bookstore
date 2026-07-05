import React, { useState, useEffect } from 'react';
import { formatCurrency } from '../../utils/currency';

import { FiSearch, FiFilter, FiEye, FiX } from 'react-icons/fi';
import AdminLayout from '../../components/admin/AdminLayout';
import { getOrders, updateOrderStatus } from '../../api/orderApi';
import axios from 'axios';

const ManageOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Filters and Search
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Modal State
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await getOrders();
      setOrders(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch orders.');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      setOrders(orders.map(order => 
        order._id === orderId ? { ...order, orderStatus: newStatus } : order
      ));
      showToast(`Order status updated to ${newStatus}`);
    } catch (err) {
      showToast("Failed to update status", 'error');
    }
  };

  const handlePaymentAction = async (orderId, action) => {
    let paymentStatus = '';
    if (action === 'Approve' || action === 'MarkPaid') paymentStatus = 'Paid';
    if (action === 'Reject') paymentStatus = 'Failed';

    try {
      // Direct axios call since orderApi doesn't export updatePaymentStatus yet
      await axios.put(`${import.meta.env.VITE_API_URL}/orders/${orderId}/payment`, { paymentStatus });
      
      setOrders(orders.map(order => 
        order._id === orderId ? { ...order, paymentStatus } : order
      ));
      showToast(`Payment status updated to ${paymentStatus}`);
    } catch (err) {
      showToast("Failed to update payment status", 'error');
    }
  };

  const openDetails = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  // Filter and Search Logic
  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order._id.toLowerCase().includes(searchTerm.toLowerCase()) || 
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesStatus = statusFilter === 'All' || order.orderStatus === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Pagination Logic
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const currentOrders = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage, 
    currentPage * itemsPerPage
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered': return 'bg-green-100 text-green-700';
      case 'Out for Delivery': return 'bg-teal-100 text-teal-700';
      case 'Shipped': return 'bg-purple-100 text-purple-700';
      case 'Processing': return 'bg-blue-100 text-blue-700';
      case 'Confirmed': return 'bg-indigo-100 text-indigo-700';
      case 'Cancelled': return 'bg-red-100 text-red-700';
      case 'Order Placed': return 'bg-yellow-100 text-yellow-700';
      case 'Pending': default: return 'bg-yellow-100 text-yellow-700';
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'Paid': return 'bg-green-100 text-green-700';
      case 'Failed': return 'bg-red-100 text-red-700';
      case 'Verification Pending': return 'bg-orange-100 text-orange-700';
      case 'Pending': default: return 'bg-yellow-100 text-yellow-700';
    }
  };

  return (
    <AdminLayout>
      {toast && (
        <div className={`fixed top-24 right-8 px-6 py-3 rounded-lg shadow-lg font-bold z-50 animate-fade-in-down ${toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'} text-white`}>
          {toast.msg}
        </div>
      )}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold text-gray-800">Manage Orders</h2>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          {/* Search Bar */}
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search ID or Name..." 
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 w-full sm:w-64"
            />
          </div>
          
          {/* Filter Dropdown */}
          <div className="relative">
            <FiFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10" />
            <select 
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
              className="pl-10 pr-8 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 appearance-none w-full sm:w-40 cursor-pointer relative"
            >
              <option value="All">All Statuses</option>
              <option value="Order Placed">Order Placed</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Processing">Processing</option>
              <option value="Shipped">Shipped</option>
              <option value="Out for Delivery">Out for Delivery</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
              <option value="Pending">Pending (Legacy)</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 space-y-4">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="animate-pulse flex gap-4 h-16 bg-gray-50 rounded-xl"></div>
            ))}
          </div>
        ) : error ? (
          <div className="p-8 text-center text-red-500 font-medium">{error}</div>
        ) : filteredOrders.length === 0 ? (
          <div className="p-16 text-center text-gray-500">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiShoppingBag size={24} className="text-gray-400" />
            </div>
            <h3 className="text-xl font-bold mb-2 text-gray-800">No orders found</h3>
            <p>Try adjusting your search or filters.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-gray-50 text-gray-600 font-semibold border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4">Order ID & Date</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Items</th>
                  <th className="px-6 py-4">Total</th>
                  <th className="px-6 py-4">Payment</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-700">
                {currentOrders.map(order => (
                  <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-bold text-gray-900">#{order._id.substring(0, 8).toUpperCase()}</p>
                      <p className="text-gray-500 text-xs mt-1">
                        {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-gray-900">{order.customerName}</p>
                      <p className="text-gray-500 text-xs mt-1">{order.customerEmail}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-md text-xs font-semibold">
                        {order.books.reduce((acc, curr) => acc + curr.quantity, 0)} Books
                      </span>
                    </td>
                    <td className="px-6 py-4 font-bold text-gray-900">
                      {formatCurrency(order.totalAmount)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <span className="text-xs font-semibold text-gray-600">{order.paymentMethod}</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold w-max ${getPaymentStatusColor(order.paymentStatus)}`}>
                          {order.paymentStatus}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={order.orderStatus}
                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                        className={`px-3 py-1.5 rounded-full text-xs font-bold border-none outline-none cursor-pointer appearance-none ${getStatusColor(order.orderStatus)}`}
                      >
                        <option value="Order Placed">Order Placed</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Out for Delivery">Out for Delivery</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                        {order.orderStatus === 'Pending' && <option value="Pending">Pending</option>}
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center">
                        <button 
                          onClick={() => openDetails(order)}
                          className="p-2 text-pink-600 hover:bg-pink-50 rounded-lg transition-colors tooltip tooltip-left flex items-center gap-2"
                          data-tip="View Details"
                        >
                          <FiEye size={18} />
                          <span className="text-sm font-semibold">Details</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="p-4 border-t border-gray-100 flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredOrders.length)} of {filteredOrders.length} entries
            </p>
            <div className="flex gap-2">
              <button 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-semibold text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              <button 
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-semibold text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {isModalOpen && selectedOrder && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Order Details</h3>
                <p className="text-sm text-gray-500 mt-1">Order #{selectedOrder._id}</p>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-full transition-colors"
              >
                <FiX size={24} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto flex-1">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* Customer Info */}
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <h4 className="font-bold text-gray-800 mb-3 text-sm uppercase tracking-wider">Customer Information</h4>
                  <p className="text-gray-900 font-medium">{selectedOrder.customerName}</p>
                  <p className="text-gray-600 text-sm mt-1">{selectedOrder.customerEmail}</p>
                  <p className="text-gray-600 text-sm mt-1">{selectedOrder.phoneNumber}</p>
                </div>
                
                {/* Shipping Info */}
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <h4 className="font-bold text-gray-800 mb-3 text-sm uppercase tracking-wider">Shipping Address</h4>
                  <p className="text-gray-600 text-sm leading-relaxed">{selectedOrder.shippingAddress}</p>
                </div>
              </div>

              {/* Order Items */}
              <h4 className="font-bold text-gray-800 mb-4 text-sm uppercase tracking-wider">Ordered Items</h4>
              <div className="border border-gray-100 rounded-xl overflow-hidden mb-6">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50 text-gray-600">
                    <tr>
                      <th className="px-4 py-3">Book</th>
                      <th className="px-4 py-3 text-center">Qty</th>
                      <th className="px-4 py-3 text-right">Price</th>
                      <th className="px-4 py-3 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {selectedOrder.books.map((item, idx) => (
                      <tr key={idx}>
                        <td className="px-4 py-3 font-medium text-gray-900">{item.title}</td>
                        <td className="px-4 py-3 text-center">{item.quantity}</td>
                        <td className="px-4 py-3 text-right">{formatCurrency(item.price)}</td>
                        <td className="px-4 py-3 text-right font-bold">{formatCurrency(item.quantity * item.price)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Summary */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-pink-50 p-4 rounded-xl border border-pink-100 gap-4">
                <div className="flex-1 space-y-2">
                  <div className="flex gap-2 items-center">
                    <p className="text-pink-800 text-sm font-semibold w-24">Payment:</p>
                    <span className="font-bold text-gray-900">{selectedOrder.paymentMethod}</span>
                  </div>
                  <div className="flex gap-2 items-center">
                    <p className="text-pink-800 text-sm font-semibold w-24">Pay Status:</p>
                    <span className={`px-2 py-0.5 rounded text-xs font-bold ${getPaymentStatusColor(selectedOrder.paymentStatus)}`}>{selectedOrder.paymentStatus}</span>
                  </div>
                  {selectedOrder.transactionId && (
                    <div className="flex gap-2 items-center">
                      <p className="text-pink-800 text-sm font-semibold w-24">Txn ID:</p>
                      <span className="font-mono text-sm bg-white px-2 py-1 border border-pink-100 rounded">{selectedOrder.transactionId}</span>
                    </div>
                  )}
                  <div className="flex gap-2 items-center">
                    <p className="text-pink-800 text-sm font-semibold w-24">Order Status:</p>
                    <span className={`px-2 py-0.5 rounded text-xs font-bold ${getStatusColor(selectedOrder.orderStatus)}`}>{selectedOrder.orderStatus}</span>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className="text-pink-800 text-sm font-semibold mb-1">Total Amount</p>
                  <p className="text-3xl font-extrabold text-pink-600">{formatCurrency(selectedOrder.totalAmount)}</p>
                </div>
              </div>
              
              {/* Screenshot Section & Actions */}
              {(selectedOrder.screenshotUrl || selectedOrder.paymentStatus === 'Verification Pending') && (
                <div className="mt-6 p-4 border border-gray-200 rounded-xl bg-white shadow-sm">
                  <h4 className="font-bold text-gray-800 mb-4 text-sm uppercase tracking-wider border-b pb-2">Payment Verification</h4>
                  <div className="flex flex-col md:flex-row gap-6 items-start">
                    {selectedOrder.screenshotUrl ? (
                      <div className="flex-1 border rounded bg-gray-50 p-2">
                        <p className="text-xs text-gray-500 mb-2 font-semibold">Attached Screenshot:</p>
                        <img src={selectedOrder.screenshotUrl} alt="Payment Screenshot" className="max-h-64 object-contain rounded" />
                      </div>
                    ) : (
                      <div className="flex-1 p-4 border border-dashed rounded text-center text-gray-500 text-sm">
                        No screenshot uploaded.
                      </div>
                    )}
                    
                    <div className="flex flex-col gap-3 w-full md:w-48">
                      {selectedOrder.paymentStatus !== 'Paid' && (
                        <>
                          <button onClick={() => handlePaymentAction(selectedOrder._id, 'Approve')} className="w-full px-4 py-2 bg-green-500 text-white rounded-lg font-bold text-sm hover:bg-green-600 transition-colors">
                            Approve Payment
                          </button>
                          <button onClick={() => handlePaymentAction(selectedOrder._id, 'Reject')} className="w-full px-4 py-2 bg-red-500 text-white rounded-lg font-bold text-sm hover:bg-red-600 transition-colors">
                            Reject Payment
                          </button>
                        </>
                      )}
                      {selectedOrder.paymentMethod === 'Cash on Delivery' && selectedOrder.paymentStatus !== 'Paid' && (
                        <button onClick={() => handlePaymentAction(selectedOrder._id, 'MarkPaid')} className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg font-bold text-sm hover:bg-blue-600 transition-colors">
                          Mark as Paid (COD)
                        </button>
                      )}
                      
                      {selectedOrder.orderStatus !== 'Cancelled' && (
                        <button onClick={() => handleStatusChange(selectedOrder._id, 'Cancelled')} className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg font-bold text-sm hover:bg-gray-900 transition-colors mt-2">
                          Cancel Order
                        </button>
                      )}
                      {selectedOrder.orderStatus !== 'Delivered' && selectedOrder.orderStatus !== 'Cancelled' && (
                        <button onClick={() => handleStatusChange(selectedOrder._id, 'Delivered')} className="w-full px-4 py-2 bg-purple-500 text-white rounded-lg font-bold text-sm hover:bg-purple-600 transition-colors mt-2">
                          Mark as Delivered
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      )}

    </AdminLayout>
  );
};

export default ManageOrders;
