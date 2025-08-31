#!/bin/bash

# Highway Delite Docker Deployment Script
# Updated for current Docker configuration

set -e

echo "Starting Highway Delite deployment..."

# Check if .env file exists
if [ ! -f .env ]; then
    echo "Error: .env file not found!"
    echo "Please copy .env.example to .env and configure your environment variables."
    exit 1
fi

# Load environment variables
source .env

# Validate required environment variables
required_vars=("MONGO_ROOT_PASSWORD" "MONGO_PASSWORD" "JWT_SECRET" "GOOGLE_CLIENT_ID")
for var in "${required_vars[@]}"; do
    if [ -z "${!var}" ]; then
        echo "Error: Environment variable $var is not set!"
        exit 1
    fi
done

echo "Environment variables validated"

# Stop existing containers
echo "Stopping existing containers..."
docker-compose down

# Remove old volumes (optional)
read -p "Do you want to reset the database? This will delete all data! (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "Removing database volumes..."
    docker-compose down -v
fi

# Remove old images (optional)
read -p "Do you want to remove old images to save space? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "Removing old images..."
    docker image prune -a -f
fi

# Build and start services
echo "Building and starting services..."
docker-compose up -d --build

# Wait for services to be ready
echo "Waiting for services to start..."
sleep 30

# Check if services are running
echo "Checking service health..."
if docker-compose ps | grep -q "Up"; then
    echo "Services are running successfully!"
    
    # Show service status
    docker-compose ps
    
    echo ""
    echo "Deployment complete!"
    echo "Frontend: http://localhost:5173"
    echo "Backend API: http://localhost:5000"
    echo "MongoDB: localhost:27017"
    echo ""
    echo "Useful commands:"
    echo "  View logs: docker-compose logs -f [service]"
    echo "  Stop: docker-compose down"
    echo "  Restart: docker-compose restart [service]"
    echo "  Update: git pull && docker-compose up -d --build"
    echo "  Fresh start: docker-compose down -v && docker-compose up -d"
    echo "  Database access: docker exec -it highway-delite-db mongosh --authenticationDatabase admin -u admin -p [password]"
else
    echo "Some services failed to start. Check logs:"
    docker-compose logs
    exit 1
fi
