// SPDX-License-Identifier: MIT
pragma solidity 0.8.23;

interface IUserManager {
    /**
     * @dev Returns true if the account has the role
     * @param role The role to check
     * @param account The address to check
     * @return True if the account has the role
     */
    function hasRole(bytes32 role, address account) external view returns (bool);
}
