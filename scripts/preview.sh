#!/usr/bin/env bash

source scripts/artifactVariables.sh

# Docs
echo "Docs preview...RENDER"
scripts/docsDist.sh
PREVIEWS="$(artifactLink '/packages/docs/dist/index.html' 'docs')"
COVERAGES="$(coverageLink '/packages/core/' 'core')"
COVERAGES="$COVERAGES | $(coverageLink 'packages/datetime/' 'datetime')"

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
    echo "NO_RELEASE_SKIP"
fi

fi
# Landing
echo -n "Landing preview..."
git diff HEAD..origin/master --quiet -- packages/landing
if [ $? -eq 0 ]; then
    echo "SKIP"
else
    echo "RENDER"
    (cd packages/landing; npm run build)
    PREVIEWS="$PREVIEWS | $(artifactLink '/packages/landing/dist/index.html' 'landing')"
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

# Submit comment
submitPreviewComment "<h3>${COMMIT_MESSAGE}</h3>\nPreview: <b>${PREVIEWS}</b>\nCoverage: ${COVERAGES}"
