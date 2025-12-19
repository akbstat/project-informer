"use client";

import EditNoteIcon from '@mui/icons-material/EditNote';
import { Button, IconButton, List, ListItem, Popover } from '@mui/material';
import { useRouter } from 'next/navigation';
import React from 'react';

export default function UpdateModeSelection() {
    const router = useRouter();
    const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const gotoSyncActive = () => {
        router.push("/version");
        handleClose();
    };

    const gotoCreateManually = () => {
        router.push("/content");
        handleClose();
    };

    return (
        <>
            <IconButton size="small" sx={{ color: "primary.main" }} onClick={handleClick}>
                <EditNoteIcon />
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
                <List sx={{ width: "30vh" }} >
                    <ListItem>
                        <Button sx={{ textTransform: 'none' }} color="primary" fullWidth onClick={gotoSyncActive}>
                            Synchronize From Active
                        </Button>
                    </ListItem>
                    <ListItem>
                        <Button sx={{ textTransform: 'none' }} color="primary" fullWidth onClick={gotoCreateManually}>
                            Create / Modify Maunully
                        </Button>
                    </ListItem>
                </List>
            </Popover>
        </>
    );
}