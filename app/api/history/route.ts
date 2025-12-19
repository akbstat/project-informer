import { getRepositoryInstance } from "@/data/repository/repository";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const project = searchParams.get("project");
    if (!project) {
        return;
    }
    const projectId = parseInt(project);
    const repo = await getRepositoryInstance();
    const details = await repo.listContent({ projectId });
    return NextResponse.json({ data: details });
}