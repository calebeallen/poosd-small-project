#!/bin/bash

# root pwd: #4}uQ>1j97o

# Get the directory of this script (the project root)
PROJECT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# VM details (hardcode your values here)
VM_USER="root"
VM_HOST="137.184.94.213"
VM_PATH="/var/www/html"


echo "Copying project from $PROJECT_DIR to $VM_USER@$VM_HOST:$VM_PATH ..."
rsync -av --delete --exclude 'copy_project.sh' --exclude '.git' "$PROJECT_DIR/" "$VM_USER@$VM_HOST:$VM_PATH/"

if [ $? -eq 0 ]; then
  echo "✅ Project copied successfully to $VM_USER@$VM_HOST:$VM_PATH"
else
  echo "❌ Copy failed."
fi
