const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("UserManager", function () {
  let userManager;
  let deployer, user1, user2;

  beforeEach(async function () {
    // Récupération des comptes de test
    [deployer, user1, user2] = await ethers.getSigners();

    // Déploiement du contrat UserManager
    const UserManager = await ethers.getContractFactory("UserManager");
    userManager = await UserManager.deploy();
  });

  describe("Deployment", function () {
    it("Deployer should have the ADMIN role", async function () {
      expect(
        await userManager.hasRole(await userManager.ADMIN(), deployer.address)
      ).to.be.true;
    });
  });

  describe("assignRole", function () {
    it("Should not allow unauthorized users to assign roles", async function () {
      await expect(
        userManager
          .connect(user1)
          .assignRole(user2.address, await userManager.PEPINIERISTE())
      ).to.be.revertedWithCustomError(
        userManager,
        "AccessControlUnauthorizedAccount"
      );
    });

    it("Should allow ADMIN to assign roles", async function () {
      await userManager.assignRole(
        user1.address,
        await userManager.MARCHAND_GRAINIER()
      );
      expect(
        await userManager.hasRole(
          await userManager.MARCHAND_GRAINIER(),
          user1.address
        )
      ).to.be.true;
    });
  });

  describe("revokeUserRole", function () {
    it("Should not allow unauthorized users to revoke roles", async function () {
      await expect(
        userManager
          .connect(user1)
          .revokeUserRole(user2.address, await userManager.PEPINIERISTE())
      ).to.be.revertedWithCustomError(
        userManager,
        "AccessControlUnauthorizedAccount"
      );
    });

    it("should allow ADMIN to revoke roles", async function () {
      await userManager.assignRole(
        user1.address,
        await userManager.MARCHAND_GRAINIER()
      );
      await userManager.revokeUserRole(
        user1.address,
        await userManager.MARCHAND_GRAINIER()
      );
      expect(
        await userManager.hasRole(
          await userManager.MARCHAND_GRAINIER(),
          user1.address
        )
      ).to.be.false;
    });
  });
});
