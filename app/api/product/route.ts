import { NextRequest, NextResponse } from "next/server";
import { getRepositoryInstance } from "@/data/repository/repository";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const version = searchParams.get("version");
    const repo = await getRepositoryInstance();
    if (!version) {
        const products = await repo.listAllProducts();
        return NextResponse.json({ data: products });
    }
    const versionId = parseInt(version);
    const products = await repo.listProductsByVersion(versionId);
    return NextResponse.json({ data: products });
}
