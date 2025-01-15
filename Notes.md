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

## Database Documentation

### Linking databases

#### Development:

- Create a .env.development.local and inside place:
  - DATABASE_URL=postgres://postgres:postgres@localhost:5432/postgres

#### Production:

- Create a .env.local and inside place:
  - DATABASE_URL=postgresql://neondb_owner:NcYBUrdAy3v5@ep-fancy-surf-a5x5lelh.us-east-2.aws.neon.tech/neondb?sslmode=require
  - If you had a different production database, you would provide a connection string to that instead

### Docker set-up

In project directory, run

```
💻 docker-compose -f docker-compose.dev.yml up
```

### Migrations

In project directory, run (in this order):

```
💻 npx knex migrate:up 20240413021157_rooms.js
💻 npx knex migrate:up 20240418185132_machines.js
💻 npx knex migrate:up 20240427231219_loads.js
```

### Seeding

In project directory, run (in this order):

```
💻 npx knex seed:run --specific retrieve-rooms.js
💻 npx knex seed:run --specific retrieve-machine.js
💻 npx knex seed:run --specific retrieve-loads.js
```

## Notifications documentation

#### Linking SendGrid

- Create account, retrieve API key from website
- Create .env file and inside place:
  - SENDGRID_API_KEY = "YOUR_API_KEY"
