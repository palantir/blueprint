#!/usr/bin/env bash

# Run this script after a botched `lerna publish` to delete all tags
# and the "Publish" commit created by Lerna. Requires confirmation.

read -p "⚠️  Delete lerna publish commit and tags? [y/N] " response
if [[ ! $response =~ ^(yes|y)$ ]]; then
  exit
fi

# delete all tags created by Lerna
for tag in $(git tag --points-at HEAD); do
  git tag -d $tag
done

# undo Lerna commit
git reset --hard HEAD^
