// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract OriginalContract is Pausable, Ownable {

    uint private firstValue;
    uint public secondValue;
    uint private thirdValue;
    mapping(string => uint) private balances;

    event FirstValueUpdate(uint from, uint to);
    event BalanceUpdate(string key, uint value, uint256 timestamp);
    event BalanceRemove(string key, uint value, uint256 timestamp);

    constructor(uint _firstValue, uint _secondValue, uint _thirdValue) {
        firstValue = _firstValue;
        secondValue = _secondValue;
        thirdValue = _thirdValue;
    }

    function pause() external onlyOwner {
        _pause();
    }
    
    function unpause() external onlyOwner {
        _unpause();
    }

    function setFirstValue(uint _value) external whenNotPaused{
        uint oldValue = firstValue;
        firstValue = _value;
        emit FirstValueUpdate(oldValue, _value);
    }

    function setSecondValue(uint _value) external whenNotPaused {
        secondValue = _value;
    }

    function setThirdValue(uint _value) external whenNotPaused {
        thirdValue = _value;
    }

    function sum() external view returns (uint) {
        return firstValue + secondValue + thirdValue;
    }

    function setBalance(string memory key, uint value) external whenNotPaused {
        balances[key] = value;
        emit BalanceUpdate(key, value, block.timestamp);
    }

    function getBalance(string memory key) external view returns (uint){
        return balances[key];
    }

    function deleteBalance(string memory key) external whenNotPaused {
        uint value = balances[key];
        delete balances[key];
        emit BalanceRemove(key, value, block.timestamp);
    }

}