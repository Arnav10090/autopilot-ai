# Bugfix Requirements Document

## Introduction

This document addresses a critical bug in the Google OAuth login flow where users receive a 404 "This page could not be found" error after successfully authenticating with Google. The issue occurs due to a port mismatch between the configured frontend URL in the backend environment variables (localhost:3000) and the actual frontend application port (localhost:3001). This prevents users from completing the OAuth login process, resulting in authentication failure despite successful Google account selection.

## Bug Analysis

### Current Behavior (Defect)

1.1 WHEN a user completes Google OAuth authentication THEN the backend redirects to `http://localhost:3000/auth/callback?user=...` which returns a 404 error because the frontend runs on port 3001

1.2 WHEN the OAuth callback redirect occurs THEN the user sees "This page could not be found" error page instead of being authenticated

1.3 WHEN the backend reads the FRONTEND_URL environment variable THEN it uses `http://localhost:3000` which does not match the actual frontend port

### Expected Behavior (Correct)

2.1 WHEN a user completes Google OAuth authentication THEN the backend SHALL redirect to the correct frontend URL on port 3001 (`http://localhost:3001/auth/callback?user=...`)

2.2 WHEN the OAuth callback redirect occurs THEN the user SHALL be successfully redirected to the callback page which processes the authentication and redirects to the home page

2.3 WHEN the backend reads the FRONTEND_URL environment variable THEN it SHALL use the correct port that matches the running frontend application

### Unchanged Behavior (Regression Prevention)

3.1 WHEN a user authenticates using email/password login THEN the system SHALL CONTINUE TO authenticate successfully without any changes

3.2 WHEN GitHub OAuth authentication is used THEN the system SHALL CONTINUE TO work with the same port configuration fix applied

3.3 WHEN the OAuth callback page receives valid user data THEN the system SHALL CONTINUE TO parse the user data, store it in localStorage, and redirect to the home page

3.4 WHEN OAuth authentication fails THEN the system SHALL CONTINUE TO redirect to the signin page with appropriate error messages

3.5 WHEN the backend processes OAuth callbacks for both Google and GitHub THEN the system SHALL CONTINUE TO use the same FRONTEND_URL environment variable for consistency
