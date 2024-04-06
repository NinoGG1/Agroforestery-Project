"use client";

import ManageUsers from "@/components/ManageUsers";
import NotAllowed from "@/components/NotAllowed";
import { useReadFunctions } from "@/context/ReadFunctions";
import { Box, Flex, Heading } from "@chakra-ui/react";
import { useEffect } from "react";
import { useAccount } from "wagmi";

const user_manager = () => {
  const { address, isConnected } = useAccount();
  const { ownerAddress, isAdmin, refetchIsAdmin } = useReadFunctions();

  useEffect(() => {
    refetchIsAdmin();
  }, [address]);

  return (
    <Box minH={"100vh"}>
      {isAdmin & isConnected ? (
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
