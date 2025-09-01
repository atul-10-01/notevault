# AWS Setup Guide: From Zero to Deployment

## Step 1: Create AWS Free Tier Account

### Why AWS Free Tier?
- **12 months free** for new accounts
- **750 hours/month** of t2.micro EC2 (enough for 24/7)
- **30 GB** of EBS storage
- **Perfect for learning** and small projects

### Account Creation Process:
1. **Go to**: https://aws.amazon.com/free/
2. **Click**: "Create a Free Account"
3. **Provide**:
   - Email address
   - Account name (e.g., "MyFirstAWS")
   - Credit card (required, but won't be charged for free tier)
   - Phone verification

### Important Notes:
- **Credit card required** even for free tier
- **Set up billing alerts** immediately
- **Free tier is generous** for learning

---

## Step 2: Launch Your First EC2 Instance

### What is EC2?
- **Elastic Compute Cloud**
- **Virtual server** in AWS cloud
- **Like your computer** but running in AWS data center
- **Pay-as-you-go** pricing (free tier covers basic usage)

### Launch Steps:

#### 1. Access EC2 Console
```
AWS Console → Services → EC2 → Launch Instance
```

#### 2. Choose Configuration
- **Name**: `highway-delite-server`
- **OS**: Ubuntu Server 22.04 LTS (Free tier eligible)
- **Instance Type**: t2.micro (Free tier eligible)
- **Key Pair**: Create new → Download `.pem` file **SAVE THIS FILE!**

#### 3. Network Settings
- **Create security group** with these rules:
  - SSH (port 22): Your IP only
  - HTTP (port 80): 0.0.0.0/0
  - HTTPS (port 443): 0.0.0.0/0
  - Custom TCP (port 3000): 0.0.0.0/0 (for our app)

#### 4. Storage
- **8 GB** (free tier limit)

#### 5. Launch
- Click "Launch Instance"
- **Save the .pem file** - you can't download it again!

---

## Step 3: Connect to Your EC2 Instance

### Get Instance Details
1. **EC2 Console** → Instances
2. **Select your instance**
3. **Copy Public IPv4 address** (e.g., 12.34.56.78)

### Connect via SSH

#### Windows (PowerShell):
```powershell
# Navigate to where you saved the .pem file
cd C:\Users\YourName\Downloads

# Set correct permissions
icacls "your-key.pem" /inheritance:r /grant:r %username%:R

# Connect
ssh -i "your-key.pem" ubuntu@YOUR-EC2-PUBLIC-IP
```

#### Example:
```powershell
ssh -i "your-key-name.pem" ubuntu@YOUR-EC2-PUBLIC-IP
```

---

## Step 4: Install Docker on EC2

Once connected to your EC2 instance, run these commands:

```bash
# Update the system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Add user to docker group
sudo usermod -aG docker ubuntu

# Install Docker Compose (Modern Plugin Method - Recommended)
sudo apt update
sudo apt install docker-compose-plugin

# Alternative: Legacy standalone method (if plugin fails)
# sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
# sudo chmod +x /usr/local/bin/docker-compose

# Logout and login again for group changes
exit
```

### Reconnect and verify:
```bash
ssh -i "your-key.pem" ubuntu@YOUR-IP
docker --version
docker compose version
```

**Note**: Modern Docker installations use `docker compose` (with space) instead of `docker-compose` (with hyphen). The plugin method is recommended as the standalone version is deprecated on many CI/CD platforms like GitHub Actions.

---

## Step 5: Configure GitHub Secrets

Now you can set up the GitHub secrets with **real values**:

### Required Secrets:
1. **EC2_HOST**: Your EC2 public IP (e.g., `12.34.56.78`)
2. **EC2_PRIVATE_KEY**: Content of your `.pem` file
3. **DOCKER_USERNAME**: Your Docker Hub username
4. **DOCKER_PASSWORD**: Your Docker Hub password/token

### How to Add Secrets:
1. **GitHub** → Your repository → Settings
2. **Secrets and variables** → Actions
3. **New repository secret**
4. **Add each secret** with exact name and value

---

## Step 6: Test the Complete Pipeline

### 1. Make a small change:
```bash
echo "Ready for AWS deployment!" >> README.md
git add .
git commit -m "Test AWS deployment pipeline"
git push origin main
```

### 2. Watch GitHub Actions:
- **GitHub** → Actions tab
- **Monitor the workflow**
- **Check each step**

### 3. Verify on EC2:
```bash
# SSH into your EC2
ssh -i "your-key.pem" ubuntu@YOUR-IP

# Check if containers are running
docker ps

# Test the application
curl http://localhost:3000
```

---

## Cost Monitoring & Safety

### Set Up Billing Alerts:
1. **AWS Console** → Billing Dashboard
2. **Billing preferences** → Enable alerts
3. **Create alarm** for $1, $5, $10

### Free Tier Monitoring:
- **AWS Console** → Billing → Free Tier
- **Track usage** monthly
- **Stay within limits**

### Auto-Stop Instance (Optional):
```bash
# Create a cron job to stop instance at night
crontab -e
# Add: 0 2 * * * sudo shutdown -h now
```

---

## What This Teaches You

### DevOps Concepts:
- **Infrastructure as Code**
- **Continuous Integration/Deployment**
- **Cloud Computing basics**
- **Container orchestration**
- **Security best practices**

### Resume Skills:
- AWS EC2 deployment
- Docker containerization
- GitHub Actions CI/CD
- Linux server administration
- Cloud cost optimization

---

## Troubleshooting Common Issues

### 1. Can't SSH to EC2:
- Check security group allows SSH from your IP
- Verify .pem file permissions
- Ensure instance is running

### 2. GitHub Actions fails:
- Check all secrets are set correctly
- Verify EC2 is running and accessible
- Check Docker is installed on EC2

### 3. High AWS costs:
- Monitor free tier usage
- Stop instance when not needed
- Use billing alerts

### 4. Application not accessible:
- Check security group allows port 3000
- Verify containers are running: `docker ps`
- Check logs: `docker compose logs`
