"use client";
import Header from "./Header";
import Footer from "./Footer";
import { Box, Divider, Flex } from "@chakra-ui/react";

const Layout = ({ children }) => {
  return (
    <Flex direction="column" minHeight="100vh">
      <Header />
      <Divider />
      {/* Utilisez Box comme conteneur externe pour gérer le centrage et la largeur maximale */}
      <Box
        width="100%"
        display="flex"
        justifyContent="center"
        p="2rem"
        flexGrow={1}
      >
        {/* Flex interne pour le contenu, maxWidth pour limiter la largeur et width full pour permettre le centrage */}
        <Flex direction="column" maxWidth="1200px" width="full">
          {children}
        </Flex>
      </Box>
      <Footer />
    </Flex>
  );
};

export default Layout;
