// SPDX-License-Identifier: MIT
pragma solidity 0.8.23;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

//Errors
error TokenIdAlreadyUsed();

contract SFT2 is ERC1155, Ownable {
    using Strings for uint256;

    string private _uri;

    // Structure pour stocker les données sft2  
    struct sft2 {
        uint256 Sft1TokenId;
        string Df2Hash;
    }

    // Mapping pour suivre les données sft2 par ID de token
    mapping(uint256 => sft2) public sft2Data;

    constructor() ERC1155("") Ownable(msg.sender) {}

    // Evénement pour suivre les données sft2
    event Sft2Data(uint256 indexed tokenId, string cid, string cmHash, string df1Hash);

// ************************ Mint ************************

    function mint(address account, uint tokenId, uint256 amount, string memory cid,string memory cmHash, string memory df1Hash) public onlyOwner {
        
        // Mint le token
        _mint(account, tokenId, amount, "");
        
        // Associer les données Sft2 avec l'ID de token
        sft2Data[tokenId] = sft2(cmHash, df1Hash);

        // Définir l'URI pour ce token
        _setURI(cid);

        // Émettre l'événement avec les données sft2
        emit Sft2Data(tokenId, cid, cmHash, df1Hash);
    }

// ************************ Getters ************************

    function getSft2Data(uint tokenId) public view returns (sft2 memory) {
        return sft2Data[tokenId];
    }
}
