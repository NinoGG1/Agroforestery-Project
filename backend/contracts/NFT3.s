// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./IUserManager.sol";
import "./ISFT2.sol"; // Assurez-vous d'avoir cette interface définie

// ::::::::::::::::::::: Custom errors :::::::::::::::::::::
error UnauthorizedAccess(string message);
error InvalidCID();
error OnlySFT2OwnerCanMint();
error SFT2TokenNotFound();

/**
 * @title NFT3
 * @dev Contract for NFT3 tokens representing planted trees
 * @notice NFT3 is a contract for minting ERC-721 tokens with metadata stored on IPFS for each planted tree
 */
contract NFT3 is ERC721URIStorage, Ownable {
    IUserManager public userManager;
    ISFT2 public sft2Contract;

    // Mapping from tokenId to the sft2TokenId it is associated with
    mapping(uint256 => uint64) public sft2TokenIds;

    // Event to emit when a new NFT3 token is minted
    event NFT3Minted(uint256 indexed tokenId, uint64 indexed sft2TokenId, string cid);

    constructor(address _userManagerAddress, address _sft2Address) ERC721("NFT3", "NFT3") {
        userManager = IUserManager(_userManagerAddress);
        sft2Contract = ISFT2(_sft2Address);
    }

    /**
     * @dev Mint a new NFT3 token
     * @param to The address receiving the token
     * @param tokenId The ID for the new token
     * @param cid The CID of the token metadata stored on IPFS
     * @param sft2TokenId The ID of the associated SFT2 token
     */
    function mint(address to, uint256 tokenId, string memory cid, uint64 sft2TokenId) public {
        if (!sft2Contract.isOwnerOfSFT2(msg.sender, sft2TokenId)) {
            revert OnlySFT2OwnerCanMint();
        }
        if (bytes(cid).length == 0) {
            revert InvalidCID();
        }
        _mint(to, tokenId);
        _setTokenURI(tokenId, string(abi.encodePacked("ipfs://", cid)));
        sft2TokenIds[tokenId] = sft2TokenId;

        emit NFT3Minted(tokenId, sft2TokenId, cid);
    }

}
