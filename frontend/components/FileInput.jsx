"use client";

import React from "react";
import { Button, Input, FormControl, FormLabel } from "@chakra-ui/react";

const FileInput = ({ onChange, accept }) => {
  return (
    <FormControl>
      <FormLabel htmlFor="file-upload" cursor="pointer">
        <Button as="div" variant="outline" size="md">
          Upload File
        </Button>
      </FormLabel>
      <Input
        id="file-upload"
        type="file"
        accept={accept}
        onChange={onChange}
        hidden // Hide the default input
      />
    </FormControl>
  );
};

export default FileInput;
