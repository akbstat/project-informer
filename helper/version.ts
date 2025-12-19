import { Version } from "@/object/version";

export function getVersion(): string {
    return (new Date()).toISOString().substring(0, 7);
}

export function getVersionObject(): Version {
    const now = new Date();
    return {
        year: now.getFullYear().toString(),
        month: (now.getMonth() + 1).toString(),
    }
}