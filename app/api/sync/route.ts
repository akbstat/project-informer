
import { getRepositoryInstance } from "@/data/repository/repository";
import { authenticate } from "@/helper/auth";
import { ProjectSyncer } from "@/helper/syncer";
import { SyncVersionRequest } from "@/object/version";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    const param = (await request.json()) as SyncVersionRequest;
    const jwt = await authenticate(param.auth);
    const repo = await getRepositoryInstance();
    const syncer = new ProjectSyncer({ jwt, repo, version: param.version });
    await syncer.run();
    return NextResponse.json({ message: "Data sync initiated." });
}


