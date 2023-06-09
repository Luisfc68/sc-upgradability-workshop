// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "./Storage.sol";

contract FacetThree {

    function multiply() public view returns (uint) {
        DiamondStorage.Storage storage s = DiamondStorage.getStorage();
        return s.value1 * s.value2 * 2;
    }

}