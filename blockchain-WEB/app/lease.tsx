import * as React from 'react';
import { useState, useEffect } from "react";
import { Description, Dialog, DialogPanel, DialogTitle, Field, Label, Input, Textarea } from '@headlessui/react';
import { useReadContract, useWriteContract, useAccount } from 'wagmi';
import { contracts } from './contract'; 
import { parseEther } from 'viem';

interface LeaseProps {
  ipId: BigInt;
  onLease: () => void;
}

export function Lease({ ipId, onLease }: LeaseProps) {
  const [isPending, setIsPending] = React.useState(false);
  const [price, setPrice] = useState<number | undefined>(0); // Initialize to 0

  const { data: priceData } = useReadContract({
    address: contracts['transaction'].address as `0x${string}`,
    abi: contracts['transaction'].abi,
    functionName: 'leasePrices',
    args: [ipId.toString()],
  });

  useEffect(() => {
    if (priceData) {
      setPrice(Number(priceData));
    } else {
      setPrice(undefined); // Set to undefined if price data is not fetched
    }
  }, [priceData]); 

  const { writeContract } = useWriteContract();

  const handleLease = async () => {
    setIsPending(true);

    try {
      if(price !== undefined){
        const priceInWei: bigint = BigInt(price);
        console.log('Attempting to Lease IP with price:', parseEther((price).toString()));
        const tx = await writeContract({
          address: contracts['ipCore'].address as `0x${string}`,
          abi: contracts['ipCore'].abi,
          functionName: 'lease', 
          args: [ipId],
          value: priceInWei, // Convert to Wei
    
        });
        console.log('Lease sent:', tx);
      }
    } catch (error) {
      console.error('Error leasing IP:', error);
    } finally {
      setIsPending(false);
      if (!isPending) {
        onLease(); // Close dialog
      }
    }
  };

  return (
    <Dialog open={true} onClose={onLease} className="relative z-50">
      <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
        <DialogPanel className="max-w-lg w-1/2 space-y-4 border bg-white p-12">
          <DialogTitle className="font-bold">Lease IP</DialogTitle>
          <p>{price !== undefined ? `Are you sure you want to Lease the IP?  The current price is: ${price} Wei` : 'Failed to fetch price'}</p>
          <div className="flex gap-4 mt-8">
            <button className="border p-2 rounded-md" type="submit" disabled={isPending} onClick={handleLease}>Confirm Lease</button>
            <button className="border p-2 rounded-md" onClick={onLease}>Cancel</button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
