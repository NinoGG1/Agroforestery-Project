import { FormControl, FormLabel, Input } from "@chakra-ui/react";

const NumberInput = ({
  label,
  value,
  onChange,
  placeholder,
  isRequired = false,
  min = 1,
}) => {
  return (
    <FormControl isRequired={isRequired}>
      <FormLabel>{label}</FormLabel>
      <Input
        type="number"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        min={min}
      />
    </FormControl>
  );
};

export default NumberInput;
