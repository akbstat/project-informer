"use client";

import React from "react"

type ContextObject = {
    fontsizeTimes: number;
    versionId: number | undefined;
    pruductId: number | undefined;
    setVersionId: (id: number) => void;
    setPruductId: (id: number) => void;
    setFontsizeTimes: (id: number) => void;
};

export const Contexts = React.createContext<ContextObject | undefined>(undefined);

export function ContextProvider({ children }: { children: React.ReactNode }) {
    const [versionId, setVersionId] = React.useState<number | undefined>(undefined);
    const [pruductId, setPruductId] = React.useState<number | undefined>(undefined);
    const [fontsizeTimes, setFontsizeTimes] = React.useState<number>(1);
    return (
        <Contexts value={{ versionId, setVersionId, pruductId, setPruductId, fontsizeTimes, setFontsizeTimes }}>
            {children}
        </Contexts>
    );
}

export function useSelectionContext() {
    const context = React.useContext(Contexts);
    if (!context) {
        throw new Error('useSelection must be used within a ContextProvider');
    }
    return context;
}