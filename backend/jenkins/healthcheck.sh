#!/bin/bash

set -e

echo "Checking Backend Health..."

curl http://$EC2_HOST:5000/

echo "Application is running."