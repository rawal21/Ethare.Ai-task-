================================================================================
                         TEAM TASK MANAGER - README
================================================================================

PROJECT OVERVIEW
================
A full-stack Team Task Manager built as a multi-user collaboration SaaS
application. Features strict Role-Based Access Control (RBAC), project-level
data isolation, and user-specific dashboards.

TECH STACK
==========

  Frontend:
    - Next.js 16 (App Router)
    - React 19
    - TypeScript
    - Redux Toolkit + RTK Query
    - Tailwind CSS 4
    - React Hook Form + Zod (validation)
    - Lucide React (icons)

  Backend:
    - Express 5
    - TypeScript
    - Mongoose 9 (MongoDB ODM)
    - Passport.js + passport-jwt (authentication)
    - Winston (logging)
    - Helmet (security headers)
    - express-rate-limit (API rate limiting)
    - express-validator (request validation)
    - bcrypt (password hashing)

  Database:
    - MongoDB Atlas (cloud-hosted)

  Deployment:
    - Vercel (frontend + backend)


PROJECT STRUCTURE
=================

  Ethare.Ai-task-/
  |
  +-- client/                     Next.js frontend
  |   +-- src/
  |       +-- app/
  |       |   +-- (auth)/         Login & Register pages
  |       |   +-- (dashboard)/    Protected pages (dashboard, projects, tasks, profile)
  |       |   +-- unauthorized/   403 error page
  |       +-- components/         UI components, forms, HOCs
  |       +-- hooks/              useAuth custom hook
  |       +-- lib/                Redux store, RTK Query API slices
  |       +-- providers/          StoreProvider, ToastProvider
  |
  +-- server/                     Express backend
  |   +-- server.ts               Entry point
  |   +-- app/
  |       +-- routes.ts           Root router
  |       +-- auth/               Authentication module
  |       +-- user/               User module
  |       +-- project/            Project module
  |       +-- task/               Task module
  |       +-- dashboard/          Dashboard module
  |       +-- common/             Middleware, helpers, services
  |
  +-- README.md
  +-- README.txt


GETTING STARTED
===============

  Prerequisites:
    - Node.js >= 18
    - npm >= 9
    - MongoDB Atlas account (or local MongoDB)

  1. Clone the repository:
     git clone https://github.com/your-username/Ethare.Ai-task-.git
     cd Ethare.Ai-task-

  2. Setup Backend:
     cd server
     npm install
     (Create .env.local file - see ENVIRONMENT VARIABLES section)
     npm run dev
     -> Server runs at http://localhost:5050

  3. Setup Frontend:
     cd client
     npm install
     npm run dev
     -> Client runs at http://localhost:3000


ENVIRONMENT VARIABLES
=====================

  Server (.env.local):

    PORT=5050
    NODE_ENV=local
    CORS_ORIGIN=http://localhost:3000
    MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<dbname>
    JWT_SECRET=your_super_secret_jwt_key_here
    ACCESS_TOKEN_EXPIRY=15m
    REFRESH_TOKEN_EXPIRY=2d


BUILD COMMANDS
==============

  Server:
    npm run dev       Start dev server with hot reload
    npm run build     Compile TypeScript to dist/ with path alias resolution
    npm start         Run compiled production build

  Client:
    npm run dev       Start Next.js dev server
    npm run build     Create production build
    npm start         Serve production build
    npm run lint      Run ESLint


API ENDPOINTS
=============

  Authentication:
    POST /api/auth/register      Register a new user
    POST /api/auth/login         Login and get tokens
    POST /api/auth/refresh       Refresh access token

  Projects:
    GET    /api/projects          List user's projects
    GET    /api/projects/:id      Get project details
    POST   /api/projects          Create project (Admin only)
    PUT    /api/projects/:id      Update project (Admin only)
    DELETE /api/projects/:id      Delete project + tasks (Admin only)
    POST   /api/projects/:id/members    Add member (Admin only)
    DELETE /api/projects/:id/members    Remove member (Admin only)

  Tasks:
    GET    /api/tasks             List tasks (filtered by role)
    POST   /api/tasks             Create task (Admin only)
    PUT    /api/tasks/:id/status  Update task status
    DELETE /api/tasks/:id         Delete task (Admin only)

  Dashboard:
    GET    /api/dashboard         Get user-specific statistics

  Users:
    GET    /api/users             List all users


USER WORKFLOW
=============

  Admin:
    1. Register with role "admin"
    2. Create projects
    3. Add members to projects
    4. Create tasks and assign to members
    5. Monitor dashboard (all managed project stats)
    6. Update any task status in managed projects

  Member:
    1. Register with role "member"
    2. View projects you are added to
    3. View dashboard (only your assigned task stats)
    4. View only tasks assigned to you
    5. Update status of your assigned tasks (TODO -> IN_PROGRESS -> DONE)


ROLE-BASED ACCESS CONTROL
==========================

  Action                          Admin    Member
  ------                          -----    ------
  Create Project                  YES      NO
  View Own Projects               YES      YES
  View Other's Projects           NO       NO
  Add/Remove Members              YES      NO
  Create Tasks                    YES      NO
  Be Assigned to Tasks            NO       YES
  Update Own Task Status          YES      YES
  Update Any Task Status          YES*     NO
  Delete Tasks                    YES      NO
  Delete Projects                 YES      NO
  View Dashboard Stats            ALL**    OWN***

  * Only in managed projects
  ** All tasks in projects admin created/manages
  *** Only tasks assigned to the member


DATA ISOLATION RULES
====================

  - Projects: Users only see projects they created or are members of
  - Tasks: Members only see tasks assigned to them
  - Dashboard: Statistics are per-user, not global
  - Direct URL: Backend returns 403 if user is unauthorized
  - Logout: All cached data is wiped to prevent leakage between accounts


VERCEL DEPLOYMENT
=================

  Frontend:
    1. Push client/ to GitHub
    2. Vercel -> New Project -> Import repo
    3. Root Directory: client
    4. Framework: Next.js
    5. Environment variable: NEXT_PUBLIC_API_URL = <backend URL>
    6. Deploy

  Backend:
    1. Push server/ to GitHub
    2. Create vercel.json in /server (see README.md for config)
    3. Vercel -> New Project -> Import repo
    4. Root Directory: server
    5. Build Command: npm run build
    6. Output Directory: dist
    7. Add environment variables (PORT, NODE_ENV, CORS_ORIGIN, etc.)
    8. Deploy

  Post-Deployment:
    - Update frontend NEXT_PUBLIC_API_URL to backend URL
    - Update backend CORS_ORIGIN to frontend URL
    - Whitelist 0.0.0.0/0 in MongoDB Atlas for Vercel access
    - Test end-to-end


DEVELOPER GUIDE
===============

  Architecture:
    - Modular structure: each feature has controller, service, routes, dto, schema
    - Service layer: business logic in *.service.ts, never in controllers
    - Middleware pipeline: jwtAuth -> requireRole -> validation -> catchError -> controller
    - RTK Query: frontend API with automatic caching and tag-based invalidation

  Adding a New Feature:
    1. Create module folder: server/app/<module>/
    2. Add schema, dto, service, controller, routes, validation files
    3. Register routes in server/app/routes.ts
    4. Create RTK Query API slice in client/src/lib/features/<module>/
    5. Build components in client/src/components/<module>/
    6. Add page in client/src/app/(dashboard)/<module>/


LICENSE
=======
ISC

================================================================================
                    Built with love for the Ethare.AI Task
================================================================================
