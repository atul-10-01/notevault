#!/bin/bash

# EC2 Initial Setup Script
# Run this once on a fresh EC2 instance

set -e

echo "Setting up EC2 instance for Highway Delite deployment..."

# Update system
echo "Updating system packages..."
sudo apt update && sudo apt upgrade -y

# Install Docker
echo "Installing Docker..."
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker ubuntu
rm get-docker.sh

# Install Docker Compose
echo "Installing Docker Compose..."
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Install additional tools
echo "Installing additional tools..."
sudo apt install -y \
    git \
    curl \
    wget \
    htop \
    unzip \
    tree \
    vnstat

# Create application directory
echo "Creating application directory..."
sudo mkdir -p /var/www/highway-delite
sudo chown ubuntu:ubuntu /var/www/highway-delite

# Configure firewall
echo "Configuring firewall..."
sudo ufw --force enable
sudo ufw allow ssh
sudo ufw allow 80
sudo ufw allow 443
sudo ufw allow 5000
sudo ufw allow 5173

# Setup automatic security updates
echo "Setting up automatic security updates..."
sudo apt install -y unattended-upgrades
echo 'Unattended-Upgrade::Automatic-Reboot "false";' | sudo tee -a /etc/apt/apt.conf.d/50unattended-upgrades

# Create swap file (helps with memory)
echo "Creating swap file..."
sudo fallocate -l 1G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab

# Setup log rotation for Docker
echo "Setting up log rotation..."
sudo tee /etc/docker/daemon.json > /dev/null <<EOF
{
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "10m",
    "max-file": "3"
  }
}
EOF

# Restart Docker to apply log settings
sudo systemctl restart docker

# Add ubuntu user to docker group and apply immediately
newgrp docker

echo "=== EC2 Setup Complete! ==="
echo "Instance is ready for deployment."
echo "You may need to logout and login again for Docker permissions."
echo ""
echo "Next steps:"
echo "1. Set up GitHub repository secrets"
echo "2. Push code to trigger deployment"
echo "3. Access your app at: http://$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4):5173"
echo ""
echo "Useful commands:"
echo "  docker-compose ps    # Check running containers"
echo "  htop                 # Monitor system resources"
echo "  df -h                # Check disk usage"
echo "  sudo ufw status      # Check firewall status"
