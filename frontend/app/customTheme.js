import { extendTheme } from "@chakra-ui/react";
import { mode } from "@chakra-ui/theme-tools";

const config = {
  initialColorMode: "dark",
  useSystemColorMode: false,
};

const styles = {
  global: (props) => ({
    body: {
      bg: mode("#F4FFFA", "#2E4039")(props),
      color: mode("#37474F", "#E0F2E9")(props),
    },
  }),
};

const colors = {
  lightBackground: "#E0F2E9",
  darkBackground: "#2E4039",
  lightText: "#37474F",
  darkText: "#E0F2E9",
};

const customTheme = extendTheme({ config, styles, colors });

export default customTheme;
