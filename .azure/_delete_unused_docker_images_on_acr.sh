#!/usr/bin/env bash

# Environment variable for container command line
ACR="eurekacr"
REPOSITORY="eureka-club/eureka"
PURGE_CMD="acr purge --filter '"$REPOSITORY":\d*' --keep 10 \
  --untagged --ago 2m"

az acr run \
  --cmd "$PURGE_CMD" \
  --registry "$ACR" \
  /dev/null