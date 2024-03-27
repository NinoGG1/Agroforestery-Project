import Footer from "./Footer";
import Header from "./Header";
import { Box, Divider, Flex } from "@chakra-ui/react";

const Layout = ({ children }) => {
  return (
    <Flex direction="column" minHeight="100vh">
      <Box position="sticky" top="0" zIndex="banner" width="100%">
        <Header />
      </Box>
      <Box width="100vw" pt="1rem">
        <Flex direction="column" pl="4rem" pr="4rem" width="100%">
          {children}
        </Flex>
      </Box>
      <Divider mt={"4rem"} />
      <Footer />
    </Flex>
  );
};

export default Layout;
