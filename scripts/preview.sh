#!/usr/bin/env bash
scripts/artifactVariables.sh

# copy over actual contents of symlinks because CircleCI excludes symlinks from
# build artifacts
scripts/docsDist.sh

DOCS_PREVIEW="__<a href='$ARTIFACTS_URL/packages/docs/dist/index.html' target='_blank'>Preview</a>__"
COVERAGE="<a href='$ARTIFACTS_URL/packages/core/$COVERAGE_FILE' target='_blank'>core coverage</a> | <a href='$ARTIFACTS_URL/datetime/$COVERAGE_FILE' target='_blank'>datetime coverage</a>"
COMMENT="$COMMIT_MESSAGE | $DOCS_PREVIEW\n<sub>$COVERAGE</sub>"

submitPreviewComment($COMMENT)
