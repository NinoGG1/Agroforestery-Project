// SPDX-License-Identifier: MIT
pragma solidity 0.8.23;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract ArbreTracking is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _treeIds;

    // Mapping de l'ID d'arbre à l'ID du lot de graines ERC-1155
    mapping(uint256 => uint256) public treeToSeedLot;

    constructor() ERC721("Arbre", "ARBRE") {}

    // Fonction modifiée pour inclure l'association avec le lot de graines
    function createTree(uint256 seedLotId, string memory tokenURI) public {
        _treeIds.increment();
        uint256 newTreeId = _treeIds.current();
        _mint(msg.sender, newTreeId);
        _setTokenURI(newTreeId, tokenURI);

        // Associer l'arbre au lot de graines d'origine
        treeToSeedLot[newTreeId] = seedLotId;
    }

    // Fonction pour récupérer l'ID du lot de graines à partir de l'ID de l'arbre
    function getSeedLotId(uint256 treeId) public view returns (uint256) {
        require(_exists(treeId), "ArbreTracking: L'ID de l'arbre n'existe pas.");
        return treeToSeedLot[treeId];
    }
}
