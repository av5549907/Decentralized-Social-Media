
require("@nomicfoundation/hardhat-toolbox");

require("dotenv").config();
/** @type import('hardhat/config').HardhatUserConfig */
//with alchemy Address of contract: 0x0bfB2B901433D1079e40198F17a65fee0285cf35
// localhost Address of contract: 0x5FbDB2315678afecb367f032d93F642f64180aa3
// with infura Address of contract: 0x041C3bb32F65aBE28029CE6dAB0d7439ed0ef72A
const SEPOLIA_URL = process.env.SEPOLIA_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
module.exports = {
  solidity: "0.8.19",
  networks: {
    sepolia: {
      url: SEPOLIA_URL,
      accounts: [PRIVATE_KEY],
    },
  },
};