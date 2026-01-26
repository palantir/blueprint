'use client';

import { TableOfContents } from '@/components/toc';
import { Card, H1, H2, H3 } from '@blueprintjs/core';

// Hardcoded TOC for the experiment (normally extracted from MDX)
const tocItems = [
  { title: 'Introduction', url: '#introduction', depth: 2 },
  { title: 'Installation', url: '#installation', depth: 2 },
  { title: 'Using npm', url: '#using-npm', depth: 3 },
  { title: 'Using pnpm', url: '#using-pnpm', depth: 3 },
  { title: 'Basic Usage', url: '#basic-usage', depth: 2 },
  { title: 'Next Steps', url: '#next-steps', depth: 2 },
];

export default function DocsPage() {
  return (
    <div className="docs-layout">
      <main className="docs-content">
        <Card>
          <H1 id="introduction">Introduction</H1>
          <p>
            Welcome to the BlueprintJS documentation V2 experiment. This page
            demonstrates Fumadocs headless components with Blueprint styling.
          </p>
          <p>
            Blueprint is a React-based UI toolkit for building complex,
            data-dense web interfaces for desktop applications.
          </p>

          <H2 id="installation">Installation</H2>
          <p>You can install Blueprint using your preferred package manager.</p>

          <H3 id="using-npm">Using npm</H3>
          <pre><code>npm install @blueprintjs/core</code></pre>

          <H3 id="using-pnpm">Using pnpm</H3>
          <pre><code>pnpm add @blueprintjs/core</code></pre>

          <H2 id="basic-usage">Basic Usage</H2>
          <p>
            Import components from the core package and use them in your React
            application. Remember to import the CSS files as well.
          </p>
          <pre><code>{`import { Button } from "@blueprintjs/core";
import "@blueprintjs/core/lib/css/blueprint.css";

function App() {
  return <Button intent="primary">Click me</Button>;
}`}</code></pre>

          <H2 id="next-steps">Next Steps</H2>
          <p>
            This is a minimal proof-of-concept. If viable, we could expand this
            to include MDX processing, search, and full navigation.
          </p>
          {/* Spacer for scroll testing */}
          <div style={{ height: '50vh' }} />
        </Card>
      </main>

      <TableOfContents items={tocItems} />
    </div>
  );
}
