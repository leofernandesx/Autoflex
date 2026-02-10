#!/bin/sh
set -e
echo "Waiting for PostgreSQL at postgres:5432..."
for i in $(seq 1 30); do
  if nc -z postgres 5432 2>/dev/null; then
    echo "PostgreSQL is ready."
    break
  fi
  echo "Attempt $i/30: waiting 2s..."
  sleep 2
done
exec java -jar quarkus-run.jar
