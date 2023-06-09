// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "./Storage.sol";

contract FacetTwo {

    function multiply() public view returns (uint) {
        DiamondStorage.Storage storage s = DiamondStorage.getStorage();
        return s.value1 * s.value2;
    }

}