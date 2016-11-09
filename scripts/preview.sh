#!/usr/bin/env bash

source scripts/artifactVariables.sh

# Docs
echo "Docs preview...RENDER"
scripts/docsDist.sh
PREVIEWS="$(artifactLink '/packages/docs/dist/index.html' 'docs')"
COVERAGES="$(coverageLink '/packages/core/' 'core')"
COVERAGES="$COVERAGES | $(coverageLink 'packages/datetime/' 'datetime')"

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

# Submit comment
submitPreviewComment "<h3>${COMMIT_MESSAGE}</h3>\nPreview: <b>${PREVIEWS}</b>\nCoverage: ${COVERAGES}"
