// SPDX-License-Identifier: MIT
pragma solidity 0.8.23;

contract GestionDuCertificatMaitre {

        function issueCertificate() external {
            /*
            Enregistre un nouveau CM dans la blockchain.
            Inputs : données du CM (sous forme d'une empreinte = un hash)
            Output : ID du CM.
            */
    }

        function updateCertificate() external {
            /*
            Permet la mise à jour des informations associées à un CM existant.
            Input : ID du CM, nouvelles données (empreinte).
            Output : succès ou échec.
            */
    }

        function getCertificate() external view {
            /*
            Récupère les informations d'un CM.
            Input : ID du CM.
            Output : données du CM, métadonnées.
            */
    }
    
            function verifyCertificate() external {
            /*
            Compare l'empreinte d'un document CM avec celle stockée dans la blockchain.
            Input : ID du CM, empreinte du document CM présenté.
            Output : valide ou non valide.
            */
    }

}