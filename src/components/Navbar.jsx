
import React,{useState} from 'react';
import { useCart } from '../context/CartContext';
import WalletConnect from './WalletConnect';

const Navbar = () => {
  const { cartItems, setIsCartOpen } = useCart();

  return (
    <nav className="sticky top-0 z-10 bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex-shrink-0 flex items-center">
            <h1 className="text-xl font-bold text-gray-800">PhotoMarket</h1>
          </div>
          <div className="flex items-center">
            <button 
              onClick={() => setIsCartOpen(true)}
              className="flex items-center px-4 py-2 rounded bg-gray-100 hover:bg-gray-200"
            >
              Cart ({cartItems.length})
            </button>
            <WalletConnect />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
