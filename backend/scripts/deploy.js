const hre = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  // Déployer UserManager
  const UserManager = await ethers.getContractFactory("UserManager");
  const userManager = await UserManager.deploy();
  console.log("UserManager deployed to:", userManager.target);

  // Déployer SFT1 avec l'adresse de UserManager
  const SFT1 = await ethers.getContractFactory("SFT1");
  const sft1 = await SFT1.deploy(userManager.target);
  console.log("SFT1 deployed to:", sft1.target);

  // Déployer SFT2 avec les adresses de SFT1 et UserManager
  const SFT2 = await ethers.getContractFactory("SFT2");
  const sft2 = await SFT2.deploy(sft1.target, userManager.target);
  console.log("SFT2 deployed to:", sft2.target);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
