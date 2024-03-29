import {
  FormControl,
  FormLabel,
  Input,
  useBreakpointValue,
} from "@chakra-ui/react";

const TextInput = ({
  label,
  value,
  onChange,
  placeholder,
  isRequired = false,
  isReadOnly = false,
}) => {
  return (
    <FormControl isRequired={isRequired} isReadOnly={isReadOnly}>
      <FormLabel>{label}</FormLabel>
      <Input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        resize="vertical" // Permet à l'input de s'ajuster en hauteur si nécessaire
      />
    </FormControl>
  );
};

export default TextInput;
