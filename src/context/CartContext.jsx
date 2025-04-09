
import React, { createContext, useContext, useState } from 'react';

const CartContext = createContext(undefined);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const addToCart = (photo) => {
    if (!isInCart(photo.id)) {
      setCartItems([...cartItems, photo]);
      alert(`${photo.title} added to cart`);
    } else {
      alert(`${photo.title} is already in your cart`);
    }
  };

  const removeFromCart = (photoId) => {
    const updatedCart = cartItems.filter(item => item.id !== photoId);
    setCartItems(updatedCart);
    alert("Item removed from cart");
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + item.price, 0);
  };

  const isInCart = (photoId) => {
    return cartItems.some(item => item.id === photoId);
  };

  const checkout = () => {
    if (cartItems.length === 0) {
      alert("Your cart is empty");
      return;
    }
    
    // In a real app, this would process payment
    // For now, we'll just mark photos as sold (unavailable)
    const photoIds = cartItems.map(item => item.id);
    
    // Dispatch an event so our gallery component can update
    window.dispatchEvent(new CustomEvent('photos-purchased', { 
      detail: { photoIds } 
    }));
    
    clearCart();
    setIsCartOpen(false);
    alert("Thank you for your purchase!");
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      clearCart,
      getCartTotal,
      isInCart,
      checkout,
      isCartOpen,
      setIsCartOpen
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
