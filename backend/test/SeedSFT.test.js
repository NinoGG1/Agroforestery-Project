const { ethers } = require("hardhat");
const { expect, assert } = require("chai");

describe("Test SeedSFT Contract", function () {
  let seedSFT;
  let owner, addr1, addr2;

  const tokenId = 1;
  const amount = 100;
  const tokenURI = "https://example.com/token/1";
  const cmHash = "123";
  const df1Hash = "456";
  const addressZero = "0x0000000000000000000000000000000000000000";

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();
    let contract = await ethers.getContractFactory("SeedSFT");
    seedSFT = await contract.deploy();
  });

  describe("Deployment", function () {
    it("Should deploy the contract", async function () {
      let theOwner = await seedSFT.owner();
      assert(theOwner === owner.address);
    });
  });

  // ::::::::::::: MINT ::::::::::::: //

  describe("mint", function () {
    it("Should not authorize a non owner to mint an SFT", async function () {
      // Mint du token avec l'adresse addr1, ce qui devrait échouer.
      await expect(
        seedSFT
          .connect(addr1)
          .mint(addr2.address, tokenId, amount, tokenURI, cmHash, df1Hash)
      )
        .to.be.revertedWithCustomError(seedSFT, "OwnableUnauthorizedAccount")
        .withArgs(addr1.address);
    });

    // it("Should mint an SFT, emit the TransferSingle event", async function () {
    //   await expect(
    //     seedSFT
    //       .connect(owner)
    //       .mint(addr1.address, tokenId, amount, tokenURI, cmHash, df1Hash)
    //   )
    //     .to.emit(seedSFT, "TransferSingle")
    //     .withArgs(owner, addressZero, addr1.address, tokenId, amount);
    // });

    it("Should mint an SFT, emit the SeedData event", async function () {
      await expect(
        seedSFT
          .connect(owner)
          .mint(addr1.address, tokenId, amount, tokenURI, cmHash, df1Hash)
      )
        .to.emit(seedSFT, "SeedData")
        .withArgs(tokenId, cmHash, df1Hash);
    });
  });

  // ::::::::::::: GETTERS ::::::::::::: //

  describe("getSeedData", function () {
    it("Should get the SeedData of an SFT", async function () {
      await seedSFT
        .connect(owner)
        .mint(addr1.address, tokenId, amount, tokenURI, cmHash, df1Hash);

      // Appel de getSeedData pour récupérer les informations
      const seed = await seedSFT.getSeedData(tokenId);

      // Vérification des informations
      expect(seed.CmHash.toString()).to.equal("123");
      expect(seed.Df1Hash.toString()).to.equal("456");
    });
  });

  // describe("uri", function () {
  //   it("Should get the URI of an SFT", async function () {
  //     await seedSFT
  //       .connect(owner)
  //       .mint(addr1.address, tokenId, amount, tokenURI, cmHash, df1Hash);

  //     // Appel de getSFTURI pour récupérer l'URI
  //     const uri = await seedSFT.uri(tokenId);

  //     // Vérification de l'URI
  //     expect(uri).to.equal("https://example.com/token/1");
  //   });
  // });

  // describe("balanceOf", function () {
  //   it("Should get the balance of an address", async function () {
  //     await seedSFT
  //       .connect(owner)
  //       .mint(addr1.address, tokenId, amount, tokenURI, cmHash, df1Hash);

  //     // Appel de balanceOf pour récupérer le balance de addr1
  //     const balance = await seedSFT.balanceOf(addr1.address, tokenId);

  //     // Vérification de la balance
  //     expect(balance).to.equal(100);
  //   });
  // });
});

// *************** A voir plus tard *************** //

// Empêcher de mint un token avec une URI déjà utilisée
// it("Should revert because the uri has been already used for another SFT", async function () {
//   // Mint du 1er token par le owner à addr1.
//   await seedSFT
//     .connect(owner)
//     .mint(addr1.address, tokenId, amount, tokenURI, cmHash, df1Hash);

//   // Tenter de mint un autre token avec la même URI à addr2, ce qui devrait échouer.
//   await expect(
//     seedSFT
//       .connect(owner)
//       .mint(addr2.address, tokenId + 1, amount, tokenURI, cmHash, df1Hash)
//   ).to.be.revertedWithCustomError(seedSFT, "UriAlreadyUsed");
// });
