// SPDX-License-Identifier: MIT
pragma solidity 0.8.23;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

//Errors
error UriAlreadyUsed();

contract SeedSFT is ERC1155, Ownable {
    using Strings for uint256;

    string private _uri;

    // Structure pour stocker les données Seed  
    struct Seed {
        uint CmHash;
        uint Df1Hash;
    }

    // Mapping pour suivre les données Seed par ID de token
    mapping(uint256 => Seed) public seedData;

    constructor() ERC1155("") Ownable(msg.sender) {}

    // Evénement pour suivre les données Seed
    event SeedData(uint256 indexed tokenId, uint cmHash, uint df1Hash);

// ************************ Mint ************************

    function mint(address account, uint256 id, uint256 amount, string memory tokenURI, uint cmHash, uint df1Hash) public onlyOwner {
        
        // Mint le token
        _mint(account, id, amount, "");
        
        // Associer les données Seed avec l'ID de token
        seedData[id] = Seed(cmHash, df1Hash);

        // Définir l'URI pour ce token
        _setURI(tokenURI);

        // Émettre l'événement avec les données Seed
        emit SeedData(id, cmHash, df1Hash);
    }

// ************************ Getters ************************

    function getSeedData(uint256 tokenId) public view returns (Seed memory) {
        return seedData[tokenId];
    }
}
