const hre = require("hardhat");

async function main() {
  const SFT1 = await hre.ethers.deployContract("SFT1");
  const UserManager = await hre.ethers.deployContract("UserManager");

  await SFT1.waitForDeployment();
  await UserManager.waitForDeployment();

  console.log(`SFT1 deployed to ${SFT1.target}`);
  console.log(`UserManager deployed to ${UserManager.target}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
