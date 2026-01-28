# Design Document: Free Deployment for AutoPilot AI

## Overview

This design outlines the deployment architecture for the AutoPilot AI project using free-tier hosting services. The solution leverages Vercel for frontend hosting, Render for backend API hosting, and Neon for PostgreSQL database hosting. This combination provides reliable, production-ready infrastructure at zero cost while supporting automatic deployments, environment variable management, and OAuth authentication.

The deployment strategy prioritizes simplicity, reliability, and ease of maintenance. All services support Git-based deployments, HTTPS by default, and provide sufficient resources for development and moderate production usage.

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Internet                             │
└────────────┬────────────────────────────────┬───────────────┘
             │                                 │
             │ HTTPS                           │ HTTPS
             │                                 │
    ┌────────▼─────────┐              ┌───────▼────────┐
    │  Vercel          │              │  Render        │
    │  (Frontend)      │◄────────────►│  (Backend)     │
    │  Next.js App     │   API Calls  │  Express API   │
    └──────────────────┘              └────────┬───────┘
                                               │
                                               │ PostgreSQL
                                               │ Connection
                                      ┌────────▼────────┐
                                      │  Neon           │
                                      │  (Database)     │
                                      │  PostgreSQL     │
                                      └─────────────────┘
                                      
    ┌─────────────────────────────────────────────────────────┐
    │  External Services                                       │
    │  - Google OAuth 2.0                                     │
    │  - GitHub OAuth                                         │
    │  - Groq API                                             │
    │  - Google Generative AI                                 │
    └─────────────────────────────────────────────────────────┘
```

### Service Selection Rationale

**Frontend: Vercel**
- Native Next.js support with zero configuration
- Automatic HTTPS and CDN
- Generous free tier (100 GB bandwidth, unlimited deployments)
- Automatic deployments from Git
- Built-in environment variable management
- Excellent performance and reliability

**Backend: Render**
- Free tier includes 750 hours/month (sufficient for one service)
- Automatic HTTPS
- Native support for Node.js/Express
- Environment variable management
- Automatic deployments from Git
- Health checks and auto-restart
- Note: Free tier services spin down after 15 minutes of inactivity (cold starts)

**Database: Neon**
- Serverless PostgreSQL with generous free tier
- 3 GB storage, 1 compute unit
- Automatic scaling and connection pooling
- Instant provisioning
- Compatible with standard PostgreSQL clients
- Automatic backups on paid tiers (manual exports on free tier)

### Alternative Options Considered

**Backend Alternatives:**
- Railway: Similar to Render, $5 free credit monthly
- Fly.io: More complex setup, 3 VMs free
- Cyclic: Good for Node.js, limited to 10k requests/month

**Database Alternatives:**
- Supabase: 500 MB free, includes auth and storage
- ElephantSQL: 20 MB free (too limited)
- Railway PostgreSQL: Included with backend hosting

## Components and Interfaces

### Frontend Component (Vercel)

**Build Configuration:**
- Framework: Next.js
- Build Command: `npm run build`
- Output Directory: `.next`
- Install Command: `npm install`
- Node Version: 20.x

**Environment Variables:**
```
NEXT_PUBLIC_API_URL=https://your-backend.onrender.com
```

**Deployment Trigger:**
- Automatic deployment on push to main branch
- Preview deployments for pull requests

### Backend Component (Render)

**Service Configuration:**
- Environment: Node
- Build Command: `npm install`
- Start Command: `npm start` (or `node backend/src/server.js`)
- Port: Auto-assigned via `process.env.PORT`
- Health Check Path: `/api/health` (to be implemented)

**Environment Variables:**
```
PORT=10000
DATABASE_URL=postgresql://user:pass@host.neon.tech/dbname?sslmode=require
GROQ_API_KEY=gsk_...
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GOOGLE_CALLBACK_URL=https://your-backend.onrender.com/api/auth/google/callback
GITHUB_CLIENT_ID=...
GITHUB_CLIENT_SECRET=...
GITHUB_CALLBACK_URL=https://your-backend.onrender.com/api/auth/github/callback
SESSION_SECRET=<generate-random-secret>
FRONTEND_URL=https://your-frontend.vercel.app
NODE_ENV=production
```

**Directory Structure Consideration:**
The backend code is in the `backend/` subdirectory. Render needs to:
1. Set root directory to `backend/` in service settings, OR
2. Use start command: `cd backend && npm install && node src/server.js`

### Database Component (Neon)

**Connection Configuration:**
- Connection String Format: `postgresql://user:password@host.neon.tech/dbname?sslmode=require`
- SSL Mode: Required
- Connection Pooling: Enabled by default
- Max Connections: 100 (free tier)

