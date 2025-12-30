import OpenAI from "openai";
import { buildToolManager, ToolManager } from "./tools";
import { ChatCompletionMessageParam } from "openai/resources/index.mjs";
import { FunctionToolCall } from "openai/resources/beta/threads/runs/steps.mjs";
import { getSystemPrompt } from "./prompts";

export class ChatModel {
    private client: OpenAI;
    private model: string;
    private toolManger?: ToolManager;
    constructor(param: CreateChatModelParam) {
        const { baseURL, apiKey, model } = param;
        this.client = new OpenAI({
            apiKey,
            baseURL,
        });
        this.model = model;
    }

    async chat(messages: ChatCompletionMessageParam[]): Promise<ReadableStream<Uint8Array>> {
        if (this.toolManger === undefined) {
            this.toolManger = await buildToolManager();
        }
        const tools = this.toolManger?.listTools();
        const stream = await this.client.chat.completions.create({
            model: this.model,
            messages: [{ role: "system", content: await getSystemPrompt() }, ...messages],
            stream: true,
            presence_penalty: 2,
            frequency_penalty: 1.0,
            temperature: 1.0,
            tools,
        }, { timeout: 60000 })

        return stream.toReadableStream();
    }
}

export interface CreateChatModelParam {
    baseURL: string,
    apiKey: string,
    model: string,
}

export interface ModelReply {
    choices: Chioce[]
};

export interface Chioce {
    delta: Delta
}

export interface Delta {
    content?: string,
    reasoning_content?: Delta
    tool_calls?: FunctionToolCall[]
}


