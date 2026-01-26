import { createMDX } from 'fumadocs-mdx/next';

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const config = {
  output: 'export',
  basePath: '/docsV2',
  images: { unoptimized: true },
  transpilePackages: ['@blueprintjs/core', '@blueprintjs/icons'],
};

export default withMDX(config);
