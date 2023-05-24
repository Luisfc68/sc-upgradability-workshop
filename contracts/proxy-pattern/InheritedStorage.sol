// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/access/Ownable.sol";

abstract contract InheritedStorage is Ownable {
    address internal implementation;
}