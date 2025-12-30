"use client";

import { Box, FormControl, InputLabel, MenuItem, OutlinedInput, Select, SelectChangeEvent, Typography } from "@mui/material";
import React from "react";
import { useSelectionContext } from "./contexts";
import { Version } from "@/data/repository/entity";
import StyleConfiguration from "./StyleConfiguration";
import UpdateModeSelection from "./UpdateModeSelection";
import { apiFetch } from "@/helper/fetch";

export default function Navbar({ className }: { className: string }) {
    const { versionId, setVersionId } = useSelectionContext();
    const [versions, setVersions] = React.useState<Version[]>([]);
    const selectRef = React.useRef<HTMLDivElement>(null);

    const listVersions = React.useCallback(async () => {
        const reply = await apiFetch("/api/version");
        const data: Version[] = (await reply.json()).data;
        data.sort((x, y) => x.name > y.name ? -1 : 1)
        setVersions(data);
        if (data.length > 0) {
            const latestVersion = data[0];
            setVersionId(latestVersion.id);
        }
    }, [setVersionId]);

    React.useEffect(() => {
        listVersions();
    }, [listVersions]);

    const handleChange = (event: SelectChangeEvent) => {
        setVersionId(parseInt(event.target.value as string));
    }

    return (
        <Box className={className} sx={{ padding: "15px", height: "10vh", borderColor: "primary.main", borderWidth: "1px" }}>
            <Typography color="primary.main" className="col-span-15" variant="h5" gutterBottom >
                Akeso SP Monthly Meeting
            </Typography>
            <Box className="col-span-1" sx={{ marginTop: "5%" }}>
                <UpdateModeSelection />
                <StyleConfiguration />
            </Box>
            <FormControl className="col-span-2" sx={{ minWidth: 120 }} size="small">
                <InputLabel
                    sx={{
                        color: "primary.main",
                        '&.Mui-focused': {
                            color: "primary.main",
                        },
                    }}
                >
                    Version
                </InputLabel>
                <Select
                    ref={selectRef}
                    input={<OutlinedInput label="Version" />}
                    value={versionId ? versionId.toString() : ""}
                    onChange={handleChange}
                    sx={{
                        '& .MuiOutlinedInput-input': {
                            color: 'primary.main',
                        },
                        '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: 'primary.main',
                            borderWidth: '1px',
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: 'primary.main',
                            borderWidth: '2px',
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: 'primary.main',
                            borderWidth: '2px',
                        },
                    }}
                    MenuProps={{
                        PaperProps: {
                            sx: {
                                borderColor: "primary.main",
                                borderWidth: '1px',
                                '& .MuiMenuItem-root': {
                                    '&:hover': {
                                        bgcolor: 'primary.light',
                                    },
                                },
                            },
                        },
                    }}
                >
                    {
                        versions?.map((v) => {
                            return (
                                <MenuItem key={v.id} value={v.id.toString()}>{v.name}</MenuItem>
                            );
                        })
                    }
                </Select>
            </FormControl>
        </Box >
    );
}

