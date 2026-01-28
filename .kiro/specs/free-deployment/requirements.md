# Requirements Document

## Introduction

This specification defines the requirements for deploying the AutoPilot AI project to production using free-tier hosting services. The project consists of a Next.js frontend, Node.js/Express backend with PostgreSQL database, OAuth authentication (Google & GitHub), and AI integrations (Google Gemini and Groq). The deployment must be cost-free, reliable, and production-ready with proper environment configuration, database initialization, and OAuth callback setup.

## Glossary

- **Frontend_Application**: The Next.js 16.1.1 application with React 19 and TypeScript
- **Backend_API**: The Node.js/Express server providing REST API endpoints
- **Database**: PostgreSQL database storing user, project, and OAuth account data
- **OAuth_Provider**: Third-party authentication services (Google OAuth 2.0 and GitHub OAuth)
- **Deployment_Platform**: Free-tier hosting service (Vercel, Render, Railway, Fly.io, Supabase, Neon)
- **Environment_Variables**: Configuration values for API keys, database URLs, and OAuth credentials
- **Production_Environment**: Live deployment accessible via public URLs
- **CORS**: Cross-Origin Resource Sharing configuration for frontend-backend communication
- **Database_Migration**: Process of initializing database schema and tables

## Requirements

### Requirement 1: Frontend Deployment

**User Story:** As a developer, I want to deploy the Next.js frontend to a free hosting platform, so that users can access the application via a public URL.

#### Acceptance Criteria

1. THE Deployment_Platform SHALL host the Frontend_Application on a free tier service
2. WHEN the Frontend_Application is deployed, THE Deployment_Platform SHALL provide a public HTTPS URL
3. THE Frontend_Application SHALL build successfully without errors
4. WHEN environment variables are required, THE Deployment_Platform SHALL support environment variable configuration
5. THE Frontend_Application SHALL connect to the Backend_API using the production backend URL
6. WHEN the deployment completes, THE Frontend_Application SHALL be accessible and functional

### Requirement 2: Backend Deployment

**User Story:** As a developer, I want to deploy the Node.js backend to a free hosting platform, so that the frontend can communicate with the API.

#### Acceptance Criteria

1. THE Deployment_Platform SHALL host the Backend_API on a free tier service
2. WHEN the Backend_API is deployed, THE Deployment_Platform SHALL provide a public HTTPS URL
3. THE Backend_API SHALL start successfully and listen on the assigned port
4. WHEN environment variables are configured, THE Backend_API SHALL load all required configuration values
5. THE Backend_API SHALL connect to the Database using the production database URL
6. WHEN the Backend_API receives requests, THE Backend_API SHALL respond with appropriate data or error messages

### Requirement 3: Database Provisioning

**User Story:** As a developer, I want to provision a free PostgreSQL database, so that the application can persist user and project data.

#### Acceptance Criteria

1. THE Deployment_Platform SHALL provide a PostgreSQL database on a free tier
2. WHEN the Database is provisioned, THE Deployment_Platform SHALL provide a connection string
3. THE Database SHALL support standard PostgreSQL operations (CREATE, READ, UPDATE, DELETE)
4. WHEN the database initialization script runs, THE Database SHALL create all required tables and schemas
5. THE Database SHALL persist data across Backend_API restarts
6. WHEN connection limits are reached, THE Database SHALL handle connections gracefully

### Requirement 4: Database Initialization

**User Story:** As a developer, I want to initialize the database schema automatically, so that all required tables are created on first deployment.

#### Acceptance Criteria

1. WHEN the Backend_API starts for the first time, THE Database_Migration SHALL execute the initialization script
2. THE Database_Migration SHALL create the users table with all required columns
3. THE Database_Migration SHALL create the oauth_accounts table with foreign key to users
4. THE Database_Migration SHALL create the projects table with foreign key to users
5. THE Database_Migration SHALL create the project_outputs table with foreign key to projects
6. IF tables already exist, THEN THE Database_Migration SHALL skip creation or handle gracefully
7. WHEN the Database_Migration completes, THE Backend_API SHALL log success or failure

### Requirement 5: Environment Variable Configuration

**User Story:** As a developer, I want to configure all environment variables for production, so that the application uses correct API keys, database URLs, and OAuth credentials.

#### Acceptance Criteria

1. THE Frontend_Application SHALL have environment variables for the backend API URL
2. THE Backend_API SHALL have environment variables for database connection string
3. THE Backend_API SHALL have environment variables for Google OAuth client ID, secret, and callback URL
4. THE Backend_API SHALL have environment variables for GitHub OAuth client ID, secret, and callback URL
5. THE Backend_API SHALL have environment variables for Groq API key
6. THE Backend_API SHALL have environment variables for Google Generative AI API key (if used)
7. THE Backend_API SHALL have environment variables for session secret
8. THE Backend_API SHALL have environment variables for frontend URL (for CORS)
9. WHEN environment variables are missing, THE Backend_API SHALL log clear error messages
10. THE Deployment_Platform SHALL support secure storage of sensitive environment variables

