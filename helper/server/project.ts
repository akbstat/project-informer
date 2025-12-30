"use server";

import { getRepositoryInstance } from "@/data/repository/repository";
import { SaveProjectRequest } from "@/object/project";
import { combineLeaderGroups } from "../leader";

export async function saveProject(id: number | undefined, request: SaveProjectRequest): Promise<void> {
    const repo = await getRepositoryInstance();
    const { name, blindLeaders, unblindLeaders } = request;
    const leaders = combineLeaderGroups({ blindLeaders, unblindLeaders })
    if (id) {
        await repo.updateProject(id, { name, leaders });
        return;
    }
    await repo.createProject({ name, leaders, ongoing: true, status: "联合项目" });
}