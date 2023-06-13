import { expect } from "chai";
import { ethers } from "hardhat";
import { LogicContractOne, LogicContractOne__factory, LogicContractTwo, LogicContractTwo__factory, ProxyContract, ProxyContract__factory } from "../typechain-types";

describe("Proxy pattern", () => {
    let proxyContract:ProxyContract__factory
    let logicContractOne:LogicContractOne__factory
    let logicContractTwo:LogicContractTwo__factory

    let proxy:ProxyContract
    let logicOne:LogicContractOne
    let logicTwo:LogicContractTwo

    it('Should deploy first implementation and proxy', async () => {
        logicContractOne = await ethers.getContractFactory('LogicContractOne')
        proxyContract = await ethers.getContractFactory('ProxyContract')
        logicOne = await logicContractOne.deploy()
        proxy = await proxyContract.deploy(logicOne.address)

        await ethers.provider.send('eth_sendTransaction', [
            {
                to: proxy.address,
                data: logicOne.interface.encodeFunctionData('initialize', [ 5 ])
            }
        ])
        
        const valueHex = await ethers.provider.send('eth_call', [
            {
                to: proxy.address,
                data: logicOne.interface.encodeFunctionData('doubleValue')
            }
        ])

        expect(ethers.BigNumber.from(valueHex)).to.eq(10)
    })

    it('Should deploy second implementation and upgrade proxy', async () => {
        logicContractTwo = await ethers.getContractFactory('LogicContractTwo')
        logicTwo = await logicContractTwo.deploy()

        // --- here happens the upgrade ---
        
        await proxy.changeImplementation(logicTwo.address)

        // --------------------------------

        await ethers.provider.send('eth_sendTransaction', [
            {
                to: proxy.address,
                data: logicTwo.interface.encodeFunctionData('initialize', [ 3, 4 ])
            }
        ])
        
        const doubledValueHex = await ethers.provider.send('eth_call', [
            {
                to: proxy.address,
                data: logicTwo.interface.encodeFunctionData('doubleValue', [ 3 ])
            }
        ])

        const sumHex = await ethers.provider.send('eth_call', [
            {
                to: proxy.address,
                data: logicTwo.interface.encodeFunctionData('sumValues')
            }
        ])

        expect(ethers.BigNumber.from(doubledValueHex)).to.eq(6)
        expect(ethers.BigNumber.from(sumHex)).to.eq(7)
    })

    it('Should throw error on previos version function execution', async () => {
        expect(
            ethers.provider.send('eth_call', [
                {
                    to: proxy.address,
                    data: logicOne.interface.encodeFunctionData('doubleValue')
                }
            ])
        ).to.be.rejected
    })
})