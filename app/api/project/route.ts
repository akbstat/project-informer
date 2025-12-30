import { NextRequest, NextResponse } from "next/server";
import { getRepositoryInstance } from "@/data/repository/repository";
import { CreateProjectRequest } from "@/object/project";

export async function GET() {
    const repo = await getRepositoryInstance();
    const products = await repo.listProjects();
    return NextResponse.json({ data: products });
}


export async function POST(request: NextRequest): Promise<NextResponse> {
    const repo = await getRepositoryInstance();
    const body = await request.json() as CreateProjectRequest;
    const project = await repo.createProject(body);
    return NextResponse.json(project);
}