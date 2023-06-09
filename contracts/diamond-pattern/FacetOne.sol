// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "./Storage.sol";

contract FacetOne {

    event ValuesChange(uint value1, uint value2);

    function setValues(uint value1, uint value2) public {
        DiamondStorage.Storage storage s = DiamondStorage.getStorage();
        s.value1 = value1;
        s.value2 = value2;
        emit ValuesChange(value1, value2);
    }

}