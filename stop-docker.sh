#!/bin/bash

echo -e "Stopping containers"
docker-compose down

echo -e "Removing images"
docker rmi social-network-frontend social-network-backend

echo -e "Images removed"