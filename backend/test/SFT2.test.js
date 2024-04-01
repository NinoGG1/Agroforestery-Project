const { ethers } = require("hardhat");
const { expect, assert } = require("chai");

describe("Test SFT2 Contract", function () {
  let SFT1;
  let SFT2;
  let owner, ADMIN, PEPINIERISTE, PEPINIERISTE2, EXPLOITANT_FORESTIER;

  const tokenId = 1;
  const amount = 100;
  const cid = "QmRbU5hfL8UCP9LFNqQzGMgUrYG7WL58HNDMBVpcy5ZEZy";
  const sft1TokenId = 2;
  const sft1TokenIdPepinieriste2 = 3;
  const df2Hash =
    "0x7465737400000000000000000000000000000000000000000000000000000000";
  const addressZero = "0x0000000000000000000000000000000000000000"; // Adresse 0
  const emptyHash =
    "0x0000000000000000000000000000000000000000000000000000000000000000"; // Hash vide pour bytes32

  beforeEach(async function () {
    [owner, ADMIN, PEPINIERISTE, PEPINIERISTE2, EXPLOITANT_FORESTIER] =
      await ethers.getSigners();

    // Déploiement du contrat UserManager
    const userManagerContract = await ethers.getContractFactory("UserManager");
    const userManager = await userManagerContract.deploy();

    // Assignation des rôles après le déploiement
    await userManager.assignRole(ADMIN.address, await userManager.ADMIN());
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

    // Déployez le contrat SFT2
    const contract = await ethers.getContractFactory("SFT2");
    SFT2 = await contract.deploy(SFT1.target, userManager.target);
  });

  describe("Deployment", function () {
    it("Should deploy the contract", async function () {
      let theOwner = await SFT2.owner();
      assert(theOwner === owner.address);
    });
  });

  // ::::::::::::: GETTERS ::::::::::::: //
  // Tests de la fonction uri
  describe("URI Functionality", function () {
    beforeEach(async function () {
      // Minting d'un token avant chaque test
      await SFT2.connect(PEPINIERISTE).mint(
        EXPLOITANT_FORESTIER.address,
        tokenId,
        amount,
        cid,
        sft1TokenId,
        df2Hash
      );
    });

    it("should revert for a non-existent token ID", async function () {
      // Utiliser un tokenId qui n'a pas été minté
      const nonExistentTokenId = 999;
      await expect(SFT2.uri(nonExistentTokenId)).to.be.revertedWithCustomError(
        SFT2,
        "QueryForNonexistentToken"
      );
    });

    it("should return the correct URI for a given token ID after minting", async function () {
      const expectedUri = `ipfs://${cid}`;
      const actualUri = await SFT2.uri(tokenId);
      expect(actualUri).to.equal(expectedUri);
    });
  });

  // Test de la fonction getSft1Data
  describe("getSft2Data", function () {
    beforeEach(async function () {
      await SFT2.connect(PEPINIERISTE).mint(
        EXPLOITANT_FORESTIER.address,
        tokenId,
        amount,
        cid,
        sft1TokenId,
        df2Hash
      );
    });

    it("Should revert for a non-existent token ID", async function () {
      // Utiliser un tokenId qui n'a pas été minté
      const nonExistentTokenId = 999;
      await expect(
        SFT2.getSft2Data(nonExistentTokenId)
      ).to.be.revertedWithCustomError(SFT2, "QueryForNonexistentToken");
    });

    it("Should get the Sft2Data", async function () {
      // Appel de getSft2Data pour récupérer les informations
      const sft2 = await SFT2.getSft2Data(tokenId);

      // Vérification des informations
      expect(sft2.uri).to.equal("ipfs://" + cid);
      expect(sft2.sft1TokenId).to.equal(sft1TokenId);
      expect(sft2.df2Hash.toString()).to.equal(
        "0x7465737400000000000000000000000000000000000000000000000000000000"
      );
    });
  });

  // ::::::::::::: MINT ::::::::::::: //
  describe("mint", function () {
    it("Should not authorize a non Admin or non Pépiniériste to mint an SFT", async function () {
      // Mint du token avec l'adresse EXPLOITANT_FORESTIER, ce qui devrait échouer
      await expect(
        SFT2.connect(EXPLOITANT_FORESTIER).mint(
          EXPLOITANT_FORESTIER.address,
          tokenId,
          amount,
          cid,
          sft1TokenId,
          df2Hash
        )
      ).to.be.revertedWithCustomError(SFT2, "UnauthorizedAccess");
    });

    it("Should not authorize to mint to address 0", async function () {
      // Mint du token vers l'adresse 0, ce qui devrait échouer
      await expect(
        SFT2.connect(PEPINIERISTE).mint(
          addressZero,
          tokenId,
          amount,
          cid,
          sft1TokenId,
          df2Hash
        )
      ).to.be.revertedWithCustomError(SFT2, "InvalidAddress");
    });

    it("Should not mint an SFT2 with an amount of 0", async function () {
      // Mint du token avec un montant de 0, ce qui devrait échouer
      await expect(
        SFT2.connect(PEPINIERISTE).mint(
          EXPLOITANT_FORESTIER.address,
          tokenId,
          0,
          cid,
          sft1TokenId,
          df2Hash
        )
      ).to.be.revertedWithCustomError(SFT2, "AmountMustBeGreaterThanZero");
    });

    it("Should not mint an SFT2 with an empty CID", async function () {
      // Mint du token avec un CID vide, ce qui devrait échouer
      await expect(
        SFT2.connect(PEPINIERISTE).mint(
          EXPLOITANT_FORESTIER.address,
          tokenId,
          amount,
          "",
          sft1TokenId,
          df2Hash
        )
      ).to.be.revertedWithCustomError(SFT2, "CIDCannotBeEmpty");
    });

    it("Should not mint an SFT2 with an empty DF2 Hash", async function () {
      // Mint du token avec un DF2 Hash vide, ce qui devrait échouer
      await expect(
        SFT2.connect(PEPINIERISTE).mint(
          EXPLOITANT_FORESTIER.address,
          tokenId,
          amount,
          cid,
          sft1TokenId,
          emptyHash
        )
      ).to.be.revertedWithCustomError(SFT2, "df2HashCannotBeEmpty");
    });

    it("Should not mint an SFT2 with an already used token ID", async function () {
      // Mint du 1er token par le PEPINIERISTE à EXPLOITANT_FORESTIER.
      await SFT2.connect(PEPINIERISTE).mint(
        EXPLOITANT_FORESTIER.address,
        tokenId,
        amount,
        cid,
        sft1TokenId,
        df2Hash
      );

      // Tenter de mint un autre token avec le même ID à EXPLOITANT_FORESTIER, ce qui devrait échouer.
      await expect(
        SFT2.connect(PEPINIERISTE).mint(
          EXPLOITANT_FORESTIER.address,
          tokenId,
          amount,
          cid,
          sft1TokenId,
          df2Hash
        )
      ).to.be.revertedWithCustomError(SFT2, "TokenIdAlreadyUsed");
    });

    it("Should not authorize to mint an SFT2 to an adress that has not been assigned the role of EXPLOITANT_FORESTIER", async function () {
      // Mint du token vers l'adresse ADMIN, ce qui devrait échouer
      await expect(
        SFT2.connect(PEPINIERISTE).mint(
          ADMIN.address,
          tokenId,
          amount,
          cid,
          sft1TokenId,
          df2Hash
        )
      ).to.be.revertedWithCustomError(
        SFT2,
        "HasToBeExploitantForestierToReceiveSFT2"
      );
    });

    it("Should not allow a PEPINIERISTE to mint an SFT2 if the SFT1 does not belong to him", async function () {
      // Mint du token par le PEPINIERISTE avec le sft1TokenId du PEPINIERISTE2, ce qui devrait échouer
      await expect(
        SFT2.connect(PEPINIERISTE).mint(
          EXPLOITANT_FORESTIER.address,
          tokenId,
          amount,
          cid,
          sft1TokenIdPepinieriste2,
          df2Hash
        )
      ).to.be.revertedWithCustomError(SFT2, "SFT1DoesNotBelongToPepinieriste");
    });

    it("Should mint an SFT2 by addres with role PEPINIERISTE", async function () {
      await expect(
        SFT2.connect(PEPINIERISTE).mint(
          EXPLOITANT_FORESTIER.address,
          tokenId,
          amount,
          cid,
          sft1TokenId,
          df2Hash
        )
      )
        .to.emit(SFT2, "Sft2Data")
        .withArgs(tokenId, cid, sft1TokenId, df2Hash);
    });

    it("Should mint an SFT2 by addres with role ADMIN", async function () {
      await expect(
        SFT2.connect(ADMIN).mint(
          EXPLOITANT_FORESTIER.address,
          tokenId,
          amount,
          cid,
          sft1TokenId,
          df2Hash
        )
      )
        .to.emit(SFT2, "Sft2Data")
        .withArgs(tokenId, cid, sft1TokenId, df2Hash);
    });
  });
});
