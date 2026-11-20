import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import ProductList from './pages/ProductList'
import ProductDetail from './pages/ProductDetail'
import ProductCreate from './pages/ProductCreate'
import ProductUpdate from './pages/ProductUpdate'
import Register from './pages/Register'
import Login from './pages/Login'
import { AuthProvider } from './auth/AuthContext'
import AdminRoute from './auth/AdminRoute'
import PrivateRoute from './auth/PrivateRoute'
import Cart from './pages/Cart'
import OrderForm from './pages/OrderForm'
import OrderComplete from './pages/OrderComplete'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<ProductList />} />
          <Route path="/pc/create" element={<AdminRoute><ProductCreate /></AdminRoute>} />
          <Route path="/pc/update/:id" element={<AdminRoute><ProductUpdate /></AdminRoute>} />
          <Route path="/pc/:id" element={<ProductDetail />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/cart" element={<PrivateRoute><Cart /></PrivateRoute>} />
          <Route path="/orderForm" element={<PrivateRoute><OrderForm /></PrivateRoute>} />
          <Route path="/orderComplete" element={<PrivateRoute><OrderComplete /></PrivateRoute>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
