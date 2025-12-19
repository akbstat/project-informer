import { Content } from "@/data/repository/entity";
import { ProjectHistory, VersionContent } from "@/object/detail";
import { Project } from "@/object/project";
import { FunctionToolCall } from "openai/resources/beta/threads/runs/steps.mjs";

const PROJECT_PATTERN = /^[A-Z0-9]+-/;

export function fromContentsToProjects(contents: Content[]): Project[] {
    const projects = new Map();
    contents.forEach(content => {
        const projectId = content.projectId;
        const project = projects.get(projectId) || { id: projectId, name: content.project.name, owner: content.project.leaders, descriptions: [] as Content[] };
        project.descriptions.push(content);
        project.descriptions.sort((x: Content, y: Content) => x.id - y.id);
        projects.set(projectId, project);
    });
    const result = Array.from(projects.values()).sort((x, y) => x.name > y.name ? -1 : 1);
    return result.sort((x, y) => x.id - y.id);
}

export function validateProjectName(name: string): boolean {
    return PROJECT_PATTERN.test(name);
}

export function contentsToProjectHistories(contents: Content[]): ProjectHistory[] {
    if (contents.length === 0) {
        return [];
    }
    const projects = new Map<number, Content[]>();
    contents.forEach(content => {
        const project = projects.get(content.project.id);
        if (!project) {
            const { id } = content.project;
            projects.set(id, [content]);
            return;
        }
        project.push(content)
    });
    return Array.from(projects.values()).map(p => {
        const { name, leaders } = p[0].project;
        return {
            name,
            leaders,
            histories: contentsToVersionHistory(p)
        }
    }).sort((x, y) => x.name < y.name ? -1 : 1);
}

function contentsToVersionHistory(contents: Content[]): VersionContent[] {
    const versionMap = new Map<number, Content[]>();
    contents.forEach(c => {
        const version = versionMap.get(c.versionId);
        if (!version) {
            versionMap.set(c.versionId, [c])
            return;
        }
        version.push(c);
    });
    return Array.from(versionMap.values()).map(v => {
        const { name } = v[0].version;
        return {
            name,
            contents: v.sort((x, y) => x.id < y.id ? -1 : 1).map(c => c.content),
        }
    })
}

export function mergeFunctionToolCall({ source, partial }: { source?: FunctionToolCall, partial: FunctionToolCall }): FunctionToolCall {
    const { id, function: fn } = partial;
    const { name, arguments: args } = fn;
    let target: FunctionToolCall = {
        id,
        function: { name, arguments: "", output: null },
        type: "function"
    };
    if (source) {
        target = source;
    }
    if (args) {
        target.function.arguments += args;
    }
    return target;
}