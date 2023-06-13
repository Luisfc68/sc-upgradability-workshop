// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./EIP2535.sol";

contract Diamond is Ownable, IDiamondCut {

    mapping (bytes4 => address) private facets;
    bytes4[] private selectors;
    uint private selectorCount;

    receive() external payable {}

    fallback() external payable {
        address facet = facets[msg.sig];
        require(facet != address(0), "unimplemented");
        assembly {
            let callDataSize := calldatasize()
            calldatacopy(0x0, 0x0, callDataSize)
            let success := delegatecall(gas(), facet, 0x0, callDataSize, 0, 0)
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

    function diamondCut(
        FacetCut[] calldata _diamondCut,
        address _init,
        bytes calldata _calldata
    ) external {
        require(_init != address(this), "diamond cut initialization address can't be diamond address");
        for (uint i = 0; i < _diamondCut.length; i++) {
            updateFacet(_diamondCut[i]);
        }
        if (_init != address(0)) {
            (bool success, ) = _init.delegatecall(_calldata);
            require(success, "error during diamond cut initialization");
        }
        emit DiamondCut(_diamondCut, _init, _calldata);
    }

    function updateFacet(FacetCut calldata facetCut) private {
        if (facetCut.action == FacetCutAction.Add) {
            addFacetCut(facetCut);
        } else if (facetCut.action == FacetCutAction.Replace) {
            replaceFacetCut(facetCut);
        } else if (facetCut.action == FacetCutAction.Remove) {
            removeFacetCut(facetCut);
        } else {
            revert("invalid action");
        }
    }

    function addFacetCut(FacetCut calldata facetCut) private {
        bytes4 selector;
        for (uint i; i < facetCut.functionSelectors.length; i++) {
            selector = facetCut.functionSelectors[i];
            require(facets[selector] == address(0), "Trying to add existing function");
            facets[selector] = facetCut.facetAddress;
        }
    }

    function replaceFacetCut(FacetCut calldata facetCut) private  {
        bytes4 selector;
        for (uint i = 0; i < facetCut.functionSelectors.length; i++) {
            selector = facetCut.functionSelectors[i];
            require(facets[selector] != address(0), "Trying to replace non existing function");
            facets[selector] = facetCut.facetAddress;
        }
    }

    function removeFacetCut(FacetCut calldata facetCut) private {
        bytes4 selector;
        for (uint i = 0; i < facetCut.functionSelectors.length; i++) {
            selector = facetCut.functionSelectors[i];
            require(facets[selector] != address(0), "Trying to delete non existing function");
            delete facets[selector];
        }
    }
}