const { ethers } = require("hardhat");
const { expect, assert } = require("chai");

describe("Test NFT3 Contract", function () {
  let NFT3;
  let SFT2;
  let owner,
    ADMIN,
    MARCHAND_GRAINIER,
    PEPINIERISTE,
    PEPINIERISTE2,
    EXPLOITANT_FORESTIER,
    EXPLOITANT_FORESTIER2;

  const tokenId = 1;
  const amount = 100;
  const cid = "QmRbU5hfL8UCP9LFNqQzGMgUrYG7WL58HNDMBVpcy5ZEZy";
  const sft1TokenId = 2;
  const sft1TokenIdPepinieriste2 = 3;
  const sft2TokenId = 1;
  const sft2TokenIdExploitantForestier2 = 2;
  const df2Hash =
    "0x7465737400000000000000000000000000000000000000000000000000000000";
  const addressZero = "0x0000000000000000000000000000000000000000";
  const emptyHash =
    "0x0000000000000000000000000000000000000000000000000000000000000000";

  beforeEach(async function () {
    [
      owner,
      ADMIN,
      MARCHAND_GRAINIER,
      PEPINIERISTE,
      PEPINIERISTE2,
      EXPLOITANT_FORESTIER,
      EXPLOITANT_FORESTIER2,
    ] = await ethers.getSigners();

    // ::::::::::::: USE MANAGER ::::::::::::: //
    // Déploiement du contrat UserManager
    const userManagerContract = await ethers.getContractFactory("UserManager");
    const userManager = await userManagerContract.deploy();

    // Assignation des rôles après le déploiement
    await userManager.assignRole(ADMIN.address, await userManager.ADMIN());
    await userManager.assignRole(
      MARCHAND_GRAINIER.address,
      await userManager.MARCHAND_GRAINIER()
    );
    await userManager.assignRole(
      PEPINIERISTE.address,
      await userManager.PEPINIERISTE()
    );
    await userManager.assignRole(
      PEPINIERISTE2.address,
      await userManager.PEPINIERISTE()
    );
    await userManager.assignRole(
      EXPLOITANT_FORESTIER.address,
      await userManager.EXPLOITANT_FORESTIER()
    );
    await userManager.assignRole(
      EXPLOITANT_FORESTIER2.address,
      await userManager.EXPLOITANT_FORESTIER()
    );

    // ::::::::::::: SFT1 ::::::::::::: //
    // Déployez le contrat SFT1
    const SFT1Contract = await ethers.getContractFactory("SFT1");
    SFT1 = await SFT1Contract.deploy(userManager.target);

    // Mintez un SFT1 vers le PEPINIERISTE
    const cmHash =
      "0x7465737400000000000000000000000000000000000000000000000000000000";
    const df1Hash =
      "0x7465737800000000000000000000000000000000000000000000000000000000";
    await SFT1.connect(ADMIN).mint(
      PEPINIERISTE.address,
      sft1TokenId,
      amount,
      cid,
      cmHash,
      df1Hash
    );

    // Mintez un SFT1 vers le PEPINIERISTE2
    await SFT1.connect(ADMIN).mint(
      PEPINIERISTE2.address,
      sft1TokenIdPepinieriste2,
      amount,
      cid,
      cmHash,
      df1Hash
    );

    // ::::::::::::: SFT2 ::::::::::::: //
    // Déployez le contrat SFT2
    const SFT2contract = await ethers.getContractFactory("SFT2");
    SFT2 = await SFT2contract.deploy(SFT1.target, userManager.target);

    // Mint un SFT2 vers un EXPLOITANT_FORESTIER
    await SFT2.connect(PEPINIERISTE).mint(
      EXPLOITANT_FORESTIER.address,
      sft2TokenId,
      amount,
      cid,
      sft1TokenId,
      df2Hash
    );

    // Mint un SFT2 vers un EXPLOITANT_FORESTIER2
    await SFT2.connect(PEPINIERISTE).mint(
      EXPLOITANT_FORESTIER2.address,
      sft2TokenIdExploitantForestier2,
      amount,
      cid,
      sft1TokenId,
      df2Hash
    );

    // ::::::::::::: NFT3 ::::::::::::: //
    // Déployez le contrat NFT3
    const NFT3Contract = await ethers.getContractFactory("NFT3");
    NFT3 = await NFT3Contract.deploy(userManager.target, SFT2.target);
  });

  describe("Deployment", function () {
    it("Should deploy the contract", async function () {
      let theOwner = await NFT3.owner();
      assert(theOwner === owner.address);
    });
  });

  // ::::::::::::: MINT ::::::::::::: //
  describe("mint", function () {
    it("Should not authorize a MARCHAND_GRAINIER to mint an NFT3", async function () {
      // Mint du token avec l'adresse MARCHAND_GRAINIER, ce qui devrait échouer
      await expect(
        NFT3.connect(MARCHAND_GRAINIER).mint(tokenId, cid, sft2TokenId)
      ).to.be.revertedWithCustomError(NFT3, "UnauthorizedAccess");
    });

    it("Should not authorize a ADMIN to mint an NFT3", async function () {
      // Mint du token avec l'adresse ADMIN, ce qui devrait échouer
      await expect(
        NFT3.connect(ADMIN).mint(tokenId, cid, sft2TokenId)
      ).to.be.revertedWithCustomError(NFT3, "UnauthorizedAccess");
    });

    it("Should not authorize a PEPINIERISTE to mint an NFT3", async function () {
      // Mint du token avec l'adresse PEPINIERISTE, ce qui devrait échouer
      await expect(
        NFT3.connect(PEPINIERISTE).mint(tokenId, cid, sft2TokenId)
      ).to.be.revertedWithCustomError(NFT3, "UnauthorizedAccess");
    });

    it("Should not mint an SFT2 with an empty CID", async function () {
      // Mint du token avec un CID vide, ce qui devrait échouer
      await expect(
        NFT3.connect(EXPLOITANT_FORESTIER).mint(tokenId, "", sft2TokenId)
      ).to.be.revertedWithCustomError(NFT3, "CIDCannotBeEmpty");
    });

    it("Should not allow a EXPLOITANT_FORESTIER to mint an NFT3 if the SFT2 does not belong to him", async function () {
      // Mint du token par l' EXPLOITANT_FORESTIER avec le sft2TokenId d'un autre EXPLOITANT_FORESTIER2, ce qui devrait échouer
      await expect(
        NFT3.connect(EXPLOITANT_FORESTIER).mint(
          tokenId,
          cid,
          sft2TokenIdExploitantForestier2
        )
      ).to.be.revertedWithCustomError(
        NFT3,
        "SFT2DoesNotBelongToExploitantForestier"
      );
    });

    it("Should mint an NFT3 by addres with role EXPLOITANT_FORESTIER that own the SFT2", async function () {
      await expect(
        NFT3.connect(EXPLOITANT_FORESTIER).mint(tokenId, cid, sft2TokenId)
      )
        .to.emit(NFT3, "NFT3Minted")
        .withArgs(tokenId, sft2TokenId, cid);
    });

    it("Should revert if the token already exists", async function () {
      await NFT3.connect(EXPLOITANT_FORESTIER).mint(tokenId, cid, sft2TokenId);
      await expect(
        NFT3.connect(EXPLOITANT_FORESTIER).mint(tokenId, cid, sft2TokenId)
      ).to.be.reverted;
    });
  });

  // ::::::::::::: Others functions ::::::::::::: //
  describe("Others", function () {
    it("Should return tokenURI", async function () {
      await NFT3.connect(EXPLOITANT_FORESTIER).mint(tokenId, cid, sft2TokenId);
      let tokenURI = await NFT3.tokenURI(tokenId);
      assert(tokenURI === `ipfs://${cid}`);
    });

    it("supports ERC721 interface", async function () {
      expect(await NFT3.supportsInterface("0x80ac58cd")).to.equal(true);
    });

    it("supports ERC721Metadata interface", async function () {
      expect(await NFT3.supportsInterface("0x5b5e139f")).to.equal(true);
    });
  });
});
