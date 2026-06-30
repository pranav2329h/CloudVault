#!/bin/bash

set -e

echo "Installing Python dependencies..."

python3 -m venv venv

source venv/bin/activate

pip install --upgrade pip

pip install -r requirements.txt

echo "Running Tests..."

python -m unittest discover || true

echo "Building Docker Image..."

docker build -t cloudvault-backend:latest .