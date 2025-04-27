import { useAccount, useDisconnect, useEnsAvatar, useEnsName } from 'wagmi'

export function Account() {
  const { address } = useAccount()
  const { disconnect } = useDisconnect()
  const { data: ensName } = useEnsName({ address })
  const { data: ensAvatar } = useEnsAvatar({ name: ensName! })

  return (
    <div className='flex flex-row'>
    <div className='mr-5 border-b border-gray-300 
        bg-gradient-to-b from-blue-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 
        dark:bg-zinc-800/30 dark:from-inherit 
        lg:static lg:w-auto lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 
        lg:dark:bg-zinc-800/30'>
         {ensAvatar && <img alt="ENS Avatar" src={ensAvatar} />}
      {address && <div>{ensName ? `${ensName} (${address})` : address}</div>}
    </div>
     
      <button className="mr-5 fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 
        bg-gradient-to-b from-blue-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 
        dark:bg-zinc-800/30 dark:from-inherit 
        lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 
        lg:dark:bg-zinc-800/30" onClick={() => disconnect()}>Disconnect</button>
    </div>
  )
}