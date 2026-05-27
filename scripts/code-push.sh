#!/bin/bash

set -e

platform="$1"
if [ -z "$platform" ]; then
  echo "missing platform"
  exit 1
fi

shift

PROJECT_DIR=$(dirname $(dirname "$(realpath $0)"))
echo "$PROJECT_DIR"
. "$PROJECT_DIR/.env"
if test -f "$PROJECT_DIR/.env.local"; then
  . "$PROJECT_DIR/.env.local"
fi
if [ "$APP_ENV" = "production" ]; then
  . "$PROJECT_DIR/.env.production"
  if test -f "$PROJECT_DIR/.env.production.local"; then
    source "$PROJECT_DIR/.env.production.local"
  fi
fi


# Fallback APP_ENV
if [ -z "$APP_ENV" ]; then
  echo "⚠️  APP_ENV not set. Defaulting to development"
  APP_ENV=development
fi

# Prepare deployment and suffix
DEPLOYMENT=""
APP_ID_SUFFIX=""

case "$APP_ENV" in
  production)
    DEPLOYMENT="Production"
    ;;
  development)
    DEPLOYMENT="Dev"
    ANDROID_VERSION_NAME="${ANDROID_VERSION_NAME}-dev"
    IOS_VERSION_NAME="${IOS_VERSION_NAME}-dev"
    APP_ID_SUFFIX="-dev"
    ;;
  test)
    DEPLOYMENT="Dev"
    ANDROID_VERSION_NAME="${ANDROID_VERSION_NAME}-test"
    IOS_VERSION_NAME="${IOS_VERSION_NAME}-test"
    APP_ID_SUFFIX="-staging"
    ;;
  *)
    echo "❌ invalid APP_ENV: $APP_ENV"
    exit 1
    ;;
esac

# Ensure yarn installs
yarn

# Get commit hash
COMMIT_HASH=$(git rev-parse --short HEAD)
if [ -z "$COMMIT_HASH" ]; then
  echo "❌ Cannot determine git commit hash"
  exit 1
fi

# RevoPush Release
if grep -q "ios" <<< "$platform"; then
  DESC="${IOS_VERSION_NAME}.${APP_BUNDLE_VERSION}.${COMMIT_HASH}"
  echo "🚀 Releasing to RevoPush (iOS): $DESC"
  revopush release-react may10-qms ios -d "$DEPLOYMENT" -t "$IOS_VERSION_NAME" --description "$DESC" 
fi

if grep -q "android" <<< "$platform"; then
  DESC="${ANDROID_VERSION_NAME}.${APP_BUNDLE_VERSION}.${COMMIT_HASH}"
  echo "🚀 Releasing to RevoPush (Android): $DESC"
  revopush release-react may10-qms android -d "$DEPLOYMENT" -t "$ANDROID_VERSION_NAME" --description "$DESC" 
fi
