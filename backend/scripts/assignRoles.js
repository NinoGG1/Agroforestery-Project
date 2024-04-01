const hre = require("hardhat");

async function main() {
  // L'adresse du contrat UserManager déployé
  const userManagerAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

  // Adresses auxquelles vous souhaitez attribuer des rôles
  const marchandGrainier1 = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8";
  const marchandGrainier2 = "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC";
  const pepinieriste1 = "0x90F79bf6EB2c4f870365E785982E1f101E93b906";
  const pepinieriste2 = "0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65";
  const exploitantForestier1 = "0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc";
  const exploitantForestier2 = "0x976EA74026E726554dB657fA54763abd0C3a0aa9";

  // Obtenir le contrat UserManager déployé
  const UserManager = await hre.ethers.getContractFactory("UserManager");
  const userManager = UserManager.attach(userManagerAddress);

  // Assigner le rôle MARCHAND_GRAINIER
  await userManager.assignRole(
    marchandGrainier1,
    await userManager.MARCHAND_GRAINIER()
  );
  await userManager.assignRole(
    marchandGrainier2,
    await userManager.MARCHAND_GRAINIER()
  );

  // Assigner le rôle PEPINIERISTE
  await userManager.assignRole(pepinieriste1, await userManager.PEPINIERISTE());
  await userManager.assignRole(pepinieriste2, await userManager.PEPINIERISTE());

  // Assigner le rôle EXPLOITANT_FORESTIER
  await userManager.assignRole(
    exploitantForestier1,
    await userManager.EXPLOITANT_FORESTIER()
  );
  await userManager.assignRole(
    exploitantForestier2,
    await userManager.EXPLOITANT_FORESTIER()
  );

  console.log("Rôles attribués avec succès");
}

// Exécuter le script et gérer les erreurs
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
