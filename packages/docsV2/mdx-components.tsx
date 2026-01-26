import type { MDXComponents } from 'mdx/types';

// Use native HTML elements with Blueprint classes instead of Blueprint components
// This avoids the 'use client' requirement while maintaining Blueprint styling
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h1: (props) => <h1 className="bp5-heading" {...props} />,
    h2: (props) => <h2 className="bp5-heading" {...props} />,
    h3: (props) => <h3 className="bp5-heading" {...props} />,
    code: (props) => <code className="bp5-code" {...props} />,
    pre: (props) => <pre className="bp5-code-block" {...props} />,
    ...components,
  };
}
