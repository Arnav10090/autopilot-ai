# Implementation Plan: Free Deployment for AutoPilot AI

## Overview

This implementation plan provides step-by-step tasks for deploying the AutoPilot AI project to production using free-tier hosting services. The deployment uses Vercel for the Next.js frontend, Render for the Node.js backend, and Neon for the PostgreSQL database. Tasks include service provisioning, environment configuration, OAuth setup, database initialization, and deployment verification.

## Tasks

- [-] 1. Prepare deployment prerequisites
  - Create accounts on Vercel, Render, and Neon
  - Generate secure session secret using `openssl rand -base64 32`
  - Document all service URLs and credentials in a secure location
  - Verify Git repository is up to date and pushed to GitHub
  - _Requirements: 1.1, 2.1, 3.1_

- [ ] 2. Provision and configure Neon PostgreSQL database
  - [ ] 2.1 Create Neon database instance
    - Sign up for Neon account at neon.tech
    - Create new project named "autopilot-ai"
    - Create database named "autopilot_ai"
    - Copy the connection string (format: postgresql://user:pass@host.neon.tech/dbname?sslmode=require)
    - _Requirements: 3.1, 3.2_
  
  - [ ] 2.2 Initialize database schema
    - Update backend/.env with Neon connection string
    - Run database initialization script: `cd backend && node src/db/init_db.js`
    - Verify all tables are created (users, oauth_accounts, projects, project_outputs)
    - Test database connection with a simple query
    - _Requirements: 3.4, 4.1, 4.2, 4.3, 4.4, 4.5_
  
  - [ ]* 2.3 Write verification script for database schema
    - Create script to verify all tables exist with correct columns
    - Verify foreign key constraints are properly set
    - Test CRUD operations on each table
    - _Requirements: 3.3, 4.2, 4.3, 4.4, 4.5_

- [ ] 3. Configure OAuth providers for production
  - [ ] 3.1 Update Google OAuth configuration
    - Go to Google Cloud Console (console.cloud.google.com)
    - Navigate to APIs & Services > Credentials
    - Select existing OAuth 2.0 Client ID
    - Add authorized JavaScript origins: `https://your-frontend.vercel.app` (will update after Vercel deployment)
    - Add authorized redirect URIs: `https://your-backend.onrender.com/api/auth/google/callback` (will update after Render deployment)
    - Note: URLs will be updated in step 7 after deployments complete
    - _Requirements: 6.1, 6.2_
  
  - [ ] 3.2 Update GitHub OAuth configuration
    - Go to GitHub Settings > Developer settings > OAuth Apps
    - Select existing OAuth App or create new one
    - Set Homepage URL: `https://your-frontend.vercel.app` (will update after Vercel deployment)
    - Set Authorization callback URL: `https://your-backend.onrender.com/api/auth/github/callback` (will update after Render deployment)
    - Note: URLs will be updated in step 7 after deployments complete
    - _Requirements: 6.1, 6.3_

- [ ] 4. Deploy backend to Render
  - [ ] 4.1 Create Render web service
    - Sign up for Render account at render.com
    - Click "New +" and select "Web Service"
    - Connect GitHub repository
    - Configure service settings:
      - Name: autopilot-ai-backend
      - Region: Choose closest to your users
      - Branch: main
      - Root Directory: backend
      - Runtime: Node
      - Build Command: `npm install`
      - Start Command: `node src/server.js`
    - _Requirements: 2.1, 2.2_
  
  - [ ] 4.2 Configure backend environment variables
    - Add environment variables in Render dashboard:
      - PORT: (leave empty, Render auto-assigns)
      - NODE_ENV: production
      - DATABASE_URL: (paste Neon connection string from step 2.1)
      - GROQ_API_KEY: (paste your Groq API key)
      - GOOGLE_CLIENT_ID: (from Google Cloud Console)
      - GOOGLE_CLIENT_SECRET: (from Google Cloud Console)
      - GOOGLE_CALLBACK_URL: https://your-service-name.onrender.com/api/auth/google/callback
      - GITHUB_CLIENT_ID: (from GitHub OAuth App)
      - GITHUB_CLIENT_SECRET: (from GitHub OAuth App)
      - GITHUB_CALLBACK_URL: https://your-service-name.onrender.com/api/auth/github/callback
      - SESSION_SECRET: (paste generated secret from step 1)
      - FRONTEND_URL: http://localhost:3000 (temporary, will update after Vercel deployment)
    - _Requirements: 2.4, 5.2, 5.3, 5.4, 5.5, 5.7, 5.8_
  
  - [ ] 4.3 Deploy backend and verify
    - Click "Create Web Service" to start deployment
    - Monitor deployment logs for errors
    - Wait for deployment to complete (5-10 minutes)
    - Copy the Render service URL (e.g., https://autopilot-ai-backend.onrender.com)
    - Test health endpoint: `curl https://your-backend.onrender.com/api/health` (if implemented)
    - Verify backend logs show successful startup and database connection
    - _Requirements: 2.3, 2.5, 2.6_
  
  - [ ] 4.4 Add health check endpoint to backend
    - Create new route file: backend/src/routes/health.routes.js
    - Implement health check endpoint that returns status and database connection status
    - Add route to backend/src/app.js: `app.use("/api/health", healthRoutes)`
    - Commit and push changes to trigger redeployment
    - _Requirements: 10.1, 10.2_

- [ ] 5. Deploy frontend to Vercel
  - [ ] 5.1 Create Vercel project
    - Sign up for Vercel account at vercel.com
    - Click "Add New..." and select "Project"
    - Import Git repository from GitHub
    - Configure project settings:
      - Framework Preset: Next.js
      - Root Directory: ./ (leave as root)
      - Build Command: `npm run build` (auto-detected)
      - Output Directory: .next (auto-detected)
    - _Requirements: 1.1, 1.2_
  
  - [ ] 5.2 Configure frontend environment variables
    - Add environment variable in Vercel dashboard:
      - NEXT_PUBLIC_API_URL: (paste Render backend URL from step 4.3)
    - Example: https://autopilot-ai-backend.onrender.com
    - _Requirements: 1.4, 1.5, 5.1_
  
  - [ ] 5.3 Deploy frontend and verify
    - Click "Deploy" to start deployment
    - Monitor deployment logs for build errors
    - Wait for deployment to complete (2-5 minutes)
    - Copy the Vercel deployment URL (e.g., https://autopilot-ai.vercel.app)
    - Visit the URL and verify frontend loads correctly
    - Check browser console for any errors
    - _Requirements: 1.3, 1.6_

- [ ] 6. Configure CORS for production
  - [ ] 6.1 Update backend FRONTEND_URL environment variable
    - Go to Render dashboard
    - Navigate to your backend service
    - Update FRONTEND_URL environment variable with Vercel URL from step 5.3
    - Example: https://autopilot-ai.vercel.app
    - Save changes (this will trigger automatic redeployment)
    - _Requirements: 7.1, 7.5_
  
  - [ ]* 6.2 Write CORS verification tests
    - Create test script to verify CORS headers are present
    - Test requests from allowed origin (Vercel URL)
    - Test requests from disallowed origins
    - Verify credentials are allowed in CORS requests
    - _Requirements: 7.2, 7.3, 7.4_

- [ ] 7. Update OAuth callback URLs with production URLs
  - [ ] 7.1 Update Google OAuth with production URLs
    - Go to Google Cloud Console > APIs & Services > Credentials
    - Edit OAuth 2.0 Client ID
    - Update authorized JavaScript origins: Replace temporary URL with Vercel URL
    - Update authorized redirect URIs: Replace temporary URL with Render URL
    - Save changes
    - _Requirements: 6.2_
  
  - [ ] 7.2 Update GitHub OAuth with production URLs
    - Go to GitHub Settings > Developer settings > OAuth Apps
    - Edit OAuth App
    - Update Homepage URL: Replace temporary URL with Vercel URL
    - Update Authorization callback URL: Replace temporary URL with Render URL
    - Save changes
    - _Requirements: 6.3_
  
  - [ ] 7.3 Update backend OAuth callback environment variables
    - Go to Render dashboard
    - Update GOOGLE_CALLBACK_URL with production Render URL
    - Update GITHUB_CALLBACK_URL with production Render URL
    - Save changes (triggers redeployment)
    - _Requirements: 6.1_

- [ ] 8. Checkpoint - Test OAuth authentication flows
  - Visit the deployed frontend at Vercel URL
  - Test Google OAuth login flow end-to-end
  - Test GitHub OAuth login flow end-to-end
  - Verify user records are created in database
  - Verify sessions persist across page refreshes
  - Check Render logs for any OAuth errors
  - _Requirements: 6.4, 6.5, 6.6, 6.7, 11.4_

- [ ] 9. Verify deployment and security
  - [ ] 9.1 Verify HTTPS enforcement
    - Confirm frontend URL uses HTTPS
    - Confirm backend URL uses HTTPS
    - Test that HTTP requests redirect to HTTPS
    - _Requirements: 12.1, 12.2_
  
  - [ ] 9.2 Verify session security
    - Check that session cookies have secure flag in production
    - Verify session expiration is set to 24 hours
    - Test session persistence across requests
    - _Requirements: 11.1, 11.2, 11.3_
  
  - [ ] 9.3 Verify environment variables are secure
    - Confirm .env files are in .gitignore
    - Verify no environment variables are committed to Git
    - Check that sensitive data is not exposed in client-side code
    - _Requirements: 12.6, 12.7_
  
  - [ ]* 9.4 Write security verification tests
    - Test that error messages don't expose sensitive information
    - Test input validation on all API endpoints
    - Verify API keys are not exposed in responses
    - _Requirements: 12.4, 12.5_

- [ ] 10. Test complete application workflows
  - [ ] 10.1 Test user authentication
    - Test Google OAuth login
    - Test GitHub OAuth login
    - Verify user data is stored correctly
    - Test logout functionality
    - _Requirements: 6.4, 6.5, 6.6, 6.7_
  
  - [ ] 10.2 Test project creation and AI features
    - Create a new project through the UI
    - Verify project is saved to database
    - Test AI features (Groq API integration)
    - Verify project outputs are generated and stored
    - _Requirements: 8.1, 8.3, 8.4_
  
  - [ ] 10.3 Test data persistence
    - Create test data (user, project)
    - Wait for Render service to spin down (15+ minutes of inactivity)
    - Make a request to wake up the service
    - Verify test data still exists in database
    - _Requirements: 3.5_

- [ ] 11. Checkpoint - Final verification and documentation
  - Verify all environment variables are correctly configured
  - Test all major user workflows end-to-end
  - Document deployment URLs and access credentials
  - Create deployment runbook for future updates
  - Monitor logs for any errors or warnings
  - Set up uptime monitoring (optional: UptimeRobot, Pingdom)
  - _Requirements: 10.3, 10.5_

- [ ]* 12. Write automated deployment verification tests
  - [ ]* 12.1 Write property test for environment variable loading
    - Test that all required environment variables are loaded
    - Test error handling for missing variables
    - **Property 2: Environment Variable Loading**
    - **Validates: Requirements 2.4, 5.1-5.8**
  
  - [ ]* 12.2 Write property test for API response validity
    - Test that all API endpoints return valid responses
    - Test error responses have proper structure
    - **Property 4: API Response Validity**
    - **Validates: Requirements 2.6**
  
  - [ ]* 12.3 Write property test for database operations
    - Test CRUD operations on all tables
    - Verify data integrity and constraints
    - **Property 5: Database CRUD Operations**
    - **Validates: Requirements 3.3**
  
  - [ ]* 12.4 Write property test for CORS configuration
    - Test CORS headers are present for allowed origins
    - Test CORS headers are absent for disallowed origins
    - **Property 6: CORS Header Presence**
    - **Property 7: CORS Origin Validation**
    - **Validates: Requirements 7.2, 7.4**
  
  - [ ]* 12.5 Write property test for session validation
    - Test authenticated endpoints require valid sessions
    - Test invalid sessions are rejected
    - **Property 10: Session Validation**
    - **Validates: Requirements 11.5**
  
  - [ ]* 12.6 Write property test for security
    - Test error responses don't expose sensitive data
    - Test input validation on all endpoints
    - **Property 11: Security - No Sensitive Data Exposure**
    - **Property 12: Input Validation**
    - **Validates: Requirements 12.4, 12.5**

## Notes

- Tasks marked with `*` are optional and can be skipped for faster deployment
- Render free tier services spin down after 15 minutes of inactivity (cold start: 30-60 seconds)
- Neon free tier provides 3 GB storage and 1 compute unit
- Vercel free tier provides 100 GB bandwidth per month
- All services provide automatic HTTPS and SSL certificates
- Monitor service logs regularly for errors and performance issues
- Consider setting up uptime monitoring to keep Render service active
- Database backups are manual on free tier - export data regularly
