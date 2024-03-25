// SPDX-License-Identifier: MIT
pragma solidity 0.8.23;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";

contract PlantationTracking is ERC721URIStorage {
    // Adresse du contrat SeedTracking ERC-1155
    address public seedTrackingAddress;

    // Mapping de l'ID d'arbre à l'ID du lot de graines ERC-1155
    mapping(uint256 => uint256) public treeToSeedBatch;

    constructor(address _seedTrackingAddress) ERC721("Tree", "TREE") {
        seedTrackingAddress = _seedTrackingAddress;
    }

    function registerTree(uint256 _treeId, uint256 _seedBatchId, string memory _tokenURI) public {
        // Crée un nouveau token ERC-721 pour l'arbre
        _mint(msg.sender, _treeId);
        _setTokenURI(_treeId, _tokenURI);

        // Associe l'arbre au lot de graines ERC-1155
        treeToSeedBatch[_treeId] = _seedBatchId;
    }

    function getSeedBatchId(uint256 _treeId) public view returns (uint256) {
        return treeToSeedBatch[_treeId];
    }
}
