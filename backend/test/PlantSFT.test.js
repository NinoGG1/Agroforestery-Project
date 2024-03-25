const { ethers } = require("hardhat");
const { expect, assert } = require("chai");

describe("Test PlantSFT Contract", function () {
  let plantSFT;
  let owner, addr1, addr2;

  const tokenId = 1;
  const amount = 100;
  const tokenURI = "https://example.com/plant/1";
  const seedSFT_Uri = "https://example.com/seed/1";
  const df2Hash = "123";
  const addressZero = "0x0000000000000000000000000000000000000000";

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();
    let contract = await ethers.getContractFactory("PlantSFT");
    plantSFT = await contract.deploy();
  });

  describe("Deployment", function () {
    it("Should deploy the contract", async function () {
      let theOwner = await plantSFT.owner();
      assert(theOwner === owner.address);
    });
  });

  // ::::::::::::: MINT ::::::::::::: //

  describe("mint", function () {
    it("Should not authorize a non owner to mint an SFT", async function () {
      // Mint du token avec l'adresse addr1, ce qui devrait échouer.
      await expect(
        plantSFT
          .connect(addr1)
          .mint(addr2.address, tokenId, amount, tokenURI, seedSFT_Uri, df2Hash)
      )
        .to.be.revertedWithCustomError(plantSFT, "OwnableUnauthorizedAccount")
        .withArgs(addr1.address);
    });

    it("Should mint an SFT, emit the PlantData event", async function () {
      await expect(
        plantSFT
          .connect(owner)
          .mint(addr1.address, tokenId, amount, tokenURI, seedSFT_Uri, df2Hash)
      )
        .to.emit(plantSFT, "PlantData")
        .withArgs(tokenId, seedSFT_Uri, df2Hash);
    });
  });

  // ::::::::::::: GETTERS ::::::::::::: //

  describe("getPlantData", function () {
    it("Should get the PlantData of an SFT", async function () {
      await plantSFT
        .connect(owner)
        .mint(addr1.address, tokenId, amount, tokenURI, seedSFT_Uri, df2Hash);

      // Appel de getSeedData pour récupérer les informations
      const plant = await plantSFT.getPlantData(tokenId);

      // Vérification des informations
      expect(plant.seedSFT_Uri.toString()).to.equal(
        "https://example.com/seed/1"
      );
      expect(plant.df2Hash.toString()).to.equal("123");
    });
  });
});
