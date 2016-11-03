#!/usr/bin/env bash

if git diff HEAD..master --quiet -- packages/table; then
    # no changes to table, just exit
    echo "No changes to table package. Skipping"
    exit 0
fi

# build the preview
cd packages/table
npm run build

# TODO extract common code with the root version of this script
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


DOCS_PREVIEW="<a href='$ARTIFACTS_URL/preview' target='_blank'>feature gallery preview</a>"
PERF_PREVIEW="<a href='$ARTIFACTS_URL/preview/perf.html' target='_blank'>perf preview</a>"
COVERAGE="<a href='$ARTIFACTS_URL/$COVERAGE_FILE' target='_blank'>coverage</a>"
COMMENT_JSON="{\"body\": \"$COMMIT_MESSAGE \n $DOCS_PREVIEW | $PERF_PREVIEW | $COVERAGE\"}"

if PR_NUMBER=$(basename $CI_PULL_REQUEST); then
  # post comment to PR (repos/elements/blueprint/issues/:number/comments)
  curl --data "$COMMENT_JSON" $PROJECT_API_BASE_URL/issues/$PR_NUMBER/comments
else
  # PR not created yet; CircleCI doesn't know about it.
  # post comment to commit (repos/elements/blueprint/commits/:sha/comments)
  curl --data "$COMMENT_JSON" $PROJECT_API_BASE_URL/commits/$CIRCLE_SHA1/comments
fi
