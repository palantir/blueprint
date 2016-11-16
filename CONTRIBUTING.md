# Contributing

Thanks for taking the time to contribute! :tada: :confetti_ball: :+1:

#### Table of contents

[Getting started](#getting-started)
  - [Installation](#installation)

[Developing](#developing)
  - [Running](#running)
  - [Coding](#coding)
  - [Submitting](#submitting)

[Releasing](#releasing)


## Getting started

Looking for places to contribute to the codebase? Check out the
[Status: accepting PRs](https://github.com/palantir/blueprint/labels/Status%3A%20accepting%20PRs) label.

### Installation

First, clone the Blueprint monorepo:

```sh
git clone git@github.com:palantir/blueprint.git
```

> **Install Node.js**
>
> If you haven't already, you'll need to install Node.js. Use an [official
> installer](https://nodejs.org/en/download/), or use a utility for managing
> versions such as [Node Version Manager](https://github.com/creationix/nvm).

Go to the root directory of this repository and
install its dependencies:

```sh
cd blueprint
npm install
npm run bootstrap
```

## Developing

Start a new feature branch. We use a format like `[your-initials]/[short-name]`.

For example:
 * `bd/laser-beams`
 * `bd/jittery-cells`
 * `bd/css-class-renames`

To create a new branch for development, run:

```sh
git fetch
git checkout -b your-initials/your-branch-name origin/master
```


### Running

Many of the packages have their own compile-and-watch preview tasks which will
help you confirm that your features are working.

To start the compile-and-watch task, run the default script in the package
directory.

```sh
cd packages/table
npm start
```

Once the preview server is running, navigate to
[http://localhost:8080](http://localhost:8080).


### Coding

While reviewing your changes, we use
[`previews`](https://github.com/palantir/blueprint/blob/master/packages/table/preview)
to demonstrate the functionality of various table features. The relevant package
previews will also be automatically added to your pull request.

Feel free to modify the examples in the previews to test your code changes. When
you modify the code in `src/` or `preview/`, the code will be automatically
recompiled and you can simply refresh to see the result.


### Submitting

Once you're satisfied with your changes, you'll need to make sure your code
will pass code review.

Your code must be **test covered** and **lint free**.

Run all unit tests and measure code coverage:

```sh
npm run test
```

If the coverage check fails, you may have to add a new suite of tests or
modify existing tests in `test/`.

Run code and style linters across all code:

```sh
npm run lint
```

These commands must complete successfully, otherwise our CI will automatically
fail your pull request.


### Submit a pull request

Once your code works and the tests and linter pass, you can submit your
code for review!

```sh
git add --all .
git commit
git push
```

When committing, write a thorough description of your work so that reviewers
and future developers can understand your code changes.

Once pushed, navigate to the [code tab of the GitHub site](https://github.com/palantir/blueprint)
and you should see an option to create a pull request from the recently pushed
commit.

After your PR is created, our CI server will pick it up, run tests, and run a
server with your version of the preview so that other engineers can verify
your feature works as intended.

After this point, you may be asked to make modification to your code to adhere
to coherent code style or to fix bugs you may have not noticed. Once you get
approvals from 1 or 2 repository owners, we will merge your code! :confetti_ball: :tada:
