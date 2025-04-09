
import React from 'react';
import { useCart } from '../context/CartContext';

const CartItem = ({ item }) => {
  const { removeFromCart } = useCart();

  return (
    <div className="flex items-center py-3 border-b border-gray-200 last:border-b-0">
      <div className="h-16 w-16 flex-shrink-0 rounded overflow-hidden bg-gray-100">
        <div className="h-full w-full bg-gray-200 flex items-center justify-center">
          📷
        </div>
      </div>
      <div className="ml-4 flex-1">
        <h4 className="text-sm font-medium text-gray-800">{item.title}</h4>
        <p className="text-sm font-bold text-gray-900 mt-1">${item.price.toFixed(2)}</p>
      </div>
      <button
        onClick={() => removeFromCart(item.id)}
        className="text-red-500 hover:text-red-700 font-medium"
        aria-label="Remove item"
      >
        Remove
      </button>
    </div>
  );
};

export default CartItem;
