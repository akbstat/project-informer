import { getRepositoryInstance, Repository } from "@/data/repository/repository";
import { contentsToProjectHistories } from "@/helper/converter";
import { FunctionToolCall } from "openai/resources/beta/threads/runs/steps.mjs";
import { ChatCompletionFunctionTool } from "openai/resources/index.mjs";
import { ProjectHistory } from "@/object/detail";
import { Project } from "../repository/entity";

export async function buildToolManager() {
    const repository = await getRepositoryInstance();
    return new ToolManager(repository);
}

type ToolExecute = (param: unknown) => Promise<unknown>;

export class ToolManager {
    private repository: Repository;
    private toolMap: Map<string, ToolExecute>;
    private toolList: ChatCompletionFunctionTool[];
    constructor(repository: Repository) {
        this.repository = repository;
        this.toolMap = new Map<string, ToolExecute>();
        this.toolList = [
            this.getAllProjectInfoWrap(),
            this.getProjectLogsWrap(),
            this.getCurrentDateWrap(),
        ];
    }

    async callTool(param: FunctionToolCall): Promise<string> {
        const { name, arguments: args } = param.function;
        const targetTool = this.toolMap.get(name);
        return targetTool ?
            await targetTool(JSON.parse(args)) as string :
            `工具**${name}**不存在`
    }

    listTools(): ChatCompletionFunctionTool[] {
        return this.toolList;
    }

    async getCurrentDate(): Promise<string> {
        return (new Date()).toISOString().substring(0, 10);
    }

    async getProjectInfo({ code, leader, ongoing }: { code?: string, leader?: string, ongoing?: boolean }): Promise<string> {
        let projects = await this.repository.listProjects();
        if (code) {
            projects = projects.filter(p => p.name === code);
        }
        if (leader) {
            projects = projects.filter(p => p.leaders.indexOf(leader) > -1);
        }
        if (ongoing) {
            projects = projects.filter(p => p.ongoing);
        }
        return buildMdFlavorProjectLeader(projects);
    }

    async getProjectLogs({ code, date }: { code?: string, date?: string }): Promise<string> {
        const projectId = code ? (await this.repository.findProjectByName(code))?.id : undefined;
        const versionId = date ? (await this.repository.findVersion(date))?.id : undefined;
        const projectLogs = await this.repository.listContent({ projectId, versionId });
        const histories = contentsToProjectHistories(projectLogs);
        return histories.length > 0 ? buildMdFlavorProjectLogs(histories) : "暂无对应的项目记录信息";
    }

    getCurrentDateWrap(): ChatCompletionFunctionTool {
        const name = "get_current_date";
        this.toolMap.set(name, () => this.getCurrentDate());
        return {
            type: "function",
            function: {
                name,
                strict: true,
                description: "获取当前系统日期",
            }
        }
    }

    getProjectLogsWrap(): ChatCompletionFunctionTool {
        const name = "get_logs_of_projects";
        this.toolMap.set(name, (param: unknown) => this.getProjectLogs(param as { code: string, date: string }));
        return {
            type: "function",
            function: {
                name,
                parameters: {
                    type: "object",
                    properties: {
                        code: { type: "string", description: "项目编号", required: false },
                        date: { type: "string", description: "查询日期", required: false },
                    },
                },
                strict: true,
                description: "查询项目进度的日志信息",
            }
        }
    }


    getAllProjectInfoWrap(): ChatCompletionFunctionTool {
        const name = "get_project_information";
        this.toolMap.set(name, (param: unknown) => this.getProjectInfo(param as { code?: string, leader?: string, ongoing?: boolean }));
        return {
            type: "function",
            function: {
                name,
                parameters: {
                    type: "object",
                    properties: {
                        code: { type: "string", description: "项目编号", required: false },
                        leader: { type: "string", description: "项目负责人名称, 如不提供, 则查询所有负责人", required: false },
                        ongoing: { type: "boolean", description: "是否仅查询正在进行的项目, 如不提供, 则默认为否", required: false },
                    },
                },
                strict: true,
                description: "查询项目的以下信息：项目名称, 负责人, 项目状态, 以及是否正在进行",
            }
        }
    }
}

function buildMdFlavorProjectLeader(source: Project[]) {
    const tableHeader = "|项目名称|负责人(若有多个负责人, 则用逗号隔开)|是否正在进行?|状态描述|\n|-|-|-|-|\n";
    const tableRows = source.map(s => `|${s.name}|${s.leaders}|${s.ongoing ? "是" : "否"}|${s.status}|`).join("\n");
    return `${tableHeader}${tableRows}`;
}


function buildMdFlavorProjectLogs(source: ProjectHistory[]): string {
    const contents = source.map(p => {
        const header = `## 项目名称: ${p.name}\n\n## 项目负责人(Leader): ${p.leaders}\n\n`;
        const tableHeader = "|date|log|\n|-|-|\n";
        const tableRows = p.histories.map(h => {
            return `|${h.name}|${h.contents.join("\n")}|`
        }).join("\n");
        return `${header}\n${tableHeader}\n${tableRows}}\n`
    });
    return contents.join("\n---\n")
}