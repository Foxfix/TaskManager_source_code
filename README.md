# TaskFlow - Task Manager

A fullstack task management application built with TypeScript featuring a React frontend and Express backend, using PostgreSQL database.

## Features

- ✅ Create and manage tasks
- ✅ Task priorities (low, medium, high)
- ✅ Task statuses (pending, in-progress, completed)
- ✅ Task filtering and sorting
- ✅ Responsive design
- ✅ Form validation with Zod
- ✅ Caching with TanStack Query

## Tech Stack

**Frontend:**
- React 18 + TypeScript
- Tailwind CSS + shadcn/ui
- TanStack React Query
- Wouter (routing)
- React Hook Form + Zod

**Backend:**
- Node.js + Express
- TypeScript
- Drizzle ORM
- PostgreSQL
- Zod validation

## Local Development Without Docker

This project is configured as a single Node app with the frontend, backend, and shared code living in the same repository root. You do not need separate `npm install` commands in `client` and `server`; install dependencies once in the project root.

### Prerequisites

- Node.js 18+ or 20+
- npm
- Docker (required only for the PostgreSQL database container)

### 1) Install dependencies once at the project root

```bash
npm install
```

### 2) Start PostgreSQL for the app to connect to

This is required for the app to start successfully. Run the following command exactly once to create the database container:

```bash
docker run --name taskflow-postgres \
  -e POSTGRES_USER=taskflow \
  -e POSTGRES_PASSWORD=taskflow123 \
  -e POSTGRES_DB=taskflow \
  -p 5432:5432 \
  -d postgres:16
```

This is the database the app expects in the `.env` file:

```env
DATABASE_URL=postgresql://taskflow:taskflow123@localhost:5432/taskflow
```

You do not need to understand the internals of this Docker command; just run it once and keep the container running while developing.

### 3) Apply the database schema

```bash
npm run db:push
```

This creates the required tables, including `tasks`.

### 4) Start the application in development mode

```bash
npm run dev
```

The app will run on:

```text
http://localhost:5001
```

### 5) If the app does not start because the port is already in use

This usually means another process is already listening on port `5001`.

Check which process is using it:

```bash
lsof -nP -iTCP:5001 -sTCP:LISTEN
```

or:

```bash
ss -lntp | grep 5001
```

If you want to stop it and free the port:

```bash
kill -9 <PID>
```

Then run:

```bash
npm run dev
```

If you prefer to keep the existing process, change the app port in `.env` to a free one, for example:

```env
PORT=5002
```

and restart the app.

### 6) If PostgreSQL is not running

Check the container status:

```bash
docker ps
```

If the container is not running, start it again:

```bash
docker start taskflow-postgres
```


## API Endpoints

- `GET /api/tasks` - Get all tasks
- `GET /api/tasks/:id` - Get task by ID
- `POST /api/tasks` - Create new task
- `PATCH /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

## Database

The application uses PostgreSQL with the following tables:

### Tasks
- `id` - UUID (primary key)
- `title` - Task title
- `description` - Task description
- `priority` - Priority (low, medium, high)
- `status` - Status (pending, in-progress, completed)
- `created_at` - Creation date
- `updated_at` - Update date



### Migrations

To apply database schema changes:
```bash
npm run db:push
```

## Development

### Installing Dependencies
```bash
npm install
```

### Running in Development Mode
```bash
npm run dev
```

### Types and Validation
All data types are defined in `shared/schema.ts` using Drizzle ORM and Zod for validation.

## License

MIT
