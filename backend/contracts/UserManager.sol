// SPDX-License-Identifier: MIT
pragma solidity 0.8.23;

import "@openzeppelin/contracts/access/AccessControl.sol";

contract UserManager is AccessControl {
    // Définition des bytes32 pour chaque rôle
    bytes32 public constant ADMIN = keccak256("ADMIN");
    bytes32 public constant MARCHAND_GRAINIER = keccak256("MARCHAND_GRAINIER");
    bytes32 public constant PEPINIERISTE = keccak256("PEPINIERISTE");
    bytes32 public constant EXPLOITANT_FORESTIER = keccak256("EXPLOITANT_FORESTIER");

    // Events 
    /*
    event RoleAdminChanged(bytes32 indexed role, bytes32 indexed previousAdminRole, bytes32 indexed newAdminRole);
    event RoleGranted(bytes32 indexed role, address indexed account, address indexed sender);
    event RoleRevoked(bytes32 indexed role, address indexed account, address indexed sender);
    */

    // Constructeur
    constructor() {
        // Celui qui déploie le contrat est l'admin par défaut
        _grantRole(ADMIN, msg.sender);
    }

    // Modifier pour restreindre l'accès aux admins
    modifier onlyAdmin() {
        require(hasRole(ADMIN, msg.sender), "Seul l'admin peut effectuer cette action");
        _;
    }

    // Modifier pour restreindre l'accès aux marchands grainiers
    modifier onlyMarchandGrainier() {
        require(hasRole(MARCHAND_GRAINIER, msg.sender), "Seul le marchand grainier peut effectuer cette action");
        _;
    }

    // Modifier pour restreindre l'accès aux pépiniéristes
    modifier onlyPepinieriste() {
        require(hasRole(PEPINIERISTE, msg.sender), "Seul le pepinieriste peut effectuer cette action");
        _;
    }

    // Modifier pour restreindre l'accès aux exploitants forestiers
    modifier onlyExploitantForestier() {
        require(hasRole(EXPLOITANT_FORESTIER, msg.sender), "Seul l'exploitant forestier peut effectuer cette action");
        _;
    }

    // Exemple de fonction pour assigner un rôle à un utilisateur
    function assignRole(address user, bytes32 role) public onlyRole(ADMIN) {
        _grantRole(role, user);
    }

    // Exemple de fonction pour révoquer un rôle à un utilisateur
    function revokeUserRole(address user, bytes32 role) public onlyRole(ADMIN) {
    _revokeRole(role, user);
    }

    // Exemple de fonction pour qu'un utilisateur renonce à un rôle
    function renounceRole(address user, bytes32 role) public {
    require(msg.sender == user, "Seul l'utilisateur lui meme peut renoncer a son role");
    _revokeRole(role, user);
    }

    // Exemple de fonction pour vérifier si un utilisateur a un rôle
    function checkUserRole(address user, bytes32 role) public view returns (bool) {
    return hasRole(role, user);
    }

}
