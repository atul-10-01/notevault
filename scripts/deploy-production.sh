#!/bin/bash

# Production deployment script for EC2
# This script is used by GitHub Actions but can also be run manually

set -e

echo "Starting production deployment..."

# Configuration
APP_DIR="/var/www/highway-delite/current"
BACKUP_DIR="/var/www/highway-delite/backup"
USER="ubuntu"

# Function to check if service is healthy
check_health() {
    local retries=10
    local wait_time=5
    
    for i in $(seq 1 $retries); do
        if curl -f http://localhost:5000/ > /dev/null 2>&1; then
            echo "Health check passed!"
            return 0
        fi
        echo "Health check attempt $i/$retries failed, waiting ${wait_time}s..."
        sleep $wait_time
    done
    
    echo "Health check failed after $retries attempts"
    return 1
}

# Function to rollback deployment
rollback() {
    echo "Rolling back deployment..."
    cd $APP_DIR
    docker-compose down || true
    
    if [ -d "$BACKUP_DIR" ]; then
        cd $BACKUP_DIR
        echo "Starting backup deployment..."
        docker-compose up -d
        if check_health; then
            echo "Rollback successful!"
        else
            echo "Rollback failed! Manual intervention required."
        fi
    else
        echo "No backup available for rollback!"
    fi
}

# Main deployment logic
main() {
    # Ensure we're in the right directory
    cd $APP_DIR
    
    # Validate required files
    if [ ! -f "docker-compose.yml" ]; then
        echo "Error: docker-compose.yml not found!"
        exit 1
    fi
    
    if [ ! -f ".env" ]; then
        echo "Error: .env file not found!"
        exit 1
    fi
    
    # Show current status
    echo "Current deployment status:"
    docker-compose ps || echo "No containers running"
    
    # Stop existing containers gracefully
    echo "Stopping existing containers..."
    docker-compose down --timeout 30 || true
    
    # Clean up unused Docker resources
    echo "Cleaning up Docker resources..."
    docker system prune -f || true
    
    # Start new deployment
    echo "Starting new deployment..."
    docker-compose up -d --build
    
    # Wait for services to initialize
    echo "Waiting for services to start..."
    sleep 30
    
    # Perform health check
    if check_health; then
        echo "Deployment successful!"
        
        # Show final status
        echo "=== Deployment Complete ==="
        echo "Time: $(date)"
        echo "Services:"
        docker-compose ps
        echo "Disk usage:"
        df -h /var/www/highway-delite
        
        # Clean up old backup
        if [ -d "$BACKUP_DIR" ]; then
            echo "Cleaning up old backup..."
            rm -rf $BACKUP_DIR
        fi
        
        return 0
    else
        echo "Deployment failed health check!"
        rollback
        exit 1
    fi
}

# Trap to handle script interruption
trap 'echo "Deployment interrupted! Consider running rollback."; exit 1' INT TERM

# Run main deployment
main "$@"
