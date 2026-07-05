import React from 'react';
import { FiBook, FiUsers, FiShoppingBag, FiTrendingUp, FiDollarSign } from 'react-icons/fi';
import AdminLayout from '../../components/admin/AdminLayout';

const AdminDashboard = () => {
  return (
    <AdminLayout>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Total Books</p>
              <h3 className="text-3xl font-extrabold text-gray-900">1,248</h3>
            </div>
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
              <FiBook size={24} />
            </div>
          </div>
          <p className="text-sm text-green-600 flex items-center gap-1 mt-4 font-medium">
            <FiTrendingUp /> +12% from last month
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Total Users</p>
              <h3 className="text-3xl font-extrabold text-gray-900">8,549</h3>
            </div>
            <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center">
              <FiUsers size={24} />
            </div>
          </div>
          <p className="text-sm text-green-600 flex items-center gap-1 mt-4 font-medium">
            <FiTrendingUp /> +5.2% from last month
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Total Orders</p>
              <h3 className="text-3xl font-extrabold text-gray-900">3,721</h3>
            </div>
            <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-full flex items-center justify-center">
              <FiShoppingBag size={24} />
            </div>
          </div>
          <p className="text-sm text-green-600 flex items-center gap-1 mt-4 font-medium">
            <FiTrendingUp /> +18.4% from last month
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Total Revenue</p>
              <h3 className="text-3xl font-extrabold text-gray-900">₹124.5k</h3>
            </div>
            <div className="w-12 h-12 bg-green-50 text-green-600 rounded-full flex items-center justify-center">
              <FiDollarSign size={24} />
            </div>
          </div>
          <p className="text-sm text-green-600 flex items-center gap-1 mt-4 font-medium">
            <FiTrendingUp /> +22.1% from last month
          </p>
        </div>
      </div>

      {/* Charts Placeholder Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm lg:col-span-2">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Monthly Sales</h3>
          <div className="w-full h-64 bg-gray-50 rounded-xl flex items-center justify-center border border-dashed border-gray-200">
            <span className="text-gray-400 font-medium">[Chart Placeholder: Bar Chart]</span>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Top Categories</h3>
          <div className="w-full flex-1 bg-gray-50 rounded-xl flex items-center justify-center border border-dashed border-gray-200 min-h-[256px]">
            <span className="text-gray-400 font-medium">[Chart Placeholder: Donut Chart]</span>
          </div>
        </div>
      </div>

      {/* Tables Section */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        
        {/* Recent Orders Table */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white">
            <h3 className="text-lg font-bold text-gray-800">Recent Orders</h3>
            <button className="text-sm font-semibold text-pink-600 hover:text-pink-700">View All</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-gray-50 text-gray-600 font-semibold border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4">Order ID</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Total</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-700">
                <tr className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900">#ORD-7391</td>
                  <td className="px-6 py-4">Emma Watson</td>
                  <td className="px-6 py-4 text-gray-500">Oct 24, 2026</td>
                  <td className="px-6 py-4 font-medium">₹45.99</td>
                  <td className="px-6 py-4">
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">Delivered</span>
                  </td>
                </tr>
                <tr className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900">#ORD-7392</td>
                  <td className="px-6 py-4">Liam Johnson</td>
                  <td className="px-6 py-4 text-gray-500">Oct 24, 2026</td>
                  <td className="px-6 py-4 font-medium">₹12.50</td>
                  <td className="px-6 py-4">
                    <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold">Processing</span>
                  </td>
                </tr>
                <tr className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900">#ORD-7393</td>
                  <td className="px-6 py-4">Olivia Smith</td>
                  <td className="px-6 py-4 text-gray-500">Oct 23, 2026</td>
                  <td className="px-6 py-4 font-medium">₹89.00</td>
                  <td className="px-6 py-4">
                    <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-bold">Shipped</span>
                  </td>
                </tr>
                <tr className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900">#ORD-7394</td>
                  <td className="px-6 py-4">Noah Williams</td>
                  <td className="px-6 py-4 text-gray-500">Oct 22, 2026</td>
                  <td className="px-6 py-4 font-medium">₹24.99</td>
                  <td className="px-6 py-4">
                    <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold">Cancelled</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Users Table */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white">
            <h3 className="text-lg font-bold text-gray-800">New Users</h3>
            <button className="text-sm font-semibold text-pink-600 hover:text-pink-700">View All</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-gray-50 text-gray-600 font-semibold border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Joined Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-700">
                <tr className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-pink-100 overflow-hidden shrink-0"><img src="https://ui-avatars.com/api/?name=Sophia+Davis&background=random&color=fff" alt="" /></div>
                    Sophia Davis
                  </td>
                  <td className="px-6 py-4 text-gray-500">sophia.d@example.com</td>
                  <td className="px-6 py-4 text-gray-500">2 mins ago</td>
                </tr>
                <tr className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 overflow-hidden shrink-0"><img src="https://ui-avatars.com/api/?name=Jackson+Brown&background=random&color=fff" alt="" /></div>
                    Jackson Brown
                  </td>
                  <td className="px-6 py-4 text-gray-500">jackson.b@example.com</td>
                  <td className="px-6 py-4 text-gray-500">1 hour ago</td>
                </tr>
                <tr className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-green-100 overflow-hidden shrink-0"><img src="https://ui-avatars.com/api/?name=Mia+Garcia&background=random&color=fff" alt="" /></div>
                    Mia Garcia
                  </td>
                  <td className="px-6 py-4 text-gray-500">mia.g@example.com</td>
                  <td className="px-6 py-4 text-gray-500">5 hours ago</td>
                </tr>
                <tr className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-purple-100 overflow-hidden shrink-0"><img src="https://ui-avatars.com/api/?name=Ethan+Martinez&background=random&color=fff" alt="" /></div>
                    Ethan Martinez
                  </td>
                  <td className="px-6 py-4 text-gray-500">ethan.m@example.com</td>
                  <td className="px-6 py-4 text-gray-500">Yesterday</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
