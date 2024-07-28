### About smart contract

- IPcore.sol
- Transaction.sol

IPcore.sol define the business logic of Dapp. 

Struct Property is the definition of IP(Intellectual Property) with 9 member variables.

- id : unique id in IPs
- Category : category of IP
- Name : name of IP
- Description : A user can give a short description for IP when they submit it to manager.
- Owner: owner who creats IP which has been verified by manager.
- Lessee: Owner can rent out IP to it if necessary.
- md5 : md5 of IP file
- timestamp: The Manager would generates a timestamp when a IP created;
- Status : 0 means unavailable , 1 means active, 2 means tradable.

TxAddress - The deployed address of transaction.sol

Some functions are easy to understand, so I won't go into too much detail. The logic is that the manager has the authority to verify, enable, and disable any IP. I believe the IP management system cannot be completely decentralized because IP should be considered valuable. An organization can assess its value and present it to the public. However, the trade market is entirely free. Owners have full control over the tradable status and price of their property. This model is rare in the real world and makes the best use of blockchain features.



### How to use

1. make sure you have package.json and  npm install.
2. have a database named blockchain_group and run the script
3. compile the IPcore and Transaction.sol, then deploy them to the chain
4. Usage: client [options] [command]

   Options:
     -h, --help                                display help for command

   Commands:
     applyIP                                   Execute applyIP
     getIP <id>                                get IP
     sell <id> <price>                         sell IP
     withdraw <id>                             withdraw IP
     transfer <id> <price>                     transfer IP
     leaseIP <id> <price> <leaseEndTimestamp>  lease IP
     recycleIP <id>                            recycle IP
     lease <id> <price>                        lease IP
     getPrice <id>                             get price IP
     help [command]                            display help for command

5. Usage: manage [options] [command]

Options:
  -h, --help                display help for command

Commands:
  verifyIP                  Execute VerifyIP
  getIP <id>                Execute GetIP
  setTxAddress <address>    Set transaction contract Address for IPcore contract
  invalidateIP <id>         invalidate an IP that can not be transfered
  restoreIP <id>            retore an IP
  setCoreAddress <address>  Set IPcore address for transaction contract
  getBalance                get balance of contract
  payContract <ETH>         pay to contract
  help [command]            display help for command
