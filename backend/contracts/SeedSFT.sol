// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract SeedSFT is ERC1155, Ownable {
    using Strings for uint256;

    // Structure pour stocker les données Seed  
    struct Seed {
        uint CmHash;
        uint Df1Hash;
    }

    // Mapping pour suivre les données Seed par ID de token
    mapping(uint256 => Seed) public seedData;
    // Mapping pour suivre si l'URI d'un token a déjà été défini
    mapping(uint256 => bool) private _uriHasBeenSet;

    constructor(address initialOwner) ERC1155("") Ownable(initialOwner) {}

    // Evénement pour suivre les données Seed
    event SeedData(uint256 indexed tokenId, uint cmHash, uint df1Hash);

    // Modifier la fonction mint pour inclure les données Seed
    function mint(address account, uint256 id, uint256 amount, string memory tokenURI, uint cmHash, uint df1Hash) public onlyOwner {
        require(!_uriHasBeenSet[id], "MyERC1155: URI already set for this token");
        
        // Mint le token
        _mint(account, id, amount, "");
        
        // Associer les données Seed avec l'ID de token
        seedData[id] = Seed(cmHash, df1Hash);

        // Définir l'URI pour ce token
        _setURI(tokenURI);

        // Marquer l'URI comme défini
        _uriHasBeenSet[id] = true;

        // Émettre l'événement avec les données Seed
        emit SeedData(id, cmHash, df1Hash);
    }
    
    // Surcharge de la fonction uri pour inclure la logique de récupération de l'URI spécifique
    function uri(uint256 tokenId) override public view returns (string memory) {
        require(_uriHasBeenSet[tokenId], "MyERC1155: URI not set yet.");

        return string(abi.encodePacked(super.uri(tokenId), tokenId.toString()));
    }
}
