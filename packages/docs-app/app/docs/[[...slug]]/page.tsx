import { source } from "@/lib/source";
import { DocsPageClient } from "@/components/fumadocs/DocsPageClient";
import { notFound } from "next/navigation";

interface PageProps {
    params: Promise<{ slug?: string[] }>;
}

export default async function Page({ params }: PageProps) {
    const { slug = [] } = await params;
    const page = source.getPage(slug);

    if (!page) {
        notFound();
    }

    const tree = source.pageTree;

    return (
        <DocsPageClient
            page={{
                title: page.data.title,
                description: page.data.description,
                toc: page.data.toc,
                body: page.data.body,
            }}
            tree={tree}
        />
    );
}

export function generateStaticParams() {
    return source.generateParams();
}

export async function generateMetadata({ params }: { params: Promise<{ slug?: string[] }> }) {
    const { slug = [] } = await params;
    const page = source.getPage(slug);
    if (!page) return {};

    return {
        title: `${page.data.title} - Blueprint`,
        description: page.data.description,
    };
}
