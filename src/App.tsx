import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import ProductList from './pages/ProductList'
import ProductDetail from './pages/ProductDetail'
import ProductCreate from './pages/ProductCreate'
import ProductUpdate from './pages/ProductUpdate'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ProductList />} />
        <Route path="/pc/create" element={<ProductCreate />} />
        <Route path="/pc/update/:id" element={<ProductUpdate />} />
        <Route path="/pc/:id" element={<ProductDetail />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
