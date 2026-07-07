import React from 'react'
import Home from './component/Home/Home'
import { Routes, Route } from 'react-router-dom'
import Shop from './pages/Shop'
import BookDetails from './pages/BookDetails'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import Payment from './pages/Payment'
import PaymentSuccess from './pages/PaymentSuccess'
import PaymentFailed from './pages/PaymentFailed'
import OrderSuccess from './pages/OrderSuccess'
import Orders from './pages/Orders'
import OrderDetails from './pages/OrderDetails'
import Profile from './pages/Profile'
import Wishlist from './pages/Wishlist'
import AdminDashboard from './pages/admin/AdminDashboard'
import ManageBooks from './pages/admin/ManageBooks'
import AddBook from './pages/admin/AddBook'
import EditBook from './pages/admin/EditBook'
import ManageOrders from './pages/admin/ManageOrders'
import ManageUsers from './pages/admin/ManageUsers'
import ManageReviews from './pages/admin/ManageReviews'
import Analytics from './pages/admin/Analytics'
import Settings from './pages/admin/Settings'
import ManageContact from './pages/admin/ManageContact'
import Contact from './pages/Contact'
import About from './pages/About'
import FAQ from './pages/FAQ'
import ForgotPassword from './pages/ForgotPassword'
import VerifyOTP from './pages/VerifyOTP'
import Signup from './component/Signup'
import ProtectedRoute from './component/ProtectedRoute'
import LoginPage from './pages/LoginPage'
import AdminRoute from './component/AdminRoute'
import AdminPlaceholder from './components/AdminPlaceholder'

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        {/* Protect the Course route */}
        <Route path="/Course" element={<ProtectedRoute><Shop /></ProtectedRoute>} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/books/:id" element={<BookDetails />} />
        <Route path="/about" element={<About />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify-otp" element={<VerifyOTP />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/Checkout" element={<Checkout />} />
        <Route path="/Payment" element={<Payment />} />
        <Route path="/PaymentSuccess" element={<PaymentSuccess />} />
        <Route path="/PaymentFailed" element={<PaymentFailed />} />
        <Route path="/OrderSuccess" element={<OrderSuccess />} />
        <Route path="/my-orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
        <Route path="/orders/:orderId" element={<OrderDetails />} />
        <Route path="/Profile" element={<Profile />} />
        <Route path="/Wishlist" element={<Wishlist />} />
        
        {/* Admin Routes */}
        <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        <Route path="/admin/books" element={<AdminRoute><ManageBooks /></AdminRoute>} />
        <Route path="/admin/books/add" element={<AdminRoute><AddBook /></AdminRoute>} />
        <Route path="/admin/books/edit/:id" element={<AdminRoute><EditBook /></AdminRoute>} />
        <Route path="/admin/orders" element={<AdminRoute><ManageOrders /></AdminRoute>} />
        <Route path="/admin/users" element={<AdminRoute><ManageUsers /></AdminRoute>} />
        
        {/* Placeholder Admin Routes */}
        <Route path="/admin/categories" element={<AdminRoute><AdminPlaceholder /></AdminRoute>} />
        <Route path="/admin/reviews" element={<AdminRoute><ManageReviews /></AdminRoute>} />
        <Route path="/admin/analytics" element={<AdminRoute><Analytics /></AdminRoute>} />
        <Route path="/admin/contact" element={<AdminRoute><ManageContact /></AdminRoute>} />
        <Route path="/admin/settings" element={<AdminRoute><Settings /></AdminRoute>} />
        
        <Route path="/Signup" element={<Signup />} />
      </Routes>
    </div>
  )
}

export default App