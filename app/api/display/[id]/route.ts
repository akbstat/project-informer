import { NextRequest, NextResponse } from "next/server";
import { getRepositoryInstance } from "@/data/repository/repository";
import { ProjectDisplay } from "@/object/display";
import { entityToObject } from "@/helper/display";

export async function PUT(request: NextRequest, context: { params: Promise<{ id: string; }> }) {
    try {
        const { id } = await context.params;
        const displayId = id ? parseInt(id) : undefined;
        const { versionId, productId, projectIds: order } = await request.json() as ProjectDisplay;
        const projectIds = order.map(n => n.toString()).join(",");
        if (!displayId) {
            return NextResponse.json({ error: "Missing detail ID" }, { status: 400 });
        }
        const repo = await getRepositoryInstance();
        const display = await repo.updateProjectDisplay(displayId, { versionId, productId, projectIds });
        if (!display) {
            return NextResponse.json({ error: "Content not found" }, { status: 404 });
        }
        return NextResponse.json({ data: entityToObject(display) });
    } catch (error) {
        return NextResponse.json({ error: `Failed to update detail: ${error}` }, { status: 500 });
    }
}
