// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.8.0 <0.9.0;

import "remix_tests.sol";
import "remix_accounts.sol";
import "../contracts/transaction.sol"; // 导入 Transaction 合约

contract transactionTest is Transaction {

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

    /// Test setting IP core
    function setIPcoreTest() public {
        setIPcore(acc1);
        Assert.equal(IPcore, acc1, "IPcore should be acc1");
    }

    function checkSuccess() public {
        Assert.ok(2 == 2, 'should be true');
        Assert.greaterThan(uint(2), uint(1), "2 should be greater than 1");
        Assert.lesserThan(uint(2), uint(3), "2 should be lesser than 3");
    }

    function checkSuccess2() public pure returns (bool) {
        return true;
    }

    function checkFailure() public {
        Assert.notEqual(uint(1), uint(1), "1 should not be equal to 1");
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
