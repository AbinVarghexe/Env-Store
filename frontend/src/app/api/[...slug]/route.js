import { connectDB } from "@/lib/api/db";
import { authenticate } from "@/lib/middleware/auth";
import { checkProjectAccess } from "@/lib/middleware/rbac";
import { validateBody, schemas } from "@/lib/middleware/validate";

import * as authController from "@/lib/api/controllers/auth";
import * as projectController from "@/lib/api/controllers/project";
import * as environmentController from "@/lib/api/controllers/environment";
import * as secretController from "@/lib/api/controllers/secret";
import * as auditController from "@/lib/api/controllers/audit";
import * as tokenController from "@/lib/api/controllers/token";
import * as statsController from "@/lib/api/controllers/stats";
import * as globalSecretController from "@/lib/api/controllers/globalSecret";

function json(data, status = 200) {
  return Response.json(data, { status });
}

function error(message, status = 500) {
  return Response.json({ error: message }, { status });
}

async function withDB(handler) {
  try {
    await connectDB();
    return await handler();
  } catch (err) {
    if (err.name === "ValidationError") {
      const details = Object.values(err.errors).map((e) => e.message);
      return Response.json({ error: "Validation Error", details }, { status: 400 });
    }
    if (err.name === "CastError") return error("Invalid ID format", 400);
    if (err.code === 11000) return error(`Duplicate value for: ${Object.keys(err.keyValue)[0]}`, 409);
    console.error("API Error:", err);
    return error("Internal server error");
  }
}

