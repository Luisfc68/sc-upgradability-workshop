import { ethers } from 'hardhat';
import { Contract } from 'ethers';
import { expect } from "chai";
describe('Beacon pattern', function () {

    let vaultV1: Contract;

    beforeEach(async function() {
        const vaultFactory = await ethers.getContractFactory('VaultV1');
        vaultV1 = await vaultFactory.deploy();

        await vaultV1.initialize(10);
    });

    it('should deploy beacon with implementation', async function () {
        const beaconFactory = await ethers.getContractFactory('VaultBeacon');
        const beacon = await beaconFactory.deploy(vaultV1.address);
        const implementationAddress = await beacon.implementation();
        
        expect(vaultV1.address).to.be.equal(implementationAddress);
        await expect(vaultV1.name()).to.be.eventually.contain('V1');
    });

    it('should upgrade implementation to V2', async function(){
        const beaconFactory = await ethers.getContractFactory('VaultBeacon');
        const beacon = await beaconFactory.deploy(vaultV1.address);
        let implementationAddress = await beacon.implementation();
        
        expect(vaultV1.address).to.be.equal(implementationAddress);
        await expect(vaultV1.name()).to.be.eventually.contain('V1');

        const vaultFactory = await ethers.getContractFactory('VaultV2');
        const vaultV2 = await vaultFactory.deploy();
        await vaultV2.initialize(10);
        await beacon.update(vaultV2.address);
        implementationAddress = await beacon.implementation();

        expect(vaultV2.address).to.be.equal(implementationAddress);
        await expect(vaultV2.name()).to.be.eventually.contain('V2');

    });
    

});