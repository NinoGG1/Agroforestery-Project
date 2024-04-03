"use client";

import ManageUsers from "@/components/ManageUsers";
import NotAllowed from "@/components/NotAllowed";
import { useReadFunctions } from "@/context/ReadFunctions";
import { Box, Flex, Heading } from "@chakra-ui/react";
import { useAccount } from "wagmi";

const user_manager = () => {
  const { address, isConnected } = useAccount();
  const { ownerAddress } = useReadFunctions();

  return (
    <Box minH={"100vh"}>
      {(address === ownerAddress) & isConnected ? (
        <>
          <ManageUsers />
        </>
      ) : (
        <>
          <NotAllowed />
        </>
      )}
    </Box>
  );
};

export default user_manager;
