import ProjectEditor from "@/components/ProjectEditor";
import { Project } from "@/data/repository/entity";
import { getRepositoryInstance } from "@/data/repository/repository";
import { buildLeaderOptions } from "@/helper/leader";
import { saveProject } from "@/helper/server/project";

export const dynamic = "force-dynamic";

export default async function UpdateProject({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const id = parseInt(slug);
    const repo = await getRepositoryInstance();
    const projects = await repo.listProjects();
    const project = projects.filter(p => p.id === id)[0];
    const { name, leaders } = project as Project;
    const leaderOptions = buildLeaderOptions(projects);

    return (
        project ? <ProjectEditor
            project={{ id, name, leaders }}
            label="Update Project"
            leaderOptions={leaderOptions}
            save={saveProject}
        /> : null
    );
}

