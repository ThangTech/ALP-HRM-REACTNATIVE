#!/bin/bash

set -e

yarn

PROJECT_DIR=$(dirname $(dirname "$(realpath $0)"))

# Parse command line arguments
if [ "$1" = "--production" ]; then
  export APP_ENV=production
elif [ "$1" = "--development" ]; then
  export APP_ENV=development
else
  echo "Usage: $0 [--development|--production]"
  exit 1
fi

set -a;
source "$PROJECT_DIR/.env"
if test -f "$PROJECT_DIR/.env.local"; then
  source "$PROJECT_DIR/.env.local"
fi

echo "Building for environment: $APP_ENV"

if [ "$APP_ENV" = "production" ]; then
  source "$PROJECT_DIR/.env.production"
  if test -f "$PROJECT_DIR/.env.production.local"; then
    source "$PROJECT_DIR/.env.production.local"
  fi
elif [ "$APP_ENV" = "development" ]; then
  source "$PROJECT_DIR/.env"
  if test -f "$PROJECT_DIR/.env.local"; then
    source "$PROJECT_DIR/.env.local"
  fi
fi
set +a;

export COMMIT_HASH=$(git rev-parse --short HEAD)

rm -rf "$PROJECT_DIR/android/app/build"

yarn react-native build-android --tasks assembleRelease
