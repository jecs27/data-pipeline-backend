#!/bin/sh
# wait-for-it.sh

set -e

host="$1"
shift
cmd="$@"

until nc -z -v -w30 "$host" > /dev/null 2>&1; do
  echo "Waiting for database connection..."
  sleep 1
done

echo "Database is up - executing command"
exec $cmd