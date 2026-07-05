import React, { useState, useEffect } from 'react';
import { formatCurrency } from '../../utils/currency';

import { 
  FiDollarSign, FiShoppingBag, FiBookOpen, FiUsers, 
  FiBook, FiStar, FiCalendar, FiTrendingUp, FiTrendingDown, FiAlertCircle 
} from 'react-icons/fi';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, 
  ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, Legend
} from 'recharts';
import AdminLayout from '../../components/admin/AdminLayout';

// ==========================================
// MOCK DATA (TODO: Replace with backend APIs)
// ==========================================
const mockSalesData = [
  { name: 'Jan', revenue: 4000, orders: 240 },
  { name: 'Feb', revenue: 3000, orders: 139 },
  { name: 'Mar', revenue: 2000, orders: 980 },
  { name: 'Apr', revenue: 2780, orders: 390 },
  { name: 'May', revenue: 1890, orders: 480 },
  { name: 'Jun', revenue: 2390, orders: 380 },
  { name: 'Jul', revenue: 3490, orders: 430 },
];

const mockCategoryData = [
  { name: 'Fiction', value: 400 },
  { name: 'Non-Fiction', value: 300 },
  { name: 'Science', value: 300 },
  { name: 'Technology', value: 200 },
  { name: 'Children', value: 100 },
];

const COLORS = ['#ec4899', '#8b5cf6', '#3b82f6', '#10b981', '#f59e0b'];

const topBooks = [
  { id: 1, title: 'The Great Gatsby', sold: 423, revenue: 6345.00 },
  { id: 2, title: '1984 by George Orwell', sold: 384, revenue: 5760.00 },
  { id: 3, title: 'To Kill a Mockingbird', sold: 312, revenue: 4680.00 },
];

const topCustomers = [
  { id: 1, name: 'Alice Smith', orders: 12, spent: 1245.50 },
  { id: 2, name: 'John Doe', orders: 8, spent: 890.00 },
  { id: 3, name: 'Emma Watson', orders: 7, spent: 750.25 },
];

const lowStockBooks = [
  { id: 1, title: 'Design Patterns', stock: 2 },
  { id: 2, title: 'Clean Code', stock: 4 },
];

