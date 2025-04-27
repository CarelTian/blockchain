import * as React from 'react'
import { useState, useEffect } from "react";
import { Description, Dialog, DialogPanel, DialogTitle, Field, Label, Input, Textarea } from '@headlessui/react'
import { useWaitForTransactionReceipt, BaseError, useReadContract, useWriteContract, useAccount } from 'wagmi'
import { Purchase } from './purchase';
import { Lease } from './lease';
import { contracts } from './contract';
import { FaSearch } from 'react-icons/fa';

interface IPData {
    id: BigInt,
    category: string,
    name: string,
    description: string,
    owner: string,
    lessee: string,
    md5: string,
    timestamp: BigInt,
    leaseEndTimestamp: BigInt,
    status: BigInt,
}
export function GetIP() {
    const address = useAccount();
    const [ipId, setIpId] = useState('');
    const [ipData, setIpData] = useState<IPData | null>(null);
    // Handle user input
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setIpId(e.target.value);
    };
    // Query specific information
    const { data: data } = useReadContract({
        address: contracts['ipCore'].address as `0x${string}`,
        abi: contracts['ipCore'].abi,
        functionName: 'getIP',
        args: [ipId],
    });
    // Data processing
    const fetchIP = async () => {
        if (!ipId) {
            alert("Please enter IP id.");
            return;
        }
        setIpData(data as IPData);
        console.log('Retrieved IP:', data);
    };

    const [invalidOpen, setInvalidOpen] = useState(false);
    const [restoreOpen, setRestoreOpen] = useState(false);
    const [rentOpen, setRentOpen] = useState(false);
    const [leaseOpen, setLeaseOpen] = useState(false);

    const [sellOpen, setSellOpen] = useState(false);
    const [purchaseOpen, setPurchaseOpen] = useState(false);

    const { data: hash, writeContract, isPending } = useWriteContract()

    const { isLoading: isConfirming, isSuccess: isConfirmed } =
            useWaitForTransactionReceipt({
                hash,
    })

    async function handleOperate(functionName: string) {
        console.log(functionName);
        try {
            const result = await writeContract({
                address: contracts['ipCore'].address as `0x${string}`,
                abi: contracts['ipCore'].abi,
                functionName: functionName,
                args: [ipId],
            })
            console.log(isPending);
            if (isPending) {
                setTimeout(() => {
                    console.log("pending");
                }, 3000);
            }
            console.log(result);
        } catch (error) {
            console.error('Error run :', functionName, error);
        }
    }

    async function handleSell(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        const formData = new FormData(e.target as HTMLFormElement)
        const price = formData.get('price') as string
        await writeContract({
            address: contracts['ipCore'].address as `0x${string}`,
            abi: contracts['ipCore'].abi,
            functionName: 'sellIP',
            args: [ipData?.id, Number(price)*1000000000],
        })
        if (!isPending) {
            setTimeout(() => {
                setSellOpen(false)
            }, 3000)
        }
    }



    async function handleRent(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        const formData = new FormData(e.target as HTMLFormElement)
        const price = formData.get('price') as string
        const timestamp = formData.get('timestamp') as string
        await writeContract({
            address: contracts['ipCore'].address as `0x${string}`,
            abi: contracts['ipCore'].abi,
            functionName: 'leaseIP',
            args: [ipData?.id, Number(price)*1000000000, Number(timestamp)],
        })

        if (isPending) {
            console.log("Confirming...");
        }

        if (isConfirmed) {
            console.log("isConfirmed",hash);
            //menu close
            setRentOpen(false)
        }
    }

    function getStatusColor(status: BigInt): string {
        switch (status.toString()) {
            case '0':
                return 'text-red-500';
            case '1':
                return 'text-green-500';
            case '2':
                return 'text-blue-500'; // New status color
            default:
                return '';
        }
    }

    function getStatusText(status: BigInt): string {
        switch (status.toString()) {
            case '0':
                return 'Deprecated';
            case '1':
                return 'In Use';
            case '2':
                return 'In Transaction'; // New status text
            default:
                return '';
        }
    }
    function formatTimestamp(timestamp: number): string {
        const date = new Date(timestamp * 1000); // Convert timestamp from seconds to milliseconds
        const options: Intl.DateTimeFormatOptions = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
            timeZoneName: 'short'
        };
        return date.toLocaleString('default', options);
    }


    return (
        <>
            <Field className="mt-4 w-full">
                <Input value={ipId}
                    onChange={handleInputChange}
                    type="text" className="w-[80%] m-0 border p-2 rounded-md border-[focus]:shadow" placeholder="Please enter the IP id to query" />
                <button
                    className="p-3 rounded-r-md bg-gray-100 hover:bg-gray-200"
                    onClick={fetchIP}>
                    <FaSearch />
                </button>
            </Field>

            {ipData && (
                <div className="flex flex-row w-full max-w-6xl flex-wrap items-center w-full text-sm lg:flex">
                    <div className="mt-10 ml-5 mr-5 p-4 text-center rounded-lg border border-gray-300 lg:w-1/2 lg:mb-0 lg:text-left">
                        <div className='flex flex-row justify-between'>
                            <h2 className="mb-2 text-2xl font-semibold">
                                {ipData.id.toString()}
                            </h2>
                            <h2 className={`mb-2 text-sm opacity-30 ${getStatusColor(ipData.status)}`}>
                                {getStatusText(ipData.status)}
                            </h2>
                        </div>

                        <div className="m-0 h-5 w-1/5 border border-yellow-300 bg-yellow-100 rounded-md text-center text-yellow-400 text-sm">
                            {ipData.category}
                        </div>
                        <p className="mt-4 mb-4 max-w-[30ch] text-sm opacity-50">
                            {ipData.description}
                        </p>
                        <p className="mt-4 mb-4 max-w-[30ch] text-sm opacity-50">
                            {formatTimestamp(Number(ipData.timestamp))}
                        </p>
                        <p className="mt-4 mb-4 max-w-[50ch] text-sm opacity-50">
                            Owner: {ipData.owner}
                        </p>
                        {ipData?.owner === address.address as string && ipData.status ?
                            (<button className="w-1/4 mr-3 border border-gray-300 rounded-md"
                                onClick={() => setSellOpen(true)}>Sell</button>) :
                            (<button className="w-1/4 mr-3 border border-gray-300 rounded-md" onClick={() => setPurchaseOpen(true)}>Purchase</button>)}

                        {ipData?.owner === address.address as string && ipData.status ?
                            (<button className="w-1/4 mr-3 border border-gray-300 rounded-md"
                                onClick={() => setRentOpen(true)}>Rent</button>) :
                            (<button className="w-1/4 mr-3 border border-gray-300 rounded-md" onClick={() => setLeaseOpen(true)}>Lease</button>)}


                        {ipData?.owner === address.address as string ?
                            (ipData?.status.toString() === '0'?(<button className="w-1/4 mr-3 border border-gray-300 rounded-md" onClick={() => setRestoreOpen(true)}>Restore</button>) :
                            (<button className="w-1/4 mr-3 border border-gray-300 rounded-md" onClick={() => setInvalidOpen(true)}>Deprecate</button>)):''
                        }
                    </div>
                </div>
            )}

            <Dialog open={invalidOpen} onClose={() => setInvalidOpen(false)} className="relative z-50">
                <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
                    <DialogPanel className="max-w-lg w-1/2 space-y-4 border bg-white p-12">
                        <DialogTitle className="font-bold">Deprecate IP</DialogTitle>
                        <Description>Once deprecated, the IP cannot be used</Description>
                        <p>It can be restored later</p>
                        <div className="flex flex-row-reverse gap-4 mt-8">
                            <button className="border p-2 rounded-md" onClick={() => setInvalidOpen(false)}>Cancel</button>
                            <button className="border p-2 rounded-md" onClick={() => handleOperate("invalidateIP")}>Deprecate IP</button>
                        </div>
                    </DialogPanel>
                </div>
            </Dialog>

            <Dialog open={restoreOpen} onClose={() => setRestoreOpen(false)} className="relative z-50">
                <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
                    <DialogPanel className="max-w-lg w-1/2 space-y-4 border bg-white p-12">
                        <DialogTitle className="font-bold">Restore IP</DialogTitle>
                        <Description>Restored IP can be used normally</Description>
                        <div className="flex flex-row-reverse gap-4 mt-8">
                            <button className="border p-2 rounded-md" onClick={() => setRestoreOpen(false)}>Cancel</button>
                            <button className="border p-2 rounded-md" onClick={() => handleOperate("restoreIP")}>Restore IP</button>
                        </div>
                    </DialogPanel>
                </div>
            </Dialog>

            <Dialog open={sellOpen} onClose={() => setSellOpen(false)} className="relative z-50">
                <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
                    <DialogPanel className="max-w-lg space-y-4 border bg-white p-12">
                        <DialogTitle className="font-bold">Sell IP</DialogTitle>
                        <form onSubmit={handleSell}>
                            <Field className="mt-4">
                                <Label className="mr-4">IP Id</Label>
                                <Input type="text" className="border border-[focus]:shadow" disabled placeholder={ipData?.id.toString()} />
                            </Field>
                            <Field className="mt-4">
                                <Label className="mr-4">Price</Label>
                                <Input name="price" type="number" className="border border-[focus]:shadow" />gWei
                            </Field>
                            <div className="flex gap-4 mt-8">
                                <button className="border p-2 rounded-md" type="submit" disabled={isPending}>Confirm Sale</button>
                                <button className="border p-2 rounded-md" onClick={() => setSellOpen(false)}>Cancel</button>
                            </div>
                        </form>

                    </DialogPanel>
                </div>
            </Dialog>

            <Dialog open={rentOpen} onClose={() => setRentOpen(false)} className="relative z-50">
                <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
                    <DialogPanel className="max-w-lg space-y-4 border bg-white p-12">
                        <DialogTitle className="font-bold">Sell IP</DialogTitle>
                        <form onSubmit={handleRent}>
                            <Field className="mt-4">
                                <Label className="mr-4">IP Id</Label>
                                <Input type="text" className="border border-[focus]:shadow" disabled placeholder={ipData?.id.toString()} />
                            </Field>
                            <Field className="mt-4">
                                <Label className="mr-4">Price</Label>
                                <Input name="price" type="number" className="border border-[focus]:shadow" />gWei
                            </Field>
                            <Field className="mt-4">
                                <Label className="mr-4">Timestamp</Label>
                                <Input name="timestamp" type="number" className="border border-[focus]:shadow" />
                            </Field>
                            <div className="flex gap-4 mt-8">
                                <button className="border p-2 rounded-md" type="submit" disabled={isPending}>Confirm Rent</button>
                                <button className="border p-2 rounded-md" onClick={() => setRentOpen(false)}>Cancel</button>
                            </div>
                        </form>

                    </DialogPanel>
                </div>
            </Dialog>

            {purchaseOpen && ipData && <Purchase ipId={ipData?.id as BigInt} onPurchase={() => setPurchaseOpen(false)} />}
            {leaseOpen && ipData && <Lease ipId={ipData?.id as BigInt} onLease={() => setLeaseOpen(false)} />}
        </>
    )
}