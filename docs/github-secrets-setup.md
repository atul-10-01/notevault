# GitHub Secrets Configuration Guide

## Required Secrets for CI/CD Pipeline

Navigate to your GitHub repository → Settings → Secrets and variables → Actions

### 1. AWS Secrets

#### `EC2_HOST`
- **Value**: Your EC2 instance public IP address
- **Example**: `12.34.56.78`
- **How to get**: AWS Console → EC2 → Instances → Select your instance → Public IPv4 address

#### `EC2_PRIVATE_KEY`
- **Value**: Your EC2 private key (.pem file content)
- **How to get**: 
  1. Open your `.pem` file in a text editor
  2. Copy the entire content including `-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----`
  3. Paste as the secret value

### 2. Docker Hub Secrets

#### `DOCKER_USERNAME`
- **Value**: Your Docker Hub username
- **Example**: `johndoe`

#### `DOCKER_PASSWORD`
- **Value**: Your Docker Hub password or access token
- **Recommendation**: Use access token instead of password
- **How to create token**: Docker Hub → Account Settings → Security → New Access Token

### 3. Application Secrets

#### `MONGODB_URI`
- **Value**: Your MongoDB connection string
- **Example**: `mongodb://admin:password@localhost:27017/notesapp?authSource=admin`

#### `JWT_SECRET`
- **Value**: A secure random string for JWT signing
- **Example**: `your-super-secret-jwt-key-256-bits-long`
- **How to generate**: 
  ```bash
  openssl rand -base64 32
  ```

#### `GOOGLE_CLIENT_ID`
- **Value**: Your Google OAuth client ID
- **How to get**: Google Cloud Console → APIs & Services → Credentials

#### `GOOGLE_CLIENT_SECRET`
- **Value**: Your Google OAuth client secret
- **How to get**: Google Cloud Console → APIs & Services → Credentials

## Setup Checklist

- [ ] EC2_HOST configured
- [ ] EC2_PRIVATE_KEY configured
- [ ] DOCKER_USERNAME configured
- [ ] DOCKER_PASSWORD configured
- [ ] MONGODB_URI configured
- [ ] JWT_SECRET configured
- [ ] GOOGLE_CLIENT_ID configured
- [ ] GOOGLE_CLIENT_SECRET configured

## Testing the Pipeline

1. **Commit and push changes**:
   ```bash
   git add .
   git commit -m "Add CI/CD pipeline"
   git push origin main
   ```

2. **Monitor the workflow**:
   - Go to GitHub → Actions tab
   - Watch the workflow execution
   - Check for any failures

3. **Verify deployment**:
   - SSH into your EC2 instance
   - Check running containers: `docker ps`
   - Test the application: `curl http://localhost:3000`

## Troubleshooting

### Common Issues

1. **SSH Connection Failed**:
   - Verify EC2_HOST is correct
   - Ensure EC2_PRIVATE_KEY includes header/footer
   - Check EC2 security groups allow SSH (port 22)

2. **Docker Login Failed**:
   - Verify DOCKER_USERNAME and DOCKER_PASSWORD
   - Use access token instead of password

3. **Application Not Starting**:
   - Check environment variables are set correctly
   - Verify MongoDB connection string
   - Check EC2 instance has enough resources

### Debug Commands

Run these on your EC2 instance:

```bash
# Check running containers
docker ps

# Check container logs
docker-compose logs

# Check disk space
df -h

# Check memory usage
free -h

# Restart services if needed
docker-compose down && docker-compose up -d
```