async function handler(request, { params }) {
  const { slug = [] } = await params;
  const method = request.method;
  const url = new URL(request.url);
  const query = Object.fromEntries(url.searchParams);
  const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown";

  return withDB(async () => {
    // GET /api/health
    if (slug.length === 1 && slug[0] === "health" && method === "GET") {
      return json({ status: "ok", service: "DevVault API", timestamp: new Date().toISOString() });
    }

    // ---- AUTH ROUTES ----
    if (slug[0] === "auth") {
      if (slug.length === 2 && slug[1] === "register" && method === "POST") {
        const body = await request.json();
        const v = validateBody(schemas.register, body);
        if (v.error) return error(v.error, 400);
        return authController.register(v.value, ip);
      }

      if (slug.length === 2 && slug[1] === "login" && method === "POST") {
        const body = await request.json();
        const v = validateBody(schemas.login, body);
        if (v.error) return error(v.error, 400);
        return authController.login(v.value, ip);
      }

      if (slug.length === 3 && slug[1] === "login" && slug[2] === "2fa" && method === "POST") {
        const auth = await authenticate(request);
        if (auth.error) return error(auth.error, auth.status);
        const body = await request.json();
        const v = validateBody(schemas.twoFactorVerify, body);
        if (v.error) return error(v.error, 400);
        return authController.loginTwoFactor(auth.user._id, v.value, ip);
      }

      if (slug.length === 2 && slug[1] === "refresh" && method === "POST") {
        const body = await request.json();
        return authController.refreshAccessToken(body);
      }

      if (slug.length === 2 && slug[1] === "me" && method === "GET") {
        const auth = await authenticate(request);
        if (auth.error) return error(auth.error, auth.status);
        return authController.getMe(auth.user._id);
      }

      if (slug.length === 3 && slug[1] === "2fa" && slug[2] === "setup" && method === "POST") {
        const auth = await authenticate(request);
        if (auth.error) return error(auth.error, auth.status);
        return authController.setupTwoFactor(auth.user._id);
      }

      if (slug.length === 3 && slug[1] === "2fa" && slug[2] === "verify" && method === "POST") {
        const auth = await authenticate(request);
        if (auth.error) return error(auth.error, auth.status);
        const body = await request.json();
        const v = validateBody(schemas.twoFactorVerify, body);
        if (v.error) return error(v.error, 400);
        return authController.verifyAndEnableTwoFactor(auth.user._id, v.value, ip);
      }

      if (slug.length === 3 && slug[1] === "2fa" && slug[2] === "disable" && method === "POST") {
        const auth = await authenticate(request);
        if (auth.error) return error(auth.error, auth.status);
        const body = await request.json();
        const v = validateBody(schemas.twoFactorVerify, body);
        if (v.error) return error(v.error, 400);
        return authController.disableTwoFactor(auth.user._id, v.value, ip);
      }
    }

    // ---- PROJECT ROUTES ----
    if (slug[0] === "projects") {
      // GET /api/projects
      if (slug.length === 1 && method === "GET") {
        const auth = await authenticate(request);
        if (auth.error) return error(auth.error, auth.status);
        return projectController.listProjects(auth.user._id);
      }

      // POST /api/projects
      if (slug.length === 1 && method === "POST") {
        const auth = await authenticate(request);
        if (auth.error) return error(auth.error, auth.status);
        const body = await request.json();
        const v = validateBody(schemas.createProject, body);
        if (v.error) return error(v.error, 400);
        return projectController.createProject(auth.user._id, auth.user.plan, v.value, ip);
      }

      const projectId = slug[1];

      // GET /api/projects/:id
      if (slug.length === 2 && method === "GET") {
        const auth = await authenticate(request);
        if (auth.error) return error(auth.error, auth.status);
        return projectController.getProject(projectId, auth.user._id);
      }

      // DELETE /api/projects/:id
      if (slug.length === 2 && method === "DELETE") {
        const auth = await authenticate(request);
        if (auth.error) return error(auth.error, auth.status);
        const access = await checkProjectAccess(auth.user, projectId, ["owner"]);
        if (access.error) return error(access.error, access.status);
        return projectController.deleteProject(projectId, auth.user._id, ip);
      }

      // POST /api/projects/:id/members
      if (slug.length === 3 && slug[2] === "members" && method === "POST") {
        const auth = await authenticate(request);
        if (auth.error) return error(auth.error, auth.status);
        const access = await checkProjectAccess(auth.user, projectId, ["owner", "admin"]);
        if (access.error) return error(access.error, access.status);
        const body = await request.json();
        const v = validateBody(schemas.inviteMember, body);
        if (v.error) return error(v.error, 400);
        return projectController.inviteMember(projectId, auth.user._id, v.value, ip);
      }

      // DELETE /api/projects/:id/members/:userId
      if (slug.length === 4 && slug[2] === "members" && method === "DELETE") {
        const auth = await authenticate(request);
        if (auth.error) return error(auth.error, auth.status);
        const access = await checkProjectAccess(auth.user, projectId, ["owner", "admin"]);
        if (access.error) return error(access.error, access.status);
        return projectController.removeMember(projectId, slug[3], auth.user._id, ip);
      }

      // ---- ENVIRONMENT ROUTES (nested under projects) ----
      if (slug.length >= 3 && slug[2] === "environments") {
        const auth = await authenticate(request);
        if (auth.error) return error(auth.error, auth.status);
        const envId = slug[3];

        // GET /api/projects/:id/environments
        if (slug.length === 3 && method === "GET") {
          const access = await checkProjectAccess(auth.user, projectId, ["owner", "admin", "developer", "viewer"]);
          if (access.error) return error(access.error, access.status);
          return environmentController.listEnvironments(projectId);
        }

        // POST /api/projects/:id/environments
        if (slug.length === 3 && method === "POST") {
          const access = await checkProjectAccess(auth.user, projectId, ["owner", "admin"]);
          if (access.error) return error(access.error, access.status);
          const body = await request.json();
          const v = validateBody(schemas.createEnvironment, body);
          if (v.error) return error(v.error, 400);
          return environmentController.createEnvironment(projectId, auth.user._id, v.value, ip);
        }

        // DELETE /api/projects/:id/environments/:envId
        if (slug.length === 4 && method === "DELETE") {
          const access = await checkProjectAccess(auth.user, projectId, ["owner", "admin"]);
          if (access.error) return error(access.error, access.status);
          return environmentController.deleteEnvironment(projectId, envId, auth.user._id, ip);
        }

        // ---- SECRET ROUTES (nested under environments) ----
        if (slug.length >= 4 && slug[3] && slug[4] === "secrets") {
          const secretId = slug[5];

          // GET /api/projects/:id/environments/:envId/secrets
          if (slug.length === 5 && method === "GET") {
            const access = await checkProjectAccess(auth.user, projectId, ["owner", "admin", "developer", "viewer"]);
            if (access.error) return error(access.error, access.status);
            return secretController.listSecrets(projectId, envId);
          }

          // GET /api/projects/:id/environments/:envId/secrets/download
          if (slug.length === 6 && slug[5] === "download" && method === "GET") {
            const access = await checkProjectAccess(auth.user, projectId, ["owner", "admin", "developer"]);
            if (access.error) return error(access.error, access.status);
            return secretController.downloadSecrets(projectId, envId, auth.user._id, ip);
          }

          // POST /api/projects/:id/environments/:envId/secrets
          if (slug.length === 5 && method === "POST") {
            const access = await checkProjectAccess(auth.user, projectId, ["owner", "admin", "developer"]);
            if (access.error) return error(access.error, access.status);
            const body = await request.json();
            const v = validateBody(schemas.createSecret, body);
            if (v.error) return error(v.error, 400);
            return secretController.createSecret(projectId, envId, auth.user._id, v.value, ip);
          }

          // PUT /api/projects/:id/environments/:envId/secrets/:secretId
          if (slug.length === 6 && method === "PUT") {
            const access = await checkProjectAccess(auth.user, projectId, ["owner", "admin", "developer"]);
            if (access.error) return error(access.error, access.status);
            const body = await request.json();
            const v = validateBody(schemas.updateSecret, body);
            if (v.error) return error(v.error, 400);
            return secretController.updateSecret(projectId, envId, secretId, auth.user._id, v.value, ip);
          }

          // DELETE /api/projects/:id/environments/:envId/secrets/:secretId
          if (slug.length === 6 && method === "DELETE") {
            const access = await checkProjectAccess(auth.user, projectId, ["owner", "admin"]);
            if (access.error) return error(access.error, access.status);
            return secretController.deleteSecret(projectId, envId, secretId, auth.user._id, ip);
          }

          // GET /api/projects/:id/environments/:envId/secrets/:secretId/reveal
          if (slug.length === 7 && slug[6] === "reveal" && method === "GET") {
            const access = await checkProjectAccess(auth.user, projectId, ["owner", "admin", "developer"]);
            if (access.error) return error(access.error, access.status);
            return secretController.revealSecret(projectId, envId, secretId, auth.user._id, ip);
          }
        }
      }
    }

    // ---- AUDIT ROUTES ----
    if (slug[0] === "audit" && slug.length === 1 && method === "GET") {
      const auth = await authenticate(request);
      if (auth.error) return error(auth.error, auth.status);
      return auditController.listAuditLogs(auth.user._id, query);
    }

    // ---- TOKEN ROUTES ----
    if (slug[0] === "tokens") {
      const auth = await authenticate(request);
      if (auth.error) return error(auth.error, auth.status);
      const body = method === "POST" || method === "PUT" ? await request.json().catch(() => ({})) : {};

      // GET /api/tokens
      if (slug.length === 1 && method === "GET") {
        return tokenController.listTokens(auth.user._id);
      }

      // POST /api/tokens
      if (slug.length === 1 && method === "POST") {
        const v = validateBody(schemas.createApiToken, body);
        if (v.error) return error(v.error, 400);
        return tokenController.createToken(auth.user._id, v.value, ip);
      }

      // DELETE /api/tokens/:id
      if (slug.length === 2 && method === "DELETE") {
        return tokenController.revokeToken(auth.user._id, slug[1], ip);
      }
    }

    // ---- STATS ROUTES ----
    if (slug[0] === "stats" && slug.length === 1 && method === "GET") {
      const auth = await authenticate(request);
      if (auth.error) return error(auth.error, auth.status);
      return statsController.getDashboardStats(auth.user._id);
    }

    // ---- GLOBAL SECRET ROUTES ----
    if (slug[0] === "global-secrets") {
      const auth = await authenticate(request);
      if (auth.error) return error(auth.error, auth.status);

      // GET /api/global-secrets
      if (slug.length === 1 && method === "GET") {
        return globalSecretController.listGlobalSecrets(auth.user._id);
      }

      // POST /api/global-secrets
      if (slug.length === 1 && method === "POST") {
        const body = await request.json();
        const v = validateBody(schemas.createSecret, body);
        if (v.error) return error(v.error, 400);
        return globalSecretController.createGlobalSecret(auth.user._id, v.value, ip);
      }

      // DELETE /api/global-secrets/:id
      if (slug.length === 2 && method === "DELETE") {
        return globalSecretController.deleteGlobalSecret(auth.user._id, slug[1], ip);
      }

      // GET /api/global-secrets/:id/reveal
      if (slug.length === 3 && slug[2] === "reveal" && method === "GET") {
        return globalSecretController.revealGlobalSecret(auth.user._id, slug[1], ip);
      }
    }

    return error("Not found", 404);
  });
}

export { handler as GET, handler as POST, handler as PUT, handler as DELETE };
