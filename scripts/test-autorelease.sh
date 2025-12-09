#!/bin/bash
# Script to test autorelease configuration
# This creates a test branch and shows what autorelease would do

set -e

echo "Testing autorelease configuration..."
echo ""

# Save current branch
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)

# Create test branch
TEST_BRANCH="test/autorelease-$(date +%s)"
echo "Creating test branch: $TEST_BRANCH"
git checkout -b "$TEST_BRANCH"

# Create a sample changelog entry for testing
TEST_FILE="packages/core/CHANGELOG.md"
if [ -f "$TEST_FILE" ]; then
    echo "" >> "$TEST_FILE"
    echo "## Test" >> "$TEST_FILE"
    echo "- Test change for autorelease validation" >> "$TEST_FILE"
    git add "$TEST_FILE"
    git commit -m "test: validate autorelease configuration"
fi

echo ""
echo "Test branch created. To test autorelease:"
echo "1. Push this branch: git push origin $TEST_BRANCH"
echo "2. Check CI/CD pipeline to see autorelease analysis"
echo "3. Autorelease will create a PR or comment showing what it would release"
echo ""
echo "To cleanup:"
echo "  git checkout $CURRENT_BRANCH"
echo "  git branch -D $TEST_BRANCH"
echo "  git push origin --delete $TEST_BRANCH"
