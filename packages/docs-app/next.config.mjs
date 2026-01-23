import { createMDX } from "fumadocs-mdx/next";

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const nextConfig = {
    output: "export", // Static export for GitHub Pages
    basePath: process.env.NODE_ENV === "production" ? "/docs-next" : "",
    images: { unoptimized: true },
    sassOptions: {
        includePaths: ["../../node_modules"],
    },
    // Turbopack configuration for handling .preview files
    experimental: {
        turbo: {
            rules: {
                // Handle .tsx.preview files as raw text
                "*.preview": {
                    loaders: ["raw-loader"],
                    as: "*.js",
                },
            },
        },
    },
    // Webpack configuration (used when not using turbopack)
    webpack: (config, { isServer }) => {
        // Allow importing raw files with ?raw suffix
        config.module.rules.push({
            resourceQuery: /raw/,
            type: "asset/source",
        });
        // Handle .preview files as raw text
        config.module.rules.push({
            test: /\.preview$/,
            type: "asset/source",
        });
        return config;
    },
    // Transpile Blueprint packages
    transpilePackages: [
        "@blueprintjs/core",
        "@blueprintjs/icons",
        "@blueprintjs/select",
        "@blueprintjs/datetime",
        "@blueprintjs/datetime2",
        "@blueprintjs/table",
        "@blueprintjs/docs-theme",
    ],
};

export default withMDX(nextConfig);
