#!/usr/bin/env bash

# copy over actual contents of symlinks because CircleCI excludes symlinks from build artifacts
scripts/docsDist.sh

BUILD_PATH="/home/ubuntu/blueprint/packages"
ARTIFACTS_URL="https://circleci.com/api/v1/project/$CIRCLE_PROJECT_USERNAME/$CIRCLE_PROJECT_REPONAME/$CIRCLE_BUILD_NUM/artifacts/0/$BUILD_PATH"
GH_API_URL="x-oauth-basic@api.github.com"
PROJECT_API_BASE_URL="https://$GH_AUTH_TOKEN:$GH_API_URL/repos/$CIRCLE_PROJECT_USERNAME/$CIRCLE_PROJECT_REPONAME"
PR_NUMBER=$(basename $CI_PULL_REQUEST)
COMMIT_HASH=$(git --no-pager log --pretty=format:"%h" -1)
COMMIT_MESSAGE=$(git --no-pager log --pretty=format:"%s" -1)
# escape commit message, see http://stackoverflow.com/a/10053951/3124288
COMMIT_MESSAGE=${COMMIT_MESSAGE//\"/\\\"}

COVERAGE_FILE="coverage/PhantomJS%202.1.1%20%28Linux%200.0.0%29/index.html"
DOCS_PREVIEW="__<a href='$ARTIFACTS_URL/docs/dist/index.html' target='_blank'>Preview</a>__"
COVERAGE="<a href='$ARTIFACTS_URL/core/$COVERAGE_FILE' target='_blank'>core coverage</a> | <a href='$ARTIFACTS_URL/datetime/$COVERAGE_FILE' target='_blank'>datetime coverage</a>"
COMMENT_JSON="{\"body\": \"$COMMIT_MESSAGE | $DOCS_PREVIEW\n<sub>$COVERAGE</sub>\"}"

if PR_NUMBER=$(basename $CI_PULL_REQUEST); then
  # post comment to PR (repos/palantir/blueprint/issues/:number/comments)
  curl --data "$COMMENT_JSON" $PROJECT_API_BASE_URL/issues/$PR_NUMBER/comments
else
  # PR not created yet; CircleCI doesn't know about it.
  # post comment to commit (repos/palantir/blueprint/commits/:sha/comments)
  curl --data "$COMMENT_JSON" $PROJECT_API_BASE_URL/commits/$CIRCLE_SHA1/comments
fi
