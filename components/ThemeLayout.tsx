"use client";

import React from "react";
import { ThemeProvider } from "@mui/material/styles";
import { theme } from "@/styles/theme";
import { CssBaseline } from "@mui/material";

export default function ThemeLayout({ children }: { children: React.ReactNode }) {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            {children}
        </ThemeProvider>
    )
}