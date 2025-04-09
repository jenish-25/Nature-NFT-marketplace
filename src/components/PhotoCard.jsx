import React from 'react';
import { useCart } from '../context/CartContext';

const PhotoCard = ({ photo }) => {
  const { addToCart, isInCart } = useCart();

  if (!photo.available) {
    return null; // Don't display photos that are no longer available
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="relative pb-[66.66%] overflow-hidden bg-gray-100">
        <img 
          src={photo.src} 
          alt={photo.title} 
          className="absolute inset-0 w-full h-full object-cover"
          loading="lazy"
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-medium text-gray-800 mb-2">{photo.title}</h3>
        <div className="flex justify-between items-center">
          <p className="text-xl font-bold text-gray-900">${photo.price.toFixed(2)}</p>
          <button
            onClick={() => addToCart(photo)}
            disabled={isInCart(photo.id)}
            className={`px-4 py-2 rounded ${
              isInCart(photo.id) 
                ? 'bg-gray-300 cursor-default' 
                : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
          >
            {isInCart(photo.id) ? "Added" : "Buy"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PhotoCard;
