import {
  FormControl,
  FormLabel,
  Input,
  useColorModeValue,
} from "@chakra-ui/react";

const NumberInput = ({
  label,
  value,
  onChange,
  placeholder,
  isRequired = false,
  min = 1,
}) => {
  const borderColor = useColorModeValue("gray.700", "gray.600");
  return (
    <FormControl isRequired={isRequired}>
      <FormLabel>{label}</FormLabel>
      <Input
        type="number"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        min={min}
        borderColor={borderColor}
      />
    </FormControl>
  );
};

export default NumberInput;
