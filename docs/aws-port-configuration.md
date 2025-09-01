# AWS EC2 Security Group Configuration

## Required Ports for Highway Delite

### Current Configuration (Recommended)
```
Inbound Rules:
┌─────────────────┬──────────────┬─────────────────┬──────────────────┐
│ Type            │ Port Range   │ Source          │ Description      │
├─────────────────┼──────────────┼─────────────────┼──────────────────┤
│ SSH             │ 22           │ 0.0.0.0/0       │ SSH access       │
│ HTTP            │ 80           │ 0.0.0.0/0       │ Future use       │
│ HTTPS           │ 443          │ 0.0.0.0/0       │ Future SSL       │
│ Custom TCP      │ 5173         │ 0.0.0.0/0       │ React Frontend   │
│ Custom TCP      │ 5000         │ 0.0.0.0/0       │ Node.js Backend  │
└─────────────────┴──────────────┴─────────────────┴──────────────────┘
```

### Why These Ports?
- **22**: SSH for deployment and maintenance
- **80/443**: Standard web ports (for future domain setup)
- **5173**: React frontend (matches our docker-compose.yml)
- **5000**: Node.js API (matches our docker-compose.yml)

## Access After Deployment

### Your Application URLs:
```bash
# Frontend (main app)
http://YOUR-EC2-IP:5173

# Backend API (for testing)
http://YOUR-EC2-IP:5000

# API endpoints
http://YOUR-EC2-IP:5000/api/auth/login
http://YOUR-EC2-IP:5000/api/notes
```

### Example with Real IP:
```bash
# If your EC2 IP is 12.34.56.78
Frontend: http://12.34.56.78:5173
Backend:  http://12.34.56.78:5000
```

## Optional: Change to Standard Ports

If you want "cleaner" URLs without port numbers:

### 1. Modify docker-compose.yml:
```yaml
frontend:
  ports:
    - "80:80"     # Standard HTTP port
backend:
  ports:
    - "3000:5000" # Alternative backend port
```

### 2. Update nginx.conf:
```nginx
server {
    listen 80;  # Already correct!
    # ... rest of config
}
```

### 3. Update CI/CD environment:
```yaml
CLIENT_URL=http://${{ secrets.EC2_HOST }}  # No port needed
```

### 4. Security group stays the same:
```
Port 80:   0.0.0.0/0  (for frontend)
Port 3000: 0.0.0.0/0  (for backend)
```

## Recommendation

**Keep current configuration (5173:80)**:
- **No changes needed**
- **Already configured in CI/CD**
- **Non-conflicting ports**
- **Clear separation**

**Why?**
- Less chance of conflicts with system services
- Clear development vs production distinction
- Already tested and working
- Easy to remember: 5173 = Vite default, 5000 = Express default

## Final URLs After AWS Deployment:
```
Frontend: http://YOUR-EC2-IP:5173
Backend:  http://YOUR-EC2-IP:5000
Health:   http://YOUR-EC2-IP:5000/health (if available)
```
