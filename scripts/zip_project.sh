#!/bin/bash

# Script to zip the project for deployment, excluding heavy folders
# Run this from the root of the project (e.g., ./scripts/zip_project.sh)

OUTPUT_FILE="digital-marketplace-deploy.zip"

echo "Zipping project to $OUTPUT_FILE..."

# Zip the current directory contents into the output file
# Exclude node_modules, .git, .turbo, .next, dist, and other build artifacts
# -r: recursive
# -x: exclude pattern

if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
    # PowerShell/Windows command (requires 7z or similar if not using standard zip, but assuming git bash/wsl environment based on .sh extension)
    # If standard zip is not available, we might need a different approach or instruct user to use 'tar' if available.
    # Using tar might be safer across environments if available, or just standard zip.
    
    # Check if zip command exists
    if ! command -v zip &> /dev/null; then
        echo "Error: 'zip' command not found. Please install zip or use a different method."
        exit 1
    fi

    zip -r "$OUTPUT_FILE" . -x "**/node_modules/*" -x "**/.git/*" -x "**/.turbo/*" -x "**/.next/*" -x "**/dist/*" -x "**/.cache/*"
else
    # Linux/Mac
    zip -r "$OUTPUT_FILE" . -x "**/node_modules/*" -x "**/.git/*" -x "**/.turbo/*" -x "**/.next/*" -x "**/dist/*" -x "**/.cache/*"
fi

echo "Done! File created: $OUTPUT_FILE"
echo "You can now upload this file to your VPS."