### Requirement 6: OAuth Configuration

**User Story:** As a developer, I want to configure OAuth providers for production URLs, so that users can authenticate with Google and GitHub.

#### Acceptance Criteria

1. WHEN the Backend_API is deployed, THE OAuth_Provider SHALL use production callback URLs
2. THE Google_OAuth_Configuration SHALL include the production backend URL in authorized redirect URIs
3. THE GitHub_OAuth_Configuration SHALL include the production backend URL in authorization callback URLs
4. WHEN a user initiates OAuth login, THE Backend_API SHALL redirect to the OAuth_Provider
5. WHEN OAuth authentication succeeds, THE OAuth_Provider SHALL redirect back to the Backend_API callback URL
6. WHEN the callback is received, THE Backend_API SHALL create or update user records
7. THE Backend_API SHALL store OAuth provider information in the oauth_accounts table

### Requirement 7: CORS Configuration

**User Story:** As a developer, I want to configure CORS properly, so that the frontend can make requests to the backend API.

#### Acceptance Criteria

1. THE Backend_API SHALL configure CORS to allow requests from the Frontend_Application URL
2. WHEN the Frontend_Application makes API requests, THE Backend_API SHALL include appropriate CORS headers
3. THE Backend_API SHALL allow credentials (cookies, authorization headers) in CORS requests
4. WHEN requests come from unauthorized origins, THE Backend_API SHALL reject them
5. THE CORS_Configuration SHALL use the FRONTEND_URL environment variable for allowed origins

### Requirement 8: API Integration Configuration

**User Story:** As a developer, I want to configure AI API integrations, so that the application can use Google Gemini and Groq services.

#### Acceptance Criteria

1. THE Backend_API SHALL load the Groq API key from environment variables
2. THE Backend_API SHALL load the Google Generative AI API key from environment variables (if used)
3. WHEN API keys are loaded, THE Backend_API SHALL log confirmation without exposing the keys
4. WHEN AI service requests are made, THE Backend_API SHALL use the configured API keys
5. IF API keys are invalid or missing, THEN THE Backend_API SHALL return appropriate error messages

### Requirement 9: Deployment Automation

**User Story:** As a developer, I want automated deployment from Git repository, so that code changes are deployed automatically.

#### Acceptance Criteria

1. THE Deployment_Platform SHALL support Git-based deployment
2. WHEN code is pushed to the main branch, THE Deployment_Platform SHALL trigger automatic deployment
3. THE Deployment_Platform SHALL run build commands for the Frontend_Application
4. THE Deployment_Platform SHALL run start commands for the Backend_API
5. WHEN deployment fails, THE Deployment_Platform SHALL provide error logs
6. WHEN deployment succeeds, THE Deployment_Platform SHALL make the new version live

### Requirement 10: Health Checks and Monitoring

**User Story:** As a developer, I want to monitor application health, so that I can detect and resolve issues quickly.

#### Acceptance Criteria

1. THE Backend_API SHALL provide a health check endpoint
2. WHEN the health check endpoint is called, THE Backend_API SHALL return status information
3. THE Deployment_Platform SHALL monitor application uptime
4. WHEN the application crashes, THE Deployment_Platform SHALL attempt automatic restart
5. THE Deployment_Platform SHALL provide logs for debugging

### Requirement 11: Session Management

**User Story:** As a user, I want my authentication session to persist, so that I don't have to log in repeatedly.

#### Acceptance Criteria

1. THE Backend_API SHALL configure express-session with a secure session secret
2. WHEN in Production_Environment, THE Backend_API SHALL set secure cookie flags
3. THE Backend_API SHALL configure session expiration (24 hours)
4. WHEN a user authenticates, THE Backend_API SHALL create a session
5. WHEN a user makes authenticated requests, THE Backend_API SHALL validate the session
6. WHEN a session expires, THE Backend_API SHALL require re-authentication

### Requirement 12: Security Configuration

**User Story:** As a developer, I want to implement security best practices, so that the application is protected from common vulnerabilities.

#### Acceptance Criteria

1. THE Frontend_Application SHALL be served over HTTPS
2. THE Backend_API SHALL be served over HTTPS
3. THE Backend_API SHALL use secure session cookies in production
4. THE Backend_API SHALL not expose sensitive information in error messages
5. THE Backend_API SHALL validate and sanitize user inputs
6. THE Environment_Variables SHALL not be committed to version control
7. THE OAuth_Provider credentials SHALL be stored securely in environment variables
