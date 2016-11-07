#!/usr/bin/env bash

# Compute all the fancy artifact variables for preview scripts

BUILD_PATH="/home/ubuntu/blueprint"
ARTIFACTS_URL="https://circleci.com/api/v1/project/$CIRCLE_PROJECT_USERNAME/$CIRCLE_PROJECT_REPONAME/$CIRCLE_BUILD_NUM/artifacts/0/$BUILD_PATH"
GH_API_URL="x-oauth-basic@api.github.com"
PROJECT_API_BASE_URL="https://$GH_AUTH_TOKEN:$GH_API_URL/repos/$CIRCLE_PROJECT_USERNAME/$CIRCLE_PROJECT_REPONAME"
PR_NUMBER=$(basename $CI_PULL_REQUEST)
COMMIT_HASH=$(git --no-pager log --pretty=format:"%h" -1)
COMMIT_MESSAGE=$(git --no-pager log --pretty=format:"%s" -1)
# escape commit message, see http://stackoverflow.com/a/10053951/3124288
COMMIT_MESSAGE=${COMMIT_MESSAGE//\"/\\\"}

# Submit the comment
function submitPreviewComment {
    COMMENT_JSON="{\"body\": \"$1\"}"

    if PR_NUMBER=$(basename $CI_PULL_REQUEST); then
        # post comment to PR (repos/palantir/blueprint/issues/:number/comments)
        curl --data "$COMMENT_JSON" $PROJECT_API_BASE_URL/issues/$PR_NUMBER/comments
    else
        # PR not created yet; CircleCI doesn't know about it.
        # post comment to commit (repos/palantir/blueprint/commits/:sha/comments)
        curl --data "$COMMENT_JSON" $PROJECT_API_BASE_URL/commits/$CIRCLE_SHA1/comments
    fi
}

# Create a preview link string
function artifactLink {
    local LINK="$1"
    local HREF="${ARTIFACTS_URL}${2}"
    echo "__<a href='$HREF' target='_blank'>$LINK</a>__"
}
