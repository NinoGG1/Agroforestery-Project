// SPDX-License-Identifier: MIT
pragma solidity 0.8.23;

contract MFRTracking {

    // enum des différentes étapes de la traçabilité
    enum Step { 
        SeedBatchRegistration,
        SeedCertified,
        DF1 : Marchand grainier -> Pépiniériste,
        DF2 : Pépiniériste -> Reboiseur,
        DF3 : Pépiniériste -> Propriétaire forestier,
        DF4 : Reboiseur -> Propriétaire forestier,
        }

    

}
```