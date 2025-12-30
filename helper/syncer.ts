
import { Version } from "@/data/repository/entity";
import { Repository } from "@/data/repository/repository";
import { Workbook } from "exceljs";
import { getVersion } from "./version";

export class ProjectSyncer {
    private version: string;
    private workbook: Workbook;
    private jwt: string;
    private repo: Repository;

    constructor({ jwt, repo, version }: { jwt: string, repo: Repository, version?: string }) {
        this.jwt = jwt;
        this.version = version ? version : getVersion();
        this.workbook = new Workbook();
        this.repo = repo;
    }

    async run() {
        let versionId = await this.versionExisted();
        if (versionId !== undefined) {
            await this.repo.deleteContentByVersion(versionId);
        }
        await this.fetchData();
        await this.updateProductsAndProjects();
        if (versionId === undefined) {
            const version = await this.createVersion();
            versionId = version.id;
        }
        await this.updateContents(versionId);
    }

    private async updateContents(versionId: number) {
        const sheet = this.workbook.getWorksheet("统计编程部门_项目状态更新记录");
        if (!sheet) {
            return;
        }

        const products = new Map((await this.repo.listProducts()).map(p => [p.name, p.id]));
        const projects = new Map((await this.repo.listProjects()).map(p => [p.name, p.id]));

        const rows = sheet.getRows(2, sheet.actualRowCount);
        if (!rows) {
            return;
        }

        for (const row of rows) {
            const department = row.getCell(3).toString();
            if (department !== "编程部门") {
                continue;
            }
            const date = row.getCell(5).toString().substring(0, 7);
            if (date !== this.version) {
                continue;
            }
            const project = row.getCell(1).toString();
            const product = project.split("-")[0];
            const projectId = projects.get(project);
            const productId = products.get(product);
            if (!projectId || !productId) {
                continue;
            }

            const descriptions = row.getCell(2).toString().split("\n");
            for (const content of descriptions) {
                await this.repo.createContent({
                    versionId,
                    projectId,
                    productId,
                    content,
                    fromActive: true,
                });
            }
        }
    }

    private async createVersion(): Promise<Version> {
        return await this.repo.createVersion({ name: this.version });
    }

    private async updateProductsAndProjects() {
        const sheet = this.workbook.getWorksheet("项目管理基本信息");
        if (!sheet) {
            return;
        }

        const rows = sheet.getRows(2, sheet.actualRowCount);
        if (!rows) {
            return;
        }

        const products = new Set((await this.repo.listProducts()).map(p => p.name));
        const projectInfo = new Map((await this.repo.listProjects()).map(p => [p.name, {
            leaders: p.leaders,
            ongoing: p.ongoing,
            status: p.status,
        }]));
        for (const row of rows) {
            const projectName = row.getCell(1).toString();
            const status = row.getCell(2).toString();
            const ongoing = isOngoing(status);
            const ownerList = [];
            // blind owner
            ownerList.push(row.getCell(4).toString());
            // unblind owner
            ownerList.push(row.getCell(5).toString());
            const owners = ownerList.filter(o => o.length > 0).join("|");
            if (projectName.length === 0) {
                continue;
            }
            const produdct = projectName.split("-")[0];
            if (!products.has(produdct)) {
                await this.repo.createProduct({ name: produdct });
                products.add(produdct);
            }
            const project = projectInfo.get(projectName);
            if (project === undefined) {
                await this.repo.createProject({ name: projectName, leaders: owners, status, ongoing });
                projectInfo.set(projectName, { leaders: owners, ongoing, status });
                continue;
            } else {
                const p = await this.repo.findProjectByName(projectName);
                if (!p || (p.leaders === owners && p.ongoing === ongoing && p.status === status)) {
                    continue
                }
                await this.repo.updateProject(p.id, { leaders: owners, status, ongoing });
                projectInfo.set(projectName, { leaders: owners, ongoing, status });
            }
        }
    }

    private async fetchData() {
        const response = await fetch("https://active.akesobio.com:8888/akApi/v1/pm/projects/data_export/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${this.jwt}`,
            },
            body: `{"supplierInfo":false,"statusInfo":false,"bs_sp_Info":true,"project_cols":[{"id":"projectId","name":"项目编号"},{"id":"project_statues","name":"项目状态"},{"id":"is_sp_owned","name":"编程是否自营"}],"dm_nodes_cols":[],"bs_nodes_cols":[],"sp_nodes_cols":[{"id":"desc","name":"统计编程项目状态描述"},{"id":"fill_at","name":"统计编程创建日期"},{"id":"created_by","name":"统计编程创建人"}],"member_cols":[{"id":"统计编程","name":"统计编程"},{"id":"统计编程(非盲)","name":"统计编程(非盲)"}]}`,
        });
        const blob = await response.blob();
        const arrayBuffer = await blob.arrayBuffer();
        await this.workbook.xlsx.load(arrayBuffer);
    }

    private async versionExisted(): Promise<number | undefined> {
        const versions = await this.repo.listVersions();
        for (const version of versions) {
            if (version.name === this.version) {
                return version.id;
            }
        }
        return undefined;
    }
}


const NOT_ONGOING_STATUS = [
    "无",
    "立项完成",
    "方案审核",
    "CRF设计",
    "DVP配置",
    "EDC仅界面上线",
    "EDC整体上线",
    "项目结束",
]

function isOngoing(status: string): boolean {
    for (const s of NOT_ONGOING_STATUS) {
        if (status === s) {
            return false;
        }
    }
    return true;
}