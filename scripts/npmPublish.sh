#!/usr/bin/env bash

cd $(dirname $0)/..
set -e

# ---------------------------------------------------------------------------------------------------------------------
# NPM pre publish

# https://circleci.com/docs/npm-login/
echo -e "$NPM_USER\n$NPM_PASSWORD\n$NPM_EMAIL" | npm login

# ---------------------------------------------------------------------------------------------------------------------
# NPM publish

MODULES=$(ls packages)

for module in $MODULES; do
  if [ -e "packages/$module/package.json" ]; then
    IS_PRIVATE=$(echo "console.log(require('./packages/$module/package.json').private)" | node)
    if [[ $IS_PRIVATE == "true" ]]; then
      echo "Skipping private package @blueprintjs/$module"
      continue
    fi

    TO_PUBLISH=$(echo "console.log(require('./packages/$module/package.json').version)" | node)
    VERSIONS=$(npm info @blueprintjs/$module versions || echo "new_package")

    # check for presence of this version in the list of all published versions
    if [[ $VERSIONS == *"'$TO_PUBLISH'"* ]]; then
      echo "Nothing to publish for @blueprintjs/$module@$TO_PUBLISH"
    else
      echo "Publishing @blueprintjs/$module@$TO_PUBLISH..."
      # must set public access for scoped packages
      npm publish packages/$module --access public
    fi
  fi
done
