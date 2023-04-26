# Contributing

Thanks for taking the time to contribute! :tada: :confetti_ball: :+1:

## Getting started

Looking for places to contribute to the codebase? Check out the
["help wanted"](https://github.com/palantir/blueprint/labels/help%20wanted) label.

### Installation

First, ensure you have a compatible version of [Node.js](https://nodejs.org/) and [Yarn](https://yarnpkg.com)
installed on your machine. We recommend using [nvm](https://github.com/nvm-sh/nvm) and running `nvm use` in
the repo to switch to right version of Node.

If you are a Palantir employee, you may join the [Palantir Github organization](https://github.com/palantir/)
through the internal OSS portal to gain write access to the Blueprint repository. This allows you to push
branches directly to this repo without forking.

For all external contributors, you will have to fork the Blueprint repo in order to contribute code.

Clone your fork onto your machine and then run the following commands to install dependencies and run a cold
build. Make sure you have an [SSH key set up with your Github account](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/adding-a-new-ssh-key-to-your-github-account#adding-a-new-ssh-key-to-your-account).

```sh
git clone git@github.com:<username>/blueprint.git
cd blueprint
yarn
yarn build
yarn dist
```

## Developing

A typical contributor workflow looks like this:

1. Create a new feature branch. We like to use a format like `[your-initials]/[short-name]`:
   for example, `bd/refactor-buttons`.
1. Run development build tasks - follow the ["Developing libraries" steps in the README](https://github.com/palantir/blueprint/blob/develop/README.md#developing-libraries).
1. Visit http://localhost:9000 in your web browser to see the interactive docs web app.
4. Write some code. :hammer: **Refer to the wiki in this repo for detailed instructions on:**
    - [Development practices](https://github.com/palantir/blueprint/wiki/Development-practices)
    - [Coding guidelines](https://github.com/palantir/blueprint/wiki/Coding-guidelines)
    - [Editor integration](https://github.com/palantir/blueprint/wiki/Editor-integration)
5. Ensure your code **compiles properly** and is **tested**, **linted**, and **formatted**.
    - Run `yarn compile` at the repo root to build all libraries.
    - Run `yarn bundle` at the repo root to build the Blueprint documentation and other bundles.
    - Add unit tests as necessary when fixing bugs or adding features; run them with `yarn test`
      in the relevant package directory.
    - Linting is best handled by your editor for real-time feedback (see
      [Editor integration](https://github.com/palantir/blueprint/wiki/Editor-integration)). Run
      `yarn lint` to be 100% safe.
    - TypeScript lint errors can often be automatically fixed by ESLint. Run lint fixes with `yarn lint-fix`.
    - Code formatting is enforced using [Prettier](https://prettier.io/). These errors can be fixed in your editor
      through ESLint (make sure you have set up the editor integrations linked above).
      __Formatting checks will not run__ during the `yarn lint` package script.
      Instead, when using the CLI or in a CI environment, you should run the `yarn format` script to fix all
      formatting issues across the Blueprint monorepo.
1. Submit a Pull Request on GitHub and fill out the template.
    - ⚠️ __DO NOT enable CircleCI for your fork of Blueprint.__ When you open a PR, your branch will be checked out
      and built in palantir's CI pipeline automatically. There is no need to enable the CI build for your fork's
      pipeline. If you do, this may cause problems in the CI build.
      - If you have already opened a PR where CircleCI built the code in your own personal or organization pipeline,
        you will likely have to disable the project from building at app.circleci.com/settings/project/github/\<your-username\>/website
        and open a new PR.
1. Team members will review your code and merge it after approvals.
    - You may be asked to make modifications to code style or to fix bugs you may have not noticed.
    - Please respond to comments in a timely fashion (even if to tell us you need more time).
    - _Do not_ amend commits and `push --force` as they break the PR history. Please add more commits; we squash each PR to a single commit on merge.
1. Hooray, you contributed! :tophat:

