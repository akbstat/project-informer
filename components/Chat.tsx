"use client";

import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Fab, List, TextField, Typography } from "@mui/material";
import { ModelReply } from "@/data/service/model";
import { ChatCompletionMessageParam, ChatCompletionToolMessageParam } from "openai/resources/index.mjs";
import { FunctionToolCall } from "openai/resources/beta/threads/runs/steps.mjs";
import Message from "./Message";
import FaceRetouchingNaturalIcon from '@mui/icons-material/FaceRetouchingNatural';
import React from "react";
import { mergeFunctionToolCall } from "@/helper/converter";
import { apiFetch } from "@/helper/fetch";

export default function Chat() {
    const [message, setMessage] = React.useState("");
    const [thinking, setThinking] = React.useState(false);
    const [modelReply, setModelReply] = React.useState("");
    const [chatDisplay, setChatDisplay] = React.useState(false);
    const [chatHistory, setChatHistory] = React.useState<ChatCompletionMessageParam[]>([]);
    const [callingTool, setCallingTool] = React.useState<string | undefined>(undefined);
    const listRef = React.useRef<HTMLUListElement>(null);
    const scrollToBottom = React.useCallback(() => {
        if (listRef.current) {
            listRef.current.scrollTop = listRef.current.scrollHeight;
        }
    }, []);
    const handleClick = () => {
        setChatDisplay(true);
    };
    const closeChat = () => {
        setChatDisplay(false);
    }
    const onMessageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setMessage(event.target.value as string);
    }
    const toolCall = async (tools: FunctionToolCall[]): Promise<ChatCompletionToolMessageParam[]> => {
        const result = [];
        for (const tool of tools) {
            setCallingTool(tool.function.name);
            const reply = await apiFetch("/api/chat/tool", {
                method: "POST",
                body: JSON.stringify(tool),
            });
            const body: { data: string } = await reply.json();
            result.push({ role: "tool", content: body.data, tool_call_id: tool.id } as ChatCompletionToolMessageParam);
        }
        setCallingTool(undefined);
        return result;
    }
    const runChatCompletion = async (currentHistories: ChatCompletionMessageParam[]) => {
        const response = await apiFetch("/api/chat", {
            method: "POST",
            body: JSON.stringify({ data: currentHistories }),
        });
        const reader = response.body?.getReader();
        if (!reader) throw new Error("Invalid Response");
        const decoder = new TextDecoder();
        let notDone = true;
        let responseText = "";
        const updatedHistories = [...currentHistories];
        let hasToolCalls = false;
        const toolCallFields: FunctionToolCall[] = [];
        while (notDone) {
            const { done, value } = await reader.read();
            if (done) notDone = false;
            const chunks = decoder.decode(value, { stream: true });
            for (const chunk of chunks.split("\n")) {
                try {
                    const reply: ModelReply = JSON.parse(chunk);
                    for (const choice of reply.choices) {
                        const { content, reasoning_content, tool_calls } = choice.delta;
                        if (reasoning_content) {
                            setThinking(true);
                        } else if (tool_calls) {
                            responseText = "";
                            tool_calls.forEach((tool, index) => {
                                const source = toolCallFields[index];
                                toolCallFields[index] = mergeFunctionToolCall({ source, partial: tool });
                            });

                            hasToolCalls = true;
                        } else if (content !== undefined) {
                            setThinking(false);
                            responseText += content;
                            setModelReply(responseText);
                        }
                        scrollToBottom();
                    }
                } catch {
                    continue;
                }
            }
        }
        if (hasToolCalls) {
            console.debug(toolCallFields);
            updatedHistories.push({ role: "assistant", tool_calls: toolCallFields });
            const toolCallResults = await toolCall(toolCallFields);
            updatedHistories.push(...toolCallResults);
        } else if (responseText) {
            updatedHistories.push({ role: "assistant", content: responseText });
        }
        setModelReply("");
        console.debug(updatedHistories);
        setChatHistory([...updatedHistories]);
        return { updatedHistories, hasToolCalls };
    };

    const submit = async () => {
        const histories = [...chatHistory];
        histories.push({ role: "user", content: message });
        setChatHistory([...histories]);
        setMessage("");
        let result = await runChatCompletion(histories);
        while (result.hasToolCalls) {
            result = await runChatCompletion(result.updatedHistories);
        }
        scrollToBottom();
    };


    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.key === 'Enter') {
            if (e.shiftKey) {
                return;
            }
            submit();
            e.preventDefault();
        }
    };
    const clearChat = () => {
        setChatHistory([]);
        setThinking(false);
    }
    React.useEffect(() => {
        scrollToBottom();
    }, [chatHistory, scrollToBottom]);
    return (
        <>
            <Fab
                onClick={handleClick}
                color="primary"
                sx={{
                    position: 'fixed',
                    bottom: 24,
                    right: 24,
                    zIndex: 1000,
                }}
            >
                <FaceRetouchingNaturalIcon />
            </Fab>
            <Dialog
                fullWidth
                open={chatDisplay}
                onClose={closeChat}
                maxWidth="xl"
                slotProps={{
                    transition: {
                        onEntered: () => {
                            if (listRef.current) {
                                scrollToBottom();
                            }
                        }
                    }
                }}
                sx={{
                    "& .MuiDialog-paper": {
                        borderWidth: "1px",
                        borderColor: "primary.main",
                    },
                }}
            >
                <DialogTitle id="alert-dialog-title">
                    <Typography color="primary.main" fontSize={30}>
                        Ask AI
                    </Typography>
                </DialogTitle>
                <DialogContent>
                    <Box>
                        <List sx={{ height: "55vh", overflow: 'auto', }} ref={listRef}>
                            {chatHistory.filter(h => h.role !== "tool" && h.content).map((h, index) => {
                                return (
                                    <Message key={index} role={h.role} content={h.content as string} />
                                );
                            })}
                            <Message role="assistant" content={modelReply} thinking={thinking} tool={callingTool} />
                        </List>
                    </Box>
                    <Box sx={{ marginTop: "1vh" }}>
                        <TextField value={message} multiline fullWidth rows={3} onKeyDown={handleKeyDown} onChange={onMessageChange} />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button sx={{ textTransform: "none" }} onClick={closeChat}>Close Chat</Button>
                    <Button sx={{ textTransform: "none" }} color="error" onClick={clearChat}>Clear History</Button>
                </DialogActions>
            </Dialog>
        </>
    );
}