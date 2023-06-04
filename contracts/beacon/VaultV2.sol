// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

contract VaultV2 is Initializable {

    string public name;
    uint256 public value;
    
    error Down(string reason);

    function initialize(uint256 _value) public initializer {
        name = 'V2';
        value = _value;
    }

    function down() public {
        if (value == 0) revert Down("!value");
        value--;
    }

    function up() public {
        value++;
    }

}