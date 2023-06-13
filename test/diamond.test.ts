import { expect } from "chai";
import { ethers } from "hardhat";

import { Diamond, FacetOne, FacetTwo, FacetThree } from "../typechain-types";


describe("Diamond pattern", () => {

    let diamond:Diamond

    let facetOne:FacetOne
    let facetTwo:FacetTwo
    let facetThree:FacetThree

    it('Should deploy diamond and facets one and two', async () => {
        const diamondFactory = await ethers.getContractFactory('Diamond')
        diamond = await expect(diamondFactory.deploy()).to.eventually.be.fulfilled;

        

        const facetOneFactory = await ethers.getContractFactory('FacetOne')
        facetOne = await expect(facetOneFactory.deploy()).to.eventually.be.fulfilled;


        const facetTwoFactory = await ethers.getContractFactory('FacetTwo')
        facetTwo = await expect(facetTwoFactory.deploy()).to.eventually.be.fulfilled;
    })

    it('Should add facets', async () => {
        const facetCuts = [
            {
                facetAddress: facetOne.address,
                action: 0,
                functionSelectors: [
                    facetOne.interface.getSighash('setValues')
                ]
            },
            {
                facetAddress: facetTwo.address,
                action: 0,
                functionSelectors: [
                    facetTwo.interface.getSighash('multiply')
                ]
            }
        ]

        await expect(diamond.diamondCut(facetCuts, '0x0000000000000000000000000000000000000000', '0x00')).to.emit(diamond, 'DiamondCut')

        await ethers.provider.send('eth_sendTransaction', [
            {
                to: diamond.address,
                data: facetOne.interface.encodeFunctionData('setValues', [ 5, 6 ])
            }
        ])

        const result = await ethers.provider.send('eth_call', [
            {
                to: diamond.address,
                data: facetTwo.interface.encodeFunctionData('multiply')
            }
        ])

        expect(ethers.BigNumber.from(result)).to.eq(30)
    })

    it('Should replace facet two', async () => {
        const facetThreeFactory = await ethers.getContractFactory('FacetThree')
        facetThree = await expect(facetThreeFactory.deploy()).to.eventually.be.fulfilled;
        const facetCuts = [
            {
                facetAddress: facetThree.address,
                action: 1,
                functionSelectors: [
                    facetTwo.interface.getSighash('multiply')
                ]
            }
        ]

        await expect(diamond.diamondCut(facetCuts, '0x0000000000000000000000000000000000000000', '0x00')).to.not.be.rejected

        await ethers.provider.send('eth_sendTransaction', [
            {
                to: diamond.address,
                data: facetOne.interface.encodeFunctionData('setValues', [ 7, 8 ])
            }
        ])

        const result = await ethers.provider.send('eth_call', [
            {
                to: diamond.address,
                data: facetTwo.interface.encodeFunctionData('multiply')
            }
        ])

        expect(ethers.BigNumber.from(result)).to.eq(112);
    })

    it('Should remove facet three', async () => {
        const facetCuts = [
            {
                facetAddress: facetThree.address,
                action: 2,
                functionSelectors: [
                    facetThree.interface.getSighash('multiply')
                ]
            }
        ]

        await expect(diamond.diamondCut(facetCuts, '0x0000000000000000000000000000000000000000', '0x00')).to.not.be.rejected

        await expect(ethers.provider.send('eth_call', [
            {
                to: diamond.address,
                data: facetThree.interface.encodeFunctionData('multiply')
            }
        ])).to.be.rejected
    })
})