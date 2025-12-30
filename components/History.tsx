"use client";

import { Content } from "@/data/repository/entity";
import { Box, Stack, Typography } from "@mui/material";
import React from "react";
import { useSelectionContext } from "./contexts";
import { ProjectHistory } from "@/object/detail";
import { contentsToProjectHistories } from "@/helper/converter";
import { useRouter } from "next/navigation";
import LeaderTag from "./LeaderTag";
import { apiFetch } from "@/helper/fetch";

export default function History({ project }: { project: number }) {
    const [history, setHistory] = React.useState<ProjectHistory | undefined>(undefined);
    const router = useRouter();
    const listHistores = React.useCallback(async () => {
        const reply = await apiFetch(`/api/history?project=${project}`);
        const jsonData: { data: Content[] } = await reply.json();
        setHistory(contentsToProjectHistories(jsonData.data)[0]);
    }, [project]);
    const { fontsizeTimes } = useSelectionContext();
    const fontSize = (base: number) => {
        return `${base * fontsizeTimes}px`
    }
    React.useEffect(() => {
        listHistores();
    }, [listHistores]);
    return (
        <Box sx={{
            padding: "10px",
            maxHeight: "90vh",
            overflow: 'auto',
        }}>
            {
                history ?
                    (<main style={{ marginTop: "20px" }}>
                        <Stack direction="row" spacing={1}>
                            <Typography
                                onClick={() => { router.back() }}
                                color="primary.main"
                                sx={{ fontSize: fontSize(30), marginBottom: "1%", cursor: "pointer" }}>
                                {`${history.name}`}
                            </Typography>
                            <LeaderTag leader={history.leaders} fontsizeTimes={fontsizeTimes} />
                        </Stack>
                        <Box
                            sx={{
                                padding: "5px",
                                borderColor: "primary.main",
                                borderLeftWidth: "5px",
                                borderRightWidth: "2px"
                            }}
                        >
                            {history.histories.sort((x, y) => x.name > y.name ? -1 : 1).map(h => {
                                return (
                                    <Box key={h.name}
                                        sx={{
                                            padding: "5px",
                                        }}>
                                        <Stack direction="row" spacing={2}>
                                            <Box sx={{ textAlign: "center", width: "15vh" }}>
                                                <Typography gutterBottom color="primary.main" sx={{ fontSize: fontSize(20) }}>{h.name}</Typography>
                                            </Box>
                                            <Box sx={{ borderLeftColor: "primary.main", borderLeftWidth: "1px", paddingLeft: "15px" }}>
                                                {h.contents.map((c, index) => {
                                                    return (
                                                        <Typography key={index} sx={{ fontSize: fontSize(20) }}>{c}</Typography>
                                                    );
                                                })}
                                            </Box>
                                        </Stack>
                                    </Box>
                                );
                            })}
                        </Box>
                    </main>) :
                    null
            }
        </Box >
    );
}