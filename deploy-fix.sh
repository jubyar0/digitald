#!/bin/bash
# Deploy script to fix build errors on VPS

echo "=== Pulling latest changes from GitHub ==="
cd /var/www/digital-marketplace
git pull origin main

echo ""
echo "=== Checking for old .eslintrc.js file ==="
if [ -f "apps/web/.eslintrc.js" ]; then
    echo "Removing old .eslintrc.js file..."
    rm apps/web/.eslintrc.js
else
    echo ".eslintrc.js already removed ✓"
fi

echo ""
echo "=== Verifying .eslintrc.cjs exists ==="
if [ -f "apps/web/.eslintrc.cjs" ]; then
    echo ".eslintrc.cjs exists ✓"
else
    echo "ERROR: .eslintrc.cjs not found!"
    exit 1
fi

echo ""
echo "=== Checking next.config.js for turbopack ==="
if grep -q "turbopack" apps/web/next.config.js; then
    echo "Found 'turbopack' in next.config.js - needs manual removal"
    echo "Current next.config.js content:"
    cat apps/web/next.config.js
else
    echo "No 'turbopack' found in next.config.js ✓"
fi

echo ""
echo "=== Installing dependencies ==="
pnpm install

echo ""
echo "=== Generating Prisma client ==="
cd packages/database
pnpm prisma generate
cd ../..

echo ""
echo "=== Building the application ==="
cd apps/web
pnpm build

echo ""
echo "=== Restarting PM2 ==="
pm2 restart all

echo ""
echo "=== Deployment completed! ==="
