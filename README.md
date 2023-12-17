# NestJS Swapi App Documentation

## Overview

This documentation provides detailed information on setting up, running, and maintaining the NestJS application that utilizes GraphQL, interacts with the SWAPI (Star Wars API) for data retrieval, and employs MongoDB as a caching system. The application is containerized using Docker for ease of deployment and management.

### Prerequisites

Before running the application locally, ensure that the following prerequisites are met:

- Docker is installed on your system.
- Docker Compose is installed on your system.
- An understanding of Make commands for Docker.

## Table of Contents

1. [Getting Started](#getting-started)
2. [Make Commands](#make-commands)
3. [Dockerfile](#dockerfile)
4. [docker-compose.yml](#docker-composeyml)
5. [Environment Variables](#environment-variables)
6. [GraphQL Endpoints](#graphql-endpoints)

## Getting Started

To run the NestJS Swapi App locally, follow the steps below:

1. Clone the repository:

```bash
git clone <repository-url>
cd <repository-directory>
```

2. Create a .env file based on the provided .env.example file and configure the necessary environment variables. You can run below command:
```bash
cp .env.example .env
```

3. Build and run the application using the provided Make commands:

```bash
make build
make run
```

## Make Commands

The Makefile includes several commands for managing the Docker containers:

- **build**: Build the Docker containers.
- **run**: Run the Docker containers.
- **stop**: Stop the running Docker containers.
- **rm**: Remove the Docker containers.
- **restart**: Stop and then run the Docker containers.
- **rebuild**: Stop, remove, build, and then run the Docker containers.
- **logs**: Display logs of the running Docker containers.
- **bash**: Access the shell of the running Docker container.

Example usage:

```bash
make rebuild
```

## Dockerfile
The Dockerfile defines the environment for running the NestJS Swapi App. It uses Node.js 18 Alpine as the base image, installs dependencies, and exposes port 3000. The application is started using the npm run start:dev command.

## docker-compose.yml
The docker-compose.yml file orchestrates the Docker services required for the application:

- mongodb: MongoDB service.
- swapi-app: Swapi application service.

The services are connected to a custom bridge network named mynet. MongoDB data is persisted using a volume named mongodb_data.

## Environment Variables
The application utilizes environment variables for configuration. Key environment variables are specified in the .env file. Ensure these variables are configured appropriately before running the application.

## GraphQL Endpoints
The NestJS Swapi App provides several GraphQL endpoints to interact with the Star Wars data. Below is a description of each available endpoint:

> **_NOTE:_** You can test queries using the GraphQL Playground that NestJS provides which is usually available at http://localhost:3000/graphql. The exact URL may vary depending on your NestJS configuration.

> **_NOTE:_** When initiating and launching a project, you can review GraphQL types in the auto-generated schema.gql file.

### `films` Query
<details>
  <summary>Show details</summary>
  <br/>

**Description**:

Retrieve a list of films based on optional search criteria, pagination, and default filtering.

**Parameters**:
- search (String): Optional search string. Defaults to an empty string.
- skip (Int): Number of records to skip. Defaults to 0.
- take (Int): Number of records to take. Defaults to 10.

**Example Usage**:

```gql
query {
  films(search: "A New Hope", skip: 0, take: 5) {
    id,
    title,
    opening_crawl,
    director
  }
}
```
</details>

### `film` Query
<details>
  <summary>Show details</summary>
  <br/>

**Description**:

Retrieve a specific film by its ID.

**Parameters**:
- id (Int): ID of the film

**Example Usage**:

```gql
query {
  film(id: 1) {
    id,
    title,
    opening_crawl,
    director
  }
}
```

</details>

### `uniqueWords` Query
<details>
  <summary>Show details</summary>
  <br/>

**Description**:

Retrieve unique words and their occurrences from the opening crawls of all films.

**Example Usage**:

```gql
query {
  uniqueWords {
    word,
    occurrences
  }
}
```

</details>

### `mostFrequentCharacterNames` Query
<details>
  <summary>Show details</summary>
  <br/>

**Description**:

Retrieve the most frequent character names and their occurrences from the opening crawls of all films.

**Example Usage**:

```gql
query {
  mostFrequentCharacterNames {
    name,
    occurrences
  }
}
```
</details>

### `people` Query
<details>
  <summary>Show details</summary>
  <br/>

**Description**:

Retrieve a list of people based on optional search criteria, pagination, and default filtering.

**Parameters**:
- search (String): Optional search string. Defaults to an empty string.
- skip (Int): Number of records to skip. Defaults to 0.
- take (Int): Number of records to take. Defaults to 10.

**Example Usage**:

```gql
query {
  people(search: "Luke", skip: 0, take: 5) {
    id,
    name,
    birth_year,
    gender
  }
}
```
</details>

### `person` Query
<details>
  <summary>Show details</summary>
  <br/>

**Description**:

Retrieve a specific person by their ID.

**Parameters**:
- id (Int): ID of the film

**Example Usage**:

```gql
query {
  person(id: 1) {
    id,
    name,
    birth_year,
    gender
  }
}
```
</details>

### `planets` Query
<details>
  <summary>Show details</summary>
  <br/>

**Description**:

Retrieve a list of planets based on optional search criteria, pagination, and default filtering.

**Parameters**:
- search (String): Optional search string. Defaults to an empty string.
- skip (Int): Number of records to skip. Defaults to 0.
- take (Int): Number of records to take. Defaults to 10.

**Example Usage**:

```gql
query {
  planets(search: "Tatooine", skip: 0, take: 5) {
    id,
    name,
    climate,
    population
  }
}
```
</details>

### `planet` Query
<details>
  <summary>Show details</summary>
  <br/>

**Description**:

Retrieve a specific planet by its ID.

**Parameters**:
- id (Int): ID of the film

**Example Usage**:

```gql
query {
  planet(id: 1) {
    id,
    name,
    climate,
    population
  }
}
```
</details>

### `species` Query
<details>
  <summary>Show details</summary>
  <br/>

**Description**:

Retrieve a list of species based on optional search criteria, pagination, and default filtering.

**Parameters**:
- search (String): Optional search string. Defaults to an empty string.
- skip (Int): Number of records to skip. Defaults to 0.
- take (Int): Number of records to take. Defaults to 10.

**Example Usage**:

```gql
query {
  species(search: "Wookiee", skip: 0, take: 5) {
    id,
    name,
    classification,
    language
  }
}
```
</details>

### `specie` Query
(Yeah, I know there is no such word)
<details>
  <summary>Show details</summary>
  <br/>

**Description**:

Retrieve a specific species by its ID.

**Parameters**:
- id (Int): ID of the film

**Example Usage**:

```gql
query {
  specie(id: 1) {
    id,
    name,
    classification,
    language
  }
}
```
</details>

### `starships` Query
<details>
  <summary>Show details</summary>
  <br/>

**Description**:

Retrieve a list of starships based on optional search criteria, pagination, and default filtering.

**Parameters**:
- search (String): Optional search string. Defaults to an empty string.
- skip (Int): Number of records to skip. Defaults to 0.
- take (Int): Number of records to take. Defaults to 10.

**Example Usage**:

```gql
query {
  starships(search: "X-wing", skip: 0, take: 5) {
    id,
    name,
    model,
    crew
  }
}
```
</details>

### `starship` Query
<details>
  <summary>Show details</summary>
  <br/>

**Description**:

Retrieve a specific starship by its ID.

**Parameters**:
- id (Int): ID of the film

**Example Usage**:

```gql
query {
  starship(id: 1) {
    id,
    name,
    model,
    crew
  }
}
```
</details>

### `vehicles` Query
<details>
  <summary>Show details</summary>
  <br/>

**Description**:

Retrieve a list of vehicles based on optional search criteria, pagination, and default filtering.

**Parameters**:
- search (String): Optional search string. Defaults to an empty string.
- skip (Int): Number of records to skip. Defaults to 0.
- take (Int): Number of records to take. Defaults to 10.

**Example Usage**:

```gql
query {
  vehicles(search: "Speeder", skip: 0, take: 5) {
    id,
    name,
    model,
    passengers
  }
}
```
</details>

### `vehicle` Query
<details>
  <summary>Show details</summary>
  <br/>

**Description**:

Retrieve a specific vehicle by its ID.

**Parameters**:
- id (Int): ID of the film

**Example Usage**:

```gql
query {
  vehicle(id: 1) {
    id,
    name,
    model,
    passengers
  }
}
```
</details>

