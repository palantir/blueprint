/** @type {import('next').NextConfig} */
const config = {
  output: 'export',
  basePath: '/docsV2',
  images: { unoptimized: true },
  transpilePackages: ['@blueprintjs/core', '@blueprintjs/icons'],
};

export default config;
