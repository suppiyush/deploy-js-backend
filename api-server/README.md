# API Server

Express based http-server to serve requests from frontend and Build-Server.
This Project follows a layer based architecture, similar to MVC.

## Table of Contents

- [Architecture Design](#architecture-design)
- [Manual Setup](#manual-setup)
  - [Installation](#installation)
  - [Usage](#usage)
- [Development Setup](#development-setup)
- [Docker Setup](#docker-setup)
- [Log Collection](#log-collection)
- [Security Practices](#security-practices)

## Architecture Design

<img width="1286" height="634" alt="api-server-arch" src="https://github.com/user-attachments/assets/77e285c6-e47a-400f-9f00-41b738c0812f" />

## Manual Setup

### Installation

This module is distributed using npm which is bundled with node and should be installed as one of the dependency prior.

1. Clone the repository:

```bash
git clone https://github.com/suppiyush/deploy-js-backend
```

2. Navigate to API-Server & Install dependencies:

```bash
cd api-server && npm install --production
```

3. Update .env with required Environment variables

```bash
mv .env.sample .env
```

3. Build the Project

```bash
npm run build
```

### Usage

```bash
npm run start
```

## Development Setup

1. Clone the repository:

```bash
git clone https://github.com/suppiyush/deploy-js-backend
```

2. Navigate to API-Server & Install dependencies:

```bash
cd api-server && npm install
```

3. Run the Project

```bash
npm run dev
```

## Docker Setup

1. Navigate to API-Server

```bash
cd api-server
```

2. Building the image

```bash
docker build --build-arg DATABASE_URL=<YOUR_DB_URL> -t api-server .
```

2. Running the container

```bash
docker run -d --name api-container -p 3000:3000 --env-file .env api-server
```

## Log Collection

This module also act as a Kafka Consumer which gathers the logs thrown by the Build Server and push them to Clickhouse for storage, which can be fetched by the client using the corresponding deployment's id.

## Security Practices

- User Inputs are sanitised using [Zod](https://www.npmjs.com/package/zod) Schema by Controller layer.
- IP based rate-limiting is imposed using [express-rate-limit](https://www.npmjs.com/package/express-rate-limit) on sensitive routes.
