
import { getRepositoryInstance } from "@/data/repository/repository";
import { ProjectDisplay } from "@/object/display";
import { ProjectDisplay as ProjectDisplayEntity } from "@/data/repository/entity";
import { NextRequest, NextResponse } from "next/server";
import { entityToObject } from "@/helper/display";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const version = searchParams.get("version") ?? "";
    const product = searchParams.get("product") ?? "";
    const versionId = parseInt(version);
    const productId = parseInt(product);
    const repo = await getRepositoryInstance();
    const displayRow = await repo.findProjectDisplay({ productId, versionId });
    let display: ProjectDisplay | null = null;
    if (displayRow) {
        const { id, productId, versionId, projectIds } = displayRow;
        display = {
            id, productId, versionId,
            projectIds: projectIds.split(",").map(n => parseInt(n) as number)
        }
    }
    return NextResponse.json({ data: display });
}

export async function POST(request: NextRequest) {
    const repo = await getRepositoryInstance();
    const { versionId, productId, projectIds: projectList } = await request.json() as ProjectDisplay;
    const projectIds = projectList.map(n => n.toString()).join(",");
    const result = await repo.createProjectDisplay({ versionId, productId, projectIds });
    return NextResponse.json({ data: entityToObject(result) });
}

