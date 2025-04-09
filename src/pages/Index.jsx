
import React, { useState, useEffect } from 'react';
import { photos as initialPhotos } from '../data/photos';
import { useCart } from '../context/CartContext';
import ShoppingCart from '../components/ShoppingCart';
import Navbar from '../components/Navbar';
import { CartProvider } from '../context/CartContext';

// Simple Photo Card component
const PhotoCard = ({ photo }) => {
  const { addToCart, isInCart } = useCart();
  
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="h-48 bg-gray-200 flex items-center justify-center">
        <span className="text-3xl">📷</span>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-medium text-gray-900">{photo.title}</h3>
        <p className="mt-1 text-xl font-bold text-gray-900">${photo.price.toFixed(2)}</p>
        <button
          onClick={() => addToCart(photo)}
          disabled={isInCart(photo.id)}
          className={`mt-4 w-full px-4 py-2 rounded ${
            isInCart(photo.id)
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-blue-500 text-white hover:bg-blue-600'
          }`}
        >
          {isInCart(photo.id) ? 'In Cart' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
};

const Index = () => {
  const [photos, setPhotos] = useState(initialPhotos);

  useEffect(() => {
    // Listen for the custom event that's fired when photos are purchased
    const handlePurchase = (event) => {
      const { photoIds } = event.detail;
      
      setPhotos(prevPhotos => 
        prevPhotos.map(photo => 
          photoIds.includes(photo.id) 
            ? { ...photo, available: false } 
            : photo
        )
      );
    };

    window.addEventListener('photos-purchased', handlePurchase);
    
    return () => {
      window.removeEventListener('photos-purchased', handlePurchase);
    };
  }, []);

  return (
    <CartProvider>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <ShoppingCart />
        
        <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              NFT MARKETPLACE
            </h1>
            <p className="mt-4 text-lg text-gray-500">
              Discover and purchase stunning NFTs.
            </p>
          </div>
          
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {photos.filter(photo => photo.available).length > 0 ? (
              photos.filter(photo => photo.available).map(photo => (
                <PhotoCard key={photo.id} photo={photo} />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-xl text-gray-500">All photos have been sold!</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </CartProvider>
  );
};

export default Index;
