"use client";

import { Autocomplete, Box, Button, Divider, IconButton, Stack, TextField, Typography } from "@mui/material";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import EditSquareIcon from '@mui/icons-material/EditSquare';
import React from "react";
import { useRouter } from 'next/navigation';
import { Content, Project } from "@/data/repository/entity";
import { validateProjectName } from "@/helper/converter";
import { SaveDetailRequest } from "@/object/detail";
import { useSelectionContext } from "@/components/contexts";
import LeaderTag from "./LeaderTag";
import { listProjects } from "@/helper/project";
import { apiFetch } from "@/helper/fetch";

export default function ContentEditor({ projectId }: { projectId?: number }) {
    const router = useRouter();
    const { versionId } = useSelectionContext();
    const [contents, setContents] = React.useState<Content[]>([]);
    const [projects, setProjects] = React.useState<Project[]>([]);
    const [project, setProject] = React.useState<Project>({ name: "", leaders: "" } as Project);
    const [invalidProject, setinvalidProject] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);
    const getContents = React.useCallback(async (projectId: number) => {
        const reply = await apiFetch(`/api/detail?project=${projectId}&version=${versionId}`);
        const data: { data: Content[] } = await reply.json();
        return data.data;
    }, [versionId]);
    const updateContent = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, index: number) => {
        const content = event.target.value as string;
        const newContents = [...contents];
        newContents[index].content = content;
        setContents(newContents);
    };
    const addContent = () => {
        setContents([...contents, { content: "", versionId } as Content]);
    };
    const removeContent = (index: number) => {
        const newContents = [...contents];
        newContents.splice(index, 1)
        setContents(newContents);
    };
    const changeProject = async (_event: React.SyntheticEvent, value: string) => {
        validateProject(value);
        const existedProject = projects.filter(p => p.name === value)[0];
        if (existedProject) {
            const contentList = await getContents(existedProject.id);
            setContents(contentList);
            setProject(existedProject);
        } else {
            setProject({ ...project, name: value });
        }
    };

    const createProject = () => {
        router.push("/project");
    };

    const updateProject = () => {
        router.push(`/project/${project.id}`);
    }

    const validateProject = (project: string) => {
        if (validateProjectName(project)) {
            setinvalidProject(false);
            setError(null);
            return;
        }
        setinvalidProject(true);
        setError("Please provide a valid project name, such as AK101-101, AK202-ISS")
    };
    const isError = () => error !== null;
    const fetchProjects = React.useCallback(async () => {
        const projects = await listProjects();
        if (projectId) {
            const target = projects.filter(p => p.id === projectId)[0];
            if (target) {
                const contentList = await getContents(target.id);
                setContents(contentList);
                setinvalidProject(false);
                setProject(target);
            }
        }
        setProjects(projects);
    }, [setProjects, setContents, projectId, getContents]);
    const submit = async () => {
        await apiFetch("/api/detail", {
            method: "POST",
            body: JSON.stringify({ project, contents, versionId } as SaveDetailRequest),
        })
        router.back();
    };

    React.useEffect(() => {
        fetchProjects();
    }, [fetchProjects]);

    return (
        <React.Suspense fallback="Loading...">
            <Box sx={{ padding: "5vh" }}>
                <Stack spacing={2}>
                    <Typography sx={{ color: "primary.main" }} variant="h5" gutterBottom>
                        Project
                        <IconButton onClick={createProject}>
                            <AddCircleIcon color="primary" />
                        </IconButton>
                    </Typography>
                    <Box sx={{ display: "flex" }}>
                        <Autocomplete fullWidth value={project.name} onChange={changeProject} disableClearable
                            options={projects.map((project) => project.name)}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Project"
                                    error={isError()}
                                    helperText={error}
                                    slotProps={{
                                        input: {
                                            ...params.InputProps,
                                            type: "search",
                                        },
                                    }}
                                />
                            )} size="small" id="project" />
                        <IconButton onClick={updateProject}>
                            <EditSquareIcon color="primary" />
                        </IconButton>
                    </Box>
                    <LeaderTag leader={project.leaders} fontsizeTimes={1}></LeaderTag>
                    <Divider />
                    <Box sx={{ display: "flex" }}>
                        <Typography sx={{ color: "primary.main", width: "8%" }} variant="h5" gutterBottom>
                            Contents
                        </Typography>
                        <Box >
                            <IconButton size="small" sx={{ color: "primary.main" }} onClick={addContent} >
                                <AddCircleIcon />
                            </IconButton >
                        </Box>
                    </Box>
                    <Stack spacing={2} sx={{ maxHeight: "40vh", overflow: "auto" }}>
                        {
                            contents.sort((x, y) => x.id - y.id).map((content, index) => {
                                return (
                                    <Box key={index} sx={{ display: "flex" }}>
                                        <TextField multiline maxRows={8} size="small" fullWidth value={content.content} id="project" variant="outlined" onChange={(e) => { updateContent(e, index) }} />
                                        <Box sx={{ textAlign: "right" }}>
                                            <IconButton color="error" size="small" onClick={() => removeContent(index)} >
                                                <RemoveCircleIcon />
                                            </IconButton>
                                        </Box>
                                    </Box>
                                );
                            })
                        }
                    </Stack>
                    <Box >
                        <Button variant="outlined" onClick={submit} disabled={invalidProject} size="large" type="submit" >
                            Submit
                        </Button>
                    </Box>
                </Stack>
            </Box>
        </React.Suspense>
    )
}

