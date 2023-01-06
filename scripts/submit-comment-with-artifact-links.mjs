#!/usr/bin/env node
/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 */

// @ts-check
/* eslint-disable camelcase */

// Submits a comment to the change PR or commit with links to artifacts that
// show the results of the code change being applied.

import { execSync } from "node:child_process";
import { basename } from "node:path";
import { Octokit } from "octokit";

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
    return `<a href="${artifactInfo?.url}">${pkg}</a>`;
}

// Synchronously execute command and return trimmed stdout as string
function exec(command, options) {
    return execSync(command, options).toString().trim();
}

if (process.env.GITHUB_API_TOKEN) {
    // We can post a comment on the PR if we have the necessary Github.com personal access token with access to this
    // repository and PR read/write permissions.
    // See https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token#creating-a-fine-grained-personal-access-token
    const octokit = new Octokit({ auth: process.env.GITHUB_API_TOKEN });

    const artifactLinks = Object.keys(ARTIFACTS).map(getArtifactAnchorLink).join(" | ");
    const currentGitCommitMessage = exec('git --no-pager log --pretty=format:"%s" -1').replace(/\\"/g, '\\\\"');
    const commentBody = `
    <h3>${currentGitCommitMessage}</h3>
    Previews: <strong>${artifactLinks}</strong>
    `;

    const repoParams = {
        owner: "palantir",
        repo: "blueprint",
    };

    if (process.env.CIRCLE_PULL_REQUEST) {
        // attempt to comment on the PR as an "issue comment" (not a review comment)
        octokit.rest.issues.createComment({
            ...repoParams,
            issue_number: parseInt(basename(process.env.CIRCLE_PULL_REQUEST ?? ""), 10),
            body: commentBody,
        });
    } else if (process.env.CIRCLE_SHA1) {
        // attempt to comment on the commit if there is no associated PR (this is most useful on the develop branch)
        octokit.rest.repos.createCommitComment({
            ...repoParams,
            commit_sha: process.env.CIRCLE_SHA1,
            body: commentBody,
        });
    }
} else {
    // If the access token is missing, simply log artifact URLs (typical in builds on repository forks).
    console.warn(
        "No Github API token available, so we cannot post a preview comment on this build's PR. This is expected on forks which have enabled CircleCI building.",
    );
    Object.keys(ARTIFACTS).forEach(pkg => console.info(`${ARTIFACTS[pkg]}: ${getArtifactAnchorLink(pkg)}`));
}
