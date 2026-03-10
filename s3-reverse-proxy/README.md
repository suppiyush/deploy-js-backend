# S3 Reverse Proxy

Express based reverse-proxy to proxy requests to S3 bucket.

## Table of Contents

- [Architecture Design](#architecture-design)
- [Manual Setup](#manual-setup)
  - [Installation](#installation)
  - [Usage](#usage)
- [Development Setup](#development-setup)
- [Docker Setup](#docker-setup)

## Architecture Design

<img width="1255" height="565" alt="s3-proxy-arch" src="https://github.com/user-attachments/assets/a469a14a-8e28-4ef1-a09c-ba89b51f61c7" />

## Working

1. Retrieve the Project's ID from the hostname of the URL.
2. Using the base URL of S3 Bucket, the request is proxied to the respective built of the project.

## Manual Setup

### Installation

This module is distributed using npm which is bundled with node and should be installed as one of the dependency prior.

1. Clone the repository:

```bash
git clone https://github.com/suppiyush/deploy-js-backend
```

1. Navigate to Reverse-Proxy & Install dependencies:

```bash
cd s3-reverse-proxy && npm install --production
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

2. Navigate to Reverse-Proxy & Install dependencies:

```bash
cd s3-reverse-proxy && npm install
```

3. Run the Project

```bash
npm run dev
```

## Docker Setup

1. Navigate to API-Server

```bash
cd s3-reverse-proxy
```

2. Building the image

```bash
docker build -t s3-reverse-proxy .
```

2. Running the container

```bash
docker run -d --name s3-proxy-container -p 3000:3000 --env-file .env s3-reverse-proxy
```

## Redirection Rules

- By default at the root domain the request is redirected to index.html.
- Incase of any static files, the path is resolved automatically by S3 bucket.
- Request to any other route, is also redirected to index.html as a SPA fallback.

---

> [!Note]
> Due to the single page nature of react, whole routing is managed by index.html.
