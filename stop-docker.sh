#!/bin/bash

echo -e "Stopping containers"
docker-compose down

echo -e "Removing images"

# For some reason docker names created images differently depending on OS, removing both variants of the images just to be safe
docker rmi social-network_frontend social-network_backend
docker rmi social-network-frontend social-network-backend

echo -e "Images removed"