import { DataSource } from "typeorm";
import { getDataSource } from "../db";
import { Content, Product, Project, ProjectDisplay, Version } from "./entity";

declare global {
    var _repository__: Repository | undefined;
}

export async function getRepositoryInstance(): Promise<Repository> {
    if (!global._repository__) {
        const dataSource = await getDataSource();
        global._repository__ = new Repository(dataSource);
    }
    return global._repository__;
}

export class Repository {
    private dataSource: DataSource;
    constructor(dataSource: DataSource) {
        this.dataSource = dataSource;
    }

    async listVersions(): Promise<Version[]> {
        return this.dataSource.getRepository(Version).createQueryBuilder("versions").getMany();
    }

    async findVersion(name: string): Promise<Version | null> {
        return this.dataSource.getRepository(Version).createQueryBuilder("versions").where("versions.name = :name", { name }).getOne();
    }

    async createVersion(version: Partial<Version>): Promise<Version> {
        const versionRepository = this.dataSource.getRepository(Version);
        const newVersion = versionRepository.create(version);
        return versionRepository.save(newVersion);
    }

    async listProductsByVersion(versionId: number): Promise<Product[]> {
        const productIds = await this.getProductIdsBy(versionId);
        // query products according to productIds
        const products: Product[] = await this.dataSource.getRepository(Product).createQueryBuilder("products").whereInIds(productIds).getMany();
        return products;
    };

    async listAllProducts(): Promise<Product[]> {
        const products: Product[] = await this.dataSource.getRepository(Product).createQueryBuilder("products").getMany();
        return products;
    }

    async listContent({ productId, projectId, versionId }: { productId?: number, projectId?: number, versionId?: number }): Promise<Content[]> {
        const querier = this.dataSource.getRepository(Content).createQueryBuilder("contents")
            .leftJoinAndSelect("contents.project", "project")
            .leftJoinAndSelect("contents.version", "version");

        if (productId) {
            querier.andWhere("contents.productId = :productId", { productId });
        }
        if (projectId) {
            querier.andWhere("contents.projectId = :projectId", { projectId });
        }
        if (versionId) {
            querier.andWhere("contents.versionId = :versionId", { versionId });
        }

        const rows = await querier.getMany();
        return rows
    }

    async createProduct(product: Partial<Product>): Promise<Product> {
        const productRepository = this.dataSource.getRepository(Product);
        const newProduct = productRepository.create(product);
        return productRepository.save(newProduct);
    }

    async listProducts(): Promise<Product[]> {
        return this.dataSource.getRepository(Product).createQueryBuilder("products").getMany();
    }

    async createProject(project: Partial<Project>): Promise<Project> {
        const projectRepository = this.dataSource.getRepository(Project);
        const newProject = projectRepository.create(project);
        return projectRepository.save(newProject);
    }

    async listProjects(): Promise<Project[]> {
        return this.dataSource.getRepository(Project).createQueryBuilder("projects").getMany();
    }

    async findProjectByName(name: string): Promise<Project | null> {
        const projectRepository = this.dataSource.getRepository(Project);
        return projectRepository.findOneBy({ name });
    }

    async updateProject(projectId: number, updatedFields: Partial<Project>): Promise<Project | null> {
        const projectRepository = this.dataSource.getRepository(Project);
        const project = await projectRepository.findOneBy({ id: projectId });
        if (!project) {
            return null;
        }
        Object.assign(project, updatedFields);
        return projectRepository.save(project);
    }

    async createContent(content: Partial<Content>): Promise<Content> {
        const contentRepository = this.dataSource.getRepository(Content);
        const newContent = contentRepository.create(content);
        return contentRepository.save(newContent);
    }

    async updateContent(contentId: number, updatedFields: Partial<Content>): Promise<Content | undefined> {
        const contentRepository = this.dataSource.getRepository(Content);
        const content = await contentRepository.findOneBy({ id: contentId });
        if (!content) {
            return undefined;
        }
        Object.assign(content, updatedFields);
        return contentRepository.save(content);
    }

    async deleteContent(contentId: number): Promise<boolean> {
        const contentRepository = this.dataSource.getRepository(Content);
        const result = await contentRepository.delete(contentId);
        return result.affected !== 0;
    }

    async deleteContentByVersion(versionId: number) {
        await this.dataSource.createQueryBuilder().delete().from(Content).where("version_id = :versionId", { versionId }).andWhere("from_active = true").execute()
    }


    private async getProductIdsBy(versionId: number): Promise<number[]> {
        const contents = await this.dataSource.getRepository(Content).createQueryBuilder("contents").where("contents.version_id = :versionId", { versionId }).getMany();
        const set = new Set(contents.map(p => p.productId));
        return Array.from(set);
    }

    async findProjectDisplay({ productId, versionId }: Partial<ProjectDisplay>) {
        const repository = this.dataSource.getRepository(ProjectDisplay);
        return repository.findOneBy({ productId, versionId });
    }

    async createProjectDisplay(display: Partial<ProjectDisplay>): Promise<ProjectDisplay> {
        const repository = this.dataSource.getRepository(ProjectDisplay);
        const newDisplay = repository.create(display);
        return repository.save(newDisplay);
    }

    async updateProjectDisplay(id: number, display: Partial<ProjectDisplay>): Promise<ProjectDisplay | undefined> {
        const repository = this.dataSource.getRepository(ProjectDisplay);
        const row = await repository.findOneBy({ id });
        if (!row) {
            return undefined;
        }
        Object.assign(row, display);
        return repository.save(row);
    }
}