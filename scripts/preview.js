#!/usr/bin/env node
/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 */

/**
 * @fileoverview Submits a comment to the change PR or commit with links to artifacts
 * that show the results of the code change being applied.
 */

import BotFactory from "circle-github-bot";

const bot = BotFactory.create();

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

if (!process.env.GH_AUTH_TOKEN) {
    // simply log artifact URLs if auth token is missed (typical on forks)
    Object.keys(ARTIFACTS).forEach(pkg => console.info(`${ARTIFACTS[pkg]}: ${getArtifactAnchorLink(pkg)}`));
    process.exit();
}

const links = Object.keys(ARTIFACTS).map(getArtifactAnchorLink).join(" | ");
bot.comment(
    process.env.GH_AUTH_TOKEN,
    `
<h3>${bot.commitMessage()}</h3>
Previews: <strong>${links}</strong>
`,
);

function getArtifactAnchorLink(pkg) {
    const artifactInfo = artifacts.find(a => a.path === ARTIFACTS[pkg]);
    return `<a href="${artifactInfo.url}">${pkg}</a>`;
}
