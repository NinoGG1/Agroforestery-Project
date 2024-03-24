// SPDX-License-Identifier: MIT
pragma solidity 0.8.23;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract GraineTracking is ERC1155, Ownable {
    // Utilisation d'un compteur pour les IDs de lot de graines
    uint256 private _currentSeedLotId = 0;

    // Mapping pour stocker les métadonnées des lots de graines
    mapping(uint256 => string) private seedLotMetadata;

    constructor() ERC1155("https://example.com/api/item/{id}.json") {}

    // Fonction pour créer un nouveau lot de graines
    function createSeedLot(uint256 initialSupply, string memory metadata) public onlyOwner {
        _currentSeedLotId += 1; // Incrémenter l'ID pour chaque nouveau lot
        uint256 newSeedLotId = _currentSeedLotId;

        _mint(msg.sender, newSeedLotId, initialSupply, "");
        seedLotMetadata[newSeedLotId] = metadata; // Stocker les métadonnées du lot
    }

    // Fonction pour mettre à jour les métadonnées d'un lot de graines
    function updateSeedLotMetadata(uint256 seedLotId, string memory newMetadata) public onlyOwner {
        require(bytes(seedLotMetadata[seedLotId]).length != 0, "Le lot de graines n'existe pas.");
        seedLotMetadata[seedLotId] = newMetadata;
    }

    // Fonction pour obtenir les métadonnées d'un lot de graines
    function getSeedLotMetadata(uint256 seedLotId) public view returns (string memory) {
        require(bytes(seedLotMetadata[seedLotId]).length != 0, "Le lot de graines n'existe pas.");
        return seedLotMetadata[seedLotId];
    }

    // Fonction pour transférer des lots de graines entre parties
    function transferSeedLot(address from, address to, uint256 seedLotId, uint256 amount) public {
        safeTransferFrom(from, to, seedLotId, amount, "");
    }
}
