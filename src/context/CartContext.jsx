import React, { createContext, useContext, useState, useEffect } from 'react';
import { ethers } from "ethers";

const receiverAddress = "0xf46618e109Fe935a2EA969E7c538Ca07e0c28564"; 

const CartContext = createContext(undefined);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [connected, setConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [isSepolia, setIsSepolia] = useState(false);

  useEffect(() => {
    const checkWallet = async () => {
      if (!window.ethereum) return;

      try {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          setConnected(true);
          setWalletAddress(accounts[0]);
          const provider = new ethers.BrowserProvider(window.ethereum);
          const { chainId } = await provider.getNetwork();
          setIsSepolia(Number(chainId) === 11155111);
        }
      } catch (error) {
        console.error("Error checking wallet:", error);
      }
    };

    checkWallet();

    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length > 0) {
          setConnected(true);
          setWalletAddress(accounts[0]);
        } else {
          setConnected(false);
          setWalletAddress("");
          setIsSepolia(false);
        }
      });

      window.ethereum.on('chainChanged', (chainId) => {
        setIsSepolia(Number(chainId) === 11155111);
      });
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeAllListeners('accountsChanged');
        window.ethereum.removeAllListeners('chainChanged');
      }
    };
  }, []);

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("Please install MetaMask!");
      return;
    }

    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      if (accounts.length > 0) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const { chainId } = await provider.getNetwork();
        setConnected(true);
        setWalletAddress(accounts[0]);
        setIsSepolia(Number(chainId) === 11155111);
      }
    } catch (error) {
      console.error("Wallet connection error:", error);
      alert("Failed to connect wallet.");
    }
  };

  const addToCart = (photo) => {
    if (!isInCart(photo.id)) {
      setCartItems([...cartItems, photo]);
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
    const pricePerItem = 0.000001;
    return (cartItems.length * pricePerItem).toFixed(6); 
  };

  const isInCart = (photoId) => {
    return cartItems.some(item => item.id === photoId);
  };

  const checkout = async () => {
    console.log("Checkout started. Cart items:", cartItems);
    if (cartItems.length === 0) {
      console.log("Cart is empty");
      alert("Your cart is empty");
      return;
    }
  
    if (!connected) {
      console.log("Wallet is not connected");
      alert("Please connect your wallet first.");
      return;
    }
  
    if (!isSepolia) {
      console.log("Not on Sepolia Testnet");
      alert("Please switch to Sepolia Testnet.");
      return;
    }
  
    console.log("Wallet connected and on Sepolia. Proceeding with transaction...");
    try {
      console.log("window.ethereum:", window.ethereum);
      if (!window.ethereum) {
        console.error("MetaMask is not detected. Please install MetaMask and connect your wallet.");
        alert("MetaMask is not detected. Please install MetaMask and connect your wallet.");
        return;
      }
  
      const provider = new ethers.BrowserProvider(window.ethereum);
      console.log("Provider created",provider);
      const signer = await provider.getSigner();
      console.log("Signer created",signer);
      const address = await signer.getAddress();
      console.log("Signer address:", address);
  
      const totalEth = getCartTotal();
      console.log("Total ETH to send:", totalEth);
  
      console.log("Preparing transaction with receiver:", receiverAddress);
      const txParams = {
        to: receiverAddress,
        value: ethers.parseUnits(totalEth.toString()),
      };
      console.log("Transaction params:", txParams);
      
      try {
        const tx = await signer.sendTransaction(txParams);
        console.log("Transaction hash:", tx.hash);
        await tx.wait();
        console.log("Transaction confirmed!");
      } catch (error) {
        console.error("Transaction failed:", error);
        throw error; 
      }
  
      const photoIds = cartItems.map(item => item.id);
      console.log("Purchased photo IDs:", photoIds);
      window.dispatchEvent(new CustomEvent('photos-purchased', {
        detail: { photoIds }
      }));
  
      clearCart();
      setIsCartOpen(false);
      alert("Transaction Successful! Thank you for your purchase.");
    } catch (error) {
      console.error("Transaction Error Details:", error);
    }
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
      setIsCartOpen,
      connected,
      walletAddress,
      isSepolia,
      connectWallet,
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