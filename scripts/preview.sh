#!/usr/bin/env bash

source scripts/artifactVariables.sh

# Docs
echo "Docs preview...RENDER"
scripts/docsDist.sh
PREVIEWS="$(artifactLink '/packages/site-docs/dist/index.html' 'documentation')"
COVERAGES="$(coverageLink '/packages/core/' 'core')"
COVERAGES="$COVERAGES | $(coverageLink 'packages/datetime/' 'datetime')"

# Landing
echo -n "site-landing preview..."
git diff HEAD..origin/master --quiet -- packages/site-landing
if [ $? -eq 0 ]; then
    echo "SKIP"
else
    echo "RENDER"
    (cd packages/site-landing; npm run build)
    PREVIEWS="$PREVIEWS | $(artifactLink '/packages/site-landing/dist/index.html' 'landing')"
fi

# Table
echo -n "Table preview..."
git diff HEAD..origin/master --quiet -- packages/table
if [ $? -eq 0 ]; then
    echo "SKIP"
else
    echo "RENDER"
    (cd packages/table; npm run build)
    PREVIEWS="$PREVIEWS | $(artifactLink '/packages/table/preview/index.html' 'table')"
fi

# Actual public site
echo -n "Full site preview..."
git rev-parse --abbrev-ref HEAD | grep -q -e '^release/'
if [ $? -eq 0 ]; then
    git diff HEAD..origin/master --quiet -- docs
    if [ $? -eq 0 ]; then
        echo "ERROR"
        echo "New release detected, but docs were not updated."
        exit 1
    else
        echo "DONE"
        PREVIEWS="$PREVIEWS | $(artifactLink '/docs/index.html' 'github pages')"
    fi
else
    echo "SKIP"
fi

# Submit comment
submitPreviewComment "<h3>${COMMIT_MESSAGE}</h3>\n\nPreview: <strong>${PREVIEWS}</strong>\nCoverage: ${COVERAGES}"
