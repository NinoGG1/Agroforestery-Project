const hre = require("hardhat");

async function main() {
  // // Déployer UserManager
  // const UserManager = await ethers.getContractFactory("UserManager");
  // const userManager = await UserManager.deploy();
  // console.log("UserManager deployed to:", userManager.target);

  // Déployer SFT1 avec l'adresse de UserManager
  // const SFT1 = await ethers.getContractFactory("SFT1");
  // const sft1 = await SFT1.deploy("0xac8e57f2656eb19dd9ea9f078327c1315838688a");
  // console.log("SFT1 deployed to:", sft1.target);

  // Déployer SFT2 avec les adresses de SFT1 et UserManager
  const SFT2 = await ethers.getContractFactory("SFT2");
  const sft2 = await SFT2.deploy(
    "0xf184508c286f589e5D9Ff741080f7084c2b83F84",
    "0xac8e57f2656eb19dd9ea9f078327c1315838688a"
  );
  console.log("SFT2 deployed to:", sft2.target);

  // // Déployer NFT3 avec les adresses de UserManager puis de SFT2
  // const NFT3 = await ethers.getContractFactory("NFT3");
  // const nft3 = await NFT3.deploy(
  //   "0xac8e57f2656eb19dd9ea9f078327c1315838688a",
  //   ""
  // );
  // console.log("NFT3 deployed to:", nft3.target);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
