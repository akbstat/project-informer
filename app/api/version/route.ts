
import { getRepositoryInstance } from "@/data/repository/repository";
import { NextResponse } from "next/server";

// import fs from "fs/promises";
// export async function GET() {
//     const entries = await fs.readdir("data", { withFileTypes: true });
//     const files = entries
//         .filter((e) => e.isFile() && e.name.toLowerCase().endsWith(".xlsx"))
//         .map((e) => e.name.replace(".xlsx", ""))
//         .sort((a, b) => a.localeCompare(b, undefined, { sensitivity: "base" }));
//     return NextResponse.json(files);
// }

export async function GET() {
    const repo = await getRepositoryInstance();
    const versions = await repo.listVersions();
    versions.sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: "base" }));
    return NextResponse.json({ data: versions });
}

