#!/usr/bin/env bash

if git diff HEAD..master --quiet -- landing; then
    echo "No changes to landing. Skipping preview"
    exit 0
fi

source scripts/artifactVariables.sh

cd landing
npm run build

DOCS_PREVIEW="<a href='$ARTIFACTS_URL/landing/dist/index.html' target='_blank'>Landing Preview</a>"
COMMENT="$COMMIT_MESSAGE | $DOCS_PREVIEW"

submitPreviewComment "$COMMENT"
