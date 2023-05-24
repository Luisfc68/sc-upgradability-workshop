// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "./InheritedStorage.sol";

contract ProxyContract is InheritedStorage {

    constructor(address _implementation) {
        implementation = _implementation;
    }

    function changeImplementation(address _implementation) external onlyOwner {
        implementation = _implementation;
    }

    receive() external payable {}

    fallback() external payable {
        assembly {
            let contractLogic := sload(implementation.slot)
            let callDataSize := calldatasize()
            calldatacopy(0x0, 0x0, callDataSize)
            let success := delegatecall(gas(), contractLogic, 0x0, callDataSize, 0, 0)
            let resultSize := returndatasize()
            returndatacopy(0, 0, resultSize)
            switch success
            case 0 {
                revert(0, resultSize)
            } default {
                return(0, resultSize)
            }
        }
    }
}