import * as React from 'react';
import { useState, useEffect } from "react";
import { Description, Dialog, DialogPanel, DialogTitle, Field, Label, Input, Textarea } from '@headlessui/react';
import { useAccount, useWriteContract } from 'wagmi';
import { contracts } from './contract';

const contractName = 'ipCore';

export function RegisterIP() {
    const { address } = useAccount();
    const { writeContract, isPending } = useWriteContract();
    const [isOpen, setIsOpen] = useState(false);
    const [isUploadOpen, setIsUploadOpen] = useState(false);
    const [isUploadPending, setIsUploadPending] = useState(false); 

    useEffect(() => {
        document.documentElement.setAttribute('lang', 'en');
    }, []);

    async function register(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);
    
        if (address) {
            formData.append('address', address);
        } else {
            console.error('Address is undefined');
            return;
        }
    
        console.log('Uploading asset with data:', formData);
    
        setIsUploadPending(true);
    
        try {
            const response = await fetch('http://3.107.96.68:6452/upload', {
                method: 'POST',
                body: formData,
            });
            const result = await response.json();
            console.log('Upload result:', result);
        } catch (error) {
            console.error('Error uploading asset:', error);
        } finally {
            setIsUploadPending(false);
            setTimeout(() => {
                setIsOpen(false);
            }, 3000);
        }
    }

    return (
        <>
            <button
                className="absolute left-20 top-50 border-b border-gray-300 
                bg-gradient-to-b from-blue-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 
                dark:bg-zinc-800/30 dark:from-inherit 
                lg:static lg:w-auto lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 
                lg:dark:bg-zinc-800/30"
                onClick={() => setIsOpen(true)}
            >
                Register IP
            </button>
            <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
                <div className="fixed inset-0 flex items-center justify-center p-4 bg-black bg-opacity-50">
                    <DialogPanel className="max-w-lg w-full space-y-4 bg-white p-6 rounded-md">
                        <DialogTitle className="font-bold text-xl">Upload Asset</DialogTitle>
                        <Description className="text-gray-500">Please confirm the asset details are correct.</Description>
                        <form onSubmit={register} encType="multipart/form-data">
                            <Field className="mt-4">
                                <Label className="block text-gray-700">Blockchain Address</Label>
                                <Input name="address" type="text" className="mt-1 w-full border border-gray-300 p-2 rounded-md focus:ring focus:ring-blue-200" defaultValue={address || ''} readOnly />
                            </Field>
                            <Field className="mt-4">
                                <Label className="block text-gray-700">Category</Label>
                                <Input name="category" type="text" className="mt-1 w-full border border-gray-300 p-2 rounded-md focus:ring focus:ring-blue-200" />
                            </Field>
                            <Field className="mt-4">
                                <Label className="block text-gray-700">Name</Label>
                                <Input name="name" type="text" className="mt-1 w-full border border-gray-300 p-2 rounded-md focus:ring focus:ring-blue-200" />
                            </Field>
                            <Field className="mt-4">
                                <Label className="block text-gray-700">Description</Label>
                                <Textarea name="description" className="mt-1 w-full border border-gray-300 p-2 rounded-md focus:ring focus:ring-blue-200"></Textarea>
                            </Field>
                            <Field className="mt-4">
                                <Label className="block text-gray-700">File</Label>
                                <Input name="file" type="file" className="mt-1 w-full border border-gray-300 p-2 rounded-md focus:ring focus:ring-blue-200" />
                            </Field>
                            <div className="flex justify-end gap-4 mt-6">
                                <button className="px-4 py-2 bg-red-500 text-white rounded-md" type="button" onClick={() => setIsOpen(false)}>Cancel</button>
                                <button className="px-4 py-2 bg-blue-500 text-white rounded-md" type="submit" disabled={isUploadPending}>Submit</button>
                            </div>
                        </form>
                    </DialogPanel>
                </div>
            </Dialog>
        </>
    );
}
