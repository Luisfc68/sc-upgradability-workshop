// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "./InheritedStorage.sol";

contract LogicContractOne is InheritedStorage {

    uint private value;

    function initialize(uint _value) external {
        value = _value;
    }

    function doubleValue() external view returns (uint) {
        return value * 2;
    }

}