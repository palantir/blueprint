import { source } from "@/lib/source";
import { DocsPage, DocsBody, DocsTitle, DocsDescription } from "fumadocs-ui/page";
import { notFound } from "next/navigation";
import { LLMCopyButton, ViewOptions } from "@/components/page-actions";
import defaultMdxComponents from "fumadocs-ui/mdx";

export default async function Page(props: { params: Promise<{ slug?: string[] }> }) {
    const params = await props.params;
    const page = source.getPage(params.slug);
    if (!page) notFound();

    const MDX = page.data.body;

    return (
        <DocsPage toc={page.data.toc}>
            <div className="flex flex-row items-center justify-between">
                <DocsTitle>{page.data.title}</DocsTitle>
                <div className="flex flex-row gap-2 items-center">
                    <LLMCopyButton markdownUrl={`${page.url}.mdx`} />
                    <ViewOptions
                        markdownUrl={`${page.url}.mdx`}
                        // github URL is incorrect
                        githubUrl={`https://github.com/palantir/blueprint/blob/develop/content/docs/${page.file.path}`}
                    />
                </div>
            </div>
            <DocsDescription>{page.data.description}</DocsDescription>
            <DocsBody>
                <MDX components={{ ...defaultMdxComponents }} />
            </DocsBody>
        </DocsPage>
    );
}

export async function generateStaticParams() {
    return source.generateParams();
}

export async function generateMetadata(props: { params: Promise<{ slug?: string[] }> }) {
    const params = await props.params;
    const page = source.getPage(params.slug);
    if (!page) notFound();

    return {
        title: page.data.title,
        description: page.data.description,
    };
}
