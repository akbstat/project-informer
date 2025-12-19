"use client";

import { Autocomplete, Box, Button, Divider, IconButton, Stack, TextField, Typography } from "@mui/material";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import React from "react";
import { useRouter } from 'next/navigation';
import { Content, Project } from "@/data/repository/entity";
import { validateProjectName } from "@/helper/converter";
import { SaveDetailRequest } from "@/object/detail";
import { useSelectionContext } from "@/components/contexts";

export default function ContentEditor({ projectId }: { projectId?: number }) {
    const router = useRouter();
    const { versionId } = useSelectionContext();
    const [contents, setContents] = React.useState<Content[]>([]);
    const [projects, setProjects] = React.useState<Project[]>([]);
    const [project, setProject] = React.useState<Project>({ name: "", leaders: "" } as Project);
    const [invalidProject, setinvalidProject] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);
    const getContents = React.useCallback(async (projectId: number) => {
        const reply = await fetch(`/api/detail?project=${projectId}&version=${versionId}`);
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

    const updateLeaders = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const value = event.target.value as string;
        setProject({ ...project, leaders: value });
    };

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
        const reply = await (await fetch("/api/project")).json();
        const projects = reply.data as Project[];
        projects.sort((x, y) => x.name < y.name ? -1 : 1);
        if (projectId) {
            const target = projects.filter(p => p.id === projectId)[0];
            if (target) {
                const contentList = await getContents(target.id);
                setContents(contentList);
                setProject(target);
            }
        }
        setProjects(projects);
    }, [setProjects, setContents, projectId, getContents]);
    const submit = async () => {
        await fetch("/api/detail", {
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
                    <Box>
                        <Typography sx={{ color: "primary.main" }} variant="h5" gutterBottom>
                            Project
                        </Typography>
                    </Box>
                    <Autocomplete value={project.name} onChange={changeProject} onInputChange={changeProject} freeSolo disableClearable options={projects.map((project) => project.name)} renderInput={(params) => (
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
                    <TextField value={project.leaders} onChange={updateLeaders} label="Leaders" size="small" />
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
                            contents.map((content, index) => {
                                return (
                                    <Box key={index} sx={{ display: "flex" }}>
                                        <TextField size="small" fullWidth value={content.content} id="project" variant="outlined" onChange={(e) => { updateContent(e, index) }} />
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

