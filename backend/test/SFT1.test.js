const { ethers } = require("hardhat");
const { expect, assert } = require("chai");

describe("Test SFT1 Contract", function () {
  let SFT1;
  let owner, ADMIN, MARCHAND_GRAINIER, PEPINIERISTE;

  const tokenId = 1;
  const amount = 100;
  const cid = "QmRbU5hfL8UCP9LFNqQzGMgUrYG7WL58HNDMBVpcy5ZEZy";
  const cmHash =
    "0x7465737400000000000000000000000000000000000000000000000000000000";
  const df1Hash =
    "0x7465737400000000000000000000000000000000000000000000000000000000";
  const addressZero = "0x0000000000000000000000000000000000000000"; // Adresse 0
  const emptyHash =
    "0x0000000000000000000000000000000000000000000000000000000000000000"; // Hash vide pour bytes32

  beforeEach(async function () {
    [owner, ADMIN, MARCHAND_GRAINIER, PEPINIERISTE] = await ethers.getSigners();
    const contract = await ethers.getContractFactory("SFT1");
    SFT1 = await contract.deploy();

    // Assignation des rôles après le déploiement
    await SFT1.assignRole(ADMIN.address, await SFT1.ADMIN());
    await SFT1.assignRole(
      MARCHAND_GRAINIER.address,
      await SFT1.MARCHAND_GRAINIER()
    );
    await SFT1.assignRole(PEPINIERISTE.address, await SFT1.PEPINIERISTE());
  });

  describe("Deployment", function () {
    it("Should deploy the contract", async function () {
      let theOwner = await SFT1.owner();
      assert(theOwner === owner.address);
    });
  });

  // ::::::::::::: GETTERS ::::::::::::: //

  // Tests de la fonction uri
  describe("URI Functionality", function () {
    beforeEach(async function () {
      // Minting d'un token avant chaque test
      await SFT1.connect(MARCHAND_GRAINIER).mint(
        PEPINIERISTE.address,
        tokenId,
        amount,
        cid,
        cmHash,
        df1Hash
      );
    });

    it("should revert for a non-existent token ID", async function () {
      // Utiliser un tokenId qui n'a pas été minté
      const nonExistentTokenId = 999; // Assurez-vous que ce tokenId n'a jamais été minté dans vos tests
      await expect(SFT1.uri(nonExistentTokenId)).to.be.revertedWithCustomError(
        SFT1,
        "QueryForNonexistentToken"
      );
    });

    it("should return the correct URI for a given token ID after minting", async function () {
      const expectedUri = `ipfs://${cid}`;
      const actualUri = await SFT1.uri(tokenId);
      expect(actualUri).to.equal(expectedUri);
    });
  });

  // Test de la fonction getSft1Data
  describe("getSft1Data", function () {
    beforeEach(async function () {
      await SFT1.connect(MARCHAND_GRAINIER).mint(
        PEPINIERISTE.address,
        tokenId,
        amount,
        cid,
        cmHash,
        df1Hash
      );
    });

    it("Should revert for a non-existent token ID", async function () {
      // Utiliser un tokenId qui n'a pas été minté
      const nonExistentTokenId = 999;
      await expect(
        SFT1.getSft1Data(nonExistentTokenId)
      ).to.be.revertedWithCustomError(SFT1, "QueryForNonexistentToken");
    });

    it("Should get the Sft1Data", async function () {
      // Appel de getSft1Data pour récupérer les informations
      const sft1 = await SFT1.getSft1Data(tokenId);

      // Vérification des informations
      expect(sft1.uri).to.equal("ipfs://" + cid);
      expect(sft1.cmHash.toString()).to.equal(
        "0x7465737400000000000000000000000000000000000000000000000000000000"
      );
      expect(sft1.df1Hash.toString()).to.equal(
        "0x7465737400000000000000000000000000000000000000000000000000000000"
      );
    });
  });

  // ::::::::::::: SUPPORT INTERFACE ::::::::::::: //
  describe("Interface Support", function () {
    it("should not support a random interface", async function () {
      // Utiliser un identifiant d'interface aléatoire
      expect(await SFT1.supportsInterface("0x12345678")).to.be.false;
    });
    it("should supports ERC1155 interface", async function () {
      // Remplacer par l'identifiant d'interface ERC1155
      expect(await SFT1.supportsInterface("0xd9b67a26")).to.be.true;
    });

    it("should supports AccessControl interface", async function () {
      // Remplacer par l'identifiant d'interface AccessControl
      expect(await SFT1.supportsInterface("0x7965db0b")).to.be.true;
    });
  });

  // ::::::::::::: MINT ::::::::::::: //
  describe("mint", function () {
    it("Should not authorize a non Admin or non Marchand_Grainier to mint an SFT", async function () {
      // Mint du token avec l'adresse PEPINIERISTE, ce qui devrait échouer
      await expect(
        SFT1.connect(PEPINIERISTE).mint(
          PEPINIERISTE.address,
          tokenId,
          amount,
          cid,
          cmHash,
          df1Hash
        )
      ).to.be.revertedWithCustomError(SFT1, "UseManagerUnauthorizedAccount");
    });

    it("Should not authorize to mint to address 0", async function () {
      // Mint du token vers l'adresse 0, ce qui devrait échouer
      await expect(
        SFT1.connect(MARCHAND_GRAINIER).mint(
          addressZero,
          tokenId,
          amount,
          cid,
          cmHash,
          df1Hash
        )
      ).to.be.revertedWithCustomError(SFT1, "InvalidAddress");
    });

    it("Should not mint an SFT1 with an amount of 0", async function () {
      // Mint du token avec un montant de 0, ce qui devrait échouer
      await expect(
        SFT1.connect(MARCHAND_GRAINIER).mint(
          PEPINIERISTE.address,
          tokenId,
          0,
          cid,
          cmHash,
          df1Hash
        )
      ).to.be.revertedWithCustomError(SFT1, "AmountMustBeGreaterThanZero");
    });

    it("Should not mint an SFT1 with an empty CID", async function () {
      // Mint du token avec un CID vide, ce qui devrait échouer
      await expect(
        SFT1.connect(MARCHAND_GRAINIER).mint(
          PEPINIERISTE.address,
          tokenId,
          amount,
          "",
          cmHash,
          df1Hash
        )
      ).to.be.revertedWithCustomError(SFT1, "CIDCannotBeEmpty");
    });

    it("Should not mint an SFT1 with an empty CM Hash", async function () {
      // Mint du token avec un CM Hash vide, ce qui devrait échouer
      await expect(
        SFT1.connect(MARCHAND_GRAINIER).mint(
          PEPINIERISTE.address,
          tokenId,
          amount,
          cid,
          emptyHash,
          df1Hash
        )
      ).to.be.revertedWithCustomError(SFT1, "cmHashCannotBeEmpty");
    });

    it("Should not mint an SFT1 with an empty DF1 Hash", async function () {
      // Mint du token avec un DF1 Hash vide, ce qui devrait échouer
      await expect(
        SFT1.connect(MARCHAND_GRAINIER).mint(
          PEPINIERISTE.address,
          tokenId,
          amount,
          cid,
          cmHash,
          emptyHash
        )
      ).to.be.revertedWithCustomError(SFT1, "df1HashCannotBeEmpty");
    });

    it("Should not mint an SFT1 with an already used token ID", async function () {
      // Mint du 1er token par le owner à addr1.
      await SFT1.connect(MARCHAND_GRAINIER).mint(
        PEPINIERISTE.address,
        tokenId,
        amount,
        cid,
        cmHash,
        df1Hash
      );

      // Tenter de mint un autre token avec le même ID à addr2, ce qui devrait échouer.
      await expect(
        SFT1.connect(MARCHAND_GRAINIER).mint(
          PEPINIERISTE.address,
          tokenId,
          amount,
          cid,
          cmHash,
          df1Hash
        )
      ).to.be.revertedWithCustomError(SFT1, "TokenIdAlreadyUsed");
    });

    it("Sould not authorize to mint an SFT1 to an adress that has not been assigned the role of PEPINIERISTE", async function () {
      // Mint du token avec l'adresse ADMIN, ce qui devrait échouer
      await expect(
        SFT1.connect(MARCHAND_GRAINIER).mint(
          ADMIN.address,
          tokenId,
          amount,
          cid,
          cmHash,
          df1Hash
        )
      ).to.be.revertedWithCustomError(SFT1, "HasToBePepinieristeToReceiveSFT1");
    });

    it("Sould mint an SFT1 by addres with role MARCHAND_GRAINIER", async function () {
      await expect(
        SFT1.connect(MARCHAND_GRAINIER).mint(
          PEPINIERISTE.address,
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

    it("Should mint an SFT1 by addres with role ADMIN", async function () {
      await expect(
        SFT1.connect(ADMIN).mint(
          PEPINIERISTE.address,
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
});
