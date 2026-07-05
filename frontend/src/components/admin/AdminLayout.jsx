import React, { useState } from 'react';
import { 
  FiHome, FiBook, FiPlusSquare, FiGrid, FiShoppingBag, 
  FiUsers, FiStar, FiPieChart, FiSettings, FiLogOut,
  FiMenu, FiX, FiMail
} from 'react-icons/fi';
import { Link, useLocation } from 'react-router-dom';

const AdminLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const sidebarLinks = [
    { icon: <FiHome />, label: "Dashboard", path: "/admin" },
    { icon: <FiBook />, label: "Manage Books", path: "/admin/books" },
    { icon: <FiPlusSquare />, label: "Add Book", path: "/admin/books/add" },
    { icon: <FiGrid />, label: "Manage Categories", path: "/admin/categories" },
    { icon: <FiShoppingBag />, label: "Manage Orders", path: "/admin/orders" },
    { icon: <FiUsers />, label: "Manage Users", path: "/admin/users" },
    { icon: <FiStar />, label: "Reviews", path: "/admin/reviews" },
    { icon: <FiPieChart />, label: "Analytics", path: "/admin/analytics" },
    { icon: <FiMail />, label: "Contact Messages", path: "/admin/contact" },
    { icon: <FiSettings />, label: "Settings", path: "/admin/settings" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex font-sans">
      
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-auto ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-16 flex items-center justify-between px-6 border-b border-gray-200">
          <span className="text-2xl font-bold text-pink-600">AdminPanel</span>
          <button onClick={toggleSidebar} className="lg:hidden text-gray-500 hover:text-gray-700">
            <FiX size={24} />
          </button>
        </div>
        
        <div className="p-4 flex flex-col h-[calc(100vh-4rem)] justify-between overflow-y-auto">
          <ul className="space-y-2">
            {sidebarLinks.map((link, idx) => {
              const isActive = location.pathname === link.path || (link.path !== '/admin' && location.pathname.startsWith(link.path) && link.path !== '#');
              
              return (
                <li key={idx}>
                  <Link 
                    to={link.path} 
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-medium ${
                      isActive
                        ? 'bg-pink-50 text-pink-600' 
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <span className="text-lg">{link.icon}</span>
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
          
          <button className="flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors font-medium w-full mt-4 border border-transparent hover:border-red-100">
            <FiLogOut size={20} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* Top Navbar */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 sm:px-6 z-10 sticky top-0">
          <div className="flex items-center gap-4">
            <button onClick={toggleSidebar} className="lg:hidden text-gray-500 hover:text-gray-700 focus:outline-none p-2 -ml-2 rounded-md hover:bg-gray-100">
              <FiMenu size={24} />
            </button>
            <h1 className="text-xl font-bold text-gray-800 hidden sm:block">
              {sidebarLinks.find(l => l.path === location.pathname)?.label || 'Admin Dashboard'}
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            <Link to="/" className="text-sm font-medium text-pink-600 hover:text-pink-700 bg-pink-50 px-4 py-2 rounded-lg transition-colors">
              View Store
            </Link>
            <div className="w-10 h-10 rounded-full bg-pink-100 border-2 border-white shadow-sm flex items-center justify-center text-pink-700 font-bold overflow-hidden">
              <img src="https://ui-avatars.com/api/?name=Admin+User&background=fbcfe8&color=be185d" alt="Admin" />
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="flex-1 overflow-auto bg-gray-50 p-4 sm:p-6 lg:p-8">
          {children}
        </div>
      </main>

    </div>
  );
};

export default AdminLayout;
