![Banner: Banana Supply Chain](https://firebasestorage.googleapis.com/v0/b/myself-dg.appspot.com/o/nanodegree%2Fblockchain%2Fbanana-supply-chain%2Fbsc_banner.png?alt=media&token=a44f4a08-4f55-4e8c-a5b3-9e1130247f9b)

## This is supply chain for Banana

I chose banana for the development of the supply chain with Solidity on the Ethereum network, as I am Brazilian and this fruit belongs to the tropical zone, in addition to personally I like banana.

## UML Diagram

UML is a way of visualizing a software program using a collection of diagrams. Below are the diagrams of this dapp:

### Activity Diagram

![Activity Diagram: Banana Supply Chain](https://firebasestorage.googleapis.com/v0/b/myself-dg.appspot.com/o/nanodegree%2Fblockchain%2Fbanana-supply-chain%2Factivity_diagram.png?alt=media&token=968e4837-d3f2-46c5-9f76-76a56c608550)

### Sequencial Diagram

![Sequencial Diagram: Banana Supply Chain](https://firebasestorage.googleapis.com/v0/b/myself-dg.appspot.com/o/nanodegree%2Fblockchain%2Fbanana-supply-chain%2Fsequencial_diagram.png?alt=media&token=0b44dd81-5f82-475c-8c1c-c236f623e802)

### State Diagram

![State Diagram:Banana Supply Chain](https://firebasestorage.googleapis.com/v0/b/myself-dg.appspot.com/o/nanodegree%2Fblockchain%2Fbanana-supply-chain%2Fstate_diagram.png?alt=media&token=b7ab65e6-c3a9-4900-b58e-479be6b12d26)

### Class Diagram

![Class Diagram: Banana Supply Chain](https://firebasestorage.googleapis.com/v0/b/myself-dg.appspot.com/o/nanodegree%2Fblockchain%2Fbanana-supply-chain%2Fclass_diagram.png?alt=media&token=f850d450-a78e-4a95-b253-1be1408edbed)

## Libraries Write-up

Below are the dependencies in my `packages.json` file:

```json
{
    "devDependencies": {
        "lite-server": "2.4.0"
    },
    "dependencies": {
        "truffle-assertions": "^0.9.2",
        "truffle-hdwallet-provider": "^1.0.17",
        "web3": "^1.6.1"
    }
}
```

## IPFS Write-up

I did not use IPFS for this project.

## Development environment (versions)

```bash
$ truffle version

Truffle v5.4.28 (core: 5.4.28)
Solidity - ^0.6.0 (solc-js)
Node v14.18.1
Web3.js v1.5.3
```

___

## Test suite

The dapp application passed all tests. To perform the test, the following command was used: `truffle test`

```bash
ganache-cli accounts used here...
Contract Owner: accounts[0]  0x627306090abaB3A6e1400e9345bC60c78a8BEf57
Farmer: accounts[1]  0xf17f52151EbEF6C7334FAD080c5704D77216b732
Distributor: accounts[2]  0xC5fdf4076b8F3A5357c5E395ab970B5B54098Fef
Retailer: accounts[3]  0x821aEa9a577a9b44299B9c15c88cf3087F3b5544
Consumer: accounts[4]  0x0d1d4e623D10F9FBA5Db95830F7d3839406C6AF2


  Contract: BananaSupplyChain
    ✓ Create a farmer, distributor, retailer and consumer for testing (722ms)
    ✓ Testing smart contract function harvestBanana() that allows a farmer to harvest banana (448ms)
    ✓ Testing smart contract function processBanana() that allows a farmer to process banana (271ms)
    ✓ Testing smart contract function boxBanana() that allows a farmer to box banana (241ms)
    ✓ Testing smart contract function sellBananaBox() that allows a farmer to sell banana box (243ms)
    ✓ Testing smart contract function buyBananaBox() that allows a distributor to buy banana box (157ms)
    ✓ Testing smart contract function shipBananaBox() that allows a distributor to ship banana box (126ms)
    ✓ Testing smart contract function receiveBananaBox() that allows a retailer to receive banana box (140ms)
    ✓ Testing smart contract function unboxBanana() that allows a retailer to unbox banana (128ms)
    ✓ Testing smart contract function sellBanana() that allows a retailer to sell banana (133ms)
    ✓ Testing smart contract function purchaseBanana() that allows a customer to purchase banana (143ms)
    ✓ Testing smart contract function fetchItemBufferOne() that allows anyone to fetch item details from blockchain (43ms)
    ✓ Testing smart contract function fetchItemBufferTwo() that allows anyone to fetch item details from blockchain (41ms)


  13 passing (3s)
```

___

## Banana Supply Chain on the Rinkeby network

- Transaction hash:    [**0x**a7d4ed1d1db2ab3440f09a1343c8faf24eeb79f4bf2e57c0369bdebaf9e41508](https://rinkeby.etherscan.io/tx/0xa7d4ed1d1db2ab3440f09a1343c8faf24eeb79f4bf2e57c0369bdebaf9e41508)
- Contract address: [**0x**BcebE9e9e857E86bD264637827B186bD0fa2D678](https://rinkeby.etherscan.io/address/0xBcebE9e9e857E86bD264637827B186bD0fa2D678)

___

## Fron-end: Banana Terminal Daap 

<video width="100%" src="https://firebasestorage.googleapis.com/v0/b/myself-dg.appspot.com/o/nanodegree%2Fblockchain%2Fbanana-supply-chain%2Fbsc.mp4?alt=media&token=162d74e1-fa30-4720-8c31-5400b59d470a"/>