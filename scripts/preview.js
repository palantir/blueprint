#!/usr/bin/env node
/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 */

// Submits a comment to the change PR or commit with links to artifacts that
// show the results of the code change being applied.

const bot = require("circle-github-bot").create();
const yargs = require("yargs").usage("$0 <artifacts-base-url>").help();

const args = yargs.argv;
const artifactsBaseUrl = args._[0];

const ARTIFACTS = {
    documentation: "packages/docs-app/dist/index.html",
    landing: "packages/landing-app/dist/index.html",
    table: "packages/table-dev-app/dist/index.html",
    demo: "packages/demo-app/dist/index.html",
};

if (!process.env.GH_AUTH_TOKEN) {
    // simply log artifact URLs if auth token is missed (typical on forks)
    Object.keys(ARTIFACTS).forEach(path => console.info(`${ARTIFACTS[path]}: ${getArtifactUrl(path)}`));
    process.exit();
}

const links = Object.keys(ARTIFACTS).map(getArtifactUrl).join(" | ");
bot.comment(
    process.env.GH_AUTH_TOKEN,
    `
<h3>${bot.commitMessage()}</h3>
Previews: <strong>${links}</strong>
`,
);

function getArtifactUrl(path) {
    return `${artifactsBaseUrl}/0/${ARTIFACTS[path]}`;
}
