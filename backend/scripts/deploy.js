const hre = require("hardhat");

async function main() {
  const SeedSFT = await hre.ethers.deployContract("SeedSFT");
  const PlantSFT = await hre.ethers.deployContract("PlantSFT");

  await SeedSFT.waitForDeployment();
  await PlantSFT.waitForDeployment();

  console.log(`SeedSFT deployed to ${SeedSFT.target}`);
  console.log(`PlantSFT deployed to ${PlantSFT.target}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
