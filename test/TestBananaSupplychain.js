// This script is designed to test the solidity smart contract - SuppyChain.sol -- and the various functions within
// Declare a variable and assign the compiled smart contract artifact
var SupplyChain = artifacts.require('SupplyChain');
const truffleAssert = require('truffle-assertions');

contract('BananaSupplyChain', function(accounts) {
    // Declare few constants and assign a few sample accounts generated by ganache-cli
    let   sku = 1;
    let   upc = 1;
    const ownerId = accounts[0];

    const farmerId = accounts[1];
    const farmerName = "John Doe";
    const farmerInformation = "Yarray Valley";
    const farmerLatitude = "-38.239770";
    const farmerLongitude = "144.341490";

    const productId = sku + upc;
    const productNotes = "Best banana";
    const productPrice = web3.utils.toWei("1", "ether");
    const productFee = web3.utils.toWei("0.5", "ether");

    const distributorId = accounts[2];
    const retailerId = accounts[3];
    const consumerId = accounts[4];
    const anyoneId = accounts[9];

    console.log("ganache-cli accounts used here...");
    console.log("Contract Owner: accounts[0] ", accounts[0]);
    console.log("Farmer: accounts[1] ", accounts[1]);
    console.log("Distributor: accounts[2] ", accounts[2]);
    console.log("Retailer: accounts[3] ", accounts[3]);
    console.log("Consumer: accounts[4] ", accounts[4]);

    const State = {
        Harvested: 0,
        Processed: 1,
        Boxed: 2,
        BoxForSale: 3,
        Sold: 4,
        Shipped: 5,
        Received: 6,
        Unboxed: 7,
        ForSale: 8,
        Purchased: 9
    }

    let currentState = State.Harvested;
    let currentOwnerId = ownerId;
    let currentProductPrice = productPrice;

    it("Create a farmer, distributor, retailer and consumer for testing", async() => {
        const supplyChain = await SupplyChain.deployed();

        await supplyChain.addFarmer(farmerId);
        const farmerAdded = await supplyChain.isFarmer(farmerId);

        await supplyChain.addDistributor(distributorId);
        const distributorAdded = await supplyChain.isDistributor(distributorId);

        await supplyChain.addRetailer(retailerId);
        const retailerAdded = await supplyChain.isRetailer(retailerId);

        await supplyChain.addConsumer(consumerId);
        const consumerAdded = await supplyChain.isConsumer(consumerId);

        assert.equal(farmerAdded, true, 'Error: farmer not added');
        assert.equal(distributorAdded, true, 'Error: distributor not added');
        assert.equal(retailerAdded, true, 'Error: retailer not added');
        assert.equal(consumerAdded, true, 'Error: consumer not added');
    });

    it("Testing smart contract function harvestBanana() that allows a farmer to harvest banana", async() => {
        const supplyChain = await SupplyChain.deployed();

        // Mark an item as Harvested by calling function harvestItem()
        const event = await supplyChain.harvestBanana(
            upc,
            farmerId,
            farmerName,
            farmerInformation,
            farmerLatitude,
            farmerLongitude,
            // productId,
            productNotes
        );

        // Retrieve the just now saved item from blockchain by calling function fetchItem()
        const resultBufferOne = await supplyChain.fetchBananaBufferOne.call(upc);
        const resultBufferTwo = await supplyChain.fetchBananaBufferTwo.call(upc);

        // Verify the result set
        assert.equal(resultBufferOne[0], sku, 'Error: Invalid SKU');
        assert.equal(resultBufferOne[1], upc, 'Error: Invalid UPC');
        assert.equal(resultBufferOne[2], ownerId, 'Error: Missing or Invalid ownerId');
        assert.equal(resultBufferOne[3], farmerId, 'Error: Missing or Invalid farmerId');
        assert.equal(resultBufferOne[4], farmerName, 'Error: Missing or Invalid farmerName');
        assert.equal(resultBufferOne[5], farmerInformation, 'Error: Missing or Invalid farmerInformation');
        assert.equal(resultBufferOne[6], farmerLatitude, 'Error: Missing or Invalid farmerLatitude');
        assert.equal(resultBufferOne[7], farmerLongitude, 'Error: Missing or Invalid farmerLongitude');
        assert.equal(resultBufferTwo[5], State.Harvested, 'Error: Invalid State');
        truffleAssert.eventEmitted(event, 'Harvested');

        currentState = State.Harvested;
    });

    it("Testing smart contract function processBanana() that allows a farmer to process banana", async() => {
        const supplyChain = await SupplyChain.deployed();

        const event = await supplyChain.processBanana(upc, {from: farmerId});

        const resultBufferOne = await supplyChain.fetchBananaBufferOne.call(upc);
        const resultBufferTwo = await supplyChain.fetchBananaBufferTwo.call(upc);

        // Verify the result set
        assert.equal(resultBufferOne[0], sku, 'Error: Invalid item SKU');
        assert.equal(resultBufferOne[1], upc, 'Error: Invalid item UPC');
        assert.equal(resultBufferOne[2], ownerId, 'Error: Missing or Invalid ownerId');
        assert.equal(resultBufferOne[3], farmerId, 'Error: Missing or Invalid farmerId');
        assert.equal(resultBufferOne[4], farmerName, 'Error: Missing or Invalid farmerName');
        assert.equal(resultBufferOne[5], farmerInformation, 'Error: Missing or Invalid farmerInformation');
        assert.equal(resultBufferOne[6], farmerLatitude, 'Error: Missing or Invalid farmerLatitude');
        assert.equal(resultBufferOne[7], farmerLongitude, 'Error: Missing or Invalid farmerLongitude');
        assert.equal(resultBufferTwo[5], State.Processed, 'Error: Invalid State');
        truffleAssert.eventEmitted(event, 'Processed');

        currentState = State.Processed;
    });

    it("Testing smart contract function boxBanana() that allows a farmer to box banana", async() => {
        const supplyChain = await SupplyChain.deployed();
        
        const event = await supplyChain.boxBanana(upc, { from: farmerId });
        
        const resultBufferOne = await supplyChain.fetchBananaBufferOne.call(upc);
        const resultBufferTwo = await supplyChain.fetchBananaBufferTwo.call(upc);

        // Verify the result set
        assert.equal(resultBufferOne[0], sku, 'Error: Invalid item SKU');
        assert.equal(resultBufferOne[1], upc, 'Error: Invalid item UPC');
        assert.equal(resultBufferOne[2], ownerId, 'Error: Missing or Invalid ownerId');
        assert.equal(resultBufferOne[3], farmerId, 'Error: Missing or Invalid farmerId');
        assert.equal(resultBufferOne[4], farmerName, 'Error: Missing or Invalid farmerName');
        assert.equal(resultBufferOne[5], farmerInformation, 'Error: Missing or Invalid farmerInformation');
        assert.equal(resultBufferOne[6], farmerLatitude, 'Error: Missing or Invalid farmerLatitude');
        assert.equal(resultBufferOne[7], farmerLongitude, 'Error: Missing or Invalid farmerLongitude');
        assert.equal(resultBufferTwo[5], State.Boxed, 'Error: Invalid State');
        truffleAssert.eventEmitted(event, 'Boxed');

        currentState = State.Boxed;
    });

    it("Testing smart contract function sellBananaBox() that allows a farmer to sell banana box", async() => {
        const supplyChain = await SupplyChain.deployed();
        
        const event = await supplyChain.sellBananaBox(upc, productPrice, { from: farmerId });
        
        const resultBufferOne = await supplyChain.fetchBananaBufferOne.call(upc);
        const resultBufferTwo = await supplyChain.fetchBananaBufferTwo.call(upc);

        // Verify the result set
        assert.equal(resultBufferOne[0], sku, 'Error: Invalid item SKU');
        assert.equal(resultBufferOne[1], upc, 'Error: Invalid item UPC');
        assert.equal(resultBufferOne[2], ownerId, 'Error: Missing or Invalid ownerId');
        assert.equal(resultBufferOne[3], farmerId, 'Error: Missing or Invalid farmerId');
        assert.equal(resultBufferOne[4], farmerName, 'Error: Missing or Invalid farmerName');
        assert.equal(resultBufferOne[5], farmerInformation, 'Error: Missing or Invalid farmerInformation');
        assert.equal(resultBufferOne[6], farmerLatitude, 'Error: Missing or Invalid farmerLatitude');
        assert.equal(resultBufferOne[7], farmerLongitude, 'Error: Missing or Invalid farmerLongitude');
        assert.equal(resultBufferTwo[5], State.BoxForSale, 'Error: Invalid State');
        truffleAssert.eventEmitted(event, 'BoxForSale');

        currentState = State.BoxForSale;
    });

    it("Testing smart contract function buyBananaBox() that allows a distributor to buy banana box", async() => {
        const supplyChain = await SupplyChain.deployed();
        const event = await supplyChain.buyBananaBox(upc, { from: distributorId, value: productPrice });

        const resultBufferOne = await supplyChain.fetchBananaBufferOne.call(upc);
        const resultBufferTwo = await supplyChain.fetchBananaBufferTwo.call(upc);

        currentState = State.Sold;
        currentOwnerId = distributorId;

        // Verify the result set
        assert.equal(resultBufferOne[0], sku, 'Error: Invalid item SKU');
        assert.equal(resultBufferOne[1], upc, 'Error: Invalid item UPC');
        assert.equal(resultBufferOne[2], currentOwnerId, 'Error: Missing or Invalid ownerId');
        assert.equal(resultBufferOne[3], farmerId, 'Error: Missing or Invalid farmerId');
        assert.equal(resultBufferOne[4], farmerName, 'Error: Missing or Invalid farmerName');
        assert.equal(resultBufferOne[5], farmerInformation, 'Error: Missing or Invalid farmerInformation');
        assert.equal(resultBufferOne[6], farmerLatitude, 'Error: Missing or Invalid farmerLatitude');
        assert.equal(resultBufferOne[7], farmerLongitude, 'Error: Missing or Invalid farmerLongitude');
        assert.equal(resultBufferTwo[5], currentState, 'Error: Invalid State');
        truffleAssert.eventEmitted(event, 'Sold');
    });

    it("Testing smart contract function shipBananaBox() that allows a distributor to ship banana box", async() => {
        const supplyChain = await SupplyChain.deployed();
        
        const event = await supplyChain.shipBananaBox(upc, { from: distributorId });

        const resultBufferOne = await supplyChain.fetchBananaBufferOne.call(upc);
        const resultBufferTwo = await supplyChain.fetchBananaBufferTwo.call(upc);
        
        // Verify the result set
        assert.equal(resultBufferOne[0], sku, 'Error: Invalid item SKU');
        assert.equal(resultBufferOne[1], upc, 'Error: Invalid item UPC');
        assert.equal(resultBufferOne[2], distributorId, 'Error: Missing or Invalid ownerId');
        assert.equal(resultBufferOne[3], farmerId, 'Error: Missing or Invalid farmerId');
        assert.equal(resultBufferOne[4], farmerName, 'Error: Missing or Invalid farmerName');
        assert.equal(resultBufferOne[5], farmerInformation, 'Error: Missing or Invalid farmerInformation');
        assert.equal(resultBufferOne[6], farmerLatitude, 'Error: Missing or Invalid farmerLatitude');
        assert.equal(resultBufferOne[7], farmerLongitude, 'Error: Missing or Invalid farmerLongitude');
        assert.equal(resultBufferTwo[5], State.Shipped, 'Error: Invalid State');
        truffleAssert.eventEmitted(event, 'Shipped');

        currentState = State.Shipped;
    });

    it("Testing smart contract function receiveBananaBox() that allows a retailer to receive banana box", async() => {
        const supplyChain = await SupplyChain.deployed();
        
        const event = await supplyChain.receiveBananaBox(upc, { from: retailerId });

        const resultBufferOne = await supplyChain.fetchBananaBufferOne.call(upc);
        const resultBufferTwo = await supplyChain.fetchBananaBufferTwo.call(upc);

        currentState = State.Received;
        currentOwnerId = retailerId;

        // Verify the result set
        assert.equal(resultBufferOne[0], sku, 'Error: Invalid item SKU');
        assert.equal(resultBufferOne[1], upc, 'Error: Invalid item UPC');
        assert.equal(resultBufferOne[2], currentOwnerId, 'Error: Missing or Invalid ownerId');
        assert.equal(resultBufferOne[3], farmerId, 'Error: Missing or Invalid farmerId');
        assert.equal(resultBufferOne[4], farmerName, 'Error: Missing or Invalid farmerName');
        assert.equal(resultBufferOne[5], farmerInformation, 'Error: Missing or Invalid farmerInformation');
        assert.equal(resultBufferOne[6], farmerLatitude, 'Error: Missing or Invalid farmerLatitude');
        assert.equal(resultBufferOne[7], farmerLongitude, 'Error: Missing or Invalid farmerLongitude');
        assert.equal(resultBufferTwo[5], currentState, 'Error: Invalid State');
        truffleAssert.eventEmitted(event, 'Received');
    });

    it("Testing smart contract function unboxBanana() that allows a retailer to unbox banana", async() => {
        const supplyChain = await SupplyChain.deployed();
        
        const event = await supplyChain.unboxBanana(upc, { from: retailerId });
        
        const resultBufferOne = await supplyChain.fetchBananaBufferOne.call(upc);
        const resultBufferTwo = await supplyChain.fetchBananaBufferTwo.call(upc);

        currentState = State.Unboxed;
        
        // Verify the result set
        assert.equal(resultBufferOne[0], sku, 'Error: Invalid item SKU');
        assert.equal(resultBufferOne[1], upc, 'Error: Invalid item UPC');
        assert.equal(resultBufferOne[2], retailerId, 'Error: Missing or Invalid ownerId');
        assert.equal(resultBufferOne[3], farmerId, 'Error: Missing or Invalid farmerId');
        assert.equal(resultBufferOne[4], farmerName, 'Error: Missing or Invalid farmerName');
        assert.equal(resultBufferOne[5], farmerInformation, 'Error: Missing or Invalid farmerInformation');
        assert.equal(resultBufferOne[6], farmerLatitude, 'Error: Missing or Invalid farmerLatitude');
        assert.equal(resultBufferOne[7], farmerLongitude, 'Error: Missing or Invalid farmerLongitude');
        assert.equal(resultBufferTwo[5], currentState, 'Error: Invalid State');
        truffleAssert.eventEmitted(event, 'Unboxed');
    });

    it("Testing smart contract function sellBanana() that allows a retailer to sell banana", async() => {
        const supplyChain = await SupplyChain.deployed();
        
        const event = await supplyChain.sellBanana(upc, { from: retailerId });
        
        const resultBufferOne = await supplyChain.fetchBananaBufferOne.call(upc);
        const resultBufferTwo = await supplyChain.fetchBananaBufferTwo.call(upc);

        currentState = State.ForSale;
        
        // Verify the result set
        assert.equal(resultBufferOne[0], sku, 'Error: Invalid item SKU');
        assert.equal(resultBufferOne[1], upc, 'Error: Invalid item UPC');
        assert.equal(resultBufferOne[2], retailerId, 'Error: Missing or Invalid ownerId');
        assert.equal(resultBufferOne[3], farmerId, 'Error: Missing or Invalid farmerId');
        assert.equal(resultBufferOne[4], farmerName, 'Error: Missing or Invalid farmerName');
        assert.equal(resultBufferOne[5], farmerInformation, 'Error: Missing or Invalid farmerInformation');
        assert.equal(resultBufferOne[6], farmerLatitude, 'Error: Missing or Invalid farmerLatitude');
        assert.equal(resultBufferOne[7], farmerLongitude, 'Error: Missing or Invalid farmerLongitude');
        assert.equal(resultBufferTwo[5], currentState, 'Error: Invalid State');
        truffleAssert.eventEmitted(event, 'ForSale');
    });

    it("Testing smart contract function purchaseBanana() that allows a customer to purchase banana", async() => {
        const supplyChain = await SupplyChain.deployed();

        currentProductPrice = (Number.parseInt(productPrice) + Number.parseInt(productFee)).toString();

        const event = await supplyChain.purchaseBanana(upc, { from: consumerId, value: currentProductPrice });
        
        const resultBufferOne = await supplyChain.fetchBananaBufferOne.call(upc);
        const resultBufferTwo = await supplyChain.fetchBananaBufferTwo.call(upc);

        currentState = State.Purchased;
        currentOwnerId = consumerId;

        // Verify the result set
        assert.equal(resultBufferOne[0], sku, 'Error: Invalid item SKU');
        assert.equal(resultBufferOne[1], upc, 'Error: Invalid item UPC');
        assert.equal(resultBufferOne[2], currentOwnerId, 'Error: Missing or Invalid ownerId');
        assert.equal(resultBufferOne[3], farmerId, 'Error: Missing or Invalid farmerId');
        assert.equal(resultBufferOne[4], farmerName, 'Error: Missing or Invalid farmerName');
        assert.equal(resultBufferOne[5], farmerInformation, 'Error: Missing or Invalid farmerInformation');
        assert.equal(resultBufferOne[6], farmerLatitude, 'Error: Missing or Invalid farmerLatitude');
        assert.equal(resultBufferOne[7], farmerLongitude, 'Error: Missing or Invalid farmerLongitude');
        assert.equal(resultBufferTwo[5], currentState, 'Error: Invalid State');
        truffleAssert.eventEmitted(event, 'Purchased');
    });

    // 9th Test
    it("Testing smart contract function fetchItemBufferOne() that allows anyone to fetch item details from blockchain", async() => {
        const supplyChain = await SupplyChain.deployed();

        // Retrieve the just now saved item from blockchain by calling function fetchItem()
        const resultBufferOne = await supplyChain.fetchBananaBufferOne.call(upc, { from: anyoneId });
        
        // Verify the result set:
        assert.equal(resultBufferOne[0], sku, 'Error: Invalid item SKU');
        assert.equal(resultBufferOne[1], upc, 'Error: Invalid item UPC');
        assert.equal(resultBufferOne[2], currentOwnerId, 'Error: Missing or Invalid ownerId');
        assert.equal(resultBufferOne[3], farmerId, 'Error: Missing or Invalid farmerId');
        assert.equal(resultBufferOne[4], farmerName, 'Error: Missing or Invalid farmerName');
        assert.equal(resultBufferOne[5], farmerInformation, 'Error: Missing or Invalid farmerInformation');
        assert.equal(resultBufferOne[6], farmerLatitude, 'Error: Missing or Invalid farmerLatitude');
        assert.equal(resultBufferOne[7], farmerLongitude, 'Error: Missing or Invalid farmerLongitude');
    })

    // 10th Test
    it("Testing smart contract function fetchItemBufferTwo() that allows anyone to fetch item details from blockchain", async() => {
        const supplyChain = await SupplyChain.deployed();

        // Retrieve the just now saved item from blockchain by calling function fetchItem()
        const resultBufferTwo = await supplyChain.fetchBananaBufferTwo.call(upc, { from: anyoneId });
        
        // Verify the result set:
        assert.equal(resultBufferTwo[0], sku, 'Error: Invalid item SKU');
        assert.equal(resultBufferTwo[1], upc, 'Error: Invalid item UPC');
        assert.equal(resultBufferTwo[2], productId, 'Error: Missing or Invalid productId');
        assert.equal(resultBufferTwo[3], productNotes, 'Error: Missing or Invalid productNotes');
        assert.equal(resultBufferTwo[4], (currentState > State.BoxForSale) ? currentProductPrice : 0, 'Error: Missing or Invalid productPrice');
        assert.equal(resultBufferTwo[5], currentState, 'Error: Missing or Invalid state');
        assert.equal(resultBufferTwo[6], (currentState > State.BoxForSale) ? distributorId : 0, 'Error: Missing or Invalid distributorId');
        assert.equal(resultBufferTwo[7], (currentState > State.Shipped) ? retailerId : 0, 'Error: Missing or Invalid retailerId');
        assert.equal(resultBufferTwo[8], (currentState > State.ForSale) ? consumerId : 0, 'Error: Missing or Invalid consumerId');
    });

});