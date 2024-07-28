// SPDX-License-Identifier: GPL-3.0
        
pragma solidity >=0.8.0 <0.9.0;

import "remix_tests.sol";
import "remix_accounts.sol";
import "./IPCore.sol";
import "./Transaction.sol";
import "./BytesLib.sol";


contract ipcoreTest is IPcore{
    using BytesLib for bytes;
    address acc0;   
    address acc1;
    address acc2;
    Transaction txcontract;

    /// 'beforeAll' runs before all other tests
    function beforeAll() public {
        // Initialize account variables
        acc0 = TestsAccounts.getAccount(0); // Default account
        acc1 = TestsAccounts.getAccount(1); // Second account
        acc2 = TestsAccounts.getAccount(2); // Third account
        //deploy Transaction contract
        txcontract = new Transaction();
        txcontract.setIPcore(address(this));
        // Instantiate the contract using acc0
    }

    /// Check manager
    function managerTest() public {
        Assert.equal(manager, acc0, "Manager should be acc0");
    }
    
    /// Register an IP
    function registerIPTest() public {
        registerIP("category1", "IP1", "Description1", acc0, "md5hash", block.timestamp);
        
        IPcore.Property memory ip = getIP(0);
        Assert.equal(ip.id, uint(0), "ID should be 0");
        Assert.equal(ip.category, "category1", "Category should be 'category1'");
        Assert.equal(ip.name, "IP1", "Name should be 'IP1'");
        Assert.equal(ip.description, "Description1", "Description should be 'Description1'");
        Assert.equal(ip.owner, acc0, "Owner should be acc0");
        Assert.equal(ip.md5, "md5hash", "MD5 should be 'md5hash'");
        Assert.equal(ip.status, uint8(1), "Status should be 1");
    }

    /// Invalidate an IP
    function invalidateIPTest() public {
        invalidateIP(0);
        Property memory ip = getIP(0);
        Assert.equal(ip.status, uint8(0), "Status should be 0");
    }
    
    /// Restore an IP
    function restoreIPTest() public {
        restoreIP(0);
        IPcore.Property memory ip = getIP(0);
        Assert.equal(ip.status, uint8(1), "Status should be 1");
    }
    /// Test setting transaction address
    function setTransactionTest() public {
        setTransaction(address(txcontract));
        Assert.equal(TxAddress, address(txcontract), "Transaction address should be txcontract address");
    }
    
    function leaseIPTest() public {
        uint id= 0;
        uint price = 10000; 
        uint leaseEndTimestamp = block.timestamp + 1000;
        leaseIP(id, price, leaseEndTimestamp);
        bool flag = txcontract.leaseable(id);
        Assert.ok(flag, "Lease status should be leaseable");
    }
    
    function recycleIPTest() public {
        uint id= 0;
        recycleIP(id);
        bool flag = txcontract.leaseable(id);
        Assert.ok(!flag, "Lease status shouldn't be leaseable");
    }

     function leaseIP1Test() public {
        uint id= 0;
        uint price = 10000; 
        uint leaseEndTimestamp = block.timestamp + 1000;
        leaseIP(id, price, leaseEndTimestamp);
        bool flag = txcontract.leaseable(id);
        Assert.ok(flag, "Lease status should be leaseable");
    }

    /// #sender: account-1
    /// #value: 1000000000000000
    function leaseTest() public payable{
        uint id= 0;
        (bool success, bytes memory result) = address(this).delegatecall(abi.encodeWithSignature("lease(uint256)", id));
         if(!success){
            string memory errorMessage = abi.decode(result.slice(4,result.length-4),(string));
            Assert.equal(errorMessage, "Can only be executed by the manager", errorMessage);
         }else{
            IPcore.Property memory ip = getIP(0);
           Assert.equal(ip.owner, acc1, "Owner should be acc1");
         }
    }


    /// Test redeeming contract balance
    function redeemTest() public {
        redeem();
        uint balance = address(this).balance;
        Assert.equal(balance, uint(0), "Contract balance should be 0 after redeem");
    }

    /// Custom Transaction Context: https://remix-ide.readthedocs.io/en/latest/unittesting.html#customization
    /// #sender: account-1
    /// #value: 100
    function checkSenderAndValue() public payable {
        // account index varies 0-9, value is in wei
        Assert.equal(msg.sender, TestsAccounts.getAccount(1), "Invalid sender");
        Assert.equal(msg.value, 100, "Invalid value");
    }
}
