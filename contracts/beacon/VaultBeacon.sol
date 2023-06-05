// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/proxy/beacon/UpgradeableBeacon.sol";

contract VaultBeacon {
    UpgradeableBeacon immutable beacon;

    constructor(address _implementationAddress) {
        beacon = new UpgradeableBeacon(_implementationAddress);
    }

    function update(address _implementationAddress) public {
        beacon.upgradeTo(_implementationAddress);
    }

    function implementation() public view returns (address) {
        return beacon.implementation();
    }
}
