"use client";
import Header from "./Header";
import Footer from "./Footer";
import { Box, Divider, Flex } from "@chakra-ui/react";

const Layout = ({ children }) => {
  return (
    <Flex direction="column" minHeight="100vh">
      <Header />
      <Divider />
      <Box
        width="100%"
        display="flex"
        justifyContent="center"
        p="2rem"
        flexGrow={1}
      >
        <Flex direction="column" maxWidth="1200px" width="full">
          {children}
        </Flex>
      </Box>
    </Flex>
  );
};

export default Layout;
