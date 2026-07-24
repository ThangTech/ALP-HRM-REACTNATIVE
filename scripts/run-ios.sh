#!/bin/bash

set -e

PROJECT_DIR=$(dirname $(dirname "$(realpath "$0")"))

yarn

set -a
source "$PROJECT_DIR/.env"
if test -f "$PROJECT_DIR/.env.local"; then
  source "$PROJECT_DIR/.env.local"
fi
set +a

yarn react-native run-ios --scheme ALPHRM-Debug --no-packager "$@"
