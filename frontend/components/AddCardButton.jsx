import { AddIcon } from "@chakra-ui/icons";
import { Box, Button, Center, useColorModeValue } from "@chakra-ui/react";

const AddCardButton = ({ onAddClick }) => {
  const bgHover = useColorModeValue("gray.100", "gray.900");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  return (
    <Box
      maxW="350px"
      minH="100%" // Utilisez minH pour une hauteur minimum
      borderWidth="1px"
      borderColor={borderColor}
      borderRadius="lg"
      overflow="hidden"
      position="relative"
      _hover={{ bg: bgHover }}
      display="flex"
      justifyContent="center"
      alignItems="center"
    >
      <Center w="100%">
        <Button
          leftIcon={<AddIcon />}
          colorScheme="teal"
          variant="solid"
          onClick={onAddClick}
          size="lg"
        >
          Ajouter une carte
        </Button>
      </Center>
    </Box>
  );
};

export default AddCardButton;
