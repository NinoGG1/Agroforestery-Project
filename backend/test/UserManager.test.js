const { ethers } = require("hardhat");
const { expect, assert } = require("chai");

describe("Test UserManager Contract", function () {
  let UserManager;
  let owner, ADMIN, MARCHAND_GRAINIER, PEPINIERISTE;

  beforeEach(async function () {
    [owner, ADMIN, MARCHAND_GRAINIER, PEPINIERISTE] = await ethers.getSigners();
    const UserManagercontract = await ethers.getContractFactory("UserManager");
    UserManager = await UserManagercontract.deploy();
  });

  describe("Deployment", function () {
    it("Should deploy the contract", async function () {
      let theOwner = await UserManager.owner();
      assert(theOwner === owner.address);
    });
  });

  // describe("assignRole", function () {
  //   it("Should allow ADMIN to assign roles", async function () {
  //     await userManager.assignRole(
  //       marchandGrainier.address,
  //       userManager.MARCHAND_GRAINIER()
  //     );
  //     expect(
  //       await userManager.hasRole(
  //         userManager.MARCHAND_GRAINIER(),
  //         marchandGrainier.address
  //       )
  //     ).to.be.true;
  //   });

  //   it("Should prevent non-ADMINs from assigning roles", async function () {
  //     await expect(
  //       userManager
  //         .connect(pepinieriste)
  //         .assignRole(otherAccount.address, userManager.MARCHAND_GRAINIER())
  //     )
  //       .to.be.revertedWithCustomError(userManager, "Unauthorized")
  //       .withArgs("Seul l'admin peut effectuer cette action");
  //   });
  // });

  // describe("revokeUserRole", function () {
  //   it("Should allow ADMIN to revoke roles", async function () {
  //     await userManager.assignRole(
  //       marchandGrainier.address,
  //       userManager.MARCHAND_GRAINIER()
  //     );
  //     await userManager.revokeUserRole(
  //       marchandGrainier.address,
  //       userManager.MARCHAND_GRAINIER()
  //     );
  //     expect(
  //       await userManager.hasRole(
  //         userManager.MARCHAND_GRAINIER(),
  //         marchandGrainier.address
  //       )
  //     ).to.be.false;
  //   });

  //   it("Should prevent non-ADMINs from revoking roles", async function () {
  //     await userManager.assignRole(
  //       marchandGrainier.address,
  //       userManager.MARCHAND_GRAINIER()
  //     );
  //     await expect(
  //       userManager
  //         .connect(pepinieriste)
  //         .revokeUserRole(
  //           marchandGrainier.address,
  //           userManager.MARCHAND_GRAINIER()
  //         )
  //     )
  //       .to.be.revertedWithCustomError(userManager, "Unauthorized")
  //       .withArgs("Seul l'admin peut effectuer cette action");
  //   });
  // });

  // describe("renounceRole", function () {
  //   it("Should allow users to renounce their roles", async function () {
  //     await userManager.assignRole(
  //       pepinieriste.address,
  //       userManager.PEPINIERISTE()
  //     );
  //     await userManager
  //       .connect(pepinieriste)
  //       .renounceRole(pepinieriste.address, userManager.PEPINIERISTE());
  //     expect(
  //       await userManager.hasRole(
  //         userManager.PEPINIERISTE(),
  //         pepinieriste.address
  //       )
  //     ).to.be.false;
  //   });

  //   it("Should prevent users from renouncing roles they do not own", async function () {
  //     await expect(
  //       userManager
  //         .connect(marchandGrainier)
  //         .renounceRole(pepinieriste.address, userManager.PEPINIERISTE())
  //     ).to.be.revertedWith("InvalidRoleRenounce");
  //   });
  // });
});
