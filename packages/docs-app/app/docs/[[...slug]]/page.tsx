import { source } from "@/lib/source";
import { DocsLayout } from "@/components/fumadocs/DocsLayout";
import { notFound } from "next/navigation";
import { useMDXComponents } from "@/mdx-components";

interface PageProps {
    params: Promise<{ slug?: string[] }>;
}

export default async function Page({ params }: PageProps) {
    const { slug = [] } = await params;
    const page = source.getPage(slug);

    if (!page) {
        notFound();
    }

    const MDX = page.data.body;

    return (
        <DocsLayout toc={page.data.toc}>
            <h1>{page.data.title}</h1>
            {page.data.description && (
                <p className="docs-description">{page.data.description}</p>
            )}
            <MDX components={useMDXComponents({})} />
        </DocsLayout>
    );
}

export function generateStaticParams() {
    return source.generateParams();
}

export function generateMetadata({ params }: { params: Promise<{ slug?: string[] }> }) {
    return params.then(({ slug = [] }) => {
        const page = source.getPage(slug);
        if (!page) return {};

        return {
            title: `${page.data.title} - Blueprint`,
            description: page.data.description,
        };
    });
}
