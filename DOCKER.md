# DevVault Docker Guide

This guide details how to build, run, and manage the DevVault application using Docker.

## Prerequisites

1. **Docker Engine** & **Docker Compose** installed.
2. **Ports Available**:
   - `3000` (Frontend)
   - `5000` (Backend API)

## Quick Start

1. **Configure Environment**:
   Ensure you have a `.env` file in the root directory. You can copy the example:
   ```bash
   cp backend/.env.example .env
   ```
   *Note: Update `MONGODB_URI` and `REDIS_URL` in `.env` to point to valid instances (or local/cloud).*

   For Docker, if you run DBs locally on your host, use `host.docker.internal` instead of `localhost`.

2. **Build and Run**:
   ```bash
   docker-compose up --build
   ```
   This builds both frontend and backend images and starts the services.

3. **Access**:
   - Frontend: [http://localhost:3000](http://localhost:3000)
   - Backend: [http://localhost:5000](http://localhost:5000)

## Service Details

### Backend
- **Dockerfile**: `./backend/Dockerfile`
- **Port**: 5000
- **Env Vars**: Needs DB connections and JWT secrets.

### Frontend
- **Dockerfile**: `./frontend/Dockerfile`
- **Port**: 3000
- **Build Args**: `NEXT_PUBLIC_API_URL` is baked in at build time.
  - Defaults to `http://localhost:5000/api` in `docker-compose.yml`.
  - To change, update the `args` section in `docker-compose.yml` or pass it via CLI.

## Troubleshooting

- **Container Conflicts**: If ports 3000/5000 are in use, modify `docker-compose.yml` `ports` mapping (e.g., `"3001:3000"`).
- **Network Issues**: Ensure frontend container can reach backend. The browser (client) connects to `NEXT_PUBLIC_API_URL`.
