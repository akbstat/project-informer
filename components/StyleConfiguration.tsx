"use client";

import { ButtonGroup, IconButton, List, ListItem, ListItemText, Popover, Slider, useColorScheme } from "@mui/material";
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import SettingsIcon from '@mui/icons-material/Settings';
import React from "react";
import { useSelectionContext } from "./contexts";

export default function StyleConfiguration() {
    const { mode, setMode } = useColorScheme();
    const { setFontsizeTimes, fontsizeTimes } = useSelectionContext();
    const darkMode = () => { setMode("dark") };
    const lightMode = () => { setMode("light") };
    const sliderChange = (_event: Event, newValue: number) => {
        setFontsizeTimes(newValue);
    }
    const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    return (
        <>
            <IconButton onClick={handleClick} size="small" sx={{ color: "primary.main" }} >
                <SettingsIcon />
            </IconButton >
            <Popover
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
            >
                <List sx={{ width: "50vh" }} >
                    <ListItem>
                        <ListItemText primary="Display" sx={{ color: "primary.main" }} />
                        <ButtonGroup variant="outlined" aria-label="Basic button group">
                            <IconButton color={mode === "light" ? "primary" : "default"} onClick={lightMode}>
                                <LightModeIcon />
                            </IconButton>
                            <IconButton color={mode === "dark" ? "primary" : "default"} onClick={darkMode}>
                                <DarkModeIcon />
                            </IconButton>
                        </ButtonGroup>
                    </ListItem>
                    <ListItem>
                        <ListItemText primary="Font Size" sx={{ color: "primary.main" }} />
                        <Slider sx={{ width: "70%" }}
                            value={fontsizeTimes}
                            defaultValue={1}
                            valueLabelDisplay="auto"
                            shiftStep={30}
                            step={0.2}
                            marks
                            min={1}
                            max={3}
                            onChange={sliderChange}
                        />
                    </ListItem>
                </List>
            </Popover>
        </>
    );
}