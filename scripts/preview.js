#!/usr/bin/env node

// Submits a comment to the change PR or commit with links to artifacts that
// show the results of the code change being applied.

const bot = require("circle-github-bot").create();

const links = [
    bot.artifactLink("packages/docs-app/dist/index.html", "documentation"),
    bot.artifactLink("packages/landing-app/dist/index.html", "landing"),
    bot.artifactLink("packages/table-dev-app/dist/index.html", "table"),
].join(" | ");

bot.comment(`
<h3>${bot.env.commitMessage}</h3>
Previews: <strong>${links}</strong>
`);
