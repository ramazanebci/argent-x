import { makeColorVariants } from "./utilities/makeColorVariants"

export const colors = {
  transparent: "transparent",
  current: "currentColor",
  black: "#000000",
  black10: "rgba(0,0,0,0.1)",
  black30: "rgba(0,0,0,0.3)",
  black50: "rgba(0,0,0,0.5)",
  white: "#ffffff",
  white30: "rgba(255,255,255,0.3)",
  white50: "rgba(255,255,255,0.5)",
  white90: "rgba(255,255,255,0.9)",
  gray: makeColorVariants("#58585b"),
  primary: makeColorVariants("#f36a3d"),
  primaryExtraDark: makeColorVariants("#371709"),
  secondary: makeColorVariants("#08a681"),
  secondaryDark: "#068063",
  tertiary: makeColorVariants("#404043"),
  accent: makeColorVariants("#197aa6"),
  warn: makeColorVariants("#ffbf3d"),
  "warn-high": makeColorVariants("#f36a3d"),
  info: makeColorVariants("#0078a4"),
  danger: makeColorVariants("#c12026"),
  warning: makeColorVariants("#f4bc54"),
  success: makeColorVariants("#3ed373"),
  error: makeColorVariants("#cc3247"),
  errorText: "#E95F72",
  skyBlue: makeColorVariants("#29c5ff"),
  neutrals: {
    100: "#b7b7b9",
    200: "#9f9fa1",
    300: "#88888a",
    400: "#707072",
    500: "#58585b",
    600: "#404043",
    700: "#28282c",
    800: "#1d1f22",
    900: "#101014",
  },
  /** used by Chakra Alert and Toast */
  blue: makeColorVariants("#0078a4"),
  orange: makeColorVariants("#f4bc54"),
  red: makeColorVariants("#cc3247"),
  green: makeColorVariants("#08a681"),
}
