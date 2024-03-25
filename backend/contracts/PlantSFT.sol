// SPDX-License-Identifier: MIT
pragma solidity 0.8.23;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

//Errors
error UriAlreadyUsed();

contract PlantSFT is ERC1155, Ownable {
    using Strings for uint256;

    string private _uri;

    // Structure pour stocker les données Seed  
    struct plant {
        string seedSFT_Uri;
        uint df2Hash;
    }

    // Mapping pour suivre les données Plant par ID de token
    mapping(uint256 => plant) public plantData;

    constructor() ERC1155("") Ownable(msg.sender) {}

    // Evénement pour suivre les données Seed
    event PlantData(uint256 indexed tokenId, string seedSFT_Uri, uint df2Hash);

// ************************ Mint ************************

    function mint(address account, uint256 id, uint256 amount, string memory tokenURI, string memory seedSFT_Uri, uint df2Hash) public onlyOwner {
        
        // Mint le token
        _mint(account, id, amount, "");
        
        // Associer les données Seed avec l'ID de token
        plantData[id] = plant(seedSFT_Uri, df2Hash);

        // Définir l'URI pour ce token
        _setURI(tokenURI);

        // Émettre l'événement avec les données Seed
        emit PlantData(id, seedSFT_Uri, df2Hash);
    }

// ************************ Getters ************************

    function getPlantData(uint tokenId) public view returns (plant memory) {
        return plantData[tokenId];
    }
}
