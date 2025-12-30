import ProjectEditor from "@/components/ProjectEditor";
import { getRepositoryInstance } from "@/data/repository/repository";
import { buildLeaderOptions } from "@/helper/leader";
import { saveProject } from "@/helper/server/project";

export const dynamic = "force-dynamic";

export default async function CreateProject() {
    const repo = await getRepositoryInstance();
    const projects = await repo.listProjects();
    const leaderOptions = buildLeaderOptions(projects);
    return (
        <ProjectEditor
            leaderOptions={leaderOptions}
            label="Create Project"
            save={saveProject}
        />
    );
}