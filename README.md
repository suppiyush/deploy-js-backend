# Deploy-JS Backend

Backend system for deploying React applications.
It is composed of three core modules:

1. API Server
2. Build Server
3. S3 Reverse Proxy

## Table of Contents

- [Architecture Design](#architecture-design)
- [Setup](#setup)
- [Usage](#usage)
- [Data Storage & Log Collection](#data-storage--log-collection)

## Architecture Design

<img width="1421" height="598" alt="arch" src="https://github.com/user-attachments/assets/c4c67165-a7a4-40bc-aede-1ac0edb8c3dd" />

## Setup

1. Build the Docker image for Build server.

```bash
cd build-server
docker build -t builder-server .
```

2. Push the built image to AWS ECR.

3. Build the Docker image for API server.

```bash
cd api-server
docker build --build-arg DATABASE_URL=<your_db_url> -t api-server .
```

4. Build the Docker image for S3 reverse proxy.

```bash
cd s3-reverse-proxy
docker build -t s3-reverse-proxy .
```

5. Update the environment variables for both API server and Reverse Proxy according to the provided .env.sample.

## Usage

```bash
docker compose up -d
```

## Data Storage & Log Collection:

1. Postgres along with Prisma as an ORM is used for storing the data of users, projects and deployments.

2. Clickhouse is used to store the logs produced by the Build Server through a Kafka Server.

> [!Note]
> ClickHouse is deployed in-house alongside the API server and reverse proxy containers, while Kafka and PostgreSQL are provisioned via third-party managed services.
