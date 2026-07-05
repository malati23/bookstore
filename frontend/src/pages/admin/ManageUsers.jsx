import React, { useState, useEffect } from 'react';
import { FiSearch, FiFilter, FiEye, FiTrash2, FiX, FiShield, FiUser } from 'react-icons/fi';
import AdminLayout from '../../components/admin/AdminLayout';
import { getUsers, updateUserRole, updateUserStatus, deleteUser } from '../../api/userApi';
import { useAuth } from '../../context/AuthProvider';

const ManageUsers = () => {
  const { authUser } = useAuth();
  
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters and Search
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('All');

  // Modal State
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await getUsers();
      setUsers(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch users.');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    // Prevent admin from accidentally demoting themselves if they are the only admin
    // Note: robust check should be handled in backend, but we add a frontend guard here.
    if (userId === authUser._id && newRole === 'user') {
      if (!window.confirm("WARNING: You are about to remove your own admin privileges. Continue?")) return;
    }

    try {
      await updateUserRole(userId, newRole);
      setUsers(users.map(u => u._id === userId ? { ...u, role: newRole } : u));
    } catch (err) {
      alert("Failed to update role");
    }
  };

  const handleStatusChange = async (userId, newStatus) => {
    if (userId === authUser._id) {
      alert("You cannot block your own account.");
      return;
    }

    try {
      await updateUserStatus(userId, newStatus);
      setUsers(users.map(u => u._id === userId ? { ...u, status: newStatus } : u));
    } catch (err) {
      alert("Failed to update status");
    }
  };

  const handleDeleteUser = async (userId) => {
    if (userId === authUser._id) {
      alert("You cannot delete your own account.");
      return;
    }

    if (window.confirm('Are you sure you want to permanently delete this user?')) {
      try {
        await deleteUser(userId);
        setUsers(users.filter(u => u._id !== userId));
      } catch (err) {
        alert("Failed to delete user");
      }
    }
  };

  const openDetails = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  // Filtering Logic
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
      
    let matchesFilter = true;
    if (filter === 'Admin') matchesFilter = user.role === 'admin';
    if (filter === 'User') matchesFilter = user.role === 'user';
    if (filter === 'Active') matchesFilter = user.status === 'Active';
    if (filter === 'Blocked') matchesFilter = user.status === 'Blocked';
    
    return matchesSearch && matchesFilter;
  });

  return (
    <AdminLayout>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold text-gray-800">Manage Users</h2>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          {/* Search Bar */}
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search Name or Email..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 w-full sm:w-64"
            />
          </div>
          
          {/* Filter Dropdown */}
          <div className="relative">
            <FiFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10" />
            <select 
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="pl-10 pr-8 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 appearance-none w-full sm:w-40 cursor-pointer relative"
            >
              <option value="All">All Users</option>
              <option value="Admin">Admins Only</option>
              <option value="User">Users Only</option>
              <option value="Active">Active</option>
              <option value="Blocked">Blocked</option>
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
        ) : filteredUsers.length === 0 ? (
          <div className="p-16 text-center text-gray-500">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiUser size={24} className="text-gray-400" />
            </div>
            <h3 className="text-xl font-bold mb-2 text-gray-800">No users found</h3>
            <p>Try adjusting your search or filters.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-gray-50 text-gray-600 font-semibold border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">Contact</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Joined Date</th>
                  <th className="px-6 py-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-700">
                {filteredUsers.map(user => (
                  <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img 
                          src={`https://ui-avatars.com/api/?name=${user.name}&background=random&color=fff`} 
                          alt={user.name} 
                          className="w-10 h-10 rounded-full shadow-sm"
                        />
                        <span className="font-bold text-gray-900 capitalize">{user.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-gray-900">{user.email}</p>
                      {user.phone && <p className="text-gray-500 text-xs mt-1">{user.phone}</p>}
                    </td>
                    <td className="px-6 py-4">
                      <div className="relative inline-block w-28">
                        <select
                          value={user.role}
                          onChange={(e) => handleRoleChange(user._id, e.target.value)}
                          className={`w-full px-3 py-1.5 rounded-full text-xs font-bold border-none outline-none cursor-pointer appearance-none ${
                            user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          <option value="user">User</option>
                          <option value="admin">Admin</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                          <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="relative inline-block w-28">
                        <select
                          value={user.status || 'Active'}
                          onChange={(e) => handleStatusChange(user._id, e.target.value)}
                          className={`w-full px-3 py-1.5 rounded-full text-xs font-bold border-none outline-none cursor-pointer appearance-none ${
                            (user.status || 'Active') === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                          }`}
                        >
                          <option value="Active">Active</option>
                          <option value="Blocked">Blocked</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                          <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button 
                          onClick={() => openDetails(user)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors tooltip tooltip-top"
                          data-tip="View Details"
                        >
                          <FiEye size={18} />
                        </button>
                        <button 
                          onClick={() => handleDeleteUser(user._id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors tooltip tooltip-top"
                          data-tip="Delete User"
                        >
                          <FiTrash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* User Details Modal */}
      {isModalOpen && selectedUser && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden flex flex-col shadow-2xl">
            
            <div className="p-6 border-b border-gray-100 flex justify-between items-start bg-gray-50">
              <div className="flex items-center gap-4">
                <img 
                  src={`https://ui-avatars.com/api/?name=${selectedUser.name}&background=random&color=fff&size=80`} 
                  alt={selectedUser.name} 
                  className="w-16 h-16 rounded-full shadow-md"
                />
                <div>
                  <h3 className="text-xl font-bold text-gray-900 capitalize flex items-center gap-2">
                    {selectedUser.name} 
                    {selectedUser.role === 'admin' && <FiShield className="text-purple-500" title="Admin" />}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">{selectedUser.email}</p>
                </div>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-full transition-colors"
              >
                <FiX size={24} />
              </button>
            </div>

            <div className="p-6">
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-1">Phone Number</p>
                  <p className="font-medium text-gray-900">{selectedUser.phone || 'N/A'}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-1">Joined Date</p>
                  <p className="font-medium text-gray-900">
                    {new Date(selectedUser.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 col-span-2">
                  <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-1">Address</p>
                  <p className="font-medium text-gray-900">{selectedUser.address || 'No address provided.'}</p>
                </div>
              </div>

              {/* Simulated Stats for this user */}
              <h4 className="font-bold text-gray-800 mb-3 text-sm uppercase tracking-wider">Account Statistics</h4>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-3 border border-gray-100 rounded-xl bg-white shadow-sm">
                  <p className="text-2xl font-extrabold text-pink-600">{Math.floor(Math.random() * 20)}</p>
                  <p className="text-xs font-medium text-gray-500 mt-1">Orders</p>
                </div>
                <div className="text-center p-3 border border-gray-100 rounded-xl bg-white shadow-sm">
                  <p className="text-2xl font-extrabold text-purple-600">${Math.floor(Math.random() * 500) + 50}</p>
                  <p className="text-xs font-medium text-gray-500 mt-1">Spent</p>
                </div>
                <div className="text-center p-3 border border-gray-100 rounded-xl bg-white shadow-sm">
                  <p className="text-2xl font-extrabold text-blue-600">{Math.floor(Math.random() * 15)}</p>
                  <p className="text-xs font-medium text-gray-500 mt-1">Wishlist</p>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

    </AdminLayout>
  );
};

export default ManageUsers;
