// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "./InheritedStorage.sol";

contract LogicContractTwo is InheritedStorage {

    uint private firstValue;
    uint private secondValue;

    function initialize(uint _firstValue, uint _secondValue) external {
        firstValue = _firstValue;
        secondValue = _secondValue;
    }

    function doubleValue(uint value) external pure returns (uint) {
        return value * 2;
    }

    function sumValues() external view returns (uint) {
        return firstValue + secondValue;
    }

}