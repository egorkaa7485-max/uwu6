# Popular Games Platform

## Overview
This is a fullstack web application built with React, Express, and TypeScript. It appears to be a gaming platform with an onboarding flow for users to discover and play popular games.

## Project Structure
- **Frontend**: React with Vite, located in `/client`
  - UI Framework: Radix UI components with Tailwind CSS
  - Routing: Wouter
  - State Management: TanStack Query (React Query)
  - Animation: Framer Motion
  
- **Backend**: Express server in `/server`
  - TypeScript-based REST API
  - Session management with Express Session
  - Currently using in-memory storage (MemStorage)
  - Configured for PostgreSQL via Drizzle ORM
  
- **Shared**: Common schema and types in `/shared`

## Architecture
- Single server serves both API and frontend (port 5000)
- Development: Vite dev server integrated with Express
- Production: Static files served by Express

## Recent Changes (November 3, 2025)
- Configured for Replit environment
- Updated Vite config to bind to 0.0.0.0:5000 for Replit proxy compatibility
- Updated Express server to bind to 0.0.0.0
- Installed all dependencies
- Set up deployment configuration (autoscale)
- Verified frontend is working correctly

## Development
- Run: `npm run dev` (starts both backend and frontend)
- Build: `npm run build`
- Type check: `npm check`
- Database push: `npm run db:push`

## Dependencies
- Node.js runtime
- PostgreSQL (optional, falls back to in-memory storage)

## Routes
Frontend routes:
- `/` - Onboarding page 1
- `/onboarding-2` - Onboarding page 2
- `/onboarding-3` - Onboarding page 3
- `/onboarding-4` - Onboarding page 4
- `/main` - Main app page
- `/profile` - User profile page

## Notes
- The app uses in-memory storage by default
- Database schema is defined but PostgreSQL integration is optional
- All assets and UI components are already set up
