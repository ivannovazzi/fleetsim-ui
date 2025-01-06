#!/bin/sh

# Creates the JSON config based on environment variables
echo "{}" | jq '.' > config.json

# This will exec the CMD from your Dockerfile, i.e. "npm start"
exec "$@"
