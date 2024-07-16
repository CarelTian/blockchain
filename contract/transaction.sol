/// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.3;

/// @title Contract to Transaction verification
/// @author Yuantian Lou

contract Transaction{
    address public manager;
    address public IPcore;
    mapping (uint =>bool) public tradable;   //id ->  if status on sale
    mapping (uint =>uint) public prices;   // id ->  price(ETH) 
    constructor (){
        manager=msg.sender;
    }
    function setIPcore(address addr) public restricted {
        IPcore=addr;
    }

    function enableTrade(uint id,uint price) public IPcoreCall returns(bool) {
        tradable[id]=true;
        prices[id]=price;
        return true;
    }
    function disableTrade(uint id) public IPcoreCall returns(bool){
        tradable[id]=false;
        prices[id]=0;
        return true;
    }
    
    function transferVerify(uint id, uint price) public IPcoreCall returns(bool) {
        if(tradable[id] && prices[id]<=price){
            tradable[id]=false;
            return true;
        }
        return false;
    }

    modifier restricted() {
        require (msg.sender == manager, "Only manager can call");
        _;
    }
    modifier IPcoreCall() {
        require (msg.sender == IPcore, "Only IP contract can call");
        _;
    }
}