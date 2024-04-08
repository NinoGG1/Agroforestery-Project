const hre = require("hardhat");

async function main() {
  // Déployer UserManager
  const UserManager = await ethers.getContractFactory("UserManager");
  const userManager = await UserManager.deploy();
  await userManager.waitForDeployment();
  console.log("UserManager deployed to:", userManager.target);

  // Déployer SFT1 avec l'adresse de UserManager
  const SFT1 = await ethers.getContractFactory("SFT1");
  const sft1 = await SFT1.deploy(userManager.target);
  await sft1.waitForDeployment();
  console.log("SFT1 deployed to:", sft1.target);

  // Déployer SFT2 avec les adresses de SFT1 et UserManager
  const SFT2 = await ethers.getContractFactory("SFT2");
  const sft2 = await SFT2.deploy(sft1.target, userManager.target);
  await sft2.waitForDeployment();
  console.log("SFT2 deployed to:", sft2.target);

  // Déployer NFT3 avec les adresses de UserManager puis de SFT2
  const NFT3 = await ethers.getContractFactory("NFT3");
  const nft3 = await NFT3.deploy(userManager.target, sft2.target);
  await nft3.waitForDeployment();
  console.log("NFT3 deployed to:", nft3.target);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
