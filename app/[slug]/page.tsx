import ProductDetail from "@/components/Detail";

export default async function Detail({ params }: { className: string, params: Promise<{ slug: string }> }) {
    const { slug: id } = await params;
    return (
        <ProductDetail product={id} />
    );
}

