import { SaveDetailRequest, ProjectHistory } from "@/object/detail";
import { getRepositoryInstance, Repository } from "@/data/repository/repository";
import { Content, Project } from "@/data/repository/entity";

export async function saveContents(request: SaveDetailRequest) {
    const { contents, project, versionId } = request;
    const repo = await getRepositoryInstance();
    const creator = new ContentSaver(project, versionId, repo);
    await creator.init();
    await creator.save(contents);
}

class ContentSaver {
    private productId: number | undefined;
    private project: Project;
    private versionId: number;
    private repo: Repository;
    constructor(project: Project, versionId: number, repo: Repository) {
        this.project = project;
        this.versionId = versionId;
        this.repo = repo;
    }
    async init() {
        this.productId = await this.mustGetProductId();
        if (this.project.id === undefined) {
            const { name, leaders } = this.project;
            this.project = await this.repo.createProject({ name, leaders, ongoing: true });
        } else {
            await this.repo.updateProject(this.project.id, this.project);
        }
    }
    async save(contents: Content[]) {
        const oldContents = await this.findExistedContents({ versionId: this.versionId, projectId: this.project.id });

        for (const content of contents) {
            if (content.id) {
                await this.update(content);
                oldContents.delete(content.id);
                continue;
            }
            await this.create(content)
        }

        // the rest of old contents should be deleted
        for (const id of oldContents.values()) {
            await this.delete(id);
        }
    }

    private async findExistedContents({ versionId, projectId }: { versionId: number, projectId: number }): Promise<Set<number>> {
        const contents = await this.repo.listContent({ versionId, projectId });
        const ids = contents.map(c => c.id);
        return new Set(ids);
    }

    private async update(incoming: Content): Promise<Content | undefined> {
        const { id, content } = incoming;
        return await this.repo.updateContent(id, { content });
    }

    private async create(incoming: Content): Promise<Content> {
        const { content, versionId } = incoming;
        return await this.repo.createContent({
            productId: this.productId,
            projectId: this.project.id,
            versionId,
            content,
            fromActive: false,
        });
    }

    private async delete(id: number) {
        await this.repo.deleteContent(id);
    }

    private async mustGetProductId(): Promise<number> {
        const productName = this.project.name.split("-")[0];
        const products = await this.repo.listAllProducts();
        const target = products.find((p) => p.name === productName);
        if (target) {
            return target.id;
        }
        const newProduct = await this.repo.createProduct({ name: productName });
        return newProduct.id;
    }
}


export function buildMdFlavorProjectLog(source: ProjectHistory): string {
    const header = `## 项目名称: ${source.name}\n\n## 项目Leader: ${source.leaders.length > 0 ? source.leaders : "暂无"}\n\n`;
    const tableHeader = "|date|log|\n|-|-|\n";
    const tableRows = source.histories.map(h => {
        return `|${h.name}|${h.contents.join("\n")}|`
    }).join("\n");

    return `${header}${tableHeader}${tableRows}`
}