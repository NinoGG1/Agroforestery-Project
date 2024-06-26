// SPDX-License-Identifier: MIT
pragma solidity 0.8.23;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./IUserManager.sol";


// ::::::::::::::::::::: Custom errors :::::::::::::::::::::
error InvalidAddress();
error AmountMustBeGreaterThanZero();
error CIDCannotBeEmpty();
error cmHashCannotBeEmpty();
error df1HashCannotBeEmpty();
error TokenIdAlreadyUsed();
error QueryForNonexistentToken();
error HasToBePepinieristeToReceiveSFT1();
error UnauthorizedAccess(string message);

/**
 * @title SFT1
 * @dev Contract for SFT1 tokens
 * @notice SFT1 is a contract for minting ERC-1155 tokens with metadata stored on IPFS
 */
contract SFT1 is ERC1155, Ownable {
    IUserManager public userManager;

    // Structure pour stocker les données sft1  
    struct sft1 {
        string uri;
        bytes32 cmHash;
        bytes32 df1Hash;
    }

    // Mapping pour suivre les données sft1 par ID de token
    mapping(uint64 => sft1) public sft1Data;

    // Evénement pour suivre les données sft1
    /**
     * @dev Emitted when SFT1 data is set
     * @param tokenId The ID of the token
     * @param cid The CID of the token
     * @param cmHash The hash of the "Certificat Maitre"
     * @param df1Hash The hash of the "Dcoument du fournisseur 1"
     */
    event Sft1Data(uint64 indexed tokenId, string cid, bytes32 cmHash, bytes32 df1Hash);

    // Constructeur
    constructor(address _userManagerAddress) ERC1155("") Ownable(msg.sender) {
    userManager = IUserManager(_userManagerAddress);
}

    // ::::::::::::::::::::: Modifier :::::::::::::::::::::
    modifier onlyAdminOrMarchandGrainer {
        bool isAdmin = userManager.hasRole(keccak256("ADMIN"), msg.sender);
        bool isMarchandGrainer = userManager.hasRole(keccak256("MARCHAND_GRAINIER"), msg.sender);

        if (!isAdmin && !isMarchandGrainer) {
            revert UnauthorizedAccess("Only admin or marchand grainer can perform this action");
        }
        _;
    }


    // ::::::::::::::::::::: GETTERS :::::::::::::::::::::
    // Surcharge de la fonction uri pour retourner l'URI basée sur le CID correspondant au tokenId, uint64 convertit en uint256 pour correspondre à l'interface ERC-1155
    /**
     * @dev Returns the URI for a token ID
     * @param tokenId The ID of the token
     * @return The URI for the token
     * @notice Return the URI for the token ID, revert if the token ID does not exist
     */
    function uri(uint256 tokenId) override public view returns (string memory) {
        if (bytes(sft1Data[uint64(tokenId)].uri).length == 0) revert QueryForNonexistentToken();
        return sft1Data[uint64(tokenId)].uri;
    }

    // Fonction pour obtenir les données sft1 par ID de token
    /**
     * @dev Get the SFT1 data for a token ID
     * @param tokenId The ID of the token
     * @return The SFT1 data for the token ID
     * @notice Get the SFT1 data for the token ID, revert if the token ID does not exist
     */
    function getSft1Data(uint64 tokenId) public view returns (sft1 memory) {
        if (bytes(sft1Data[uint64(tokenId)].uri).length == 0) revert QueryForNonexistentToken();
        return sft1Data[tokenId];
    }  

    // ::::::::::::::::::::: MINT :::::::::::::::::::::
    // Fonction pour mint un token SFT1
    /**
     * @dev Mint a new SFT1 token
     * @param account The address to mint the token to
     * @param tokenId The ID of the token
     * @param amount The amount of the token to mint
     * @param cid The CID of the token
     * @param cmHash The hash of the "Certificat Maitre"
     * @param df1Hash The hash of the "Dcoument du fournisseur 1"
     * @notice Mint a new SFT1 token with the URI constructed from the CID, and store the data in the sft1Data mapping, and emit the Sft1Data event
     * @notice Only the "Marchand Grainier", and the "Admin" can call this function
     */
    function mint(address account, uint64 tokenId, uint32 amount, string memory cid, bytes32 cmHash, bytes32 df1Hash) external onlyAdminOrMarchandGrainer {

        // Vérifications
        if (account == address(0)) revert InvalidAddress();
        if (amount <= 0) revert AmountMustBeGreaterThanZero();
        if (bytes(cid).length == 0) revert CIDCannotBeEmpty();
        if (cmHash == bytes32(0)) revert cmHashCannotBeEmpty();
        if (df1Hash == bytes32(0)) revert df1HashCannotBeEmpty();
        if (bytes(sft1Data[tokenId].uri).length != 0)
        revert TokenIdAlreadyUsed();
        // Utilisation de userManager pour vérifier si l'adresse destinataire a le rôle PEPINIERISTE
        bytes32 rolePepinieriste = keccak256("PEPINIERISTE");
        if (!userManager.hasRole(rolePepinieriste, account)) revert HasToBePepinieristeToReceiveSFT1();

        // Construire l'URI à partir du CID
        string memory tokenUri = string(abi.encodePacked("ipfs://", cid));
        
        // Mint le token
        _mint(account, tokenId, amount, "");
        
        // Associer les données Sft1, y compris l'URI, avec l'ID de token
        sft1Data[tokenId] = sft1(tokenUri, cmHash, df1Hash);

        // Émettre l'événement avec les données sft1
        emit Sft1Data(tokenId, cid, cmHash, df1Hash);
    }

 
}
