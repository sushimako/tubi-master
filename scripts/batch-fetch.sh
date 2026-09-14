#!/bin/bash
# Batch fetch course info - to be run after browser fetching

# Add a course result to the JSON file
add_course() {
  local cn="$1"
  local name="$2"
  local type="$3"
  local hours="$4"
  local ects="$5"
  local sem="$6"
  local cancelled="$7"
  
  # Read current JSON, add new course, write back
  jq --arg cn "$cn" \
     --arg name "$name" \
     --arg type "$type" \
     --argjson hours "$hours" \
     --argjson ects "$ects" \
     --arg sem "$sem" \
     --argjson cancelled "$cancelled" \
     '.[$cn] = {courseNumber: $cn, name: $name, type: $type, hours: $hours, ects: $ects, semester: $sem, cancelled: $cancelled}' \
     scripts/courses-from-tiss.json > /tmp/courses-temp.json \
     && mv /tmp/courses-temp.json scripts/courses-from-tiss.json
  
  echo "Added $cn: $name"
}

echo "Batch course fetcher - use add_course function"
