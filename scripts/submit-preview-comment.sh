#!/usr/bin/env bash

# Submit Github comment with links to built artifacts

if [ -z "${CIRCLE_BUILD_NUM}" ]; then
    echo "Not on CircleCI, refusing to run script."
    exit 1
fi

if [ -z "${CIRCLE_API_TOKEN}" ]; then
    echo "No CircleCI API token available to query for artifact asset URLs from thsi build. Check the \$CIRCLE_API_TOKEN environment variable."
    exit 1
fi

artifacts=$(curl -X GET "https://circleci.com/api/v2/project/github/palantir/blueprint/$CIRCLE_BUILD_NUM/artifacts" -H "Accept: application/json" -u "$CIRCLE_API_TOKEN:")
echo $artifacts > ./scripts/artifacts.json
node ./submit-comment-with-artifact-links.js
