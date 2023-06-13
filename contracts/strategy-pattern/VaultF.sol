// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.18;

abstract contract VaultF {

    function f()
        external
        pure
        virtual
        returns (string memory);
}
