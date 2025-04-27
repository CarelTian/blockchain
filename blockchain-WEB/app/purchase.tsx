import * as React from 'react';
import { useState, useEffect } from "react";
import { Description, Dialog, DialogPanel, DialogTitle, Field, Label, Input, Textarea } from '@headlessui/react';
import { useReadContract, useWriteContract, useAccount } from 'wagmi';
import { contracts } from './contract'; 
import { parseEther } from 'viem';

interface PurchaseProps {
  ipId: BigInt;
  onPurchase: () => void;
}

export function Purchase({ ipId, onPurchase }: PurchaseProps) {
  const [isPending, setIsPending] = React.useState(false);
  const [price, setPrice] = useState<number | undefined>(0); // Initialize to 0

  const { data: tradePriceData } = useReadContract({
    address: contracts['transaction'].address as `0x${string}`,
    abi: contracts['transaction'].abi,
    functionName: 'tradePrices',
    args: [ipId.toString()],
  });

  useEffect(() => {
    if (tradePriceData) {
      setPrice(Number(tradePriceData));
    } else {
      setPrice(undefined); // Set to undefined if price data is not fetched
    }
  }, [tradePriceData]); 

  const { writeContract } = useWriteContract();

  const handlePurchase = async () => {
    setIsPending(true);
    try {
      if(price !== undefined){
        const priceInWei: bigint = BigInt(price);
        console.log('Attempting to purchase IP with price:', price);
        const tx = await writeContract({
          address: contracts['ipCore'].address as `0x${string}`,
          abi: contracts['ipCore'].abi,
          functionName: 'transfer', 
          args: [ipId],
          value: priceInWei, // Convert to Wei
    
        });
        console.log('Transaction sent:', tx);
      }
    } catch (error) {
      console.error('Error purchasing IP:', error);
    } finally {
      setIsPending(false);
      if (!isPending) {
        onPurchase(); // Close dialog
      }
    }
  };

  return (
    <Dialog open={true} onClose={onPurchase} className="relative z-50">
      <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
        <DialogPanel className="max-w-lg w-1/2 space-y-4 border bg-white p-12">
          <DialogTitle className="font-bold">Purchase IP</DialogTitle>
          <p>{price !== undefined ? `Are you sure you want to purchase the IP? The current price is: ${price} Wei` : 'Failed to fetch price'}</p>
          <div className="flex gap-4 mt-8">
            <button className="border p-2 rounded-md" type="submit" disabled={isPending} onClick={handlePurchase}>Confirm Purchase</button>
            <button className="border p-2 rounded-md" onClick={onPurchase}>Cancel</button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
