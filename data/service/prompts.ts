import { readFile } from "fs/promises";

const SYSTEM_PROMPT_FILEPATH = `${process.cwd()}/prompts/system.md`;
let systemPrompt: string;

declare global {
    var __systemPrompt__: string | undefined;
}

export async function getSystemPrompt() {
    if (!global.__systemPrompt__) {
        const prompt = await readFile(SYSTEM_PROMPT_FILEPATH, "utf-8");
        global.__systemPrompt__ = prompt;
    }
    systemPrompt = global.__systemPrompt__;
    return systemPrompt
}