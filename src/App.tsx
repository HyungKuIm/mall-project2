import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import ProductList from './pages/ProductList'
import ProductDetail from './pages/ProductDetail'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ProductList />} />
        <Route path="/pc/:id" element={<ProductDetail />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
