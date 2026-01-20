#!/bin/bash

# Script to manually deploy updates to VPS
# Run this on the VPS server

echo "🚀 Starting deployment..."

# Navigate to project directory
cd /var/www/digital-marketplace || exit 1

echo "📥 Pulling latest changes from GitHub..."
git pull origin main

echo "📦 Installing dependencies..."
export PNPM_HOME="/root/.local/share/pnpm"
export PATH="$PNPM_HOME:$PATH"
pnpm install --frozen-lockfile

echo "🔧 Generating Prisma Client..."
pnpm db:generate

echo "🏗️ Building the application..."
cd apps/web
pnpm build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    
    echo "🔄 Restarting application with PM2..."
    pm2 reload digital-marketplace || pm2 start npm --name "digital-marketplace" -- start
    pm2 save
    
    echo "✅ Deployment complete!"
    echo "🌐 Application should be running at http://168.231.84.38"
else
    echo "❌ Build failed! Please check the errors above."
    exit 1
fi
