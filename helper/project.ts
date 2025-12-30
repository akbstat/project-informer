import { Project } from "@/data/repository/entity";
import { Project as ProjectObject } from "@/object/project";
import { CreateProjectRequest, SaveProjectRequest } from "@/object/project";
import { apiFetch } from "./fetch";

export async function listProjects(): Promise<Project[]> {
    const reply = await (await apiFetch("/api/project")).json();
    const projects = reply.data as Project[];
    projects.sort((x, y) => x.name < y.name ? -1 : 1);
    return projects;
}

export async function createProject(request: SaveProjectRequest): Promise<Project> {
    const { name, blindLeaders, unblindLeaders } = request;
    let leaders = "";
    if (blindLeaders.length > 0) {
        leaders += `${blindLeaders.join(", ")}`;
    }
    if (unblindLeaders.length > 0) {
        leaders += `|${unblindLeaders.join(", ")}`;
    }
    const response = await apiFetch("/api/project", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, leaders, ongoing: true, status: "" } as CreateProjectRequest),
    });
    return await response.json();
}

export function customProjectSorter(project: ProjectObject[], custom: number[] | null): ProjectObject[] {
    if (custom) {
        const orderMap = new Map<number, number>();
        custom.forEach((id, index) => {
            orderMap.set(id, index);
        });

        return [...project].sort((x, y) => {
            const xIndex = orderMap.get(x.id);
            const yIndex = orderMap.get(y.id);
            if (xIndex !== undefined && yIndex !== undefined) {
                return xIndex - yIndex;
            }
            if (xIndex !== undefined) {
                return -1;
            }
            if (yIndex !== undefined) {
                return 1;
            }
            return 0;
        });
    }
    return project.sort((x, y) => x.owner < y.owner ? -1 : 1);
}