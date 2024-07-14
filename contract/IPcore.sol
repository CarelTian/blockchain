/// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.3;

/// @title Contract to agree on the lunch venue
/// @author Dilum Bandara, CSIRO's Data61


contract IPcore{

    struct Property{
        uint id;
        string category;
        string name;
        string description;
        address onwer;
        address lessee;
        bool status;
    }
    
    address public manager;                    
    uint public globalID=0;
    mapping (uint => Property) public IPs; 

    constructor () {
        manager = msg.sender;                   //Set contract creator as manager
    }

    function registerIP(string memory category,string memory name, string memory description,address onwer) public restricted returns(uint){
        uint id_=globalID;
        globalID++;
        Property memory ip=Property({
            id: id_,
            category:category,
            name: name,
            description:description,
            onwer:onwer,
            lessee:onwer,
            status: true
        });
        IPs[id_]=ip;
        return id_;
    }
    function getIP(uint id) view  public returns (Property memory) {
        return IPs[id];
    }
    function withdrawIP(uint id) public restricted returns(bool){
        if (id<0 || id >=globalID){
            revert("invalid id");
        }
        IPs[id].status=false;
        return true;
    }

    function restore(uint id) public restricted returns(bool){
        if (id<0 || id >=globalID){
            revert("invalid id");
        }
        Property memory ip=IPs[id];
        if(ip.status!=false){
            revert("unnecessary op");
        }
        IPs[id].status=true;
        return true;
    }


    modifier restricted() {
        require (msg.sender == manager, "Can only be executed by the manager");
        _;
    }
    
}