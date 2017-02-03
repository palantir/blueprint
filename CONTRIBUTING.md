# Contributing

Thanks for taking the time to contribute! :tada: :confetti_ball: :+1:

## Getting started

Looking for places to contribute to the codebase? Check out the [Status: accepting
PRs](https://github.com/palantir/blueprint/labels/Status%3A%20accepting%20PRs) label.

### Installation

First, ensure you have Node v6+ installed on your machine. Run `node -v` in the terminal to confirm.

As an external contributor (not a member of the Palantir org), you will have to fork Blueprint in
order to contribute code. Clone your fork onto your machine and run the following commands to
install dependencies:

```sh
git clone git@github.com:<username>/blueprint.git
cd blueprint
npm install
npm run bootstrap
```

## Developing

A typical contributor workflow looks like this:

1. Create a new feature branch. We use a format like `[your-initials]/[short-name]`:
   `gg/refactor-buttons`.
1. Run the development server via `gulp` (no arguments).
    - See [Build tasks](https://github.com/palantir/blueprint/wiki/Build-tasks) on the wiki for more
      details on the inner workings of the Gulp build.
    - If you are contributing to the `table` or `landing` packages then run `npm start` in those
      directories instead, as they have separate webpack-based development builds.
1. Write some code. :hammer: **Refer to the wiki in this repo for detailed instructions on:**
    - [Development practices](https://github.com/palantir/blueprint/wiki/Development-practices)
    - [Coding guidelines](https://github.com/palantir/blueprint/wiki/Coding-guidelines)
    - [Editor integration](https://github.com/palantir/blueprint/wiki/Editor-integration)
1. Ensure your code is **tested** (via `gulp test`) and **linted** (via `gulp check`).
1. Submit a Pull Request on GitHub.
    - Write a thorough description of your work so that reviewers
and future developers can understand your code changes.
1. Team members will review your code and merge it after approvals.
    - You may be asked to make modifications to code style or to fix bugs you may have not noticed.
    - Please respond to comments in a timely fashion (even if to tell us you need more time).
1. Hooray, you contributed! :tophat:

### Using a fork

If you're developing on a fork of Blueprint, navigate to [CircleCI](https://circleci.com/), log in
using your GitHub account and **enable builds** for your fork of Blueprint.

#### Enable preview comments

The team relies on PR "preview comments" for immediate feedback on features during development.
Forkers must manually enable comments by defining the `GH_AUTH_TOKEN` environment variable on
CircleCI.

1. Navigate to the [token settings](https://github.com/settings/tokens) on GitHub and create a user
token with the `public_repo` scope.
1. Navigate to your CircleCI repo settings:
`https://circleci.com/gh/<your GitHub user name>/blueprint/edit#env-vars`
and create a new environment variable called `GH_AUTH_TOKEN` with the token you created earlier.
1. If your builds pass, a comment will be automatically posted to your PR that links to the
generated artifacts containing your changes.
