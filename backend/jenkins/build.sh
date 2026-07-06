#!/bin/bash

set -e

echo "Installing Python dependencies..."

python3 -m venv venv

source venv/bin/activate

pip install --upgrade pip

pip install -r requirements.txt

echo "Running Python compile checks..."

python -m compileall .

echo "Building Docker Image..."

docker build -t cloudvault-backend:latest .
