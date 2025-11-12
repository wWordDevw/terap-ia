# Copilot Instructions for Terap-IA

## Project Overview

**Terap-IA** is an integrated therapy clinic management system for PHP (Partial Hospitalization Program) and IOP (Intensive Outpatient Program) environments. It handles patient management, goal tracking, automatic note generation with AI, and Master Treatment Plan Reviews (MTPR).

**Tech Stack:**
- **Backend:** NestJS 11 + TypeScript + PostgreSQL + TypeORM
- **Frontend:** Next.js 15 + React 19 + TypeScript + Zustand + Radix UI + TailwindCSS
- **Deployment:** Docker Compose + Nginx (reverse proxy) + Let's Encrypt SSL
- **AI Integration:** Google Generative AI (Gemini) for patient response generation

## Architecture & Key Components

### Core Modules Structure (Backend)

The backend is organized in `src/modules/` with these critical modules:

1. **patients** - Patient management (RF-004 to RF-006)
   - Entities: `Patient`, `PatientGoal`, `PatientDiagnosis`, `GoalProgress`
   - Access control: Users can only access patients they created or are assigned to via groups
   - Key pattern: Services inject repositories and enforce role-based access

2. **goal-tracking** - Goal progress tracking and compliance reporting
   - Tracks 7 progress levels: Not Started, No Progress, Minimal, Moderate, Significant, Achieved, Regression
   - Validates coherence between progress level and percentage complete (0-100%)
   - Generates compliance reports with recommendations
   - **Integration point:** MTPR generation depends on goal compliance validation

3. **mtpr** - Master Treatment Plan Review (RF-018 to RF-027)
   - Validates: 10+ days since admission, 50%+ attendance, 4 goals configured
   - Auto-escalates progress by diagnosis
   - **Depends on goal-tracking service** for compliance validation (shows warnings if goals need attention)
   - Generates Word documents with professional formatting

4. **notes** - Daily note generation (RF-015)
   - Uses `docx` and `docx-templates` for Word document generation
   - Integrates Google Gemini for client response generation
   - Supports rotating responses to avoid repetition

5. **groups, attendance, activities** - PHP/IOP group management and tracking

### Frontend Structure

```
src/
├── app/              # Next.js App Router pages
│   └── pacientes/[id]/goals-compliance/  # Goal tracking dashboard
├── components/
│   ├── goals/        # Goal tracking UI components
│   ├── mtpr/         # MTPR generation interface
│   └── ui/           # Radix UI wrapper components
├── lib/
│   ├── services/     # API service layer (mirrors backend endpoints)
│   ├── types.ts      # Shared TypeScript types
│   └── api-client.ts # HTTP client with JWT auth
└── store/            # Zustand stores for state management
```

**Key Pattern:** Frontend services in `lib/services/` are thin wrappers around API endpoints. Each service method corresponds to a backend controller action.

## Critical Data Flows

### Goal Tracking Integration with MTPR

1. Patient creates goals during onboarding (4 per patient, required)
2. Therapists assess progress periodically using goal-tracking endpoints
3. When generating MTPR, system validates goal compliance:
   - Shows warnings if objectives lack recent evaluations
   - Displays recommendation alerts for regression/stalled progress
4. MTPR includes goal progress escalation based on compliance data

**File References:**
- Backend: `src/modules/goal-tracking/goal-tracking.service.ts` (lines 1-100)
- Backend: `src/modules/mtpr/mtpr.service.ts` (lines 30-85, validation logic)
- Frontend: `src/lib/services/goal-tracking-service.ts`

## Development Workflows

### Local Development Setup

```bash
# Backend
cd terapia-notas-backend
npm install
npm run start:dev  # Runs on port 3000

# Frontend
cd terapia-front
npm install
npm run dev  # Runs on port 5173
```

### Docker Development

```bash
# From project root
docker-compose up -d        # Start all services
docker-compose logs -f      # View logs (Ctrl+C to exit)
docker-compose down -v      # Tear down with volumes
npm run docker:reset        # Full reset (WARNING: deletes data)
```

### Database & Migrations

- TypeORM handles migrations via `AppModule` configuration (`src/config/database.config.ts`)
- Migrations run automatically on service startup
- PostgreSQL container uses health checks before dependent services start

### Testing

```bash
# Backend
npm run test              # Run Jest tests
npm run test:watch       # Watch mode
npm run test:cov         # Coverage report

# Frontend (no integrated tests currently)
npm run lint
npm run type-check
```

## Project-Specific Patterns & Conventions

### 1. **DTOs (Data Transfer Objects) Pattern**

Backend modules follow strict DTO conventions:
- Location: `src/modules/{module}/dto/`
- Example: `CreateGoalProgressDto`, `GoalComplianceReportDto`
- Used for request validation and type safety
- Includes class-validator decorators (e.g., `@IsString()`, `@IsNumber()`)

### 2. **Service Layer with Repositories**

All business logic in `*.service.ts` files:
- Constructor injects TypeORM repositories via `@InjectRepository()`
- Private methods for internal validation (e.g., `validateProgressCoherence()`)
- Public async methods for controller endpoints
- Example: `PatientsService.canAccessPatient()` implements access control

