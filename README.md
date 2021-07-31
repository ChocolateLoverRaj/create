[![License](https://badgen.net/github/license/ChocolateLoverRaj/create)](https://github.com/ChocolateLoverRaj/create/blob/master/LICENSE)
[![TS-Standard - Typescript Standard Style Guide](https://badgen.net/badge/code%20style/ts-standard/blue?icon=typescript)](https://github.com/standard/ts-standard)
# create
An npm create package for creating JavaScript projects.

## Usage
An npm create package for creating JavaScript projects.
Use [npm init](https://docs.npmjs.com/cli/v7/commands/npm-init) to create a new project.

```bash
npm init @programmerraj
```

Then install the dependencies.

## Features
### Automatic [author](https://docs.npmjs.com/cli/v7/configuring-npm/package-json#people-fields-author-contributors) field
If the project contains a GitHub git remote, the author will be fetched, and the name, email, and GitHub url of the author will be set.

### Public / [private](https://docs.npmjs.com/cli/v7/configuring-npm/package-json#private) packages
One of the first prompts asks if the package will be published. Then the `private` field is set for private packages.

### Checks for existing packages with the same name
If you try to make an npm package using a name which already exists on npm, you will be prompted to pick a different name.

### Automatic [homepage](https://docs.npmjs.com/cli/v7/configuring-npm/package-json#homepage)
The GitHub repo link is used as the homepage, if it exists.

### Automatic [repository](https://docs.npmjs.com/cli/v7/configuring-npm/package-json#repository) field
This even includes the `repository directory.

### Automatic [license](https://docs.npmjs.com/cli/v7/configuring-npm/package-json#license) field
Checks for a `LICENSE` file and uses the name of that license.

### Sets up [code lint](https://en.wikipedia.org/wiki/Lint_(software))
Currently, [standard](https://standardjs.com/) code style can be used. This sets up all the dev dependencies needed for eslint with standard.

### Generates GitHub Actions workflow
A GitHub workflow that checks the code style and runs tests can be added.

### Creates [`README.md`](https://en.wikipedia.org/wiki/README)
Adds the name of the package, as well as badges to the README.

### Creates starter code files
Just use the CLI, and you'll be ready to start coding. No need to create a `index.js` file. The package does it for you.

### Easily support CommonJS and ESModules
Using [Babel](https://babeljs.io/) or [TypeScript](https://www.typescriptlang.org/), the file structure, exports, and build scripts will be created by the CLI.

### Easily use [TypeScript](https://www.typescriptlang.org/)
Use typescript with one key press. The [compiling](#Easily-support-CommonJS-and-ESModules) and `tsconfig.json` will be setup.

### Add tests
This package sets up [Mocha](https://mochajs.org/), and even adds [`@types/mocha`](https://www.npmjs.com/package/@types/mocha) to your `devDependencies` if you're using TypeScript.

### Use with any package installer
This CLI does not run `npm i` itself. This is so you can use whatever package installer you use. Whether you use [Npm](https://www.npmjs.com/), [Pnpm](https://pnpm.io/), [Yarn](https://yarnpkg.com/), or something else, you just need to install the dependencies in `package.json` after running the CLI.

### Generate docs with [Typedoc](https://typedoc.org/)
For projects using TypeScript, there is an option to add typedoc to `devDependencies` and add a script for building docs.