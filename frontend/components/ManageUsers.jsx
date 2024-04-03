import React, { useContext, useEffect, useState } from "react";
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Link,
  Select,
  Tab,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useToast,
} from "@chakra-ui/react";
import {
  useAccount,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { UseManagerAddress, UseManagerAbi } from "@/constants";
import EventsContext from "@/context/Events";
import { ethers } from "ethers";
import { stringToHex } from "viem";
import { keccak256 } from "viem";
import { ExternalLinkIcon } from "@chakra-ui/icons";

const UserManagementForm = () => {
  const [walletAddress, setWalletAddress] = useState("");
  const [role, setRole] = useState("");
  const toast = useToast();
  const { address, isConnected } = useAccount();
  const { roleGrantedEvent, getRoleGrantedEvent } = useContext(EventsContext);

  // ::::::::::::::: Gestion de la soumission du formulaire :::::::::::::::

  const handleSubmit = async (e) => {
    e.preventDefault();
    assignRole();
  };

  // ::::::::::::::: Communication avec le SC UserManager.sol :::::::::::::::
  const {
    data: hash,
    error,
    isPending: assignRolePending,
    writeContract,
  } = useWriteContract({});

  const assignRole = async () => {
    // Convertissez le nom du rôle en bytes32
    const roleBytes32 = keccak256(role);

    writeContract({
      address: UseManagerAddress,
      abi: UseManagerAbi,
      functionName: "assignRole",
      account: address,
      args: [walletAddress, roleBytes32],
    });
  };

  const {
    isLoading: isConfirming,
    isSuccess: isConfirmed,
    error: confirmationError,
  } = useWaitForTransactionReceipt({ hash });

  useEffect(() => {
    if (isConfirmed) {
      setWalletAddress("");
      setRole("");
      getRoleGrantedEvent();
    }
  }, [isConfirmed]);

  return (
    <>
      {/* Formulaire */}
      <Box p={"2rem"} bg={"gray.900"} borderRadius={"10px"} mt={"2rem"}>
        <Flex direction="column" align="stretch" gap="4">
          <Heading as="h3" size="lg" color="white">
            Gestion des utilisateurs
          </Heading>
          <form onSubmit={handleSubmit}>
            <FormControl isRequired>
              <FormLabel color="white">Adresse du wallet</FormLabel>
              <Input
                placeholder="Entrez l'adresse du wallet"
                value={walletAddress}
                onChange={(e) => setWalletAddress(e.target.value)}
                color="white"
              />
            </FormControl>
            <FormControl mt="4" isRequired>
              <FormLabel color="white">Rôle</FormLabel>
              <Select
                placeholder="Sélectionnez un rôle"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                color="white"
              >
                <option value="ADMIN">ADMIN</option>
                <option value="MARCHAND_GRAINIER">MARCHAND_GRAINIER</option>
                <option value="PEPINIERISTE">PEPINIERISTE</option>
                <option value="EXPLOITANT_FORESTIER">
                  EXPLOITANT_FORESTIER
                </option>
              </Select>
            </FormControl>
            <Button mt="6" type="submit" colorScheme="green">
              Ajouter l'utilisateur
            </Button>
          </form>

          {/**************** Alerts ****************/}
          {/* Afficher un toast pendant que la transaction est en cours */}
          <Flex direction={"column"}>
            {isConfirming && (
              <Alert
                status="info"
                flexDirection="column"
                alignItems="flex-start"
                width="full"
                borderRadius="md"
              >
                <Flex alignItems="center">
                  <AlertIcon p={0} size={"xs"} m={0} mr={"0.5rem"} />
                  <AlertTitle mr={2}>Transaction en cours</AlertTitle>
                  <AlertDescription>
                    Veuillez patienter pendant que la transaction est en
                    cours...
                  </AlertDescription>
                </Flex>
              </Alert>
            )}

            {/* Afficher un toast si l'utilisateur est ajouté avec succès */}
            {isConfirmed && (
              <Alert
                status="success"
                flexDirection="column"
                alignItems="flex-start"
                width="full"
                borderRadius="md"
              >
                <Flex alignItems="center">
                  <AlertIcon p={0} size={"xs"} m={0} mr={"0.5rem"} />
                  <AlertTitle mr={2}>Transaction réussie</AlertTitle>
                  <AlertDescription>
                    Hash de la dernière transaction :{" "}
                    <Link
                      isExternal
                      href={`https://sepolia.etherscan.io/tx/${hash}`}
                    >
                      {hash.substring(0, 6)}...
                      {hash.substring(hash.length - 4)}
                      <ExternalLinkIcon ml={"0.5rem"} />
                    </Link>
                  </AlertDescription>
                </Flex>
              </Alert>
            )}

            {/* Afficher un toast si une erreur se produit */}
            {confirmationError && (
              <Alert
                status="error"
                flexDirection="column"
                alignItems="flex-start"
                width="full"
                borderRadius="md"
              >
                <Flex alignItems="center">
                  <AlertIcon p={0} size={"xs"} m={0} mr={"0.5rem"} />
                  <AlertTitle mr={2}>Erreur</AlertTitle>
                  <AlertDescription>
                    {confirmationError.message}
                  </AlertDescription>
                </Flex>
              </Alert>
            )}
          </Flex>
        </Flex>
      </Box>

      {/* Tableau des whitelistés */}
      <TableContainer mt={"2rem"}>
        <Table size="md">
          <Thead>
            <Tr>
              <Th>Adresse</Th>
              <Th>Role</Th>
            </Tr>
          </Thead>
          {roleGrantedEvent.map((user, index) => (
            <Tbody key={index}>
              <Tr>
                <Td>{user.account}</Td>
                <Td>
                  {user.role ===
                  "0xdf8b4c520ffe197c5343c6f5aec59570151ef9a492f2c624fd45ddde6135ec42"
                    ? "ADMIN"
                    : user.role ===
                      "0x5e08ab519e9369265d31aa5f2d064b836d76c0e3cc9104a71dcfedb74652c6c5"
                    ? "MARCHAND_GRAINIER"
                    : user.role ===
                      "0xb48f6fe2e354993a3452df774ed05a0b33da2bd6ea59dbb706d9c04ada8c6e0b"
                    ? "PEPINIERISTE"
                    : user.role ===
                      "0xaccbfbd62cc175ee39f77f9a11649bf3763143809e679d52aca3ef54d86dff3a"
                    ? "EXPLOITANT_FORESTIER"
                    : "UNKNOWN"}
                </Td>
              </Tr>
            </Tbody>
          ))}
        </Table>
      </TableContainer>
    </>
  );
};

export default UserManagementForm;
