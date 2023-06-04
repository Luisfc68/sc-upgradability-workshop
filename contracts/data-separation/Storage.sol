// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.18;
import "@openzeppelin/contracts/access/Ownable.sol";

contract Storage is Ownable {

    uint256 internal value;

    function setValue(uint256 _value) external onlyOwner {
        value = _value;
    }

    function getValue() external view returns (uint256) {
        return value;
    }
    
}