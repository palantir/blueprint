#!/usr/bin/env bash

# log changed packages so you know what's coming
$(npm bin)/lerna updated

# interactively bump updated package versions
$(npm bin)/lerna publish --skip-git --skip-npm

echo ""
echo "Building GH Pages site into docs/ directory..."
npm run build:site

echo ""
echo "Review git changes and commit when ready."
echo "Don't forget to update root package.json version."