const Analytics = () => {
  const [dateRange, setDateRange] = useState('Last 30 Days');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching dashboard data from backend
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, [dateRange]);

  return (
    <AdminLayout>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Analytics Dashboard</h2>
          <p className="text-sm text-gray-500 mt-1">Overview of your store's performance</p>
        </div>
        
        {/* Date Filter */}
        <div className="relative">
          <FiCalendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10" />
          <select 
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="pl-10 pr-8 py-2 bg-white border border-gray-200 rounded-lg font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-500 appearance-none w-full sm:w-48 cursor-pointer relative shadow-sm"
          >
            <option>Today</option>
            <option>Last 7 Days</option>
            <option>Last 30 Days</option>
            <option>Last 12 Months</option>
            <option>Custom Range...</option>
          </select>
        </div>
      </div>

      {loading ? (
        // Loading Skeleton
        <div className="space-y-6 animate-pulse">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="h-32 bg-white rounded-2xl border border-gray-100"></div>)}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-96 bg-white rounded-2xl border border-gray-100"></div>
            <div className="h-96 bg-white rounded-2xl border border-gray-100"></div>
          </div>
        </div>
      ) : (
        <>
          {/* Top Statistics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
            
            <StatCard 
              title="Total Revenue" 
              value="$24,590" 
              icon={<FiDollarSign size={24} />} 
              trend="+12%" 
              trendUp={true} 
              color="text-pink-600" 
              bg="bg-pink-50" 
            />
            <StatCard 
              title="Total Orders" 
              value="1,248" 
              icon={<FiShoppingBag size={24} />} 
              trend="+8%" 
              trendUp={true} 
              color="text-blue-600" 
              bg="bg-blue-50" 
            />
            <StatCard 
              title="Books Sold" 
              value="3,842" 
              icon={<FiBookOpen size={24} />} 
              trend="-2%" 
              trendUp={false} 
              color="text-purple-600" 
              bg="bg-purple-50" 
            />
            <StatCard 
              title="Customers" 
              value="8,549" 
              icon={<FiUsers size={24} />} 
              trend="+5%" 
              trendUp={true} 
              color="text-green-600" 
              bg="bg-green-50" 
            />
            <StatCard 
              title="Total Books" 
              value="420" 
              icon={<FiBook size={24} />} 
              trend="Stable" 
              trendUp={true} 
              color="text-orange-600" 
              bg="bg-orange-50" 
            />
            <StatCard 
              title="Avg Rating" 
              value="4.8" 
              icon={<FiStar size={24} />} 
              trend="+0.1" 
              trendUp={true} 
              color="text-yellow-500" 
              bg="bg-yellow-50" 
            />

          </div>

          {/* Charts Row 1 */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            
            {/* Revenue Area Chart */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm lg:col-span-2">
              <h3 className="text-lg font-bold text-gray-800 mb-6">Revenue Growth</h3>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={mockSalesData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ec4899" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#ec4899" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} dx={-10} tickFormatter={(value) => `$${value}`} />
                    <RechartsTooltip 
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      formatter={(value) => [`$${value}`, 'Revenue']}
                    />
                    <Area type="monotone" dataKey="revenue" stroke="#ec4899" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Category Pie Chart */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col">
              <h3 className="text-lg font-bold text-gray-800 mb-6">Category Sales</h3>
              <div className="flex-1 h-[300px] w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={mockCategoryData}
                      cx="50%"
                      cy="45%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={5}
                      dataKey="value"
                      stroke="none"
                    >
                      {mockCategoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <RechartsTooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                    <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px' }}/>
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>

          {/* Charts Row 2 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            
            {/* Orders Bar Chart */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <h3 className="text-lg font-bold text-gray-800 mb-6">Monthly Orders</h3>
              <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={mockSalesData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                    <RechartsTooltip cursor={{fill: '#f9fafb'}} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                    <Bar dataKey="orders" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Notifications & Alerts */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Inventory Alerts</h3>
              
              <div className="flex-1 space-y-4">
                {lowStockBooks.map(book => (
                  <div key={book.id} className="flex items-center justify-between p-4 bg-red-50 rounded-xl border border-red-100">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-red-100 text-red-500 flex items-center justify-center">
                        <FiAlertCircle size={20} />
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">{book.title}</p>
                        <p className="text-xs text-red-600 font-medium">Low Stock Warning</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-black text-red-600">{book.stock}</p>
                      <p className="text-xs text-gray-500">left</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Tables Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Top Selling Books Table */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-5 border-b border-gray-100 bg-gray-50/50">
                <h3 className="text-lg font-bold text-gray-800">Top Selling Books</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead className="bg-white text-gray-400 text-xs uppercase font-bold">
                    <tr>
                      <th className="px-5 py-3">Book Title</th>
                      <th className="px-5 py-3">Total Sold</th>
                      <th className="px-5 py-3 text-right">Revenue</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 text-gray-700 font-medium">
                    {topBooks.map((book, i) => (
                      <tr key={book.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-5 py-4 flex items-center gap-3">
                          <span className="w-6 h-6 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center text-xs">{i+1}</span>
                          {book.title}
                        </td>
                        <td className="px-5 py-4 text-gray-500">{book.sold}</td>
                        <td className="px-5 py-4 text-right font-bold text-gray-900">{formatCurrency(book.revenue)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Top Customers Table */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-5 border-b border-gray-100 bg-gray-50/50">
                <h3 className="text-lg font-bold text-gray-800">Top Customers</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead className="bg-white text-gray-400 text-xs uppercase font-bold">
                    <tr>
                      <th className="px-5 py-3">Customer</th>
                      <th className="px-5 py-3">Orders</th>
                      <th className="px-5 py-3 text-right">Total Spent</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 text-gray-700 font-medium">
                    {topCustomers.map((customer, i) => (
                      <tr key={customer.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-5 py-4 flex items-center gap-3">
                          <img src={`https://ui-avatars.com/api/?name=${customer.name}&background=random&color=fff`} alt={customer.name} className="w-8 h-8 rounded-full" />
                          {customer.name}
                        </td>
                        <td className="px-5 py-4 text-gray-500">{customer.orders}</td>
                        <td className="px-5 py-4 text-right font-bold text-pink-600">{formatCurrency(customer.spent)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        </>
      )}

    </AdminLayout>
  );
};

// Sub-component for Statistic Cards
const StatCard = ({ title, value, icon, trend, trendUp, color, bg }) => {
  return (
    <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all group">
      <div className="flex justify-between items-start mb-4">
        <div className={`w-12 h-12 rounded-xl ${bg} ${color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
          {icon}
        </div>
        <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${trendUp ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
          {trendUp ? <FiTrendingUp size={12} /> : <FiTrendingDown size={12} />}
          {trend}
        </div>
      </div>
      <div>
        <h4 className="text-3xl font-black text-gray-900 mb-1">{value}</h4>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{title}</p>
      </div>
    </div>
  );
};

export default Analytics;
