const hre = require("hardhat");

async function main() {
  const dwitter = await hre.ethers.getContractFactory("Dwitter");
  const contract = await dwitter.deploy(); //instance of contract

  await contract.waitForDeployment();
  console.log("Address of contract:", contract.target);
}
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
