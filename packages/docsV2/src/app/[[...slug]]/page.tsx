import { source } from '@/lib/source';
import { notFound } from 'next/navigation';
import { TableOfContents } from '@/components/toc';

interface PageProps {
  params: Promise<{ slug?: string[] }>;
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  const page = source.getPage(slug);
  if (!page) notFound();

  const MDX = page.data.body;

  return (
    <div className="docs-content-wrapper">
      <article className="docs-content">
        <MDX />
      </article>
      <TableOfContents items={page.data.toc} />
    </div>
  );
}

export function generateStaticParams() {
  return source.generateParams();
}
