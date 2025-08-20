# Overview

This is a full-stack web application called "CloudStrategik Service Offerings Builder" - a CPQ-lite (Configure, Price, Quote) tool designed for Salesforce security consulting services. The application allows users to configure service packages, generate professional Statements of Work (SOWs), and manage reusable service templates. It features a comprehensive service catalog with 7+ pre-configured Salesforce security services, advanced filtering capabilities, and professional SOW generation with Markdown export functionality.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
The client is built with React 18 using TypeScript and modern hooks patterns. The UI is implemented with shadcn/ui components built on Radix UI primitives and styled with Tailwind CSS. The application uses a custom hook-based state management approach (`useServiceBuilder`) for handling service configuration logic. Routing is handled by Wouter for client-side navigation. The frontend follows a component-based architecture with clear separation between presentation components (`components/`), business logic hooks (`hooks/`), and shared utilities (`lib/`).

## Backend Architecture  
The server is built with Express.js using TypeScript and follows an ESM module structure. It implements a simple REST API pattern with route registration through a centralized `registerRoutes` function. The backend includes middleware for request logging, JSON parsing, and error handling. Database operations are abstracted through a storage interface pattern that currently uses in-memory storage but can be extended to use persistent databases.

## Data Storage Solutions
The application uses a hybrid storage approach:
- **PostgreSQL with Drizzle ORM**: Configured for production use with Neon Database serverless connections
- **In-memory storage**: Currently implemented for rapid development using a Map-based storage service
- **Browser LocalStorage**: Used for client-side persistence of user preferences, service packages, and application state
- **Schema management**: Drizzle Kit handles database migrations and schema synchronization

## Authentication and Authorization
The current implementation includes a basic user schema with username/password fields but no active authentication middleware. The application is designed to support session-based authentication with connect-pg-simple for PostgreSQL session storage, but authentication is not currently enforced, making it suitable for internal consulting tools.

## External Dependencies
- **Neon Database**: Serverless PostgreSQL hosting for production data persistence
- **shadcn/ui Component Library**: Provides a comprehensive set of accessible UI components
- **Radix UI Primitives**: Foundation for complex interactive components like dialogs, dropdowns, and form controls
- **TanStack React Query**: Handles server state management and API caching
- **Tailwind CSS**: Utility-first CSS framework for consistent styling
- **Vite**: Build tool and development server with hot module replacement
- **Drizzle ORM**: Type-safe database operations and schema management
- **Replit Integration**: Development environment with runtime error handling and cartographer tooling