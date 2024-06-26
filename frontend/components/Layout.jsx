"use client";

import Footer from "./Footer";
import Header from "./Header";
import { Box, Divider, Flex, useColorMode } from "@chakra-ui/react";

const Layout = ({ children }) => {
  return (
    <Flex direction="column" minHeight="100vh">
      <Box position="sticky" top="0" zIndex={"overlay"} width="100%">
        <Header />
      </Box>
      <Flex direction="column" flex="1" pl="4rem" pr="4rem" width="100%">
        {children}
      </Flex>
      <Divider mt={"4rem"} />
      <Box>
        <Footer />
      </Box>
    </Flex>
  );
};

export default Layout;
