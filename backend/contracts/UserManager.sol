// SPDX-License-Identifier: MIT
pragma solidity 0.8.23;

import "@openzeppelin/contracts/access/AccessControl.sol";

// ::::::::::::::::::::: Custom errors :::::::::::::::::::::
error Unauthorized(string message);
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

    // ::::::::::::::::::::: Modifier :::::::::::::::::::::    
    // Modifier pour restreindre l'accès aux admins
    modifier onlyAdmin() {
        if (!hasRole(ADMIN, msg.sender)) revert Unauthorized("Seul l'admin peut effectuer cette action");
        _;
    }

    // Modifier pour restreindre l'accès aux marchands grainiers
    modifier onlyMarchandGrainier() {
        if (!hasRole(MARCHAND_GRAINIER, msg.sender)) revert Unauthorized("Seul le marchand grainier peut effectuer cette action");
        _;
    }

    // Modifier pour restreindre l'accès aux pépiniéristes
    modifier onlyPepinieriste() {
        if (!hasRole(PEPINIERISTE, msg.sender)) revert Unauthorized("Seul le pepinieriste peut effectuer cette action");
        _;
    }

    // Modifier pour restreindre l'accès aux exploitants forestiers
    modifier onlyExploitantForestier() {
        if (!hasRole(EXPLOITANT_FORESTIER, msg.sender)) revert Unauthorized("Seul l'exploitant forestier peut effectuer cette action");
        _;
    }

    // Fonction pour assigner un rôle à un utilisateur
    function assignRole(address user, bytes32 role) public onlyRole(ADMIN) {
        _grantRole(role, user);
    }

    // Fonction pour révoquer un rôle à un utilisateur
    function revokeUserRole(address user, bytes32 role) public onlyRole(ADMIN) {
        _revokeRole(role, user);
    }

    // Fonction pour qu'un utilisateur renonce à un rôle
    function renounceRole(address user, bytes32 role) public {
        if (msg.sender != user) revert InvalidRoleRenounce();
        _revokeRole(role, user);
    }
}
