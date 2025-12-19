import { NextResponse } from "next/server";
import { getRepositoryInstance } from "@/data/repository/repository";

export async function GET() {
    const repo = await getRepositoryInstance();
    const products = await repo.listProjects();
    return NextResponse.json({ data: products });
}
