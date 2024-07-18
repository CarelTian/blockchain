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
- Lessee: Owner can rent out IP to it if necessary. (not developed yet)
- md5 : md5 of IP file
- timestamp: The Manager would generates a timestamp when a IP created;
- Status : 0 means unavailable , 1 means active, 2 means tradable.

TxAddress - The deployed address of transaction.sol

Some functions are easy to understand, so I won't go into too much detail. The logic is that the manager has the authority to verify, enable, and disable any IP. I believe the IP management system cannot be completely decentralized because IP should be considered valuable. An organization can assess its value and present it to the public. However, the trade market is entirely free. Owners have full control over the tradable status and price of their property. This model is rare in the real world and makes the best use of blockchain features.