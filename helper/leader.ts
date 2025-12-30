import { Project } from "@/data/repository/entity";

export type LeaderGroup = {
    blindLeaders: string[],
    unblindLeaders: string[],
}

export function seperateLeaderIntoGroup(source: string): LeaderGroup {
    const parts = source.split("|");
    const blind = parts[0];
    const unblind = parts[1];
    return {
        blindLeaders: seperateLeader(blind),
        unblindLeaders: seperateLeader(unblind),
    }
}

function seperateLeader(source: string | undefined): string[] {
    if (!source) {
        return [];
    }
    return source.split(",").map(s => s.trim()).filter(s => s.length > 0);
}

export function buildLeaderOptions(projects: Project[]): string[] {
    const leaderSet = new Set<string>();
    projects.forEach(p => {
        p.leaders.split("|").forEach(l => {
            l.split(",").forEach(name => {
                const trimmed = name.trim();
                if (trimmed.length > 0) {
                    leaderSet.add(trimmed);
                }
            });
        });
    });
    return Array.from(leaderSet);
}

export function combineLeaderGroups(group: LeaderGroup): string {
    const { blindLeaders, unblindLeaders } = group;
    let leaders = "";
    if (blindLeaders.length > 0) {
        leaders += `${blindLeaders.join(", ")}`;
    }
    if (unblindLeaders.length > 0) {
        leaders += `|${unblindLeaders.join(", ")}`;
    }
    return leaders;
}