**Schema Initialization:**
The database schema will be initialized using the existing `backend/src/db/init_db.js` script. This script creates:
- `users` table: User accounts
- `oauth_accounts` table: OAuth provider linkages
- `projects` table: User projects
- `project_outputs` table: AI-generated project outputs

**Initialization Strategy:**
Option 1: Run initialization script manually after first deployment
Option 2: Add initialization check to server startup (run if tables don't exist)
Option 3: Use Render's "Build Command" to run initialization before starting server

### OAuth Configuration

**Google OAuth Setup:**
1. Go to Google Cloud Console
2. Navigate to APIs & Services > Credentials
3. Update OAuth 2.0 Client ID:
   - Authorized JavaScript origins: `https://your-frontend.vercel.app`
   - Authorized redirect URIs: `https://your-backend.onrender.com/api/auth/google/callback`

**GitHub OAuth Setup:**
1. Go to GitHub Settings > Developer settings > OAuth Apps
2. Update OAuth App:
   - Homepage URL: `https://your-frontend.vercel.app`
   - Authorization callback URL: `https://your-backend.onrender.com/api/auth/github/callback`

### CORS Configuration

The backend's CORS configuration uses the `FRONTEND_URL` environment variable:

```javascript
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));
```

This will be set to the Vercel deployment URL.

### Session Management

The existing session configuration needs the `SESSION_SECRET` environment variable:

```javascript
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000
  }
}));
```

Generate a secure random secret for production (e.g., using `openssl rand -base64 32`).

## Data Models

### Environment Configuration Model

**Frontend Environment:**
```typescript
interface FrontendEnv {
  NEXT_PUBLIC_API_URL: string; // Backend API base URL
}
```

**Backend Environment:**
```typescript
interface BackendEnv {
  PORT: number;
  DATABASE_URL: string;
  GROQ_API_KEY: string;
  GOOGLE_CLIENT_ID: string;
  GOOGLE_CLIENT_SECRET: string;
  GOOGLE_CALLBACK_URL: string;
  GITHUB_CLIENT_ID: string;
  GITHUB_CLIENT_SECRET: string;
  GITHUB_CALLBACK_URL: string;
  SESSION_SECRET: string;
  FRONTEND_URL: string;
  NODE_ENV: 'production' | 'development';
}
```

### Deployment Configuration Model

**Vercel Configuration (vercel.json):**
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "framework": "nextjs",
  "env": {
    "NEXT_PUBLIC_API_URL": "@api-url"
  }
}
```

**Render Configuration (render.yaml):**
```yaml
services:
  - type: web
    name: autopilot-ai-backend
    env: node
    rootDir: backend
    buildCommand: npm install
    startCommand: node src/server.js
    envVars:
      - key: NODE_ENV
        value: production
      - key: DATABASE_URL
        sync: false
      - key: GROQ_API_KEY
        sync: false
      - key: GOOGLE_CLIENT_ID
        sync: false
      - key: GOOGLE_CLIENT_SECRET
        sync: false
      - key: GOOGLE_CALLBACK_URL
        sync: false
      - key: GITHUB_CLIENT_ID
        sync: false
      - key: GITHUB_CLIENT_SECRET
        sync: false
      - key: GITHUB_CALLBACK_URL
        sync: false
      - key: SESSION_SECRET
        sync: false
      - key: FRONTEND_URL
        sync: false
```

### Database Schema

The existing schema from `init_db.js` remains unchanged:

```sql
-- Users table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE,
  password_hash VARCHAR(255),
  phone VARCHAR(50),
  dob DATE,
  account_status VARCHAR(20) DEFAULT 'Active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- OAuth accounts table
CREATE TABLE oauth_accounts (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  provider VARCHAR(50) NOT NULL,
  provider_user_id VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(provider, provider_user_id)
);

