"use client";

import { Box, Button, CircularProgress, IconButton, Typography } from "@mui/material";
import React from "react";
import EditSquareIcon from '@mui/icons-material/EditSquare';
import { useSelectionContext } from "./contexts";
import { Content } from "@/data/repository/entity";
import { Project } from "@/object/project";
import { fromContentsToProjects } from "@/helper/converter";
import { useRouter } from "next/navigation";

export default function ProductDetail({ product }: { product: string }) {
    const [project, setProject] = React.useState<Project[]>([]);
    const [loading, setLoading] = React.useState(true);
    const router = useRouter();
    const { versionId, fontsizeTimes } = useSelectionContext();
    const fontSize = (base: number) => {
        return `${base * fontsizeTimes}px`
    }
    React.useEffect(() => {
        if (!versionId) {
            return;
        }
        setLoading(true);
        const fetchData = async () => {
            const reply = await fetch(`/api/detail?version=${versionId}&product=${product}`);
            const contents: Content[] = (await reply.json()).data;
            setProject(fromContentsToProjects(contents));
            setLoading(false);
        }
        fetchData();
    }, [versionId, product]);

    if (loading) {
        return (
            <Box sx={{ textAlign: 'center' }}>
                <CircularProgress />
                <Typography>Loading...</Typography>
            </Box>
        );
    }

    const gotoHistory = (id: number) => {
        router.push(`/history/${id}`);
    }

    const gotoEditor = (id: number) => {
        router.push(`/content?project=${id}`);
    }

    return (
        project.length > 0 ? (
            <div style={{ padding: "10px", maxHeight: "90vh", overflow: 'auto' }}>
                <main style={{ marginTop: "20px" }}>
                    {project.map((d) => {
                        return (
                            <div key={`${d.id}`} style={{ marginBottom: "40px" }}>
                                <Button sx={{ padding: 0, textTransform: "none" }} onClick={() => { gotoHistory(d.id) }}>
                                    <Typography color="primary.main" sx={{ fontSize: fontSize(30) }}>
                                        {`${d.name}(${d.owner})`}
                                    </Typography>
                                </Button>
                                <IconButton onClick={() => { gotoEditor(d.id) }} color="primary">
                                    <EditSquareIcon />
                                </IconButton>
                                {d.descriptions.map((content) => {
                                    return (
                                        <Typography key={`${d.id}-${content.id}`} sx={{ fontSize: fontSize(20) }}>
                                            {content.content}
                                        </Typography>

                                    );
                                })}
                            </div>
                        );
                    })}
                </main>
            </div>
        ) : (
            <div>{`Product Not Found`}</div>
        )
    );
}