# Build Server

This module is responsible for the deployment of the React Project on AWS S3.

## Table of Contents

- [Architecture Design](#architecture-design)
- [Deployment Process](#deployment-process)
- [Manual Setup](#manual-setup)
  - [Installation](#installation)
  - [Usage](#usage)
- [Docker Setup](#docker-setup)
- [Log Collection](#log-collection)

## Architecture Design

<img width="1436" height="623" alt="build-server-arch" src="https://github.com/user-attachments/assets/dd1bff42-1581-4c6b-b5d9-618acabd5564" />

## Deployment Process

- Cloning the provided Github repository.
- Installing dependencies and Building the project.
- Pushing the built artifacts to AWS S3 bucket.
- Request API Server to Update the Deployment Status.

## Manual Setup

### Installation

This module is distributed using npm which is bundled with node and should be installed as one of the dependency prior.

1. Clone the repository:

```bash
git clone https://github.com/suppiyush/deploy-js-backend
```

2. Navigate to Build-Server & Install dependencies:

```bash
cd build-server && npm install
```

3. Update .env with required Environment variables

```bash
mv .env.sample .env
```

### Usage

```bash
node script.js
```

> [!NOTE]
> This module is primarily developed to be used directly as a docker image so as to spin multiple containers for deploying projects.

## Docker Setup

1. Navigate to Build-Server

```bash
cd build-server
```

2. Building the image

```bash
docker build -t build-server .
```

3. Running the container

```bash
docker run -d --name build-container --env-file .env build-server
```

## Log Collection

This module also act as a Kafka Producer to throw the logs of the deployment process to a Kafka Server, which are consumed by the Kafka Consumer in the API-Server.
