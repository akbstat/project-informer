import { ProjectDisplay } from "@/object/display";
import { ProjectDisplay as ProjectDisplayEntity } from "@/data/repository/entity";
import { apiFetch } from "./fetch";

export function entityToObject(entity: ProjectDisplayEntity): ProjectDisplay {
    const { id, productId, versionId, projectIds } = entity;
    return {
        id, productId, versionId,
        projectIds: projectIds.split(",").map(n => parseInt(n) as number)
    }
}

export async function saveDisplay(display: ProjectDisplay): Promise<ProjectDisplay> {
    if (display.id) {
        return await updateisplay(display);
    }
    return await createDisplay(display);
}

async function updateisplay(display: ProjectDisplay): Promise<ProjectDisplay> {
    const reply = await apiFetch(`/api/display/${display.id}`, {
        method: "PUT",
        body: JSON.stringify(display),
    });
    const data: { data: ProjectDisplay } = await reply.json();
    return data.data;
}

async function createDisplay(display: ProjectDisplay): Promise<ProjectDisplay> {
    const reply = await apiFetch(`/api/display`, {
        method: "POST",
        body: JSON.stringify(display),
    });
    const data: { data: ProjectDisplay } = await reply.json();
    return data.data;
}