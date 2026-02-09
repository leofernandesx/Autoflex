#!/bin/bash
cd "$(dirname "$0")"
export BROWSER=none
export SKIP_PREFLIGHT_CHECK=true
exec npm start
