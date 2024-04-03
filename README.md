# User Authentication API

This project implements a simple API for user sign-up, login, and secure access.
It's built using Node.js and TypeScript, with NestJS for the framework structure.
Authentication is managed via JWT for secure token handling, and PostgreSQL is used for data storage.
For quality assurance, Jest is utilized for unit testing, while SuperTest is employed for end-to-end testing.

## Getting Started

### Prerequisites

- Docker (preferably) for running a PostgreSQL database container.
- Node.js (version 18 was used for this project).

### Setting Up the Database

To set up the PostgreSQL database using Docker, run the following command:

```bash
docker run --name maven-auth-db -e POSTGRES_PASSWORD=myPassword123. -e POSTGRES_DB=user_auth -p 5432:5432 -d postgres
```

This command will start a PostgreSQL container with the necessary environment variables for the database username, password, and the database name itself.

### Installing Dependencies

Before running the application, we need to install the project dependencies. Run the following command in the root directory of the project:

```bash
npm install
```

### Create .env file

Copy `.env.sample` to `.env`

```bash
cp .env.sample .env
```

### Running the Application

To start the server, use:

```bash
npm run start
```

For development purposes, we can start the server in watch mode with:

```bash
npm run start:dev
```

## Running Tests

## Unit Tests

Run the unit tests with:

```bash
npm run test
```

For coverage reports, run:

```bash
npm run test:cov
```

To execute end-to-end tests, use:

```bash
npm run test:e2e
```

## API Endpoints

Below is a list of available API endpoints.

### Authentication

**Register a New User**

- Method: **POST**
- Endpoint: `/api/auth/register`
- Description: Registers a new user with the required details. Typically requires a username and password in the request body.

**Login**

- Method: **POST**
- Endpoint: `/api/auth/login`
- Description: Authenticates a user. Requires a username and password in the request body. Returns a token upon successful authentication.

### Protected Routes

These endpoints require a valid authentication token.

**Access a Protected Route**

- Method: **GET**
- Endpoint: `/api/protected`
- Description: Tests access to protected routes. Requires an authentication token.

**Get All Users**

- Method: **GET**
- Endpoint: `/api/protected/users`
- Description: Retrieves a list of all users. Requires an authentication token. This method was intended for testing e2e

**Delete the Current User**

- Method: **DELETE**
- Endpoint: `/api/protected/user`
- Description: Deletes the account of the currently authenticated user. Requires an authentication token. This method was intended for testing e2e

## API Documentation

To access the Swagger UI, navigate to:

- Swagger UI: `https://localhost:3000/api`

## Built With

- NestJS - A Node.js framework for building efficient, reliable and scalable server-side applications.
- JSON Web Token (JWT) - For implementing token-based authentication.
- PostgreSQL - Relational database.
- Jest - For unit testing.
- SuperTest - For end-to-end testing.
- Docker - For containerization and easy PostgreSQL database setup.

## Contact

- Email: edvidarez@gmail.com
