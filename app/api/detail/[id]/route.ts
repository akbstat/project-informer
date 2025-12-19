import { NextRequest, NextResponse } from "next/server";
import { getRepositoryInstance } from "@/data/repository/repository";
import { DetailParam } from "@/object/detail";

export async function PUT(request: NextRequest, context: { params: Promise<{ id: string; }> }) {
    try {
        const { id } = await context.params;
        const contentId = id ? parseInt(id) : undefined;
        const body = await request.json() as DetailParam;
        if (!contentId) {
            return NextResponse.json({ error: "Missing detail ID" }, { status: 400 });
        }
        const repo = await getRepositoryInstance();
        const updatedDetail = await repo.updateContent(contentId, body);
        if (!updatedDetail) {
            return NextResponse.json({ error: "Content not found" }, { status: 404 });
        }
        return NextResponse.json({ data: updatedDetail });
    } catch (error) {
        return NextResponse.json({ error: `Failed to update detail: ${error}` }, { status: 500 });
    }
}

export async function DELETE(_request: NextRequest, context: { params: Promise<{ id: string; }> }) {
    try {
        const { id } = await context.params;
        const contentId = id ? parseInt(id) : undefined;
        if (!contentId) {
            return NextResponse.json({ error: "Missing detail ID" }, { status: 400 });
        }
        const repo = await getRepositoryInstance();
        const success = await repo.deleteContent(contentId);
        if (!success) {
            return NextResponse.json({ error: "Detail not found" }, { status: 404 });
        }
        return NextResponse.json({ message: "Detail deleted successfully" });
    } catch (error) {
        return NextResponse.json({ error: `Failed to delete detail: ${error}` }, { status: 500 });
    }
}