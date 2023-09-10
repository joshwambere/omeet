#!/bin/bash

set -e

# Function to wait for a service to be ready
wait_for_service() {
  local service_name="$1"
  local port="$2"

  echo "Waiting for $service_name to be ready..."

  while ! nc -z "$service_name" "$port"; do
    sleep 1
  done

  echo "$service_name is ready"
}

# Wait for PostgreSQL to be ready
wait_for_service "db" 5432

# Run migrations
npm run prisma:migrate

# Execute the provided command (e.g., npm start)
exec "$@"
