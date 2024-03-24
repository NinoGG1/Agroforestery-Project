const hre = require("hardhat");

async function main() {
  const SeedNFT = await hre.ethers.deployContract("SeedNFT");

  await SeedNFT.waitForDeployment();

  console.log(`SeedNFT deployed to ${SeedNFT.target}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
