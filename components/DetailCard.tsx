"use client";

import { Box, Button, IconButton, Stack, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import EditSquareIcon from '@mui/icons-material/EditSquare';
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { Project } from "@/object/project";
import LeaderTag from "./LeaderTag";

export default function DetailCard({ project, fontsizeTimes }: { project: Project, fontsizeTimes: number }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id: project.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    const router = useRouter();
    const fontSize = (base: number) => {
        return `${base * fontsizeTimes}px`
    }
    const gotoHistory = (id: number) => {
        router.push(`/history/${id}`);
    }

    const gotoEditor = (id: number) => {
        router.push(`/content?project=${id}`);
    }
    return (
        <Box key={`${project.id}`} style={{ marginBottom: "40px", ...style }} ref={setNodeRef} >
            <Stack direction="row" spacing={1}>
                <IconButton onClick={() => { gotoEditor(project.id) }} color="primary">
                    <EditSquareIcon />
                </IconButton>
                <Button sx={{ padding: 0, textTransform: "none" }} onClick={() => { gotoHistory(project.id) }}>
                    <Typography color="primary.main" sx={{ fontSize: fontSize(30) }}>
                        {`${project.name}`}
                    </Typography>
                </Button>
                <LeaderTag leader={project.owner} fontsizeTimes={fontsizeTimes} />
            </Stack>

            <div style={{ cursor: "pointer" }} {...attributes} {...listeners}>
                {project.descriptions.map((content) => {
                    return (
                        <Box key={`${project.id}-${content.id}`}>
                            {
                                content.content.split("\n").map((row, index) => {
                                    return (
                                        <Typography key={`${project.id}-${content.id}-${index}`} sx={{ fontSize: fontSize(20) }}>
                                            {row}
                                        </Typography>
                                    );
                                })
                            }
                        </Box>
                    );
                })}

            </div>
        </Box>
    );
}