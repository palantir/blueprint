import createMDX from '@next/mdx';

const withMDX = createMDX({});

/** @type {import('next').NextConfig} */
const config = {
  output: 'export',
  basePath: '/docsV2',
  images: { unoptimized: true },
  transpilePackages: ['@blueprintjs/core', '@blueprintjs/icons'],
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
};

export default withMDX(config);
