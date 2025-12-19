
import { buildToolManager } from "@/data/service/tools";
import { NextRequest, NextResponse } from "next/server";
import { FunctionToolCall } from "openai/resources/beta/threads/runs/steps.mjs";

export async function POST(request: NextRequest) {
    try {
        const args = await request.json() as FunctionToolCall;
        const toolManger = await buildToolManager();
        const data = await toolManger.callTool(args);
        return NextResponse.json({ data });
    } catch (error) {
        return NextResponse.json({ error: `Failed to call tools: ${error}` }, { status: 500 });
    }
}
