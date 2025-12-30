
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToOne, JoinColumn, Index } from "typeorm";

@Entity({ name: "products" })
@Index("idx_products", ["name"], { unique: true })
export class Product {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "varchar", length: 20 })
    name: string;

    @CreateDateColumn({ name: "created_at", type: "timestamptz" })
    createdAt: Date;

    @UpdateDateColumn({ name: "updated_at", type: "timestamptz" })
    updatedAt: Date;

    @OneToMany(() => Content, (c) => c.project)
    contents: Content[];
}

@Entity({ name: "projects" })
@Index("idx_projects", ["name"], { unique: true })
export class Project {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "varchar", length: 20 })
    name: string;

    @Column({ type: "varchar", length: 100 })
    leaders: string;

    @Column({ type: "varchar", length: 100 })
    status: string;

    @Column({ type: "boolean" })
    ongoing: boolean;

    @CreateDateColumn({ name: "created_at", type: "timestamptz" })
    createdAt: Date;

    @UpdateDateColumn({ name: "updated_at", type: "timestamptz" })
    updatedAt: Date;

    @OneToMany(() => Content, (contents) => contents.project)
    contents: Content[];
}

@Entity({ name: "versions" })
@Index("idx_versions", ["name"], { unique: true })
export class Version {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "varchar", length: 20 })
    name: string;

    @CreateDateColumn({ name: "created_at", type: "timestamptz" })
    createdAt: Date;

    @UpdateDateColumn({ name: "updated_at", type: "timestamptz" })
    updatedAt: Date;

    @OneToMany(() => Content, (c) => c.version)
    contents: Content[];
}

@Entity({ name: "contents" })
@Index("idx_contents", ["versionId", "projectId"])
export class Content {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: "version_id", type: "integer" })
    versionId: number;

    @Column({ name: "product_id", type: "integer" })
    productId: number;

    @Column({ name: "project_id", type: "integer" })
    projectId: number;

    @Column({ type: "varchar", length: 1000 })
    content: string;

    @Column({ name: "from_active", type: "boolean" })
    fromActive: boolean;

    @CreateDateColumn({ name: "created_at", type: "timestamptz" })
    createdAt: Date;

    @UpdateDateColumn({ name: "updated_at", type: "timestamptz" })
    updatedAt: Date;

    @ManyToOne(() => Version, (versions) => versions.contents)
    @JoinColumn({ name: "version_id" })
    version: Version;

    @ManyToOne(() => Product, (products) => products.contents)
    @JoinColumn({ name: "product_id" })
    product: Product;

    @ManyToOne(() => Project, (projects) => projects.contents)
    @JoinColumn({ name: "project_id" })
    project: Project;
}


@Entity({ name: "project_display" })
@Index("idx_project_display", ["versionId", "productId"])
export class ProjectDisplay {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: "version_id", type: "integer" })
    versionId: number;

    @Column({ name: "product_id", type: "integer" })
    productId: number;

    @Column({ name: "project_ids", type: "varchar", length: 1000 })
    projectIds: string;

    @CreateDateColumn({ name: "created_at", type: "timestamptz" })
    createdAt: Date;

    @UpdateDateColumn({ name: "updated_at", type: "timestamptz" })
    updatedAt: Date;
}