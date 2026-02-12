# 🛡️ DevVault – Product Requirements Document (PRD)

## Version
1.0

## Status
Planning Phase

## Product Type
Public SaaS (Single-Tenant)

## Tech Stack
MERN (MongoDB, Express, React/Next.js, Node.js)

---

# 1. 📌 Product Overview

## Product Name
**DevVault**

## Product Summary
DevVault is a publicly launched SaaS platform that enables developers and small teams to securely store, manage, and access environment variables and secrets (API keys, tokens, credentials) per project and environment.

The platform focuses on:
- Developer experience
- Clean SaaS design
- Secure AES encryption
- Role-based access control
- Docker & CI/CD compatibility

---

# 2. 🚨 Problem Statement

Developers currently:
- Store secrets in `.env` files locally
- Share API keys via insecure channels
- Accidentally commit secrets to Git repositories
- Lack secret version tracking
- Have no access logs or auditing

Existing enterprise tools are:
- Overly complex
- Expensive
- Not beginner-friendly

DevVault provides a simple, secure, indie SaaS alternative.

---

# 3. 🎯 Goals & Objectives

## Primary Goals
- Secure storage of secrets using AES encryption
- Project & environment-based organization
- Two-Factor Authentication (2FA)
- Public SaaS-ready architecture
- Docker & GitHub Actions compatibility
- Minimal and clean UI (Linear/Vercel style)

## Success Metrics
- <200ms API response time
- Zero plaintext secret storage
- 99% uptime target
- Successful Dockerized deployment
- Functional CI/CD pipeline

---

# 4. 👥 Target Users

## Primary Users
- Student developers
- Indie hackers
- Startup teams
- Freelancers

## Secondary Users
- Small development teams
- DevOps learners

---

# 5. 🧑‍💻 User Personas

### Persona 1 – Student Developer
Needs:
- Secure storage of OpenAI/Stripe keys
- Avoid GitHub leaks
- Simple UI

### Persona 2 – Startup Founder
Needs:
- Share secrets with team members
- Track secret updates
- Manage production & staging environments

---

# 6. 🧱 Core Features (MVP)

---

## 6.1 Authentication System

- Email & Password login
- JWT-based authentication
- Password hashing using bcrypt
- Email verification
- Two-Factor Authentication (TOTP)
- Rate limiting for login attempts

---

## 6.2 Project Management

Users can:
- Create projects
- Delete projects
- Invite members
- Assign roles

Structure:

User  
 └── Project  
      └── Environment (Dev / Staging / Production)  
           └── Secrets  

---

## 6.3 Environment Management

Each project can contain:
- Development
- Staging
- Production
- Custom environments

---

## 6.4 Secret Management

Each secret contains:
- Key (e.g., STRIPE_SECRET_KEY)
- Encrypted value
- Version number
- Created by
- Updated at
- Environment reference

Secrets are:
- Encrypted before storage
- Decrypted only for authorized users

---

## 6.5 Encryption Model

- AES-256 encryption
- Server-side master key stored in environment variable
- No plaintext secret storage
- Encryption happens before DB write
- Decryption only after authorization validation

---

## 6.6 Role-Based Access Control (RBAC)

Roles:
- Owner
- Admin
- Developer
- Viewer

Permissions:

| Action | Owner | Admin | Developer | Viewer |
|--------|--------|--------|------------|---------|
| Create Secret | Yes | Yes | Yes | No |
| View Secret | Yes | Yes | Yes | Limited |
| Delete Secret | Yes | Yes | No | No |
| Invite Members | Yes | Yes | No | No |

---

## 6.7 Audit Logging

Track:
- Secret creation
- Secret update
- Secret deletion
- Secret access
- Login attempts

Stored in AuditLogs collection.

---

## 6.8 API Access

Provide secure REST API:

GET /api/secrets/:project/:environment

Authentication methods:
- JWT
- API Token

Include:
- Rate limiting
- Request validation

---

## 6.9 Docker Support

- Dockerfile for backend
- Dockerfile for frontend
- docker-compose setup
- Environment variables managed securely
- Ready for VPS/cloud deployment

---

## 6.10 GitHub Actions CI/CD

Pipeline should:
- Install dependencies
- Run lint
- Run tests
- Build Docker image
- Push to registry
- Deploy automatically

---

# 7. 🎨 UI/UX Requirements

## Design Philosophy
Minimal Indie SaaS (Inspired by Linear / Vercel)

## Requirements
- Light + Dark mode toggle
- Sidebar navigation
- Clean dashboard
- Soft shadows
- Rounded corners
- Subtle animations
- Responsive design

---

# 8. 🧩 Non-Functional Requirements

## Security
- HTTPS only
- AES encryption at rest
- JWT expiration
- Rate limiting
- No secret logging
- Secure environment variables

## Performance
- <200ms API response
- Indexed MongoDB queries
- Redis caching for sessions & rate limiting

## Scalability
- Modular architecture
- Dockerized
- CI/CD ready

---

# 9. 🗄 Database Schema (High-Level)

## Users
- _id
- email
- password_hash
- two_factor_enabled
- created_at

## Projects
- _id
- name
- owner_id
- created_at

## Environments
- _id
- project_id
- name

## Secrets
- _id
- project_id
- environment_id
- key
- encrypted_value
- version
- created_by
- updated_at

## AuditLogs
- _id
- user_id
- action
- secret_id
- timestamp

## ApiTokens
- _id
- user_id
- token_hash
- created_at
- expires_at

---

# 10. 💰 SaaS Plan Structure (Simulation)

Even if free initially, architecture should support:

| Plan | Projects Limit |
|------|----------------|
| Free | 3 Projects |
| Pro | 20 Projects |
| Team | Unlimited |

---

# 11. 🚀 Development Phases

## Phase 1 (Week 1)
- Auth system
- Project creation
- Secret CRUD
- AES encryption

## Phase 2 (Week 2)
- 2FA implementation
- Audit logging
- Rate limiting
- UI refinement

## Phase 3 (Week 3)
- Dockerization
- GitHub Actions CI/CD
- Landing page
- Pricing page

## Phase 4 (Week 4)
- API tokens
- Invite members
- Dark mode polish
- Performance optimization

---

# 12. 🧠 Architecture Overview

Client (Next.js)  
        ↓  
API Server (Node + Express)  
        ↓  
MongoDB (Data Storage)  
Redis (Caching & Rate Limiting)  
Encryption Module (AES Service)

Monolithic architecture.

---

# 13. ⚠ Risks & Mitigation

| Risk | Mitigation |
|------|------------|
| Encryption misconfiguration | Unit testing encryption module |
| Token leakage | Short expiration + hashing |
| Database breach | Data encrypted at rest |
| API abuse | Rate limiting + Redis |

---

# 14. 🏁 Final Vision

DevVault aims to be:

- A clean, secure, indie SaaS secrets manager
- A strong portfolio project demonstrating SaaS thinking
- A showcase of secure backend architecture
- A production-ready Dockerized application
- CI/CD integrated
- Public launch capable

---

# End of PRD
