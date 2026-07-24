#!/bin/bash

set -e

yarn

PROJECT_DIR=$(dirname $(dirname "$(realpath "$0")"))

if [ "$1" = "--production" ]; then
  export APP_ENV=production
  SCHEME="ALPHRM"
  CONFIGURATION="Release"
elif [ "$1" = "--development" ]; then
  export APP_ENV=development
  SCHEME="ALPHRM-Dev"
  CONFIGURATION="ReleaseDev"
else
  echo "Usage: $0 [--development|--production]"
  exit 1
fi

set -a
source "$PROJECT_DIR/.env"
if test -f "$PROJECT_DIR/.env.local"; then
  source "$PROJECT_DIR/.env.local"
fi

echo "Building iOS for environment: $APP_ENV (scheme=$SCHEME, configuration=$CONFIGURATION)"

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
set +a

export COMMIT_HASH=$(git rev-parse --short HEAD)

cd "$PROJECT_DIR/ios"
pod install

ARCHIVE_PATH="$PROJECT_DIR/ios/build/ALPHRM-${APP_ENV}.xcarchive"
EXPORT_PATH="$PROJECT_DIR/ios/build/ipa-${APP_ENV}"
EXPORT_OPTIONS="$PROJECT_DIR/ios/exportOptions.plist"

rm -rf "$PROJECT_DIR/ios/build"
mkdir -p "$PROJECT_DIR/ios/build"

xcodebuild -workspace ALPHRM.xcworkspace \
  -scheme "$SCHEME" \
  -configuration "$CONFIGURATION" \
  -sdk iphoneos \
  -archivePath "$ARCHIVE_PATH" \
  archive

if [ -f "$EXPORT_OPTIONS" ]; then
  xcodebuild -exportArchive \
    -archivePath "$ARCHIVE_PATH" \
    -exportOptionsPlist "$EXPORT_OPTIONS" \
    -exportPath "$EXPORT_PATH"
  echo "✅ IPA exported: $EXPORT_PATH"
else
  echo "⚠️  Archive done: $ARCHIVE_PATH"
  echo "   Add ios/exportOptions.plist (method, teamID) to also export an IPA."
fi
