// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.18;

import { VaultF } from "./VaultF.sol";

contract VaultF2 is VaultF {
    function f() external pure virtual override returns (string memory) {
        return "f1 v2 executed";
    }
}