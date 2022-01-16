const getWeb3 = async () => {
    if (window.ethereum) {
        const web3 = new Web3(window.ethereum);
        try {
          // ask user permission to access his accounts
          await window.ethereum.request({ method: "eth_requestAccounts" });
          return web3;
        } catch (error) {
          throw error;
        }
    } else {
        alert("Must install MetaMask");
    }
};

const getContract = async (web3) => {
    const data = await $.getJSON("./build/contracts/SupplyChain.json");

    const netId = await web3.eth.net.getId();
    const deployedNetwork = data.networks[netId];
    const supplyChain = new web3.eth.Contract(
        data.abi,
        deployedNetwork && deployedNetwork.address
    );
    account = (await web3.eth.getAccounts())[0];
    return supplyChain;
};

let contract;
let web3;
let account;

window.onload = async () => {
    web3 = await getWeb3();
    contract = await getContract(web3);
    
    setupFormEvents();
}

function logEvent(upc, eventName) {
    const display = document.getElementById("display");

    const log = document.createElement('p');
    log.innerHTML = `${upc} - Banana ${eventName.toLowerCase()}`;

    display.appendChild(log);
}

function setupFormEvents() {
    const harvestBanana = document.getElementById("harvestBanana");
    const processBanana = document.getElementById("processBanana");
    const boxBanana = document.getElementById("boxBanana");
    const sellBananaBox = document.getElementById("sellBananaBox");
    const formFarmer = document.getElementById("form-farmer");

    harvestBanana.onclick = async (event) => {
        event.preventDefault();

        const upc = Number.parseInt(formFarmer.elements.namedItem("upc").value);
        const originFarmerID = formFarmer.elements.namedItem("originFarmerID").value;
        const originFarmerName = formFarmer.elements.namedItem("originFarmerName").value;
        const originFarmerInfo = formFarmer.elements.namedItem("originFarmerInfo").value;
        const originFarmerLatitude = formFarmer.elements.namedItem("originFarmerLatitude").value;
        const originFarmerLongitude = formFarmer.elements.namedItem("originFarmerLongitude").value;
        // const upc = formFarmer.elements.namedItem("upc").value;
        const productNotes = formFarmer.elements.namedItem("productNotes").value;

        console.log("upc:", upc);
        console.log("originFamerId:", originFarmerID);
        console.log("originFamerName:", originFarmerName);
        console.log("originFamerInfo:", originFarmerInfo);
        console.log("originFamerLatitude:", originFarmerLatitude);
        console.log("originFamerLangitude:", originFarmerLongitude);
        console.log("productNotes:", productNotes);

        const transaction = await contract.methods.harvestBanana(
            upc,
            originFarmerID,
            originFarmerName,
            originFarmerInfo,
            originFarmerLatitude,
            originFarmerLongitude,
            productNotes
        ).send({
            from: account,
            gas: 3000000
        });

        if(transaction.events.Harvested) {
            logEvent(upc, 'harvsted');
        }
    };

    processBanana.onclick = async (event) => {
        event.preventDefault();

        const upc = Number.parseInt(formFarmer.elements.namedItem("upc").value);

        const transaction = await contract.methods.processBanana(upc).send({
            from: account,
            gas: 3000000,
        });

        if(transaction.events.Processed) {
            logEvent(upc, 'processed');
        }
    };

    boxBanana.onclick = async (event) => {
        event.preventDefault();

        const upc = Number.parseInt(formFarmer.elements.namedItem("upc").value);

        const transaction = await contract.methods.boxBanana(upc).send({
            from: account,
            gas: 3000000,
        });

        if(transaction.events.Boxed) {
            logEvent(upc, 'boxed');
        }
    };

    sellBananaBox.onclick = async (event) => {
        event.preventDefault();

        const upc = Number.parseInt(formFarmer.elements.namedItem("upc").value);
        const productPrice = Number.parseInt(formFarmer.elements.namedItem("productPrice").value);

        const transaction = await contract.methods.sellBananaBox(upc, productPrice).send({
            from: account,
            gas: 3000000,
        });

        if(transaction.events.BoxForSale) {
            logEvent(upc, `box for sell (${productPrice} Wei)`);
        }
    };

    const buyBananaBox = document.getElementById("buyBananaBox");
    const shipBananaBox = document.getElementById("shipBananaBox");
    const formDistributor = document.getElementById("form-distributor");

    buyBananaBox.onclick = async (event) => {
        event.preventDefault();

        const upc = Number.parseInt(formDistributor.elements.namedItem("upc").value);

        const transaction = await contract.methods.buyBananaBox(upc).send({
            from: account,
            gas: 3000000,
            value: web3.utils.toWei("5", "ether")
        });

        if(transaction.events.Sold) {
            logEvent(upc, 'box sold');
        }
    }

    shipBananaBox.onclick = async (event) => {
        event.preventDefault();

        const upc = Number.parseInt(formDistributor.elements.namedItem("upc").value);

        const transaction = await contract.methods.shipBananaBox(upc).send({
            from: account,
            gas: 3000000,
        });

        if(transaction.events.Shipped) {
            logEvent(upc, 'box shipped');
        }
    }

    const receiveBananaBox = document.getElementById("receiveBananaBox");
    const unboxBanana = document.getElementById("unboxBanana");
    const sellBanana = document.getElementById("sellBanana");
    const formRetailer = document.getElementById("form-retailer");

    receiveBananaBox.onclick = async (event) => {
        event.preventDefault();

        const upc = Number.parseInt(formRetailer.elements.namedItem("upc").value);

        const transaction = await contract.methods.receiveBananaBox(upc).send({
            from: account,
            gas: 3000000,
        });

        if(transaction.events.Received) {
            logEvent(upc, 'box received');
        }
    }

    unboxBanana.onclick = async (event) => {
        event.preventDefault();

        const upc = Number.parseInt(formRetailer.elements.namedItem("upc").value);

        const transaction = await contract.methods.unboxBanana(upc).send({
            from: account,
            gas: 3000000,
        });

        if(transaction.events.Unboxed) {
            logEvent(upc, 'unboxed');
        }
    }

    sellBanana.onclick = async (event) => {
        event.preventDefault();

        const upc = Number.parseInt(formRetailer.elements.namedItem("upc").value);

        const transaction = await contract.methods.sellBanana(upc).send({
            from: account,
            gas: 3000000,
        });

        if(transaction.events.ForSale) {
            logEvent(upc, 'for sale');
        }
    }

    const purchaseBanana = document.getElementById("purchaseBanana");
    const formConsumer = document.getElementById("form-consumer");

    purchaseBanana.onclick = async (event) => {
        event.preventDefault();

        const upc = Number.parseInt(formConsumer.elements.namedItem("upc").value);

        const transaction = await contract.methods.purchaseBanana(upc).send({
            from: account,
            gas: 3000000,
            value: web3.utils.toWei("5", "ether")
        });

        if(transaction.events.Purchased) {
            logEvent(upc, 'purchased');
        }
    }

    const fetchBanana = document.getElementById("fetchBanana");
    const formAnyone = document.getElementById("form-anyone");

    fetchBanana.onclick = async (event) => {
        event.preventDefault();

        const upc = Number.parseInt(formAnyone.elements.namedItem("upc").value);

        const resultBufferOne = await contract.methods.fetchBananaBufferOne(upc).call({
            from: account,
            gas: 3000000
        });
        const resultBufferTwo = await contract.methods.fetchBananaBufferTwo(upc).call({
            from: account,
            gas: 3000000
        });

        console.log("resultBufferOne:", resultBufferOne);
        console.log("resultBufferTwo:", resultBufferTwo);

        const sku = resultBufferOne['bananaSKU'];
        logEvent(upc, `sku: ${sku}`)
        // const upc = resultBufferOne['bananaUPC'];
        const ownerId = resultBufferOne['ownerID'];
        logEvent(upc, `owner id: ${ownerId}`);
        const originFarmerId = resultBufferOne['originFarmerID'];
        logEvent(upc, `origin famer id: ${originFarmerId}`);
        const originFarmerName = resultBufferOne['originFarmName'];
        logEvent(upc, `origin famer name: ${originFarmerName}`);
        const originFarmerInfo = resultBufferOne['originFarmInformation'];
        logEvent(upc, `origin farmer information: ${originFarmerInfo}`);
        const originFarmerLatitude = resultBufferOne['originFarmLatitude'];
        logEvent(upc, `origin farmer latitude: ${originFarmerLatitude}`);
        const originFarmerLongitude = resultBufferOne['originFarmLongitude'];
        logEvent(upc, `origin farmer longitude: ${originFarmerLongitude}`);

        const distributorId = resultBufferTwo['distributorID'];
        logEvent(upc, `distributor id: ${distributorId}`);
        const retailerId = resultBufferTwo['retailerID'];
        logEvent(upc, `retailer id: ${retailerId}`);
        const consumerId = resultBufferTwo['consumerID'];
        logEvent(upc, `consumer id: ${consumerId}`);
        const productId = resultBufferTwo['productID'];
        logEvent(upc, `product id: ${productId}`);
        const productPrice = resultBufferTwo['productPrice'];
        logEvent(upc, `product price: ${productPrice}`);
        const productNotes = resultBufferTwo['productNotes'];
        logEvent(upc, `product notes: ${productNotes}`);
        const state = resultBufferTwo['state'];
        logEvent(upc, `state: ${state}`);

    };
}