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

if (artifacts === undefined) {
    throw new Error(
        "Unable to read artifacts.json, please make sure the CircleCI API call succeeded with the necessary personal access token.",
    );
}
const ARTIFACTS = {
    documentation: "packages/docs-app/dist/index.html",
    landing: "packages/landing-app/dist/index.html",
    table: "packages/table-dev-app/dist/index.html",
    demo: "packages/demo-app/dist/index.html",
};

function getArtifactAnchorLink(pkg) {
    const artifactInfo = artifacts.find(a => a.path === ARTIFACTS[pkg]);
    return `<a href="${artifactInfo.url}">${pkg}</a>`;
}

if (process.env.GITHUB_API_TOKEN) {
    // We can post a comment on the PR if we have the necessary Github.com personal access token with access to this
    // repository and PR read/write permissions.
    // See https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token#creating-a-fine-grained-personal-access-token
    const links = Object.keys(ARTIFACTS).map(getArtifactAnchorLink).join(" | ");
    bot.comment(
        process.env.GITHUB_API_TOKEN,
        `
    <h3>${bot.commitMessage()}</h3>
    Previews: <strong>${links}</strong>
    `,
    );
} else {
    // If the access token is missing, simply log artifact URLs (typical in builds on repository forks).
    console.warn(
        "No Github API token available, so we cannot post a preview comment on this build's PR. This is expected on forks which have enabled CircleCI building.",
    );
    Object.keys(ARTIFACTS).forEach(pkg => console.info(`${ARTIFACTS[pkg]}: ${getArtifactAnchorLink(pkg)}`));
}
