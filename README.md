# TenantFlow SaaS Starter

TenantFlow is a multi-tenant SaaS starter built with Next.js, NestJS, .NET 8, PostgreSQL, and Redis. It ships with tenant onboarding, JWT authentication with refresh tokens, role-based access control, customer CRUD, dashboard metrics, and a supporting reporting service.

## Stack

- Frontend: Next.js 15 App Router + TypeScript + Tailwind CSS
- Main API: NestJS + TypeORM + PostgreSQL
- Support service: .NET 8 Web API
- Cache: Redis
- Auth: JWT access token + refresh token
- Architecture: Clean Architecture + DDD-inspired module boundaries
- Containers: Docker Compose

## Core Features

- Multi-tenant company onboarding
- Register/login flow with JWT + refresh token rotation
- Role-based access control with `admin` and `user`
- Customer CRUD scoped by tenant
- Dashboard metrics with Redis caching
- Internal reporting service consumed by NestJS

## Folder Structure

```text
apps/
  api/                NestJS main API
  reporting-service/  .NET 8 reporting service
  web/                Next.js frontend
```

## Architecture Notes

### NestJS

Each business area is split into:

- `domain`: entities and repository contracts
- `application`: use cases
- `infrastructure`: TypeORM repositories or external adapters
- `presentation`: DTOs and controllers where relevant

The main modules are:

- `auth`
- `companies`
- `users`
- `customers`
- `dashboard`
- `reporting`

### .NET Reporting Service

The reporting service follows a lightweight clean architecture split:

- `ReportingService.Domain`
- `ReportingService.Application`
- `ReportingService.Infrastructure`
- `ReportingService.Api`

It exposes `POST /api/reports/summary` and is protected with `x-internal-api-key`.

### Frontend

The frontend uses:

- App Router route groups
- Protected routes through `middleware.ts`
- HttpOnly cookies managed by Next route handlers
- Server-rendered dashboard and customer pages
- Client components for auth forms and customer mutations

## Environment Setup

1. Copy the root env example:

```bash
cp .env.example .env
```

2. Review and adjust secrets, ports, and service URLs.

Service-specific examples are available in:

- `apps/api/.env.example`
- `apps/web/.env.example`
- `apps/reporting-service/.env.example`

## Running With Docker

```bash
docker compose up --build
```

Services:

- Frontend: `http://localhost:3000`
- NestJS API: `http://localhost:4000/api`
- Reporting service: `http://localhost:5050`
- PostgreSQL: `localhost:5432`
- Redis: `localhost:6379`

After booting the stack, open `http://localhost:3000/register` and create the first tenant admin account.

## Running Locally Without Docker

### 1. Start infrastructure

Use Docker just for infrastructure if you want:

```bash
docker compose up postgres redis reporting-service
```

### 2. Run the NestJS API

```bash
cd apps/api
npm install
npm run start:dev
```

### 3. Run the Next.js frontend

```bash
cd apps/web
npm install
npm run dev
```

### 4. Run the .NET service

```bash
cd apps/reporting-service/src/ReportingService.Api
dotnet run
```

## Main API Endpoints

### Auth

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/refresh`
- `POST /api/auth/logout`
- `GET /api/auth/me`

### Customers

- `GET /api/customers`
- `GET /api/customers/:id`
- `POST /api/customers`
- `PATCH /api/customers/:id`
- `DELETE /api/customers/:id`

### Dashboard

- `GET /api/dashboard/metrics`

## Notes

- Customer and dashboard data are tenant-scoped through the authenticated user token.
- Dashboard metrics are cached in Redis for 60 seconds.
- The reporting service is optional at runtime because the NestJS gateway falls back to a local summary when it is unavailable.
- `DB_SYNCHRONIZE=true` is enabled for developer convenience. For production, replace this with migrations.

## Suggested Next Steps

- Add database migrations for the NestJS service
- Add automated tests for auth, customer CRUD, and dashboard aggregation
- Add an API gateway or BFF layer if you want centralized service orchestration
- Extend RBAC with permissions beyond `admin` and `user`
