// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NewContract is Pausable, Ownable {
    uint public zeroValue;
    uint private firstValue;
    uint public secondValue;
    uint private thirdValue;
    mapping(string => uint) private balances;

    event FirstValueUpdate(uint from, uint to);
    event BalanceUpdate(string key, uint value, uint256 timestamp);
    event BalanceRemove(string key, uint value, uint256 timestamp);

    constructor(uint _zeroValue, uint _firstValue, uint _secondValue, uint _thirdValue) {
        zeroValue = _zeroValue;
        firstValue = _firstValue;
        secondValue = _secondValue;
        thirdValue = _thirdValue;
    }

    function pause() external onlyOwner {
        _pause();
    }

    function setFirstValue(uint _value) external {
        uint oldValue = firstValue;
        firstValue = _value;
        emit FirstValueUpdate(oldValue, _value);
    }

    function setSecondValue(uint _value) external {
        secondValue = _value;
    }

    function setThirdValue(uint _value) external {
        thirdValue = _value;
    }

    function sum() external view returns (uint) {
        return zeroValue + firstValue + secondValue + thirdValue;
    }

    function multiply() external view returns (uint) {
        return zeroValue * firstValue * secondValue * thirdValue;
    }

    function setBalance(string memory key, uint value) external {
        balances[key] = value;
        emit BalanceUpdate(key, value, block.timestamp);
    }

    function getBalance(string memory key) external view returns (uint){
        return balances[key];
    }

    function deleteBalance(string memory key) external {
        uint value = balances[key];
        delete balances[key];
        emit BalanceRemove(key, value, block.timestamp);
    }

}