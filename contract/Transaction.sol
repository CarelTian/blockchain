/// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.3;

/// @title Contract to Transaction verification
/// @author Reynor Lou
/// contract address
// v1.0.0  0xbadba6877e35ce8f4282b5ba69cb950a9024faa2
// v1.0.1  0x449817dc1cb982f5d776f2f6f8b528452e85d3fd
/// v1.0.2  0xd01adb4ee7eb154731400a7ec47c9e86e164e89b
contract Transaction{
    address public manager;
    address public IPcore;
    mapping (uint =>bool) public tradable;   //id ->  if status on sale
    mapping (uint =>bool) public leaseable; //id-> if status enable lease
    mapping (uint =>uint) public tradePrices;   // id ->  price(Gwei) 
    mapping (uint =>uint) public leasePrices;   // id ->  price(Gwei) 
    constructor (){
        manager=msg.sender;
    }
    function setIPcore(address addr) public restricted {
        IPcore=addr;
    }

    function enableTrade(uint id,uint price) public IPcoreCall returns(bool) {
        require(!leaseable[id],"this ip is on lease");
        tradable[id]=true;
        tradePrices[id]=price;
        return true;
    }

    function disableTrade(uint id) public IPcoreCall returns(bool){
        tradable[id]=false;
        tradePrices[id]=0;
        return true;
    }

     function enableLease(uint id,uint price) public IPcoreCall returns(bool) {
        require(!tradable[id],"this ip is on trade");
        leaseable[id]=true;
        leasePrices[id]=price;
        return true;
    }
    
    function disableLease(uint id) public IPcoreCall returns(bool){
        leaseable[id]=false;
        leasePrices[id]=0;
        return true;
    }
    
    function transferVerify(uint id, uint price) public IPcoreCall returns(bool) {
        if(tradable[id] && tradePrices[id]<=price){
            tradable[id]=false;
            return true;
        }
        return false;
    }

    function leaseVerify(uint id, uint price) public IPcoreCall returns(bool) {
        if(leaseable[id] && leasePrices[id]<=price){
            leaseable[id]=false;
            return true;
        }
        return false;
    }

    modifier restricted() {
        require (msg.sender == manager, "Only manager can call");
        _;
    }

    //IPcore合约的地址
    modifier IPcoreCall() {
        require (msg.sender == IPcore, "Only IP contract can call");
        _;
    }
}