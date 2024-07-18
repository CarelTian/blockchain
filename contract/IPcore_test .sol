// SPDX-License-Identifier: GPL-3.0
        
pragma solidity >=0.8.0 <0.9.0;

import "remix_tests.sol";
import "remix_accounts.sol";
import "../contracts/IPcore.sol";

contract ipCore is IPcore{

    address acc0;   
    address acc1;
    address acc2;

    /// 'beforeAll' runs before all other tests
    function beforeAll() public {
        // Initialize account variables
        acc0 = TestsAccounts.getAccount(0); // Default account
        acc1 = TestsAccounts.getAccount(1); // Second account
        acc2 = TestsAccounts.getAccount(2); // Third account
        
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

    function checkSuccess() public {
        // Use 'Assert' methods: https://remix-ide.readthedocs.io/en/latest/assert_library.html
        Assert.ok(2 == 2, 'should be true');
        Assert.greaterThan(uint(2), uint(1), "2 should be greater than 1");
        Assert.lesserThan(uint(2), uint(3), "2 should be lesser than 3");
    }

    function checkSuccess2() public pure returns (bool) {
        // Use the return value (true or false) to test the contract
        return true;
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
