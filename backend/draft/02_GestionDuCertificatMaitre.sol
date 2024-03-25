// SPDX-License-Identifier: MIT
pragma solidity 0.8.23;

contract GestionDuCertificatMaitre {
    struct Certificate {
        uint256 id;
        string hash;
        string metadata;
    }

    uint256 public nextCertificateId = 1;
    mapping(uint256 => Certificate) public certificates;
    mapping(uint256 => bool) public certificateValid;

    event CertificateIssued(uint256 indexed id, string hash, string metadata);
    event CertificateUpdated(uint256 indexed id, string newHash);
    event CertificateVerified(uint256 indexed id, bool isValid);

    // Enregistre un nouveau CM dans la blockchain
    function issueCertificate(string memory _hash, string memory _metadata) external {
        certificates[nextCertificateId] = Certificate(nextCertificateId, _hash, _metadata);
        certificateValid[nextCertificateId] = true; // Marque le certificat comme valide lors de l'émission
        emit CertificateIssued(nextCertificateId, _hash, _metadata);
        nextCertificateId++;
    }

    // Met à jour les informations associées à un CM existant
    function updateCertificate(uint256 _id, string memory _newHash) external {
        require(certificateValid[_id], "Certificate is not valid or does not exist.");
        certificates[_id].hash = _newHash;
        emit CertificateUpdated(_id, _newHash);
    }

    // Récupère les informations d'un CM
    function getCertificate(uint256 _id) external view returns (Certificate memory) {
        require(certificateValid[_id], "Certificate is not valid or does not exist.");
        return certificates[_id];
    }

    // Compare l'empreinte d'un document CM avec celle stockée dans la blockchain
    function verifyCertificate(uint256 _id, string memory _presentedHash) external {
        require(certificateValid[_id], "Certificate is not valid or does not exist.");
        bool isValid = keccak256(abi.encodePacked(certificates[_id].hash)) == keccak256(abi.encodePacked(_presentedHash));
        emit CertificateVerified(_id, isValid);
    }
}
