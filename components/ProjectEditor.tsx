"use client";

import LeaderBinder from "@/components/LeaderBinder";
import { validateProjectName } from "@/helper/converter";
import { seperateLeaderIntoGroup } from "@/helper/leader";
import { listProjects } from "@/helper/project";
import { SaveProjectRequest } from "@/object/project";
import { Autocomplete, Box, Button, Stack, TextField, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import React from "react";

export default function ProjectEditor({ project, leaderOptions, label, save }: {
    project?: { id: number, name: string, leaders: string },
    leaderOptions: string[],
    label: string,
    save: (id: number | undefined, project: SaveProjectRequest) => Promise<void>;
}) {
    const { id, name, blindLeaders, unblindLeaders } = (() => {
        if (project) {
            const { id, name, leaders } = project;
            const { blindLeaders, unblindLeaders } = seperateLeaderIntoGroup(leaders);
            return { id, name, blindLeaders, unblindLeaders };
        }
        return { id: undefined, name: "", blindLeaders: [], unblindLeaders: [] };
    })();
    const [projects, setProjects] = React.useState<string[]>([]);
    const [blind, setBlind] = React.useState<string[]>(blindLeaders);
    const [unblind, setUnblind] = React.useState<string[]>(unblindLeaders);
    const [projectName, setProjectName] = React.useState<string>(name);
    const [error, setError] = React.useState<string | null>(null);
    const isError = () => error !== null;
    const router = useRouter();

    const validateProject = (project: string) => {
        if (!validateProjectName(project)) {
            setError("Please provide a valid project name, such as AK101-101, AK202-ISS")
            return;
        }
        if (projects.includes(project)) {
            setError("Project name already exists.");
            return;
        }
        setError(null);
    };
    const changeProject = async (_event: React.SyntheticEvent, value: string) => {
        validateProject(value);
        setProjectName(value);
    };
    const fetchProjects = React.useCallback(async () => {
        const projects = await listProjects();
        setProjects(projects.map(p => p.name));
    }, []);
    const sumbit = async () => {
        await save(id, { name: projectName, blindLeaders: blind, unblindLeaders: unblind });
        router.back();
    };
    const cancel = () => {
        router.back();
    }
    React.useEffect(() => {
        fetchProjects();
    }, [fetchProjects]);
    return (
        <Box sx={{ padding: "5vh" }}>
            <Stack spacing={3}>
                <Typography sx={{ color: "primary.main" }} variant="h5" gutterBottom>
                    {label}
                </Typography>
                <Autocomplete
                    fullWidth
                    value={projectName}
                    freeSolo
                    disableClearable
                    options={projects}
                    onChange={changeProject}
                    onInputChange={changeProject}
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
                <LeaderBinder options={leaderOptions} label="Blind Leaders" bind={setBlind} defaultValue={blind} />
                <LeaderBinder options={leaderOptions} label="Unblind Leaders" bind={setUnblind} defaultValue={unblind} />
                <Box>
                    <Button disabled={isError()}
                        variant="outlined"
                        size="large"
                        type="submit"
                        onClick={sumbit}
                    >
                        Submit
                    </Button>
                    <Button sx={{ mx: 1 }}
                        variant="outlined"
                        color="error"
                        size="large"
                        type="submit"
                        onClick={cancel}
                    >
                        Cancel
                    </Button>
                </Box>
            </Stack>
        </Box>
    );
}