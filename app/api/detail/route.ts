import { NextRequest, NextResponse } from "next/server";
import { getRepositoryInstance } from "@/data/repository/repository";
import { SaveDetailRequest } from "@/object/detail";
import { saveContents } from "@/helper/content";


export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const version = searchParams.get("version") ?? "";
    const product = searchParams.get("product") ?? "";
    const project = searchParams.get("project") ?? "";
    const versionId = parseInt(version);
    const projectId = parseInt(project);
    const productId = parseInt(product);
    const repo = await getRepositoryInstance();
    const details = await repo.listContent({ productId, projectId, versionId });
    return NextResponse.json({ data: details });
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json() as SaveDetailRequest;
        const newContents = await saveContents(body);
        return NextResponse.json({ data: newContents });
    } catch (error) {
        return NextResponse.json({ error: `Failed to create detail: ${error}` }, { status: 500 });
    }
}
