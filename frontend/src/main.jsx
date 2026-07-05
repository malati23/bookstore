import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {BrowserRouter} from "react-router-dom"
import { AuthProvider } from './context/AuthProvider.jsx'
import { CartProvider } from './context/CartContext.jsx'
import { WishlistProvider } from './context/WishlistContext.jsx'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <div className='dark:bg-slate-900 dark:text-white'>
            <App />
          </div>
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  </BrowserRouter>
)
