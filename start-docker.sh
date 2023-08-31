#!/bin/bash

# Start the Docker containers using Docker Compose
docker-compose up --build -d

echo "Containers are up and running. You can access your app at http://localhost:3000 and http://localhost:8080."
