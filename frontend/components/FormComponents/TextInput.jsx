"use client";

import {
  FormControl,
  FormLabel,
  Input,
  useColorModeValue,
} from "@chakra-ui/react";

const TextInput = ({
  label,
  value,
  onChange,
  placeholder,
  isRequired = false,
  isReadOnly = false,
}) => {
  const borderColor = useColorModeValue("gray.700", "gray.600");
  return (
    <FormControl isRequired={isRequired} isReadOnly={isReadOnly}>
      <FormLabel>{label}</FormLabel>
      <Input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        resize="vertical" // Permet à l'input de s'ajuster en hauteur si nécessaire
        borderColor={borderColor}
      />
    </FormControl>
  );
};

export default TextInput;
