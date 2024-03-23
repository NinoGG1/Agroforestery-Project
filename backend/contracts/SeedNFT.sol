// SPDX-License-Identifier: MIT
pragma solidity 0.8.23;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract SeedNFT is ERC1155, Ownable {
    uint256 private _currentTokenID = 0;

    // Structure pour stocker les informations des tokens
    struct TokenData {
        string masterCertificateHash; // Hash du certificat maître
        string df1Hash; // Hash DF1
    }

    // Mapping de l'ID du token à ses données
    mapping(uint256 => TokenData) public tokenData;

    constructor() ERC1155("https://ipfs://bafkreib36xiiiot35oxpoidw6yjzghkwy2ob33sow6bubn2ft5o43uerdu/{id}.json") {}

    // Fonction pour créer un nouveau token
    function mint(
        address to, 
        uint256 amount, 
        string memory masterCertificateHash, 
        string memory df1Hash
    ) public onlyOwner {
        uint256 newTokenID = _currentTokenID++;
        _mint(to, newTokenID, amount, "");
        
        tokenData[newTokenID] = TokenData(masterCertificateHash, df1Hash);
    }

    // Fonction pour récupérer les données du token
    function getTokenData(uint256 tokenId) public view returns (TokenData memory) {
        require(bytes(tokenData[tokenId].masterCertificateHash).length > 0, "Token does not exist");
        return tokenData[tokenId];
    }

    // Override de uri pour retourner les métadonnées du NFT
    function uri(uint256 tokenId) public view override returns (string memory) {
        require(bytes(tokenData[tokenId].masterCertificateHash).length > 0, "Token does not exist");
        
        TokenData memory data = tokenData[tokenId];
        // Vous pouvez ici construire dynamiquement l'URI de métadonnées ou pointer vers un emplacement spécifique
        // Cette URL peut pointer vers un service qui retourne les métadonnées JSON du token
        return string(abi.encodePacked(super.uri(tokenId), tokenId.toString()));
    }
}
