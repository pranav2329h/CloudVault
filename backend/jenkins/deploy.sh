#!/bin/bash

set -e

echo "Logging into Docker Hub..."

docker login -u $DOCKER_USERNAME -p $DOCKER_PASSWORD

echo "Tagging Image..."

docker tag cloudvault-backend:latest $DOCKER_USERNAME/cloudvault-backend:latest

echo "Pushing Image..."

docker push $DOCKER_USERNAME/cloudvault-backend:latest

echo "Connecting to Deployment Server..."

ssh -o StrictHostKeyChecking=no ubuntu@$EC2_HOST << EOF

cd CloudVault/backend

docker compose pull

docker compose up -d

EOF