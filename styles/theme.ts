import { createTheme } from "@mui/material";
import { lightTheme } from "./light";
import { darkTheme } from "./dark";

export const theme = createTheme({
    colorSchemes: {
        dark: darkTheme,
        light: lightTheme,
    },
    cssVariables: {
        colorSchemeSelector: "data",
    },
    components: {
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                            borderColor: "primary.main",
                        },
                        '&:hover fieldset': {
                            borderColor: "primary.main",
                        },
                        '&.Mui-focused fieldset': {
                            borderColor: "primary.main",
                        },
                        '& input': {
                            color: "primary.main",
                        }
                    },
                    '& .MuiInputLabel-outlined': {
                        color: "primary.main",
                    },
                    '& .MuiInputLabel-outlined.Mui-focused': {
                        color: "primary.main",
                    },
                }
            }
        },
        MuiInputBase: {
            styleOverrides: {
                root: ({ theme }) => ({
                    '& :-webkit-autofill': {
                        WebkitBoxShadow: `0 0 0 1000px ${theme.palette.background.default} inset`,
                        WebkitTextFillColor: `${theme.palette.primary.main}`,
                        caretColor: `${theme.palette.primary.main}`,
                    },
                    '& :-webkit-autofill:focus': {
                        WebkitBoxShadow: `0 0 0 1000px ${theme.palette.background.default} inset`,
                        WebkitTextFillColor: `${theme.palette.primary.main}`,
                        caretColor: `${theme.palette.primary.main}`,
                    },
                }),
            }
        }
    }
});
