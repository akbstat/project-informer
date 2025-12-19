"use client";

import { getVersionObject } from "@/helper/version";
import { AuthParam } from "@/object/auth";
import { Version } from "@/object/version";
import { Box, Button, CircularProgress, MenuItem, Select, SelectChangeEvent, Stack, TextField, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import React from "react";

const MONTHS = (() => [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(m => {
    let month = m.toString();
    if (month.length < 2) {
        month = `0${month}`;
    }
    return month;
}))();

export default function CreateVersion() {
    const router = useRouter();
    const cancel = () => { router.back() };
    const [version, setVersion] = React.useState<Version>(getVersionObject());
    const [auth, setAuth] = React.useState<AuthParam>({ email: "", password: "" });
    const [loading, setLoading] = React.useState<boolean>(false);
    const yearRange = (() => {
        const middle = parseInt(version.year);
        const years = [];
        for (let year = middle - 10; year < middle + 10; year++) years.push(year.toString());
        return years;

    })();
    const changeAccount = (event: React.ChangeEvent<HTMLInputElement>) => {
        const name = event.target.value as string;
        setAuth(prev => ({ ...prev, email: name }));
    }
    const changePassword = (event: React.ChangeEvent<HTMLInputElement>) => {
        const name = event.target.value as string;
        setAuth(prev => ({ ...prev, password: name }));
    }
    const changeYear = (event: SelectChangeEvent) => {
        setVersion({ ...version, year: event.target.value });
    };
    const changeMonth = (event: SelectChangeEvent) => {
        setVersion({ ...version, month: event.target.value });
    };
    ;
    const sumbit = async () => {
        setLoading(true);
        await fetch('/api/sync', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                auth,
                version: `${version.year}-${version.month}`,
            }),
        });
        setLoading(false);
        window.location.reload();
    }
    return loading ? (
        <Box sx={{ textAlign: 'center', minWidth: '500px' }}>
            <CircularProgress color="primary" />
            <Typography color="primary">Fetching Data from Active...</Typography>
        </Box>
    ) : (
        <Box sx={{ padding: "10vh" }}>
            <Stack spacing={3} >
                <Typography color="primary.main" className="col-span-15" variant="h5" gutterBottom >
                    Synchronize Records from Active
                </Typography>
                <TextField
                    onChange={changeAccount} id="outlined-basic" label="Active Account" variant="outlined" fullWidth />
                <TextField
                    onChange={changePassword} type="password" id="filled-basic" label="Password" variant="outlined" fullWidth />
                <Box>
                    <Typography color="primary.main" variant="h6" gutterBottom >
                        Synchronize Range
                    </Typography>
                    <Select
                        sx={{ width: "20vh" }}
                        value={version.year}
                        color="primary"
                        onChange={changeYear}
                        MenuProps={{
                            slotProps: {
                                paper: {
                                    sx: {
                                        maxHeight: "35vh"
                                    }
                                }
                            }
                        }}
                    >
                        {
                            yearRange.map(y => {
                                return (
                                    <MenuItem key={y} value={y}>{y}</MenuItem>
                                );
                            })
                        }
                    </Select>
                    <Select
                        sx={{ marginLeft: "1vh", width: "20vh" }}
                        value={version.month}
                        onChange={changeMonth}
                        MenuProps={{
                            slotProps: {
                                paper: {
                                    sx: {
                                        maxHeight: "35vh"
                                    }
                                }
                            }
                        }}
                    >
                        {
                            MONTHS.map(m => {
                                return (
                                    <MenuItem key={m} value={m}>{m}</MenuItem>
                                );
                            })
                        }
                    </Select>
                </Box>
                <Box>
                    <Button sx={{ marginRight: "10px" }} color="primary" onClick={sumbit} variant="outlined">
                        Update
                    </Button>
                    <Button color="error" variant="outlined" onClick={cancel}>
                        Cancel
                    </Button>
                </Box>
            </Stack>
        </Box >
    );
}
