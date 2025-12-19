import { getModelService } from "@/data/service";
import { NextRequest } from "next/server";
import { ChatCompletionMessageParam } from "openai/resources/index.mjs";

export async function POST(request: NextRequest) {
    const requestBody: { data: ChatCompletionMessageParam[] } = await request.json();
    const messages = requestBody.data;
    const modelService = getModelService();
    const stream = await modelService.chat(messages);
    return new Response(stream, {
        headers: {
            'Content-Type': 'application/x-ndjson; charset=utf-8', // NDJSON MIME 类型
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
        },
    });
}

