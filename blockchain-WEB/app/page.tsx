"use client";
import * as React from 'react';
import Image from "next/image";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider, useAccount, useDisconnect, useConnect } from 'wagmi';
import { config } from '../config';
import { Account } from './Account';
import { RegisterIP } from "./registerIP";
import { GetIP } from "./getIP";
import { useState, useEffect } from "react";
import { FaBars, FaTimes, FaRegAddressCard, FaSearch } from "react-icons/fa";

const queryClient = new QueryClient();

function ConnectWallet() {
  const { isConnected, address } = useAccount();
  const { disconnect } = useDisconnect();

  useEffect(() => {
    if (isConnected) {
      localStorage.setItem('walletConnected', 'true');
    } else {
      localStorage.removeItem('walletConnected');
    }
  }, [isConnected]);

  const truncatedAddress = address 
    ? `${address.slice(0, 4)}****${address.slice(-4)}`
    : '';

  return isConnected ? (
    <div className="flex flex-col items-center">
      <div className="mb-2">{truncatedAddress}</div>
      <button
        className="px-4 py-2 bg-red-500 text-white rounded-full"
        onClick={() => disconnect()}
      >
        Disconnect
      </button>
    </div>
  ) : (
    <WalletOptions />
  );
}

function WalletOptions() {
  const { connectors, connect } = useConnect();
  const connector = connectors[0];
  return (
    <button 
      className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 
      bg-gradient-to-b from-blue-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 
      dark:bg-zinc-800/30 dark:from-inherit 
      lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 
      lg:dark:bg-zinc-800/30" onClick={() => connect({ connector })}
    >
      Connect Wallet
    </button>
  );
}

export default function Home() {
  const [activeTab, setActiveTab] = useState('register');
  const [menuOpen, setMenuOpen] = useState(true);
  const [showWalletPrompt, setShowWalletPrompt] = useState(false);

  useEffect(() => {
    // Show wallet connection prompt on page load if not already connected
    const walletConnected = localStorage.getItem('walletConnected');
    if (!walletConnected) {
      setShowWalletPrompt(true);
    }
  }, []);

  return (
    <div>
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <div>
            <main className="flex min-h-screen bg-white">
              <div className={`flex flex-col ${menuOpen ? 'w-60' : 'w-20'} p-4 border-r bg-gray-100 transition-width duration-300`}>
                <div className="flex items-center justify-between mb-8">
                  <button 
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="bg-gray-200 hover:bg-gray-300 text-black font-semibold py-2 px-2 rounded-full mb-4 transition-all duration-300"
                  >
                    {menuOpen ? <FaTimes /> : <FaBars />}
                  </button>
                </div>
                {menuOpen && (
                  <>
                    <button
                      className={`flex items-center px-4 py-2 my-2 rounded-md hover:bg-gray-200 ${activeTab === 'register' ? 'bg-gray-200' : 'bg-white'}`}
                      onClick={() => setActiveTab('register')}
                    >
                      <FaRegAddressCard className="mr-4" />
                      Register IP
                    </button>
                    <button
                      className={`flex items-center px-4 py-2 my-2 rounded-md hover:bg-gray-200 ${activeTab === 'query' ? 'bg-gray-200' : 'bg-white'}`}
                      onClick={() => setActiveTab('query')}
                    >
                      <FaSearch className="mr-4" />
                      Query IP
                    </button>
                  </>
                )}
                <div className="flex-grow"></div>
                {menuOpen && (
                  <div className="flex justify-center">
                    <ConnectWallet />
                  </div>
                )}
              </div>
              <div className="flex-grow p-10">
                {activeTab === 'register' && <RegisterIP />}
                {activeTab === 'query' && <GetIP />}
              </div>
            </main>
            {showWalletPrompt && (
              <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center z-50">
                <div className="bg-white p-8 rounded-md shadow-md">
                  <h2 className="text-xl font-bold mb-4">Connect Your Wallet</h2>
                  <p className="mb-4">Please connect your MetaMask wallet to proceed.</p>
                  <button
                    className="px-4 py-2 bg-blue-500 text-white rounded-md"
                    onClick={() => setShowWalletPrompt(false)}
                  >
                    Connect Wallet
                  </button>
                </div>
              </div>
            )}
          </div>
        </QueryClientProvider>
      </WagmiProvider>
    </div>
  );
}