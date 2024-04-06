const hre = require("hardhat");

async function main() {
  // // Déployer UserManager
  // const UserManager = await ethers.getContractFactory("UserManager");
  // const userManager = await UserManager.deploy();
  // console.log("UserManager deployed to:", userManager.target);

  // // Déployer SFT1 avec l'adresse de UserManager
  // const SFT1 = await ethers.getContractFactory("SFT1");
  // const sft1 = await SFT1.deploy("0xDa1A6F223da2389E470F6Da6f56B107CBaF9e2C1");
  // console.log("SFT1 deployed to:", sft1.target);

  // // Déployer SFT2 avec les adresses de SFT1 et UserManager
  // const SFT2 = await ethers.getContractFactory("SFT2");
  // const sft2 = await SFT2.deploy(
  //   "0xE9D1D106FC5F7a7Ca37DFF254fC0758cE7aA6e88",
  //   "0xDa1A6F223da2389E470F6Da6f56B107CBaF9e2C1"
  // );
  // console.log("SFT2 deployed to:", sft2.target);

  // Déployer NFT3 avec les adresses de UserManager puis de SFT2
  const NFT3 = await ethers.getContractFactory("NFT3");
  const nft3 = await NFT3.deploy(
    "0xDa1A6F223da2389E470F6Da6f56B107CBaF9e2C1",
    "0x9712641545adF54146b6992e7F9F72205cf6DdAE"
  );
  console.log("NFT3 deployed to:", nft3.target);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
