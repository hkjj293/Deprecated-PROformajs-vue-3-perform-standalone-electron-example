# proformajs-vue3

The evolution of proformajs-vue from vue2 -> vue3

This repo uses [npm workspaces](https://docs.npmjs.com/cli/v7/using-npm/workspaces)
to create two npm libraries:
* proformajs-vue3 - components for creating protocols and running enactments
* proformajs-vue3-perform - a subset of the components needed to run enactments

This repo will also use CI to:
* format the code
* check the code with a linter
* run unit tests automatically
* run behavioural tests automatically
* check for dependency vulnerabilities

The original component work for this project can be found at https://github.com/hkjj293/PROformajs-vue-3

## Development

Currently you'll need to run ``npx vite build --watch`` in the perform package
in order to see your changes reflected in the demo as you make them.

### Committing changes

Before committing your changes ensure that your code is linted and formatted
and that the tests all run green.  Also ensure that a fresh install has no
security vulnerabilities.

# Skeleton

The skeleton for this project was created with ``npm init vue@latest`` (3.4.27)
which generated the rest of this README.

Workspaces were then created with ``npm init -w .packages/map`` etc.

---

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Customize configuration

See [Vite Configuration Reference](https://vitejs.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```

### Run Headed Component Tests with [Cypress Component Testing](https://on.cypress.io/component)

```sh
npm run test:unit:dev # or `npm run test:unit` for headless testing
```

### Run End-to-End Tests with [Cypress](https://www.cypress.io/)

```sh
npm run test:e2e:dev
```

This runs the end-to-end tests against the Vite development server.
It is much faster than the production build.

But it's still recommended to test the production build with `test:e2e` before deploying (e.g. in CI environments):

```sh
npm run build
npm run test:e2e
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```
