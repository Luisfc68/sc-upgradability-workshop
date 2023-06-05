import { ethers } from 'hardhat';
import { Contract } from 'ethers';
import { expect } from "chai";

describe('Data separation pattern', function () {
    
    let storage: Contract;
    let logic: Contract;

    beforeEach(async function() {
        const storageFactory = await ethers.getContractFactory('Storage');
        storage = await storageFactory.deploy();

        const logicFactory = await ethers.getContractFactory('Logic');
        logic = await logicFactory.deploy(storage.address);

        await storage.transferOwnership(logic.address);
    });

    it('should fail if storage not called by logic contract', async function(){
        await expect(storage.setValue(5)).to.be.rejectedWith('caller is not the owner');
    });

    it('should set value', async function(){
        const expectedValue = 10;
        await logic.setValue(expectedValue);

        await expect(storage.getValue()).to.be.eventually.equal(expectedValue);
    });

    it('should get value', async function(){
        const expectedValue = 10;
        await logic.setValue(expectedValue);

        await expect(logic.getValue()).to.be.eventually.equal(expectedValue);
    });

    it('should transfer ownership from storage', async function(){
        const logicFactory = await ethers.getContractFactory('Logic');
        const logic2 = await logicFactory.deploy(storage.address);

        await expect(storage.owner()).to.be.eventually.equal(logic.address);

        await logic.transferStorageOwnership(logic2.address);

        await expect(storage.owner()).to.be.eventually.equal(logic2.address);
    });

});