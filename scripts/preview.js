#!/usr/bin/env node

// Submits a comment to the change PR or commit with links to artifacts that
// show the results of the code change being applied.

const bot = require("circle-github-bot").create();

const ARTIFACTS = {
    "packages/docs-app/dist/index.html": "documentation",
    "packages/landing-app/dist/index.html": "landing",
    "packages/table-dev-app/dist/index.html": "table",
};

if (!process.env.GH_AUTH_TOKEN) {
    // simply log artifact URLs if auth token is missed (typical on forks)
    Object.keys(ARTIFACTS).forEach(path => console.log(`${ARTIFACTS[path]}: ${bot.artifactUrl(path)}`))
    process.exit();
}

const links = Object.keys(ARTIFACTS).map(path => bot.artifactLink(path, ARTIFACTS[path])).join(" | ")
bot.comment(process.env.GH_AUTH_TOKEN, `
<h3>${bot.commitMessage()}</h3>
Previews: <strong>${links}</strong>
`);
