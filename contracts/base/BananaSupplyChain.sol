// SPDX-License-Identifier: MIT
pragma solidity ^0.5.16;

import "../core/Ownable.sol";
import "../accesscontrol/ConsumerRole.sol";
import "../accesscontrol/DistributorRole.sol";
import "../accesscontrol/FarmerRole.sol";
import "../accesscontrol/RetailerRole.sol";

// Define a contract 'Supplychain'
contract BananaSupplyChain is 
    Ownable,
    ConsumerRole,
    DistributorRole,
    FarmerRole,
    RetailerRole
{
  // Define a variable called 'upc' for Universal Product Code (UPC)
  uint  upc;

  // Define a variable called 'sku' for Stock Keeping Unit (SKU)
  uint  sku;

  // Define a public mapping 'items' that maps the UPC to an Item.
  mapping (uint => Banana) bananas;

  // Define a public mapping 'itemsHistory' that maps the UPC to an array of TxHash, 
  // that track its journey through the supply chain -- to be sent from DApp.
  mapping (uint => string[]) itemsHistory;
  
  // Define enum 'State' with the following values:
  enum BananaState 
  {
    Harvested,  // 0
    Processed,  // 1
    Boxed,      // 2
    BoxForSale, // 3
    Sold,       // 4
    Shipped,    // 5
    Received,   // 6
    Unboxed,    // 7
    ForSale,    // 8
    Purchased   // 9
  }

  BananaState constant defaultState = BananaState.Harvested;

  // Define a struct 'Item' with the following fields:
  struct Banana {
    uint        sku;  // Stock Keeping Unit (SKU)
    uint        upc; // Universal Product Code (UPC), generated by the Farmer, goes on the package, can be verified by the Consumer
    address     ownerID;  // Metamask-Ethereum address of the current owner as the product moves through 8 stages
    address     originFarmerID; // Metamask-Ethereum address of the Farmer
    string      originFarmName; // Farmer Name
    string      originFarmInformation;  // Farmer Information
    string      originFarmLatitude; // Farm Latitude
    string      originFarmLongitude;  // Farm Longitude
    uint        productID;  // Product ID potentially a combination of upc + sku
    string      productNotes; // Product Notes
    uint        productPrice; // Product Price
    address     distributorID;  // Metamask-Ethereum address of the Distributor
    address     retailerID; // Metamask-Ethereum address of the Retailer
    address     consumerID; // Metamask-Ethereum address of the Consumer
    BananaState state;  // Product State as represented in the enum above
  }

  // Define 8 events with the same 8 state values and accept 'upc' as input argument
  event Harvested(uint upc);
  event Processed(uint upc);
  event Boxed(uint upc);
  event BoxForSale(uint upc);
  event Sold(uint upc);
  event Shipped(uint upc);
  event Received(uint upc);
  event Unboxed(uint upc);
  event ForSale(uint upc);
  event Purchased(uint upc);

  // Define a modifer that checks to see if msg.sender == owner of the contract
  modifier onlyOwner() {
    require(msg.sender == owner());
    _;
  }

  // Define a modifer that verifies the Caller
  modifier verifyCaller (address _address) {
    require(msg.sender == _address); 
    _;
  }

  // Define a modifier that checks if the paid amount is sufficient to cover the price
  modifier paidEnough(uint _price) { 
    require(msg.value >= _price); 
    _;
  }
  
  // Define a modifier that checks the price and refunds the remaining balance
  modifier checkValue(uint _upc) {
    _;
    uint _price = bananas[_upc].productPrice;
    uint amountToReturn = msg.value - _price;
    address2payable(bananas[_upc].consumerID).transfer(amountToReturn);
  }

  modifier harvested(uint _upc) {
    require(bananas[_upc].state == BananaState.Harvested);
    _;
  }

  modifier processed(uint _upc) {
    require(bananas[_upc].state == BananaState.Processed);
    _;
  }
  
  modifier boxed(uint _upc) {
    require(bananas[_upc].state == BananaState.Boxed);
    _;
  }

  modifier boxForSale(uint _upc) {
    require(bananas[_upc].state == BananaState.BoxForSale);
    _;
  }

  modifier sold(uint _upc) {
    require(bananas[_upc].state == BananaState.Sold);
    _;
  }
  
  modifier shipped(uint _upc) {
    require(bananas[_upc].state == BananaState.Shipped);
    _;
  }

  modifier received(uint _upc) {
    require(bananas[_upc].state == BananaState.Received);
    _;
  }

  modifier unboxed(uint _upc) {
    require(bananas[_upc].state == BananaState.Unboxed);
    _;
  }

  modifier forSale(uint _upc) {
    require(bananas[_upc].state == BananaState.ForSale);
    _;
  }

  modifier purchased(uint _upc) {
    require(bananas[_upc].state == BananaState.Purchased);
    _;
  }

  // In the constructor set 'owner' to the address that instantiated the contract
  // and set 'sku' to 1
  // and set 'upc' to 1
  constructor() public payable {
    sku = 1;
    upc = 1;
  }

  // Define a function 'kill' if required
  // function kill() public onlyOwner {
  //   if (msg.sender == owner()) {
  //     selfdestruct(owner());
  //   }
  // }

  function address2payable(address addr) private pure returns (address payable) {
    return address(uint160(addr));
  }

  function harvestBanana(
    uint    _upc,
    address _originFarmerID,
    string memory _originFarmName,
    string memory _originFarmInformation,
    string memory _originFarmLatitude,
    string memory  _originFarmLongitude,
    uint _productID,
    string memory _productNotes
  )
    public 
  {
    bananas[_upc].sku = sku;
    bananas[_upc].upc = _upc;
    bananas[_upc].ownerID = msg.sender;
    bananas[_upc].originFarmerID = address2payable(_originFarmerID);
    bananas[_upc].originFarmName = _originFarmName;
    bananas[_upc].originFarmInformation = _originFarmInformation;
    bananas[_upc].originFarmLatitude = _originFarmLatitude;
    bananas[_upc].originFarmLongitude = _originFarmLongitude;
    bananas[_upc].productID = _productID;
    bananas[_upc].productNotes = _productNotes;
    
    // Increment sku
    sku = sku + 1;
    // Emit the appropriate event
    emit Harvested(_upc);
  }

  function processBanana(uint _upc)
    public 
    harvested(_upc)
    verifyCaller(bananas[_upc].originFarmerID)
  {
    bananas[_upc].state = BananaState.Processed;
    emit Processed(_upc);
  }

  function boxBanana(uint _upc)
    public
    processed(_upc)
    verifyCaller(bananas[_upc].originFarmerID)
  {
    // Update the appropriate fields
    bananas[_upc].state = BananaState.Boxed;
    // Emit the appropriate event
    emit Boxed(_upc);
  }

  // Define a function 'sellItem' that allows a farmer to mark an item 'ForSale'
  function sellBananaBox(uint _upc, uint _price)
    public
    boxed(_upc)
    verifyCaller(bananas[_upc].originFarmerID)  
  {
    // Update the appropriate fields
    bananas[_upc].state = BananaState.BoxForSale;
    bananas[_upc].productPrice = _price;
    // Emit the appropriate event
    emit BoxForSale(_upc);
  }

  // Define a function 'buyItem' that allows the disributor to mark an item 'Sold'
  // Use the above defined modifiers to check if the item is available for sale, if the buyer has paid enough, 
  // and any excess ether sent is refunded back to the buyer
  function buyBananaBox(uint _upc)
    public
    payable 
    boxForSale(_upc)
    paidEnough(bananas[_upc].productPrice)
    checkValue(_upc)    
  {
    // Update the appropriate fields - ownerID, distributorID, itemState
    bananas[_upc].ownerID = msg.sender;
    bananas[_upc].distributorID = msg.sender;
    bananas[_upc].state = BananaState.Sold;
    
    // Transfer money to farmer
    address2payable(bananas[_upc].originFarmerID).transfer(bananas[_upc].productPrice);
    // emit the appropriate event
    emit Sold(_upc);
  }

  // Define a function 'shipItem' that allows the distributor to mark an item 'Shipped'
  // Use the above modifers to check if the item is sold
  function shipBananaBox(uint _upc)
    public 
    sold(_upc)
    verifyCaller(bananas[_upc].distributorID)
  {
    // Update the appropriate fields
    bananas[_upc].state = BananaState.Shipped;
    // Emit the appropriate event
    emit Shipped(_upc);
  }

  // Define a function 'receiveItem' that allows the retailer to mark an item 'Received'
  // Use the above modifiers to check if the item is shipped
  function receiveBananaBox(uint _upc)
    public 
    shipped(_upc)
    onlyRetailer()
  {
    // Update the appropriate fields - ownerID, retailerID, itemState
    bananas[_upc].ownerID = msg.sender;
    bananas[_upc].retailerID = msg.sender;
    bananas[_upc].state = BananaState.Received;
    // Emit the appropriate event
    emit Received(_upc);
  }

  function unboxBanana(uint _upc)
    public
    received(_upc)
    onlyRetailer()
  {
    bananas[_upc].state = BananaState.Unboxed;
    emit Unboxed(_upc);
  }

  function sellBanana(uint _upc)
    public
    unboxed(_upc)
    onlyRetailer()
  {
    bananas[_upc].state = BananaState.ForSale;

    emit ForSale(_upc);
  }

  // Define a function 'purchaseItem' that allows the consumer to mark an item 'Purchased'
  // Use the above modifiers to check if the item is received
  function purchaseItem(uint _upc)
    public 
    forSale(_upc)
    onlyConsumer()
  {
    // Update the appropriate fields - ownerID, consumerID, itemState
    bananas[_upc].ownerID = msg.sender;
    bananas[_upc].consumerID = msg.sender;
    bananas[_upc].state = BananaState.Purchased;
    // Emit the appropriate event
    emit Purchased(_upc);
  }

  // Define a function 'fetchItemBufferOne' that fetches the data
  function fetchBananaBufferOne(uint _upc) public view returns 
  (
    uint    bananaSKU,
    uint    bananaUPC,
    address ownerID,
    address originFarmerID,
    string memory originFarmName,
    string memory originFarmInformation,
    string memory originFarmLatitude,
    string memory originFarmLongitude
  ) 
  {
    // Assign values to the 8 parameters
    bananaSKU = bananas[_upc].sku;
    bananaUPC = bananas[_upc].upc;
    ownerID = bananas[_upc].ownerID;
    originFarmerID = bananas[_upc].originFarmerID;
    originFarmName = bananas[_upc].originFarmName;
    originFarmInformation = bananas[_upc].originFarmInformation;
    originFarmLatitude = bananas[_upc].originFarmLatitude;
    originFarmLongitude = bananas[_upc].originFarmLongitude;
    
    return 
    (
      bananaSKU,
      bananaUPC,
      ownerID,
      originFarmerID,
      originFarmName,
      originFarmInformation,
      originFarmLatitude,
      originFarmLongitude
    );
  }

  // Define a function 'fetchItemBufferTwo' that fetches the data
  function fetchBananaBufferTwo(uint _upc) public view returns 
  (
    uint    bananaSKU,
    uint    bananaUPC,
    uint    productID,
    string memory productNotes,
    uint    productPrice,
    uint    state,
    address distributorID,
    address retailerID,
    address consumerID
  ) 
  {
    // Assign values to the 9 parameters
    bananaSKU = bananas[_upc].sku;
    bananaUPC = bananas[_upc].upc;
    productID = bananas[_upc].productID;
    productNotes = bananas[_upc].productNotes;
    productPrice = bananas[_upc].productPrice;
    state = uint(bananas[_upc].state);
    distributorID = bananas[_upc].distributorID;
    retailerID = bananas[_upc].retailerID;
    consumerID = bananas[_upc].consumerID;
    
    return 
    (
      bananaSKU,
      bananaUPC,
      productID,
      productNotes,
      productPrice,
      state,
      distributorID,
      retailerID,
      consumerID
    );
  }
}