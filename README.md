# 🚀 Team Task Manager

A full-stack, production-ready **Team Task Manager** built as a multi-user collaboration SaaS application. It features strict Role-Based Access Control (RBAC), project-level data isolation, and user-specific dashboards.

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Local Development](#local-development)
- [Environment Variables](#-environment-variables)
- [API Reference](#-api-reference)
- [User Workflow](#-user-workflow)
- [Role-Based Access Control (RBAC)](#-role-based-access-control-rbac)
- [Deployment (Vercel)](#-deployment-vercel)
- [Developer Guide](#-developer-guide)

---

## ✨ Features

| Feature | Description |
|---|---|
| **Authentication** | JWT-based login/register with access & refresh tokens |
| **Role-Based Access** | Admin and Member roles with strict permission enforcement |
| **Project Management** | Create, update, delete projects with member management |
| **Task Management** | Create tasks, assign to members, track status (TODO → IN_PROGRESS → DONE) |
| **Dashboard** | Real-time, user-specific statistics (total, completed, pending, overdue tasks) |
| **Data Isolation** | Members only see their own assigned tasks; Admins see all tasks in managed projects |
| **Secure API** | Backend-enforced authorization — frontend button hiding is not the only guard |
| **State Management** | Redux Toolkit + RTK Query with cache reset on logout to prevent data leakage |

---

## 🛠 Tech Stack

### Frontend (Client)
| Technology | Purpose |
|---|---|
| **Next.js 16** | React framework with App Router |
| **React 19** | UI library |
| **TypeScript** | Type safety |
| **Redux Toolkit + RTK Query** | State management & API caching |
| **Tailwind CSS 4** | Utility-first styling |
| **React Hook Form + Zod** | Form handling & validation |
| **Lucide React** | Icon library |

### Backend (Server)
| Technology | Purpose |
|---|---|
| **Express 5** | HTTP server framework |
| **TypeScript** | Type safety |
| **Mongoose 9** | MongoDB ODM |
| **Passport.js + passport-jwt** | JWT authentication strategy |
| **Winston** | Structured logging |
| **Helmet** | Security headers |
| **express-rate-limit** | API rate limiting |
| **express-validator** | Request validation |
| **bcrypt** | Password hashing |

### Database & Infrastructure
| Technology | Purpose |
|---|---|
| **MongoDB Atlas** | Cloud-hosted NoSQL database |
| **Vercel** | Deployment platform (frontend + backend) |

---

## 📁 Project Structure

```
Ethare.Ai-task-/
├── client/                     # Next.js frontend
│   └── src/
│       ├── app/
│       │   ├── (auth)/         # Login & Register pages
│       │   ├── (dashboard)/    # Protected pages
│       │   │   ├── dashboard/  # User-specific dashboard
│       │   │   ├── projects/   # Project list & detail pages
│       │   │   ├── tasks/      # Global task list
│       │   │   └── profile/    # User profile
│       │   └── unauthorized/   # 403 error page
│       ├── components/
│       │   ├── common/         # UI, Modal, etc.
│       │   ├── forms/          # CreateTaskForm, ManageMembersForm
│       │   ├── hoc/            # withRole HOC
│       │   └── tasks/          # TaskCard component
│       ├── hooks/              # useAuth custom hook
│       ├── lib/
│       │   ├── features/       # RTK Query API slices
│       │   │   ├── auth/       # authApi + authSlice
│       │   │   ├── dashboard/  # dashboardApi
│       │   │   ├── projects/   # projectApi
│       │   │   └── tasks/      # taskApi
│       │   ├── api.ts          # Base RTK Query config
│       │   └── store.ts        # Redux store
│       └── providers/          # StoreProvider, ToastProvider
│
├── server/                     # Express backend
│   ├── server.ts               # Entry point
│   └── app/
│       ├── routes.ts           # Root router
│       ├── auth/               # Auth module (controller, service, routes, validation, dto)
│       ├── user/               # User module
│       ├── project/            # Project module
│       ├── task/               # Task module
│       ├── dashboard/          # Dashboard module
│       └── common/
│           ├── helper/         # logger, config, response helpers
│           ├── middleware/      # JWT auth, role auth, error handler, rate limiter
│           └── service/        # passport-jwt, database services
│
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** >= 18
- **npm** >= 9
- **MongoDB Atlas** account (or local MongoDB)

### Local Development

**1. Clone the repository**
```bash
git clone https://github.com/your-username/Ethare.Ai-task-.git
cd Ethare.Ai-task-
```

**2. Setup the Backend**
```bash
cd server
npm install
```

Create a `.env.local` file in `/server`:
```env
PORT=5050
NODE_ENV=local
CORS_ORIGIN=http://localhost:3000
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<dbname>
JWT_SECRET=your_super_secret_jwt_key_here
ACCESS_TOKEN_EXPIRY=15m
REFRESH_TOKEN_EXPIRY=2d
```

Start the dev server:
```bash
npm run dev
```
Server runs at `http://localhost:5050`

**3. Setup the Frontend**
```bash
cd client
npm install
npm run dev
```
Client runs at `http://localhost:3000`

---

## 🔐 Environment Variables

### Server (`/server/.env.local`)

| Variable | Description | Example |
|---|---|---|
| `PORT` | Server port | `5050` |
| `NODE_ENV` | Environment mode | `local` / `production` |
| `CORS_ORIGIN` | Allowed frontend origin | `http://localhost:3000` |
| `MONGODB_URI` | MongoDB connection string | `mongodb+srv://...` |
| `JWT_SECRET` | Secret key for JWT signing | `your_secret_key` |
| `ACCESS_TOKEN_EXPIRY` | Access token lifetime | `15m` |
| `REFRESH_TOKEN_EXPIRY` | Refresh token lifetime | `2d` |

### Client
The client reads the API base URL from the RTK Query configuration in `src/lib/api.ts`. Update the `baseUrl` for production deployment.

---

## 📡 API Reference

### Authentication
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/api/auth/register` | Register a new user | No |
| POST | `/api/auth/login` | Login and get tokens | No |
| POST | `/api/auth/refresh` | Refresh access token | Yes |

### Projects
| Method | Endpoint | Description | Auth | Role |
|---|---|---|---|---|
| GET | `/api/projects` | List user's projects | Yes | All |
| GET | `/api/projects/:id` | Get project details | Yes | All (member/creator only) |
| POST | `/api/projects` | Create a new project | Yes | Admin |
| PUT | `/api/projects/:id` | Update a project | Yes | Admin |
| DELETE | `/api/projects/:id` | Delete project + tasks | Yes | Admin |
| POST | `/api/projects/:id/members` | Add a member | Yes | Admin |
| DELETE | `/api/projects/:id/members` | Remove a member | Yes | Admin |

### Tasks
| Method | Endpoint | Description | Auth | Role |
|---|---|---|---|---|
| GET | `/api/tasks` | List tasks (filtered) | Yes | All |
| POST | `/api/tasks` | Create a task | Yes | Admin |
| PUT | `/api/tasks/:id/status` | Update task status | Yes | All (own tasks) |
| DELETE | `/api/tasks/:id` | Delete a task | Yes | Admin |

### Dashboard
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/api/dashboard` | Get user-specific stats | Yes |

### Users
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/api/users` | List all users | Yes |

---

## 👤 User Workflow

### Admin Workflow
1. **Register** with role `admin`
2. **Create a Project** with title and description
3. **Add Members** to the project from registered users
4. **Create Tasks** and assign them to project members
5. **Monitor Dashboard** — see all task statistics for managed projects
6. **Update Task Status** — can update any task in managed projects

### Member Workflow
1. **Register** with role `member`
2. **View Projects** — only projects where you are added as a member
3. **View Dashboard** — see statistics only for tasks assigned to you
4. **View Tasks** — only tasks assigned to you
5. **Update Task Status** — can only update your own assigned tasks (TODO → IN_PROGRESS → DONE)

### Account Switching
- On **logout**, all cached data (projects, tasks, dashboard) is completely wiped
- On **login**, fresh data is fetched from the backend for the authenticated user
- No data leakage between user sessions

---

## 🔒 Role-Based Access Control (RBAC)

| Action | Admin | Member |
|---|---|---|
| Create Project | ✅ | ❌ |
| View Own Projects | ✅ | ✅ |
| View Other's Projects | ❌ | ❌ |
| Add/Remove Members | ✅ | ❌ |
| Create Tasks | ✅ | ❌ |
| Be Assigned to Tasks | ❌ | ✅ |
| Update Own Task Status | ✅ | ✅ |
| Update Any Task Status | ✅ (managed projects) | ❌ |
| Delete Tasks | ✅ | ❌ |
| Delete Projects | ✅ | ❌ |
| View Dashboard Stats | ✅ (all managed tasks) | ✅ (own tasks only) |

### Data Isolation Rules
- **Projects**: Users only see projects they created or are members of
- **Tasks**: Members only see tasks assigned to them; Admins see all tasks in their projects
- **Dashboard**: Statistics are calculated per-user, not globally
- **Direct URL Access**: Backend returns 403 if user is unauthorized, even with a valid project/task ID

---

## ☁️ Deployment (Vercel)

### Frontend Deployment

1. Push your `client/` folder to a GitHub repository
2. Go to [vercel.com](https://vercel.com) → **New Project**
3. Import your repository
4. Set the **Root Directory** to `client`
5. Framework Preset: **Next.js**
6. Add environment variable:
   - `NEXT_PUBLIC_API_URL` = your backend Vercel URL (e.g., `https://your-backend.vercel.app`)
7. Deploy

### Backend Deployment

1. Push your `server/` folder to a GitHub repository
2. Create a `vercel.json` in `/server`:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "dist/server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "dist/server.js"
    }
  ]
}
```

3. Go to Vercel → **New Project** → Import repository
4. Set the **Root Directory** to `server`
5. Set **Build Command** to `npm run build`
6. Set **Output Directory** to `dist`
7. Add environment variables:
   - `PORT` = `5050`
   - `NODE_ENV` = `production`
   - `CORS_ORIGIN` = your frontend Vercel URL
   - `MONGODB_URI` = your MongoDB Atlas connection string
   - `JWT_SECRET` = your production secret key
   - `ACCESS_TOKEN_EXPIRY` = `15m`
   - `REFRESH_TOKEN_EXPIRY` = `2d`
8. Deploy

### Post-Deployment Checklist
- [ ] Update frontend `NEXT_PUBLIC_API_URL` to point to backend URL
- [ ] Update backend `CORS_ORIGIN` to point to frontend URL
- [ ] Verify MongoDB Atlas IP whitelist includes `0.0.0.0/0` (for Vercel)
- [ ] Test login, project creation, task assignment end-to-end

---

## 🧑‍💻 Developer Guide

### Scripts

#### Server
| Command | Description |
|---|---|
| `npm run dev` | Start dev server with hot reload (ts-node-dev) |
| `npm run build` | Compile TypeScript to `dist/` with path alias resolution |
| `npm start` | Run compiled production build from `dist/server.js` |

#### Client
| Command | Description |
|---|---|
| `npm run dev` | Start Next.js dev server |
| `npm run build` | Create production build |
| `npm start` | Serve production build |
| `npm run lint` | Run ESLint |

### Architecture Patterns

- **Modular Structure**: Each feature (auth, user, project, task, dashboard) has its own `controller`, `service`, `routes`, `dto`, `schema`, and `validation` files
- **Service Layer**: Business logic lives in `*.service.ts`, never in controllers
- **DTO Pattern**: Data Transfer Objects define request/response shapes
- **Middleware Pipeline**: `jwtAuth` → `requireRole` → `validation` → `catchError` → `controller`
- **RTK Query**: Frontend API calls are defined as RTK Query endpoints with automatic caching and cache invalidation via tags

### Adding a New Feature

1. Create a new module folder under `server/app/<module>/`
2. Add `schema.ts`, `dto.ts`, `service.ts`, `controller.ts`, `routes.ts`, `validation.ts`
3. Register routes in `server/app/routes.ts`
4. Create RTK Query API slice in `client/src/lib/features/<module>/`
5. Build UI components in `client/src/components/<module>/`
6. Add page in `client/src/app/(dashboard)/<module>/`

---

## 📄 License

ISC

---

**Built with ❤️ for the Ethare.AI Task**
