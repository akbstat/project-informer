"use client";

import { Box, CircularProgress, Typography } from "@mui/material";
import React from "react";
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
    DragOverlay,
    DragStartEvent,
} from "@dnd-kit/core";
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { useSelectionContext } from "./contexts";
import { Content } from "@/data/repository/entity";
import { Project } from "@/object/project";
import { fromContentsToProjects } from "@/helper/converter";
import DetailCard from "./DetailCard";
import { ProjectDisplay } from "@/object/display";
import { customProjectSorter } from "@/helper/project";
import { saveDisplay } from "@/helper/display";
import { apiFetch } from "@/helper/fetch";

export default function ProductDetail({ product }: { product: string }) {
    const productId = parseInt(product) as number;
    const [display, setDisplay] = React.useState<ProjectDisplay | null>(null);
    const [activeItem, setActiveItem] = React.useState<Project | null>(null);
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const [project, setProject] = React.useState<Project[]>([]);
    const [loading, setLoading] = React.useState(true);
    const { versionId, fontsizeTimes } = useSelectionContext();

    const handleDragStart = ({ active }: DragStartEvent) => {
        const { id } = active;
        const activeProject = project.filter(p => p.id === id)[0];
        setActiveItem(activeProject ? activeProject : null);
    }

    const updateDisplay = async (projects: Project[]) => {
        const projectIds = projects.map(p => p.id);
        const reply = await saveDisplay(display ? { ...display, projectIds } : {
            id: undefined,
            productId,
            versionId: versionId as number,
            projectIds,
        })
        if (!display) {
            setDisplay(reply);
        }
    }

    const handleDragEnd = ({ active, over }: DragEndEvent) => {
        if (over && active.id !== over.id) {
            const activeIndex = project.findIndex((i) => i.id === active.id);
            const overIndex = project.findIndex((i) => i.id === over?.id);
            const newlist = arrayMove(project, activeIndex, overIndex);
            setProject(newlist);
            updateDisplay(newlist);
        }
    };

    React.useEffect(() => {
        if (!versionId) {
            return;
        }
        setLoading(true);
        const fetchData = async () => {
            const reply = await apiFetch(`/api/detail?version=${versionId}&product=${product}`);
            const contents: Content[] = (await reply.json()).data;
            const projectList = fromContentsToProjects(contents);
            const displayOrderReply = await apiFetch(`/api/display?version=${versionId}&product=${product}`)
            const originalDisplay = (await displayOrderReply.json()).data;
            setDisplay(originalDisplay);
            const sortedProjects = customProjectSorter(projectList, originalDisplay ? originalDisplay.projectIds : null);
            setProject(sortedProjects);
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
    return (
        project.length > 0 ? (
            <div style={{ padding: "10px", maxHeight: "90vh", overflow: 'auto' }}>
                <main style={{ marginTop: "20px" }}>
                    <DndContext modifiers={[restrictToVerticalAxis]}
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragStart={handleDragStart}
                        onDragEnd={handleDragEnd}
                    >
                        <SortableContext
                            items={project}
                            strategy={verticalListSortingStrategy}
                        >
                            {project.map((d) => {
                                return (
                                    <DetailCard
                                        key={d.id}
                                        project={d}
                                        fontsizeTimes={fontsizeTimes}
                                    />
                                );
                            })}
                        </SortableContext>
                        <DragOverlay>
                            {activeItem ? (
                                <Box sx={{ p: 2, backgroundColor: 'background.paper', borderRadius: 1, borderColor: "primary.main", borderWidth: "1px" }}>
                                    <DetailCard
                                        key={activeItem.id}
                                        project={activeItem}
                                        fontsizeTimes={fontsizeTimes}
                                    />
                                </Box>
                            ) : null}
                        </DragOverlay>
                    </DndContext>
                </main>
            </div>
        ) : (
            <div>{`Product Not Found`}</div>
        )
    );
}