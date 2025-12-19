import { Content, Project } from "@/data/repository/entity";

export interface DetailParam {
    productId: number;
    projectId: number;
    versionId: number;
    content: string;
}

export interface SaveDetailRequest {
    project: Project,
    versionId: number,
    contents: Content[],
}

export interface ProjectHistory {
    name: string,
    leaders: string,
    histories: VersionContent[],
}

export interface VersionContent {
    name: string,
    contents: string[],
}


