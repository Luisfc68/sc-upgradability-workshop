// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

library DiamondStorage {
    bytes32 constant POSITION = keccak256("diamond.values.position");

    struct Storage {
        uint value1;
        uint value2;
    }

    function getStorage() internal pure returns (Storage storage storageStruct) {
        bytes32 position = POSITION;
        assembly {
            storageStruct.slot := position
        }
    }
}