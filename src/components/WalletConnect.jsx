import React from 'react';
import { useCart } from '../context/CartContext';

const WalletConnect = () => {
  const { connected, walletAddress, isSepolia, connectWallet } = useCart();

  return (
    <>
      {!connected ? (
        <button
          onClick={connectWallet}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Connect Wallet
        </button>
      ) : (
        <div style={{ padding: "10px", fontWeight: "bold" }}>
          Connected: {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
          <br />
          <strong>Network:</strong> {isSepolia ? 'Sepolia Testnet' : 'Wrong Network'}
        </div>
      )}
    </>
  );
};

export default WalletConnect;