-- Projects table
CREATE TABLE projects (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  project_description TEXT NOT NULL,
  team_size INTEGER,
  deadline VARCHAR(100),
  skill_level VARCHAR(50),
  constraints TEXT,
  status VARCHAR(50) DEFAULT 'Pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Project outputs table
CREATE TABLE project_outputs (
  id SERIAL PRIMARY KEY,
  project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
  requirements JSONB,
  tech_stack JSONB,
  task_plan JSONB,
  risks JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Correctness Properties


*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Build Success
*For any* deployment attempt, the frontend and backend build commands should complete with exit code 0 and no errors.
**Validates: Requirements 1.3, 9.3, 9.4**

### Property 2: Environment Variable Loading
*For all* required environment variables (DATABASE_URL, GROQ_API_KEY, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET, SESSION_SECRET, FRONTEND_URL), when the backend starts, each variable should be loaded and accessible.
**Validates: Requirements 2.4, 5.1, 5.2, 5.3, 5.4, 5.5, 5.7, 5.8**

### Property 3: Missing Environment Variable Errors
*For any* required environment variable that is missing, the backend should log a clear error message indicating which variable is missing.
**Validates: Requirements 5.9**

### Property 4: API Response Validity
*For any* API endpoint request, the backend should respond with either valid data (2xx status) or an appropriate error message (4xx/5xx status) with proper structure.
**Validates: Requirements 2.6**

### Property 5: Database CRUD Operations
*For any* database table (users, oauth_accounts, projects, project_outputs), standard PostgreSQL operations (INSERT, SELECT, UPDATE, DELETE) should execute successfully.
**Validates: Requirements 3.3**

### Property 6: CORS Header Presence
*For any* API endpoint, when a request is made from the configured frontend URL, the response should include appropriate CORS headers (Access-Control-Allow-Origin, Access-Control-Allow-Credentials).
**Validates: Requirements 7.2**

### Property 7: CORS Origin Validation
*For any* request from an origin other than the configured FRONTEND_URL, the backend should reject the request or omit CORS headers.
**Validates: Requirements 7.4**

### Property 8: API Key Authentication
*For any* AI service request (Groq or Google Generative AI), the request should include the configured API key in the authentication header.
**Validates: Requirements 8.4**

### Property 9: API Key Error Handling
*For any* AI service request with an invalid or missing API key, the backend should return an appropriate error message without exposing the key.
**Validates: Requirements 8.5**

### Property 10: Session Validation
*For any* authenticated API endpoint, when a request is made without a valid session, the backend should return a 401 Unauthorized response.
**Validates: Requirements 11.5**

### Property 11: Security - No Sensitive Data Exposure
*For any* error response, the response body should not contain sensitive information such as database credentials, API keys, or internal file paths.
**Validates: Requirements 12.4**

### Property 12: Input Validation
*For any* API endpoint that accepts user input, the backend should validate the input and reject invalid data with appropriate error messages.
**Validates: Requirements 12.5**

## Error Handling

### Deployment Errors

**Build Failures:**
- Frontend build errors: Check Next.js build logs, verify dependencies are installed
- Backend startup errors: Check environment variables, database connection, port availability

**Database Connection Errors:**
- Connection refused: Verify DATABASE_URL is correct, check Neon database status
- SSL errors: Ensure connection string includes `?sslmode=require`
- Connection pool exhausted: Check for connection leaks, implement proper connection closing

**OAuth Errors:**
- Redirect URI mismatch: Verify callback URLs match in OAuth provider settings
- Invalid credentials: Check CLIENT_ID and CLIENT_SECRET environment variables
- CORS errors during OAuth: Verify FRONTEND_URL is correctly configured

### Runtime Errors

**Cold Start Delays (Render Free Tier):**
- Free tier services spin down after 15 minutes of inactivity
- First request after spin-down takes 30-60 seconds
- Mitigation: Implement loading states in frontend, consider using a ping service

**Session Errors:**
- Session not persisting: Verify SESSION_SECRET is set, check cookie settings
- Session expires too quickly: Verify maxAge is set to 24 hours

**API Rate Limiting:**
- Groq API limits: Implement rate limiting and error handling
- Google Generative AI limits: Implement retry logic with exponential backoff

### Error Logging

All errors should be logged with:
- Timestamp
- Error type/code
- Error message (sanitized, no sensitive data)
- Request context (endpoint, method, user ID if available)

## Testing Strategy

### Unit Tests

Unit tests should focus on specific examples and edge cases:

**Configuration Tests:**
- Test environment variable loading with valid values
- Test environment variable loading with missing values
- Test environment variable loading with invalid formats

**Database Tests:**
- Test database connection with valid connection string
- Test database connection with invalid connection string
- Test table creation for each table individually
- Test foreign key constraints

**OAuth Tests:**
- Test OAuth callback handling with valid tokens
- Test OAuth callback handling with invalid tokens
- Test user creation from OAuth data
- Test user update from OAuth data

**CORS Tests:**
- Test CORS headers with allowed origin
- Test CORS headers with disallowed origin
- Test CORS preflight requests

**Session Tests:**
- Test session creation on authentication
- Test session validation on authenticated requests
- Test session expiration

### Property-Based Tests

Property tests should verify universal properties across all inputs. Each property test should run a minimum of 100 iterations.

**Property Test 1: Build Success**
- Generate various code changes
- Run build commands
- Verify exit code is 0
- **Tag: Feature: free-deployment, Property 1: Build Success**

**Property Test 2: Environment Variable Loading**
- Generate various sets of environment variables
- Start backend with each set
- Verify all required variables are accessible
- **Tag: Feature: free-deployment, Property 2: Environment Variable Loading**

**Property Test 3: Missing Environment Variable Errors**
- Generate various combinations of missing environment variables
- Start backend with each combination
- Verify appropriate error messages are logged
- **Tag: Feature: free-deployment, Property 3: Missing Environment Variable Errors**

**Property Test 4: API Response Validity**
- Generate various API requests (valid and invalid)
- Send requests to all endpoints
- Verify responses have proper structure and status codes
- **Tag: Feature: free-deployment, Property 4: API Response Validity**

**Property Test 5: Database CRUD Operations**
- Generate random data for each table
- Perform CRUD operations
- Verify operations succeed and data integrity is maintained
- **Tag: Feature: free-deployment, Property 5: Database CRUD Operations**

**Property Test 6: CORS Header Presence**
- Generate requests from the configured frontend URL
- Send to all API endpoints
- Verify CORS headers are present in all responses
- **Tag: Feature: free-deployment, Property 6: CORS Header Presence**

**Property Test 7: CORS Origin Validation**
- Generate requests from various origins
- Send to API endpoints
- Verify only configured origin receives CORS headers
- **Tag: Feature: free-deployment, Property 7: CORS Origin Validation**

**Property Test 8: API Key Authentication**
- Generate various AI service requests
- Verify API keys are included in authentication headers
- **Tag: Feature: free-deployment, Property 8: API Key Authentication**

**Property Test 9: API Key Error Handling**
- Generate AI service requests with invalid/missing keys
- Verify appropriate error messages without key exposure
- **Tag: Feature: free-deployment, Property 9: API Key Error Handling**

**Property Test 10: Session Validation**
- Generate requests to authenticated endpoints
- Test with valid and invalid sessions
- Verify proper authentication enforcement
- **Tag: Feature: free-deployment, Property 10: Session Validation**

**Property Test 11: Security - No Sensitive Data Exposure**
- Generate various error conditions
- Verify error responses don't contain sensitive data
- **Tag: Feature: free-deployment, Property 11: Security - No Sensitive Data Exposure**

**Property Test 12: Input Validation**
- Generate various valid and invalid inputs
- Send to all input-accepting endpoints
- Verify validation occurs and invalid inputs are rejected
- **Tag: Feature: free-deployment, Property 12: Input Validation**

### Integration Tests

Integration tests should verify end-to-end workflows:

**Deployment Integration:**
- Deploy frontend to Vercel
- Deploy backend to Render
- Verify frontend can communicate with backend
- Verify database connection works

**OAuth Integration:**
- Test complete OAuth flow for Google
- Test complete OAuth flow for GitHub
- Verify user creation and session management

**API Integration:**
- Test complete project creation flow
- Test AI service integration
- Verify data persistence

### Manual Testing Checklist

After deployment, manually verify:

1. Frontend loads at Vercel URL
2. Backend responds at Render URL
3. Health check endpoint returns 200
4. Google OAuth login works
5. GitHub OAuth login works
6. Project creation works
7. AI features work (Groq API)
8. Data persists after backend restart
9. HTTPS is enforced on both frontend and backend
10. Environment variables are not exposed in client-side code

## Deployment Checklist

### Pre-Deployment

- [ ] Create Neon database account and provision database
- [ ] Create Render account
- [ ] Create Vercel account
- [ ] Generate secure SESSION_SECRET
- [ ] Update Google OAuth credentials with production URLs
- [ ] Update GitHub OAuth credentials with production URLs
- [ ] Prepare environment variables for all services

### Database Setup

- [ ] Create Neon database
- [ ] Copy connection string
- [ ] Test connection locally
- [ ] Run initialization script to create tables

### Backend Deployment (Render)

- [ ] Create new Web Service on Render
- [ ] Connect GitHub repository
- [ ] Set root directory to `backend/`
- [ ] Configure build command: `npm install`
- [ ] Configure start command: `node src/server.js`
- [ ] Add all environment variables
- [ ] Deploy and verify logs
- [ ] Test health check endpoint
- [ ] Note the Render URL for frontend configuration

### Frontend Deployment (Vercel)

- [ ] Import project from GitHub
- [ ] Configure framework preset: Next.js
- [ ] Add environment variable: NEXT_PUBLIC_API_URL (Render URL)
- [ ] Deploy and verify build succeeds
- [ ] Test frontend loads correctly
- [ ] Note the Vercel URL for backend CORS configuration

### Post-Deployment Configuration

- [ ] Update backend FRONTEND_URL environment variable with Vercel URL
- [ ] Redeploy backend to apply CORS changes
- [ ] Update Google OAuth authorized redirect URIs
- [ ] Update GitHub OAuth authorization callback URL
- [ ] Test OAuth login flows
- [ ] Test complete user workflows
- [ ] Monitor logs for errors

### Monitoring and Maintenance

- [ ] Set up uptime monitoring (e.g., UptimeRobot)
- [ ] Configure error alerting
- [ ] Document deployment URLs and credentials
- [ ] Schedule regular database backups (manual on free tier)
- [ ] Monitor Render service for cold starts
- [ ] Monitor Neon database storage usage
