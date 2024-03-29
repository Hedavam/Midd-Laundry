# Laundry Availability

## Description

It can be frustrating having to walk over to do laundry (especially on cold/rainy days) and not finding an available/working machine. This app aims to address this issue by reporting availability, thus, helping students plan when/where to do their laundry. Moreover, Facilites may benefit as they could re-arrange the locations/amount of machines based on their usage and more quickly repair machines that are reported as broken.

## Workflow Badge

![workflow status](https://github.com/csci312-s24/project-camelshump/actions/workflows/node.js.yml/badge.svg)

## Deployed Version

https://camelshump.csci312.dev/

## Creation

This project skeleton has been setup similar to our assignments and practicals. It is a Next.JS application, created with create-next-app `💻 npx create-next-app@latest`, which uses Jest and Testing Library for testing, ESLint for static analysis, Prettier for styling, and is configured to use GitHub actions for testing pull requests.

Development dependencies installed with:

```
💻 npm install -D jest jest-environment-jsdom husky lint-staged prettier eslint-config-prettier @testing-library/react @testing-library/jest-dom cross-env
💻 npx install-peerdeps --dev eslint-config-airbnb
💻 npm install -D eslint-import-resolver-alias
```

Other dependencies installed with:

```
💻 npm install -S prop-types
```

### Additional tools you might need

#### Mocking fetch

Tools for mocking fetch can be installed with

```
💻 npm install -D fetch-mock-jest node-fetch@2.6.7
```

Note we need to pin the `node-fetch` version due to breaking changes when used with Jest in newer versions.
