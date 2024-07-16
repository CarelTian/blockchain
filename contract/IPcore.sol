/// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.3;

/// @title Contract to IP management
/// @author Yuantian Lou

contract IPcore{

    struct Property{
        uint id;
        string category;
        string name;
        string description;
        address owner;
        address lessee;
        string md5;
        uint timestamp;
        uint8 status;      // 0-invalid  1-active 2-on sale

    }
    address public manager;   
    address public TxAddress;                 
    uint public globalID=0;
    mapping (uint => Property) public IPs;
    mapping (string => bool) public md5Exist; 
    event receiveETH(address sender,uint amount);
    event Received(address sender, uint amount);
    event FallbackCalled(address sender, uint amount);

    constructor  ()  {
        manager = msg.sender;                   //Set contract creator as manager
    }
    receive() external payable { 
    }
    function getBalance() public view returns (uint) {
        return address(this).balance;
    }

    function registerIP(string memory category,string memory name, string memory description,
    address owner,string memory md5,uint timestamp) restricted public returns(uint){
        require(!md5Exist[md5], "Duplicate md5 detected");
        uint id_=globalID;
        globalID++;
        Property memory ip=Property({
            id: id_,
            category:category,
            name: name,
            description:description,
            owner:owner,
            lessee:owner,
            md5:md5,
            timestamp:timestamp,
            status: 1
        });
        IPs[id_]=ip;
        md5Exist[md5]=true;
        return id_;
    }
    function getIP(uint id) view  public returns (Property memory) {
        return IPs[id];
    }
    function invalidateIP(uint id) public restricted returns(bool){
        if (id<0 || id >=globalID){
            revert("invalid id");
        }
        IPs[id].status=0;
        return true;
    }
    
    function setTransaction(address addr) public restricted { 
        TxAddress=addr;
    }

    function restore(uint id) public restricted returns(bool){
        if (id<0 || id >=globalID){
            revert("invalid id");
        }
        Property memory ip=IPs[id];
        if(ip.status!=0){
            revert("unnecessary op");
        }
        IPs[id].status=1;
        return true;
    }
    
    function sellIP(uint id,uint price) public {
        if (id<0 || id >=globalID){
            revert("invalid id");
        }
        require(msg.sender == IPs[id].owner);
        IPs[id].status=2;   //On sale status                        
        (bool success,bytes memory result)=TxAddress.call(abi.encodeWithSignature("enableTrade(uint256,uint256)",id,price));
        require(success,"Call failed");
        bool isvalid=abi.decode(result,(bool));
        require(isvalid,"invalid transaction");
    }
    function withdrawIP(uint id) public{
        if (id<0 || id >=globalID){
            revert("invalid id");
        }
        require(msg.sender==IPs[id].owner);
        IPs[id].status=1;    //active status
        (bool success,bytes memory result)=TxAddress.call(abi.encodeWithSignature("disableTrade(uint256)",id));
        require(success,"Call failed");
        bool isvalid=abi.decode(result,(bool));
        require(isvalid,"invalid transaction");

    }
    
    function transfer(uint id) external payable{
        uint price=msg.value;
        require(price!=0,"Transfer: Cannot send 0 ETH");

        emit receiveETH(msg.sender,msg.value);
        (bool success,bytes memory result)=TxAddress.call(abi.encodeWithSignature("transferVerify(uint256, uint256)",id,price));
        require(success,"Call failed");
        bool isvalid=abi.decode(result, (bool));
        require(isvalid,"invalid transaction");

        address formerOwner=IPs[id].owner;
        IPs[id].owner=msg.sender;
        payable(formerOwner).transfer(price);
    }
    
    modifier restricted() {
        require (msg.sender == manager, "Only manager can call");
        _;
    }
    
}