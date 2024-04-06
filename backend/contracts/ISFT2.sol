// SPDX-License-Identifier: MIT
pragma solidity 0.8.23;

interface ISFT2 {
    /**
     * @dev Returns the amount of tokens of token type `id` owned by `account`.
     * @param account The address of the token holder
     * @param id The token type
     * @return The owner's balance of the token type requested
     */
    function balanceOf(address account, uint256 id) external view returns (uint256);
}
