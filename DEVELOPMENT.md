# Development Guide

This project uses a Monorepo structure, containing the frontend, backend monitoring service, and Supabase configuration.

## Project Structure

*   **web/**: Frontend project (React + Vite)
*   **mitm-monitor/**: Backend traffic monitoring service (Node.js)
*   **supabase/**: Supabase database and Edge Functions configuration

## Getting Started

### 1. Install Dependencies

Run the following command in the root directory:

```bash
# If using npm
npm install

# If using pnpm (recommended)
pnpm install
```

### 2. Start Development Environment

We provide convenient commands to start both frontend and backend services simultaneously:

```bash
# Start both frontend and monitoring service
npm run dev:all
```

Or start them individually:

```bash
# Start frontend only
npm run dev:web

# Start monitoring service only
npm run dev:monitor
```

### 3. Build Project

Build all sub-projects:

```bash
npm run build
```

## Environment Variables

Please ensure that the corresponding environment variable files (such as `.env` or `.env.local`) are configured in each sub-project.
