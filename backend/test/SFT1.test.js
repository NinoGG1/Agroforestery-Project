const { ethers } = require("hardhat");
const { expect, assert } = require("chai");

describe("Test SFT1 Contract", function () {
  let SFT1;
  let owner, addr1, addr2;

  const tokenId = 1;
  const amount = 100;
  const cid = "QmRbU5hfL8UCP9LFNqQzGMgUrYG7WL58HNDMBVpcy5ZEZy";
  const cmHash = "123abc";
  const df1Hash = "456def";
  const addressZero = "0x0000000000000000000000000000000000000000";

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();
    let contract = await ethers.getContractFactory("SFT1");
    SFT1 = await contract.deploy();
  });

  describe("Deployment", function () {
    it("Should deploy the contract", async function () {
      let theOwner = await SFT1.owner();
      assert(theOwner === owner.address);
    });
  });

  // ::::::::::::: MINT ::::::::::::: //
  describe("mint", function () {
    it("Should not authorize a non owner to mint an SFT", async function () {
      // Mint du token avec l'adresse addr1, ce qui devrait échouer.
      await expect(
        SFT1.connect(addr1).mint(
          addr2.address,
          tokenId,
          amount,
          cid,
          cmHash,
          df1Hash
        )
      )
        .to.be.revertedWithCustomError(SFT1, "OwnableUnauthorizedAccount")
        .withArgs(addr1.address);
    });

    it("Should mint an SFT1, emit the SFT1 event", async function () {
      await expect(
        SFT1.connect(owner).mint(
          addr1.address,
          tokenId,
          amount,
          cid,
          cmHash,
          df1Hash
        )
      )
        .to.emit(SFT1, "Sft1Data")
        .withArgs(tokenId, cid, cmHash, df1Hash);
    });
  });

  // ::::::::::::: GETTERS ::::::::::::: //

  describe("getSft1Data", function () {
    it("Should get the Sft1Data", async function () {
      await SFT1.connect(owner).mint(
        addr1.address,
        tokenId,
        amount,
        cid,
        cmHash,
        df1Hash
      );

      // Appel de getSft1Data pour récupérer les informations
      const sft1 = await SFT1.getSft1Data(tokenId);

      // Vérification des informations
      expect(sft1.CmHash.toString()).to.equal("123abc");
      expect(sft1.Df1Hash.toString()).to.equal("456def");
    });
  });
});

// *************** A voir plus tard *************** //

// Empêcher de mint un token avec une URI déjà utilisée
// it("Should revert because the uri has been already used for another SFT", async function () {
//   // Mint du 1er token par le owner à addr1.
//   await SFT1
//     .connect(owner)
//     .mint(addr1.address, tokenId, amount, tokenURI, cmHash, df1Hash);

//   // Tenter de mint un autre token avec la même URI à addr2, ce qui devrait échouer.
//   await expect(
//     SFT1
//       .connect(owner)
//       .mint(addr2.address, tokenId + 1, amount, tokenURI, cmHash, df1Hash)
//   ).to.be.revertedWithCustomError(SFT1, "UriAlreadyUsed");
// });
