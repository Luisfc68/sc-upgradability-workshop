// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.18;
import "@openzeppelin/contracts/access/Ownable.sol";
import "./Storage.sol";

contract Logic is Ownable {

    Storage stor;

    constructor(Storage _stor){
        stor = _stor;
    }

    function transferStorageOwnership(address newOwner) public virtual onlyOwner {
        stor.transferOwnership(newOwner);
    }

    function setStorage(Storage _stor) external onlyOwner {
        stor = _stor;
    }

    function setValue(uint256 _value) external onlyOwner {
        stor.setValue(_value);
    }

    function getValue() external view returns (uint256){
        return stor.getValue();
    }

}