#!/bin/bash
git switch deploy

docker compose build
docker compose down
docker compose up -d

# remove dangling images as per 
# https://stackoverflow.com/questions/50126741/how-to-remove-intermediate-images-from-a-build-after-the-build
 docker rmi -f $(docker images -f "dangling=true" -q)