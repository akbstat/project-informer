import ContentEditor from "@/components/ContentEditor";

export default async function ContentPage({
    searchParams,
}: {
    searchParams: Promise<{ project?: string }>
}) {
    const { project } = await searchParams;
    const projectId = project ? parseInt(project) : undefined;
    return <ContentEditor projectId={projectId} />;
}