### 3. **Role-Based Access Control (RBAC)**

- User roles: `ADMIN`, `THERAPIST`, `NURSE`, `CLINIC_ADMIN`
- Access rules:
  - `ADMIN`: full access
  - `THERAPIST/NURSE`: access only to patients in their assigned groups
  - Others: access only to resources they created
- Pattern: Services check `user.role` and `createdById` fields

### 4. **Frontend Services API Layer**

- Location: `src/lib/services/` (matches backend module names)
- Pattern: `class ServiceName { async methodName() { return apiClient.post/get(...) } }`
- Authentication: JWT token sent via `Authorization: Bearer` header automatically
- Error handling: Services throw on API errors; components handle with toast notifications

### 5. **Entity Relationships**

Key relationships to understand:
- `Patient` → many `PatientGoal` (exactly 4)
- `PatientGoal` → many `GoalProgress` (history of assessments)
- `Patient` → many `Attendance` (daily tracking in groups)
- `Group` → many `GroupPatient` → `Patient` (join table for n-to-n)

### 6. **Form Handling**

Frontend uses `react-hook-form` + `zod` for validation:
- Schema defined in component or lib
- Forms use `<FormField>` wrapper from Radix UI
- Error messages display via form state

## Integration Points & External Dependencies

### Google Generative AI (Gemini)

- **Configuration:** `GOOGLE_API_KEY` in `.env`
- **Usage:** `NotesService` calls Gemini API to generate client responses
- **Pattern:** Questions sent to Gemini, responses cached to avoid duplicates
- **Location:** Backend note generation flow

### Database (PostgreSQL)

- **Connection:** Via `TypeOrmModule.forRootAsync()` in `app.module.ts`
- **Config file:** `src/config/database.config.ts`
- **Container:** Runs on internal network, not exposed externally
- **Health check:** Database must be healthy before backend starts

### Nginx Reverse Proxy

- **Configuration:** `deploy/nginx-ssl.conf`
- **Purpose:** Routes HTTP/HTTPS traffic to backend (port 3100) and frontend (port 3001)
- **SSL:** Let's Encrypt certificates via Certbot
- **Setup scripts:** `deploy/setup-server.sh`, `deploy/install-nginx-ssl.py`

## Common Tasks

### Adding a New Endpoint

1. **Backend:** Create/update DTO in `src/modules/{module}/dto/`
2. **Service:** Add method to `{module}.service.ts` (handle business logic + validation)
3. **Controller:** Add route handler in `{module}.controller.ts`
4. **Frontend:** Add method to `src/lib/services/{module}-service.ts`
5. **Component:** Use service method, handle errors with `toast()`

### Modifying Patient Data Model

1. Create new entity file in `src/modules/patients/entities/`
2. Add `@Entity()` decorator and TypeORM relations
3. Inject new repository in `PatientsService` constructor
4. Update DTOs if exposing new fields
5. Update frontend types in `src/lib/types.ts`

### Deployment to Production

- **Server:** 147.93.184.62 (Ubuntu Linux)
- **Script:** `deploy/setup-server.sh` automates full setup (Docker, Nginx, SSL, backups)
- **Manual option:** Deploy docs at `deploy/README.md`
- **Verification:** `deploy/health-check.sh` validates all services

## File Organization Reference

Critical files by concern:

| Concern | Backend | Frontend |
|---------|---------|----------|
| **API contracts** | `src/modules/*/dto/*.ts` | `src/lib/types.ts` |
| **Business logic** | `src/modules/*/**.service.ts` | `src/lib/services/` |
| **Routes/pages** | `src/modules/*/**.controller.ts` | `src/app/**/page.tsx` |
| **Data models** | `src/modules/*/entities/*.ts` | N/A (types.ts) |
| **Configuration** | `src/config/` | `next.config.js` |
| **UI components** | N/A | `src/components/` |

## Notes for AI Agents

- **Preserve access control:** Always check user permissions before returning patient data
- **Validate progress coherence:** When updating goal progress, ensure level/percentage alignment (use patterns from `GoalTrackingService`)
- **Maintain document generation quality:** Use Word templates (`docx-templates`) for professional output; avoid hardcoded formatting
- **Test with Docker:** Local dev differs from Docker—verify changes work in containerized environment
- **Follow NestJS patterns:** Dependency injection, modules, guards, pipes—don't bypass framework conventions
- **Frontend services are thin:** Keep logic in backend; services just call APIs and handle transport errors

## Useful Commands

```bash
# Logs & diagnostics
docker-compose logs -f backend    # Backend logs
docker-compose logs -f frontend   # Frontend logs
docker-compose ps                 # Service status

# Database
npm run db:create                 # Create database
npm run db:reset                  # Drop and recreate

# Frontend dev
npm run type-check               # TypeScript check
npm run lint                     # ESLint check

# Deployment validation
bash deploy/health-check.sh      # Verify production health
python deploy/check-ssl.py       # Check SSL certificate status
```
