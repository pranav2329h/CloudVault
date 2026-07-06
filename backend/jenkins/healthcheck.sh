#!/bin/bash

set -e

echo "Checking Backend Health..."

curl --fail --show-error --silent http://$EC2_HOST:5000/health

echo "Application is running."
