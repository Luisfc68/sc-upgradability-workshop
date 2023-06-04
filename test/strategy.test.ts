import { ethers } from 'hardhat';
import { Contract } from 'ethers';
import { expect } from "chai";

describe('Strategy pattern', function () {

    let vaultStrategy: Contract;
    let vaultF1: Contract;


    beforeEach(async function () {
        const vaultFactory = await ethers.getContractFactory('VaultStrategy');
        vaultStrategy = await vaultFactory.deploy();

        const vaultF1Factory = await ethers.getContractFactory('VaultF1');
        vaultF1 = await vaultF1Factory.deploy();
    });

    it('should deploy strategy', async function () {
        const [owner] = await ethers.getSigners();

        await expect(vaultStrategy.owner()).to.be.eventually.equal(owner.address);
    });

    it('should fail is not owner', async function () {
        const [, notOwner] = await ethers.getSigners();

        await expect(vaultStrategy
            .connect(notOwner)
            .updateF1(vaultF1.address)
        ).to.be.rejectedWith('caller is not the owner');
    });

    it('should fail if functionality is not implemented', async function () {

        await expect(vaultStrategy.execute()
        ).to.be.rejectedWith('f1 not implemented');
    });

    it('should execute f1.v1', async function () {
        await vaultStrategy.updateF1(vaultF1.address);

        await expect(vaultStrategy.execute()).to.be.eventually.equal('f1 v1 executed');
    });

    it('should execute f1.v2', async function () {
        const vaultF2Factory = await ethers.getContractFactory('VaultF2');
        const vaultF2 = await vaultF2Factory.deploy();
        await vaultStrategy.updateF1(vaultF2.address);

        await expect(vaultStrategy.execute()).to.be.eventually.equal('f1 v2 executed');
    });

    it('should execute f1.v2 after upgrade', async function () {
        await vaultStrategy.updateF1(vaultF1.address);

        await expect(vaultStrategy.execute()).to.be.eventually.equal('f1 v1 executed');

        const vaultF2Factory = await ethers.getContractFactory('VaultF2');
        const vaultF2 = await vaultF2Factory.deploy();
        await vaultStrategy.updateF1(vaultF2.address);

        await expect(vaultStrategy.execute()).to.be.eventually.equal('f1 v2 executed');
    });

});