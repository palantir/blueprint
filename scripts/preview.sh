#!/usr/bin/env bash

source scripts/artifactVariables.sh

# Docs
echo "Docs preview...RENDER"
scripts/docsDist.sh
PREVIEWS="$(artifactLink '/packages/docs/dist/index.html' 'docs')"
COVERAGES="$(artifactLink '/packages/core/$COVERAGE_FILE' 'core')"
COVERAGES="$COVERAGES | $(artifactLink 'packages/datetime/$COVERAGE_FILE' 'datetime')"

# Landing
echo -n "Landing preview..."
git diff HEAD..master --quiet -- packages/landing
if [ $? -eq 0 ]; then
    echo "SKIP"
else
    echo "RENDER"
    (cd packages/landing & npm run build)
    PREVIEWS="$PREVIEWS | $(artifactLink '/packages/landing/dist/index.html' 'landing')"
fi

# Submit comment
submitPreviewComment $(cat <<EOF
<h4>${COMMIT_MESSAGE}</h4>
Preview: ${PREVIEWS}<br>
Coverage: <sub>${COVERAGES}</sub>
EOF
)
