#!/bin/bash
# This script will be used to track which courses have been fetched
# The actual fetching is done via browser automation

echo "Course fetching progress tracker"
echo "Total courses: 182"

if [ -f scripts/courses-from-tiss.json ]; then
  count=$(cat scripts/courses-from-tiss.json | jq 'keys | length')
  echo "Fetched so far: $count"
else
  echo "No courses fetched yet"
fi
