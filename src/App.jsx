import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import PrivateRoute from './components/PrivateRoute'
import Navbar from './components/Navbar'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import Product from './pages/Product'
import ProductDetail from './pages/ProductDetails'
import MyOrders from './pages/MyOrders'
import OrderConfirmation from './pages/OrderConfirmation'
import AdminRoute from './components/AdminRoute'
import AdminOrders from './pages/AdminOrders'
import { AuthModalProvider } from './AuthModalContext'

const App = () => {
  return (
    <BrowserRouter>
    <AuthModalProvider>

      <Navbar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        
        <Route path='/cart' element={
          <PrivateRoute>
            <Cart />
          </PrivateRoute>
        } />

        <Route path='/checkout' element={
          <PrivateRoute>
            <Checkout />
          </PrivateRoute>
        } />

        <Route path='/myorders' element={
          <PrivateRoute>
            <MyOrders />
          </PrivateRoute>
        } />

        <Route path="/order/:id" element={
          <PrivateRoute>
            <OrderConfirmation />
          </PrivateRoute>
        } />

        <Route path="/admin/orders" element={
          <AdminRoute>
            <AdminOrders />
          </AdminRoute>
        } />

        <Route path='/register' element={<Register />} />
        <Route path='/login' element={<Login />} />
      </Routes>
        </AuthModalProvider>
    </BrowserRouter>
  )
}

export default App
