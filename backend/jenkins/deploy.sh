#!/bin/bash

set -euo pipefail

: "${DOCKER_USERNAME:?DOCKER_USERNAME is required}"
: "${EC2_HOST:?EC2_HOST is required}"

IMAGE_NAME="${DOCKER_USERNAME}/cloudvault-backend:latest"

if [[ -n "${DOCKER_PASSWORD:-}" ]]; then
  echo "Logging into Docker Hub..."
  echo "$DOCKER_PASSWORD" | docker login -u "$DOCKER_USERNAME" --password-stdin
fi

echo "Tagging image..."
docker tag cloudvault-backend:latest "$IMAGE_NAME"

echo "Pushing image..."
docker push "$IMAGE_NAME"

echo "Deploying CloudVault on EC2..."
ssh -o StrictHostKeyChecking=no "ubuntu@$EC2_HOST" << EOF
set -euo pipefail
cd CloudVault/backend
BACKEND_IMAGE="$IMAGE_NAME" docker compose pull
BACKEND_IMAGE="$IMAGE_NAME" docker compose up -d --no-build --remove-orphans
EOF
