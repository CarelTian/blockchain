import * as React from 'react'
import { useConnect } from 'wagmi'

export function WalletOptions() {
  const { connectors, connect } = useConnect()
  const connector = connectors[0];
  return (
    <button  className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 
    bg-gradient-to-b from-blue-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 
    dark:bg-zinc-800/30 dark:from-inherit 
    lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 
    lg:dark:bg-zinc-800/30" onClick={() => connect({ connector })}>
      Connect Wallet
    </button>
  )
}