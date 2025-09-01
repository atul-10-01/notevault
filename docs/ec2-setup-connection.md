# EC2 Instance Setup and Connection Guide

## Instance Information
- **Instance ID**: YOUR-INSTANCE-ID
- **Status**: Successfully launched
- **Instance Type**: t3.micro
- **Operating System**: Ubuntu Server 24.04 LTS
- **Key Pair**: your-key-name.pem
- **Public IP**: YOUR-EC2-PUBLIC-IP

## Step 1: Get Your Instance Details

**Find Your EC2 Public IP**: 
1. AWS Console → EC2 → Instances
2. Click your instance
3. Copy "Public IPv4 address" from details panel

## Step 2: Connect via SSH

### From Command Prompt (Windows):
```cmd
# Navigate to your SSH key directory
cd C:\Users\YOUR-USERNAME\.ssh

# Connect to your instance (replace with YOUR actual IP)
ssh -i your-key-name.pem ubuntu@YOUR-EC2-PUBLIC-IP
```

### Connection Status
- **Your IP**: Get from AWS Console
- **SSH Key**: your-key-name.pem
- **User**: ubuntu
- **Status**: Test connection first

### First Connection:
- You'll see a warning about host authenticity
- Type `yes` and press Enter
- You should see Ubuntu welcome message

## Step 3: Install Docker on EC2

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
# sudo ln -s /usr/local/bin/docker-compose /usr/bin/docker-compose

# Exit and reconnect for group changes
exit
```

### Reconnect and verify:
```bash
# SSH back in (replace with your actual IP)
ssh -i your-key-name.pem ubuntu@YOUR-EC2-PUBLIC-IP

# Verify Docker installation
docker --version
docker compose version

# Test Docker
docker run hello-world
```

**Note**: Modern Docker installations use `docker compose` (with space) instead of `docker-compose` (with hyphen). The plugin method is recommended as the standalone version is deprecated on many CI/CD platforms like GitHub Actions.

## Step 4: Prepare for Deployment

### Create project directory:
```bash
# Create directory for your application
mkdir highway-delite
cd highway-delite

# Your app will be deployed here via GitHub Actions
```

## Troubleshooting

### SSH Connection Issues:
1. **Check security group** has SSH (port 22) open to 0.0.0.0/0
2. **Verify key file path** is correct
3. **Ensure instance is running** (not stopped)
4. **Check your internet connection**

### Permission Denied:
```bash
# If you get permission denied, check key permissions
icacls your-key-name.pem
```

### Can't Connect:
1. **Instance might still be initializing** - wait 2-3 minutes
2. **Check instance status** in AWS Console (should be "running")
3. **Try different terminal** (Command Prompt vs PowerShell vs Git Bash)

## Next Steps After Docker Installation

1. **Configure GitHub Secrets** with your EC2 IP
2. **Set up environment variables**
3. **Deploy via GitHub Actions CI/CD**
4. **Access your application**:
   - Frontend: `http://YOUR-EC2-IP:5173`
   - Backend: `http://YOUR-EC2-IP:5000`

## Security Notes

- **SSH is open to 0.0.0.0/0** - acceptable for learning/development
- **Key-based authentication** provides good security
- **Monitor AWS billing** to stay within free tier
- **Terminate instance** when done learning to avoid charges
