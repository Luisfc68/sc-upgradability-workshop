// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import { VaultF } from "./VaultF.sol";

contract VaultStrategy is Ownable {

    address public fImplementation;

    function updateF1(address _f) external onlyOwner {
        fImplementation = _f;
    }

    function execute() public view virtual returns (string memory){
        require(fImplementation != address(0), "f1 not implemented");
        VaultF vault = VaultF(fImplementation);
        return vault.f();
    }
  
    
}
