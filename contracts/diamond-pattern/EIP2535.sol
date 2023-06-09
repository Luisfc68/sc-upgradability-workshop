// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

interface IDiamond {
    enum FacetCutAction { Add, Replace, Remove } // 0, 1, 2
    struct FacetCut {
        address facetAddress;
        FacetCutAction action;
        bytes4[] functionSelectors;
    }
    event DiamondCut(FacetCut[] _diamondCut, address _init, bytes _calldata);
}

interface IDiamondCut is IDiamond {
    function diamondCut(
        FacetCut[] calldata _diamondCut,
        address _init,
        bytes calldata _calldata
    ) external;
}