import History from "@/components/History";


export default async function Detail({ params }: { className: string, params: Promise<{ slug: string }> }) {
    const { slug: id } = await params;
    return (
        <History project={parseInt(id)} />
    );
}

