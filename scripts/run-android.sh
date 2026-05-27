#!/bin/bash

set -e

PROJECT_DIR=$(dirname $(dirname "$(realpath $0)"))

# Install dependencies
yarn

# Read environment variables
set -a
source "$PROJECT_DIR/.env"
if test -f "$PROJECT_DIR/.env.local"; then
  source "$PROJECT_DIR/.env.local"
fi
set +a

# Run Android app
yarn android --no-packager --active-arch-only --appIdSuffix=debug "$@"
