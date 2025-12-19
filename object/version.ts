import { AuthParam } from "./auth";

export interface CreateVersionRequest {
    name: string,
}

export interface Version {
    year: string,
    month: string,
}

export interface SyncVersionRequest {
    auth: AuthParam,
    version?: string,
    overwrite?: boolean,
}