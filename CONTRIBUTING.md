# Contributing

Thanks for taking the time to contribute! :tada: :confetti_ball: :+1:

## Getting started

Looking for places to contribute to the codebase? Check out the ["help wanted"](https://github.com/palantir/blueprint/labels/help%20wanted) label.

### Installation

First, ensure you have Node v8+ and [yarn](https://yarnpkg.com) v1.0+ installed on your machine.

As an external contributor (not a member of the Palantir org), you will have to fork Blueprint in
order to contribute code. Clone your fork onto your machine and run the following commands to
install dependencies:

```sh
git clone git@github.com:<username>/blueprint.git # using ssh
cd blueprint
yarn
yarn verify
```

## Developing

A typical contributor workflow looks like this:

1. Create a new feature branch. We use a format like `[your-initials]/[short-name]`:
   `bd/refactor-buttons`.
1. Run `yarn dev` in the root to watch all the code and run the dev app at http://localhost:9000
    - You can instead watch package subsets with `yarn dev:core`, `yarn dev:select`, etc.
1. Write some code. :hammer: **Refer to the wiki in this repo for detailed instructions on:**
    - [Development practices](https://github.com/palantir/blueprint/wiki/Development-practices)
    - [Coding guidelines](https://github.com/palantir/blueprint/wiki/Coding-guidelines)
    - [Editor integration](https://github.com/palantir/blueprint/wiki/Editor-integration)
1. Ensure your code is **tested** and **linted**.
    - Add unit tests as necessary when fixing bugs or adding features; run them with `yarn test`
      in the relevant `packages/` directory.
    - Linting is best handled by your editor for real-time feedback (see
      [Editor integration](https://github.com/palantir/blueprint/wiki/Editor-integration)). Run
      `yarn lint` to be 100% safe.
    - TypeScript lint errors can often be automatically fixed by TSLint. Run lint fixes with `yarn lint-fix`.
1. Submit a Pull Request on GitHub and fill out the template.
1. Team members will review your code and merge it after approvals.
    - You may be asked to make modifications to code style or to fix bugs you may have not noticed.
    - Please respond to comments in a timely fashion (even if to tell us you need more time).
    - _Do not_ amend commits and `push --force` as they break the PR history. Please add more commits; we squash each PR to a single commit on merge.
1. Hooray, you contributed! :tophat:

### Enable preview comments

The team relies on PR "preview comments" for immediate feedback on features during development.
Forkers must manually enable comments by defining the `GH_AUTH_TOKEN` environment variable on
CircleCI.

If you're developing on a fork of Blueprint:

1. Navigate to [CircleCI](https://circleci.com/add-projects), log in using your GitHub account,
and click **"Build project"** for your fork of Blueprint.
1. Navigate to the [token settings](https://github.com/settings/tokens) on GitHub and create a user
token with the `public_repo` scope.
1. Navigate to your CircleCI repo settings: `https://circleci.com/gh/<username>/blueprint/edit#env-vars`
and create a new environment variable called `GH_AUTH_TOKEN` with the token you created earlier.
The end result should look like so:

    ![image](https://cloud.githubusercontent.com/assets/464822/22609529/6845d7e6-ea16-11e6-8a8e-444057bc4687.png)
1. When a build passes, a comment will be automatically posted to your PR that links to the
generated artifacts containing your changes.
