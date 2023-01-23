#!/usr/bin/env node
/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 */

// @ts-check
/* eslint-disable camelcase */

/**
 * @fileoverview Submits a comment to the change PR or commit with links to CI job artifacts
 * that show the results of the code changes being applied.
 */

import dedent from "dedent";
import { execSync } from "node:child_process";
import { basename } from "node:path";
import { Octokit } from "octokit";

if (process.env.CIRCLE_BUILD_URL === undefined) {
    throw new Error(
        `This script must be run in a CircleCI job with the the $CIRCLE_BUILD_URL environment variable present.`,
    );
}

const ARTIFACTS = {
    documentation: "packages/docs-app/dist/index.html",
    landing: "packages/landing-app/dist/index.html",
    table: "packages/table-dev-app/dist/index.html",
    demo: "packages/demo-app/dist/index.html",
};

function getArtifactLink(pkg) {
    return `${process.env.CIRCLE_BUILD_URL}/artifacts/0/${ARTIFACTS[pkg]}`;
}

if (process.env.GITHUB_API_TOKEN) {
    // We can post a comment on the PR if we have the necessary Github.com personal access token with access to this
    // repository and PR read/write permissions.
    // See https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token#creating-a-fine-grained-personal-access-token
    const octokit = new Octokit({ auth: process.env.GITHUB_API_TOKEN });

    const artifactLinks = Object.keys(ARTIFACTS)
        .map(pkg => `<a href="${getArtifactLink(pkg)}">${pkg}</a>`)
        .join(" | ");
    const currentGitCommitMessage = execSync('git --no-pager log --pretty=format:"%s" -1')
        .toString()
        .trim()
        .replace(/\\"/g, '\\\\"');
    const commentBody = dedent`
        <h3>${currentGitCommitMessage}</h3>
        Build artifact links for this commit: <strong>${artifactLinks}</strong>

        <em>This is an automated comment from the deploy-preview CircleCI job.</em>
    `;

    const repoParams = {
        owner: "palantir",
        repo: "blueprint",
    };

    if (process.env.CIRCLE_PULL_REQUEST) {
        // attempt to comment on the PR as an "issue comment" (not a review comment)
        await octokit.rest.issues.createComment({
            ...repoParams,
            issue_number: parseInt(basename(process.env.CIRCLE_PULL_REQUEST ?? ""), 10),
            body: commentBody,
        });
    } else if (process.env.CIRCLE_SHA1) {
        // attempt to comment on the commit if there is no associated PR (this is most useful on the develop branch)
        await octokit.rest.repos.createCommitComment({
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
    Object.keys(ARTIFACTS).forEach(pkg => {
        console.info(`${ARTIFACTS[pkg]}: ${getArtifactLink(pkg)}`);
    });
}
