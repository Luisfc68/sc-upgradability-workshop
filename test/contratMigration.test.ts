import { expect } from "chai";
import { ethers } from "hardhat";
import { Contract } from "ethers";

type Balance = { key:string, value:number }
type BalanceEvent = Balance & { update: boolean, timestamp:number }
type State = { firstValue: number, secondValue:number, thirdValue:number, balances:Balance[] }

async function deploy(contractName:string, ...args:unknown[]) {
  const contractFactory = await ethers.getContractFactory(contractName)
  
  const contract = await contractFactory.deploy(...args)
  const owner = contractFactory.signer

  return { contract, owner }
}

describe("Contract migration", function () {
  let contract:Contract;
  let state:State;

  before(async () => {
    const deployed = await deploy("OriginalContract", 1, 2, 3)
    contract = deployed.contract
  })

  it("Should deploy original contract", async () => {
    expect(await contract.sum()).to.eq(6)
  })

  it("Should generate history for the original contract", async () => {
    await contract.setFirstValue(4)
    await contract.setSecondValue(5)
    await contract.setThirdValue(6)

    await contract.setBalance("a", 100)
    await contract.setBalance("b", 200)
    await contract.setBalance("c", 300)
    await contract.setBalance("a", 400)
    await contract.deleteBalance("b")

    expect(await contract.getBalance("a")).to.eq(400)
    expect(await contract.getBalance("b")).to.eq(0)
    expect(await contract.getBalance("c")).to.eq(300)
  })

  it("Should recover data", async () => {
    // reading values
    await contract.pause()

    const firstValueEventFilter = contract.filters.FirstValueUpdate()
    const events = await contract.queryFilter(firstValueEventFilter)
    const firstValue:number = events.at(-1)?.args?.to
    const secondValue:number = await contract.secondValue()
    const thirdValueHex = await ethers.provider.getStorageAt(contract.address, 3)
    const thirdValue = ethers.BigNumber.from(thirdValueHex)

    const setBalanceFitler = contract.filters.BalanceUpdate()
    const setBalanceEvents = await contract.queryFilter(setBalanceFitler)
    const deleteBalanceFilter = contract.filters.BalanceRemove()
    const deleteBalanceEvents = await contract.queryFilter(deleteBalanceFilter)

    const updateEvents = setBalanceEvents.map(e => { return { ...e, update: true } })
    const deleteEvents = deleteBalanceEvents.map(e => { return { ...e, update: false } })

    await contract.unpause()

    // get the latest version of every key
    const balances:Balance[] = updateEvents.concat(deleteEvents)
    .map(event => {
      return {
        key: event.args?.key,
        value: event.args?.value,
        timestamp: event.args?.timestamp,
        update: event.update
      }
    })
    .sort((eventOne, eventTwo) => eventOne.timestamp - eventTwo.timestamp)
    .reduce((events:BalanceEvent[], event) => {
      const eventIndex = events.findIndex((e:BalanceEvent) => e.key === event.key)
      if (eventIndex !== -1 && !event.update) {
        events.splice(eventIndex, 1)
      } else if (eventIndex !== -1) {
        events[eventIndex] = event
      } else {
        events.push(event)
      }
      return events
    }, [])
    .map((event:any) => {
      return {
        key: event.key,
        value: event.value.toNumber(),
      }
    })

    state = { firstValue, secondValue, thirdValue: thirdValue.toNumber(), balances }
    // verifying values
    expect(firstValue).to.eq(4)
    expect(secondValue).to.eq(5)
    expect(thirdValue).to.eq(6)

    expect(balances.length).to.eq(2)
    expect(balances.some((b:Balance) => b.key === "a" && b.value === 400)).to.be.true
    expect(balances.some((b:Balance) => b.key === "c" && b.value === 300)).to.be.true
  })

  it("Should restore data in new contract", async () => {
    const deployed = await deploy("NewContract", 20, state.firstValue, state.secondValue, state.thirdValue)
    const newContract = deployed.contract

    state.balances.forEach(async (balance:Balance) => await newContract.setBalance(balance.key, balance.value));

    expect(await newContract.multiply()).to.eq(2400) // 20 * 4 * 5 * 6
    expect(await newContract.sum()).to.eq(35) // 20 + 4 + 5 + 6
    expect(await newContract.getBalance("a")).to.eq(400)
    expect(await newContract.getBalance("b")).to.eq(0)
    expect(await newContract.getBalance("c")).to.eq(300)

    console.warn(`Now you should inform users to stop using ${contract.address} and use ${newContract.address}`)
  })
})
