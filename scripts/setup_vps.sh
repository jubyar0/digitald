#!/bin/bash

# Digital Marketplace VPS Setup Script
# Run this script as root or with sudo

set -e

echo "Starting VPS Setup..."

# 1. Update System
echo "Updating system packages..."
sudo apt update && sudo apt upgrade -y
sudo apt install -y curl git unzip build-essential

# 2. Install Node.js
echo "Installing Node.js..."
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
sudo npm install -g pnpm pm2

# 3. Install Bun
echo "Installing Bun..."
curl -fsSL https://bun.sh/install | bash
# Add bun to path for the current session
export BUN_INSTALL="$HOME/.bun"
export PATH="$BUN_INSTALL/bin:$PATH"

# 4. Install PostgreSQL
echo "Installing PostgreSQL..."
sudo apt install -y postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql

# 5. Install Nginx
echo "Installing Nginx..."
sudo apt install -y nginx

# 6. Install Certbot
echo "Installing Certbot..."
sudo apt install -y certbot python3-certbot-nginx

echo "Setup complete! Please proceed with database configuration and project cloning."
