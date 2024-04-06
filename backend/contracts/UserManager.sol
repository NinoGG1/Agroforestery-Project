// SPDX-License-Identifier: MIT
pragma solidity 0.8.23;

import "@openzeppelin/contracts/access/AccessControl.sol";

// ::::::::::::::::::::: Custom errors :::::::::::::::::::::
error Unauthorized(string action);
error InvalidRoleRenounce();

/**
 * @title UserManager
 * @dev Contract for managing user roles
 */
contract UserManager is AccessControl {
    // Définition des bytes32 pour chaque rôle
    bytes32 public constant ADMIN = keccak256("ADMIN");
    bytes32 public constant MARCHAND_GRAINIER = keccak256("MARCHAND_GRAINIER");
    bytes32 public constant PEPINIERISTE = keccak256("PEPINIERISTE");
    bytes32 public constant EXPLOITANT_FORESTIER = keccak256("EXPLOITANT_FORESTIER");

    // Constructeur
    constructor() {
        _grantRole(ADMIN, msg.sender);
    }

    // Fonction pour assigner un rôle à un utilisateur
    /** 
        * @dev Assign a role to a user
        * @param user The address of the user
        * @param role The role to assign
        * @notice Only admins can assign roles
    */
    function assignRole(address user, bytes32 role) external onlyRole(ADMIN) {
        _grantRole(role, user);
    }

    // Fonction pour révoquer un rôle à un utilisateur
    /** 
        * @dev Revoke a role from a user
        * @param user The address of the user
        * @param role The role to revoke
        * @notice Only admins can revoke roles for other users
    */
    function revokeUserRole(address user, bytes32 role) external onlyRole(ADMIN) {
        _revokeRole(role, user);
    }
}
