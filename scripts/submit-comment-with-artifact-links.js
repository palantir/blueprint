#!/usr/bin/env node
/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 */

// Submits a comment to the change PR or commit with links to artifacts that
// show the results of the code change being applied.

const bot = require("circle-github-bot").create();

/**
 * @type {Array<{path: string; url: string;}>}
 */
const artifacts = require("./artifacts.json").items;

const ARTIFACTS = {
    documentation: "packages/docs-app/dist/index.html",
    landing: "packages/landing-app/dist/index.html",
    table: "packages/table-dev-app/dist/index.html",
    demo: "packages/demo-app/dist/index.html",
};

if (!process.env.GITHUB_API_TOKEN) {
    // simply log artifact URLs if auth token is missed (typical on forks)
    console.warn(
        "No Github API token available, so we cannot post a preview comment on this build's PR. This is expected on forks which have enabled CircleCI building.",
    );
    Object.keys(ARTIFACTS).forEach(pkg => console.info(`${ARTIFACTS[pkg]}: ${getArtifactAnchorLink(pkg)}`));
    process.exit();
}

// requires a Github.com personal access token with access to this repository and PR read/write permissions
// see https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token#creating-a-fine-grained-personal-access-token
const links = Object.keys(ARTIFACTS).map(getArtifactAnchorLink).join(" | ");
bot.comment(
    process.env.GITHUB_API_TOKEN,
    `
<h3>${bot.commitMessage()}</h3>
Previews: <strong>${links}</strong>
`,
);

function getArtifactAnchorLink(pkg) {
    const artifactInfo = artifacts.find(a => a.path === ARTIFACTS[pkg]);
    return `<a href="${artifactInfo.url}">${pkg}</a>`;
}
