// SPDX-License-Identifier: MIT
pragma solidity 0.8.23;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./IUserManager.sol";
import "./ISFT1.sol";


// ::::::::::::::::::::: Custom errors :::::::::::::::::::::
error InvalidAddress();
error AmountMustBeGreaterThanZero();
error CIDCannotBeEmpty();
error cmHashCannotBeEmpty();
error df2HashCannotBeEmpty();
error TokenIdAlreadyUsed();
error QueryForNonexistentToken();
error UseManagerUnauthorizedAccount();
error HasToBeExploitantForestierToReceiveSFT2();
error SFT1DoesNotBelongToPepinieriste();
error UnauthorizedAccess(string message);

/**
 * @title SFT2
 * @dev Contract for SFT2 tokens
 * @notice SFT2 is a contract for minting ERC-1155 tokens with metadata stored on IPFS
 */
contract SFT2 is ERC1155, Ownable {
    ISFT1 public sft1Contract;
    IUserManager public userManager;

    // Structure pour stocker les données sft2  
    struct sft2 {
        string uri;
        uint64 sft1TokenId;
        bytes32 df2Hash;
    }

    // Mapping pour suivre les données sft2 par ID de token
    mapping(uint64 => sft2) public sft2Data;

    // Evénement pour suivre les données sft2
    /**
     * @dev Emitted when SFT2 data is set
     * @param tokenId The ID of the token
     * @param cid The CID of the token
     * @param sft1TokenId The ID of the SFT1 token
     * @param df2Hash The hash of the document du fournisseur 2
     */
    event Sft2Data(uint64 indexed tokenId, string cid, uint64 sft1TokenId, bytes32 df2Hash);

    // Constructeur
    constructor(address _sft1Address, address _userManagerAddress) ERC1155("") Ownable(msg.sender) {
        sft1Contract = ISFT1(_sft1Address);
        userManager = IUserManager(_userManagerAddress);
    }

    // ::::::::::::::::::::: Modifier :::::::::::::::::::::

    modifier onlyPepinieriste {
        bool isPepinieriste = userManager.hasRole(keccak256("PEPINIERISTE"), msg.sender);

        if (!isPepinieriste) {
            revert UnauthorizedAccess("Only pepninieriste can perform this action");
        }
        _;
    }

    // ::::::::::::::::::::: Getters :::::::::::::::::::::
    // Surcharge de la fonction uri pour retourner l'URI basée sur le CID correspondant au tokenId, uint64 convertit en uint256 pour correspondre à l'interface ERC-1155
    /**
     * @dev Returns the URI for a token ID
     * @param tokenId The ID of the token
     * @return URI for the token
     * @notice Return the URI for the token ID, revert if the token ID does not exist
     */
    function uri(uint256 tokenId) override public view returns (string memory) {
        if (bytes(sft2Data[uint64(tokenId)].uri).length == 0) revert QueryForNonexistentToken();
        return sft2Data[uint64(tokenId)].uri;
    }

    // Fonction pour obtenir les données sft2 par ID de token
    /**
     * @dev Get the SFT2 data for a token ID, revert if the token ID does not exist
     * @param tokenId The ID of the token
     * @return The SFT2 data for the token ID
     */
    function getSft2Data(uint64 tokenId) public view returns (sft2 memory) {
        if (bytes(sft2Data[uint64(tokenId)].uri).length == 0) revert QueryForNonexistentToken();
        return sft2Data[tokenId];
    }

    // ::::::::::::::::::::: MINT :::::::::::::::::::::
    // Fonction pour mint un token SFT2
    /**
     * @dev Mint a new SFT2 token
     * @param account The address to mint the token to
     * @param tokenId The ID of the token
     * @param amount The amount of the token to mint
     * @param cid The CID of the token
     * @param sft1TokenId The ID of the SFT1 token
     * @param df2Hash The hash of the "Document fournisseur 2"
     * @notice Mint a new SFT2 token with the given CID and associate it with the given SFT1 token ID
     */
    function mint(address account, uint64 tokenId, uint32 amount, string memory cid, uint64 sft1TokenId, bytes32 df2Hash) public onlyPepinieriste() {
        // Vérifier si le pepinieriste est le propriétaire du token SFT1
        if (sft1Contract.balanceOf(msg.sender, sft1TokenId) <= 0) {
            revert SFT1DoesNotBelongToPepinieriste();
        }

        if (account == address(0)) revert InvalidAddress();
        if (amount <= 0) revert AmountMustBeGreaterThanZero();
        if (bytes(cid).length == 0) revert CIDCannotBeEmpty();
        if (df2Hash == bytes32(0)) revert df2HashCannotBeEmpty();
        if (bytes(sft2Data[tokenId].uri).length != 0) revert TokenIdAlreadyUsed();
        // Utilisation de userManager pour vérifier si l'adresse destinataire a le rôle EXPLOITANT_FORESTIER
        bytes32 roleExploitantForestier = keccak256("EXPLOITANT_FORESTIER");
        if (!userManager.hasRole(roleExploitantForestier, account)) revert HasToBeExploitantForestierToReceiveSFT2();

        // Construire l'URI à partir du CID
        string memory tokenUri = string(abi.encodePacked("ipfs://", cid));
        
        // Mint le token
        _mint(account, tokenId, amount, "");
        
        // Associer les données Sft2, y compris l'URI, avec l'ID de token
        sft2Data[tokenId] = sft2(tokenUri, sft1TokenId, df2Hash);

        // Émettre l'événement avec les données sft2
        emit Sft2Data(tokenId, cid, sft1TokenId, df2Hash);
    }

 
}
