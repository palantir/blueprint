#!/usr/bin/env bash

# Verifies that yarn.lock is in its cleanest possible state

set -e
set -o pipefail

scripts_dir="$( dirname "$(readlink -f "$0")" )"

bin="$scripts_dir/../node_modules/.bin"

# Exclude certain packages from deduplication, including:
#     - react-day-picker (we have two major versions while we upgrade from v7 to v8, see https://github.com/palantir/blueprint/pull/5935)
#     - minimatch (this node.js library is widely used by build tools and its lockfile entries often "dirty" the lockfile in a low-signal manner)
duplicates="$("$bin/yarn-deduplicate" "$scripts_dir/../yarn.lock" --strategy fewer --exclude minimatch react-day-picker --list)"

if [[ $duplicates ]]; then
    echo "Found duplicate blocks in yarn.lock which can be cleaned up. Please run 'yarn-deduplicate yarn.lock --strategy fewer'"
    echo ""
    echo "$duplicates"
    exit 1
else
    exit 0
fi
