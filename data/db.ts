import { DataSource } from "typeorm";
import * as dotenv from "dotenv";
import { Content, Product, Project, ProjectDisplay, Version } from "./repository/entity";

let dataSource: DataSource;

declare global {
    var __typeormDataSource__: DataSource | undefined;
}

async function initializeDataSource(): Promise<DataSource> {
    dotenv.config();
    const dataSource = new DataSource({
        url: process.env.DATABASE_URL ?? "",
        type: "postgres",
        synchronize: false,
        logging: true,
        entities: [Product, Project, Version, Content, ProjectDisplay],
    });
    await dataSource.initialize();
    return dataSource;
}

export async function getDataSource() {
    if (!global.__typeormDataSource__) {
        global.__typeormDataSource__ = await initializeDataSource();
        dataSource = global.__typeormDataSource__
    }
    return dataSource
}