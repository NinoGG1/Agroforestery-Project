// SPDX-License-Identifier: MIT
pragma solidity 0.8.23;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./IUserManager.sol";
import "./ISFT2.sol";

// ::::::::::::::::::::: Custom errors :::::::::::::::::::::
error UnauthorizedAccess(string message);
error CIDCannotBeEmpty();
error OnlySFT2OwnerCanMint();
error SFT2TokenNotFound();
error SFT2DoesNotBelongToExploitantForestier();
error TokenIdAlreadyUsed();

/**
 * @title NFT3
 * @dev Contract for NFT3 tokens representing planted trees
 * @notice NFT3 is a contract for minting ERC-721 tokens with metadata stored on IPFS for each planted tree
 */
contract NFT3 is ERC721,ERC721URIStorage, Ownable {
    IUserManager public userManager;
    ISFT2 public sft2Contract;

    mapping(uint64 => uint64) public sft2TokenIdAssociated;

    event NFT3Minted(uint64 indexed tokenId, uint64 indexed sft2TokenId, string cid);

    constructor(address _userManagerAddress, address _sft2Address) ERC721("TreeTrackerNFT3", "NFT3") Ownable(msg.sender) {
        userManager = IUserManager(_userManagerAddress);
        sft2Contract = ISFT2(_sft2Address);
    }

    // ::::::::::::::::::::: Modifier :::::::::::::::::::::

    modifier onlyExploitantForestier {
        bool isExploitantForestier = userManager.hasRole(keccak256("EXPLOITANT_FORESTIER"), msg.sender);

        if (!isExploitantForestier) {
            revert UnauthorizedAccess("Only ExploitantForestier can perform this action");
        }
        _;
    }

    /**
     * @dev Mint a new NFT3 token
     * @param tokenId The ID of the token
     * @param cid The CID of the token metadata stored on IPFS
     * @param sft2TokenId The ID of the associated SFT2 token
     */
    function mint(uint64 tokenId, string memory cid, uint64 sft2TokenId) public onlyExploitantForestier {

        // Vérifications
        if (sft2Contract.balanceOf(msg.sender, sft2TokenId) <= 0) {
            revert SFT2DoesNotBelongToExploitantForestier();
        }
        if (bytes(cid).length == 0) revert CIDCannotBeEmpty();

        // Minter le token
        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, string(abi.encodePacked("ipfs://", cid)));
        sft2TokenIdAssociated[tokenId] = sft2TokenId;

        emit NFT3Minted(tokenId, sft2TokenId, cid);

    }

    // The following functions are overrides required by Solidity.
    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
