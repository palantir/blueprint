import { createMDX } from "fumadocs-mdx/next";

/** @type {import('next').NextConfig} */
const config = {
    reactStrictMode: true,
    basePath: "/docsV2",
    transpilePackages: ["@blueprintjs/core", "@blueprintjs/icons"],
};

const withMDX = createMDX();

export default withMDX(config);
