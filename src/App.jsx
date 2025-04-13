import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import { CartProvider } from './context/CartContext'; 

function App() {
  return (
    <BrowserRouter>
    <CartProvider>
        <Routes>
          <Route path="/" element={<Index />} />
        </Routes>
    </CartProvider>
      </BrowserRouter>
  );
}

export default App;