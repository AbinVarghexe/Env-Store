# DevVault AWS EC2 Deployment Checklist

## ✅ Completed Steps
- [x] Docker Compose configured to use Docker Hub images
- [x] CI/CD pipeline created (`.github/workflows/deploy.yml`)
- [x] AWS MCP server integrated into docker-compose
- [x] Nginx configuration reviewed
- [x] Private keys added to .gitignore
- [x] Changes committed to local repository

## 🔐 Required GitHub Secrets

Before pushing, you **MUST** configure these secrets in your GitHub repository:

**Settings → Secrets and variables → Actions → New repository secret**

### Server Access
- `HOST` - Public IP address of your EC2 instance
- `USERNAME` - SSH username (typically `ubuntu` for Ubuntu EC2 instances)
- `SSH_KEY` - Complete contents of `DevVault1.pem` file (including BEGIN/END lines)

### Docker Hub
- `DOCKER_USERNAME` - Your Docker Hub username
- `DOCKER_PASSWORD` - Docker Hub Personal Access Token (not your password)
  - Create at: https://hub.docker.com/settings/security

### Application Environment Variables
- `MONGODB_URI` - MongoDB connection string
- `JWT_ACCESS_SECRET` - Secret for JWT access tokens
- `JWT_REFRESH_SECRET` - Secret for JWT refresh tokens
- `ENCRYPTION_MASTER_KEY` - Master key for secret encryption
- `REDIS_URL` - Redis connection string (if using)
- `AWS_REGION` - AWS region for MCP server (e.g., `us-east-1`)
- `AWS_ACCESS_KEY_ID` - AWS access key for MCP server
- `AWS_SECRET_ACCESS_KEY` - AWS secret key for MCP server

## 🔒 AWS Security Group Requirements

Ensure your EC2 Security Group allows:
- **Port 22 (SSH)** - Source: GitHub Actions IP ranges or 0.0.0.0/0 (less secure)
- **Port 80 (HTTP)** - Source: 0.0.0.0/0 (for public web access)
- **Port 443 (HTTPS)** - Source: 0.0.0.0/0 (if using SSL in future)

## 🚀 Deployment Instructions

### Option 1: Push Automatically (Triggers CI/CD)
```bash
git push origin master
```

The GitHub Actions workflow will automatically:
1. Build Docker images for frontend and backend
2. Push images to Docker Hub
3. SSH into your EC2 instance
4. Install Docker if not present
5. Copy configuration files
6. Pull and start all services

### Option 2: Manual Deployment (One-time)
If you prefer to deploy manually first:

```bash
# SSH into your EC2 instance
ssh -i DevVault1.pem ubuntu@<YOUR_EC2_IP>

# Install Docker (if not already installed)
sudo apt-get update
sudo apt-get install -y docker.io docker-compose-plugin
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -aG docker ubuntu

# Create deployment directory
mkdir -p ~/devvault
cd ~/devvault

# Copy files (from local machine)
scp -i DevVault1.pem docker-compose.yml ubuntu@<YOUR_EC2_IP>:~/devvault/
scp -i DevVault1.pem nginx.conf ubuntu@<YOUR_EC2_IP>:~/devvault/

# Set environment variables
export DOCKER_USERNAME=<your_docker_username>
# ... set other required env vars

# Start services
docker compose up -d
```

## 📊 Monitoring Deployment

After pushing:
1. Go to **GitHub → Actions** tab
2. Watch the "CI/CD - Build & Deploy DevVault to AWS EC2" workflow
3. Check each step for errors

Common failure points:
- ❌ **SSH Connection Failed** → Check Security Group Port 22 rules
- ❌ **Docker Build Failed** → Check Dockerfile syntax
- ❌ **Push Failed** → Verify Docker Hub credentials
- ❌ **Service Start Failed** → Check environment variables

## 🧪 Verification Steps

Once deployed, verify:
```bash
# Check if services are running
ssh -i DevVault1.pem ubuntu@<YOUR_EC2_IP>
cd ~/devvault
sudo docker compose ps

# Check logs if something is wrong
sudo docker compose logs backend
sudo docker compose logs frontend
sudo docker compose logs mcp-server

# Test the deployment
curl http://<YOUR_EC2_IP>
curl http://<YOUR_EC2_IP>/api/health
```

## 🔧 Troubleshooting

### Can't SSH into EC2
- Verify Security Group allows Port 22
- Check if EC2 instance is running
- Verify SSH key permissions: `chmod 400 DevVault1.pem`

### Docker Images Not Pulling
- Verify Docker Hub credentials are correct
- Check if images exist in your Docker Hub repository
- Verify `DOCKER_USERNAME` matches your actual username

### Services Not Starting
- Check environment variables are set correctly
- Review container logs with `docker compose logs <service>`
- Ensure MongoDB and Redis are accessible from EC2

### MCP Server Issues
- Verify AWS credentials in secrets
- Check AWS region is correct
- Review MCP server logs: `sudo docker compose logs mcp-server`

## 📝 Next Steps After Successful Deployment

1. **Set up HTTPS** - Install Let's Encrypt SSL certificate
2. **Configure monitoring** - Set up logging and alerting
3. **Database backups** - Implement MongoDB backup strategy
4. **Custom domain** - Point your domain to EC2 IP
5. **Scaling** - Consider load balancers when traffic grows

## 🆘 Need Help?

- Check GitHub Actions logs for detailed error messages
- Review EC2 instance system logs
- Verify all required ports are open in Security Groups
- Ensure all GitHub Secrets are correctly configured
