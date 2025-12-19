import { Content } from "@/data/repository/entity";

export interface Product {
    id: number,
    name: string,
}

export interface Project {
    id: number;
    name: string;
    owner: string;
    descriptions: Content[]
}

