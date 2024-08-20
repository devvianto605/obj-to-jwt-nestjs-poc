
# Object to JWT POC (NestJS 10)

## 1. Getting started

Launch the application using the command below.

```sh
# Make sure docker is running and set up database by provided docker-compose.yml
docker compose up

# Install dependencies
npm install

# create .env file (doesn't require to change anything to run and test)
cp .env.example .env
vi .env

# For use in development environments only, performs a Prisma migration
npx prisma migrate dev

# Launch the development server with TSNode
npm run dev
```

You can now head to `http://localhost:3000/docs` and see your API Swagger docs and test out the app.

## 2. Project structure

This template was made with a well-defined directory structure.

```sh
src/
├── modules
│   ├── app.module.ts
│   ├── common/  # The common module contains pipes, guards, service and provider used in the whole application
│   ├── configuration/
│   │   ├── controller/
│   │   │   └── configuration.controller.ts
│   │   ├── flow/  # The "flow" directory contains the pipes, interceptors and everything that may change the request or response flow
│   │   │   └── configuration.pipe.ts
│   │   ├── model/
│   │   │   ├── configuration.data.ts  # The model that will be returned in the response
│   │   │   └── configuration.input.ts  # The model that is used in the request
│   │   ├── configuration.module.ts
│   │   ├── service/
│   │   │   └── configuration.service.ts
│   │   └── spec/
│   └── tokens.ts
└── server.ts
```

## 3. Default NPM commands

The NPM commands below are already included with this template and can be used to quickly run, build and test your project.

```sh
# Start the application using the transpiled NodeJS
npm run start

# Run the application using "ts-node"
npm run dev

# Transpile the TypeScript files
npm run build

# Run the project' functional tests
npm run test

# Lint the project files using TSLint
npm run lint
```

## 5. Healtcheck support

A healthcheck API is a REST endpoint that can be used to validate the status of the service along with its dependencies. The healthcheck API endpoint internally triggers an overall health check of the service. This can include database connection checks, system properties, disk availability and memory availability.

The example healthcheck endpoint can be request with the token located in the `HEALTH_TOKEN` environment variable.

```sh
curl -H 'Authorization: Bearer ThisMustBeChanged' http://localhost:3000/api/v1/health
```