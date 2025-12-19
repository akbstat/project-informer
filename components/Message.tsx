import { Box, ListItem } from "@mui/material";
import ReactMarkdown, { Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSanitize from "rehype-sanitize";
import CircularProgress from '@mui/material/CircularProgress';
import React from "react";

export default function Message({ role, content, tool, thinking }: { role: string, content?: string, tool?: string, thinking?: boolean }) {
    let result = thinking ?
        (<Thinking />) : (
            tool ?
                (<CallTool name={tool} />) :
                (
                    content && content.length > 0 ?
                        (
                            <ModelReply content={content} />
                        ) :
                        null
                )

        );

    if (result) {
        result = (
            <MessageWrapper role={role}>
                {result}
            </MessageWrapper>
        );
    }

    return (result);
}

function MessageWrapper({ children, role }: { children: React.ReactNode, role: string }) {
    const color = role === "assistant" ? "primary.main" : "";
    const justifyContent = role === "user" ? "flex-end" : "flex-start";
    return (
        <ListItem sx={{ justifyContent }} >
            <Box sx={{
                maxWidth: "75%",
                color: color,
                padding: "15px",
                borderRadius: "15px",
                borderWidth: "2px",
                borderColor: "primary.light",
            }}>
                {children}
            </Box>
        </ListItem>
    );
}

function Thinking() {
    return (
        < >
            Thinking <CircularProgress size={15} />
        </>
    )
}

function CallTool({ name }: { name: string }) {
    return (
        < >
            {`Calling Tool ${name}`} <CircularProgress size={15} />
        </>
    )
}

function ModelReply({ content }: { content: string }) {
    return (
        <>
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeSanitize]}
                components={TABLE_COMPONENT}
            >
                {content}
            </ReactMarkdown>
        </>
    )
}

const TABLE_COMPONENT: Partial<Components> = {
    table({ children }) {
        return (
            <table
                style={{
                    borderCollapse: "collapse",
                    width: "100%",
                    margin: "1rem 0",
                }}
            >
                {children}
            </table>
        );
    },
    th({ children }) {
        return (
            <th
                style={{
                    border: "1px solid",
                    padding: "0.5rem",
                    fontWeight: "bold",
                    textAlign: "left",
                }}
            >
                {children}
            </th>
        );
    },
    td({ children }) {
        return (
            <td
                style={{
                    border: "1px solid",
                    padding: "0.5rem",
                    textAlign: "left",
                }}
            >
                {children}
            </td>
        );
    },
};