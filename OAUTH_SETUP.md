# OAuth Setup Guide

This guide will help you set up Google and GitHub OAuth authentication for your AutoPilot AI application.

## Prerequisites

- Google account
- GitHub account
- Backend server running on `http://localhost:5000`
- Frontend server running on `http://localhost:3000`

---

## Step 1: Set Up Google OAuth

### 1.1 Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click on the project dropdown and click **New Project**
3. Name your project (e.g., "AutoPilot AI")
4. Click **Create**

### 1.2 Enable Google+ API

1. In your project, go to **APIs & Services** > **Library**
2. Search for "Google+ API"
3. Click on it and click **Enable**

### 1.3 Create OAuth Credentials

1. Go to **APIs & Services** > **Credentials**
2. Click **Create Credentials** > **OAuth client ID**
3. If prompted, configure the OAuth consent screen:
   - User Type: **External**
   - App name: **AutoPilot AI**
   - User support email: Your email
   - Developer contact: Your email
   - Click **Save and Continue**
   - Scopes: Click **Save and Continue** (use defaults)
   - Test users: Add your email, click **Save and Continue**
4. Back to creating OAuth client ID:
   - Application type: **Web application**
   - Name: **AutoPilot AI Web Client**
   - Authorized JavaScript origins:
     - `http://localhost:3000`
   - Authorized redirect URIs:
     - `http://localhost:5000/api/auth/google/callback`
   - Click **Create**
5. **Copy your Client ID and Client Secret**

### 1.4 Update .env File

Open `backend/.env` and update:
```
GOOGLE_CLIENT_ID=your-actual-client-id
GOOGLE_CLIENT_SECRET=your-actual-client-secret
```

---

## Step 2: Set Up GitHub OAuth

### 2.1 Create a GitHub OAuth App

1. Go to [GitHub Settings](https://github.com/settings/developers)
2. Click **OAuth Apps** in the left sidebar
3. Click **New OAuth App**

### 2.2 Configure OAuth App

Fill in the following details:
- **Application name**: `AutoPilot AI`
- **Homepage URL**: `http://localhost:3000`
- **Authorization callback URL**: `http://localhost:5000/api/auth/github/callback`
- Click **Register application**

### 2.3 Get Client Credentials

1. After creating the app, you'll see your **Client ID**
2. Click **Generate a new client secret**
3. **Copy both Client ID and Client Secret immediately** (you won't be able to see the secret again)

### 2.4 Update .env File

Open `backend/.env` and update:
```
GITHUB_CLIENT_ID=your-actual-client-id
GITHUB_CLIENT_SECRET=your-actual-client-secret
```

---

## Step 3: Update Database Schema

The database schema has been updated to support OAuth users. Run the database initialization script:

```powershell
cd c:\Users\Asus\Desktop\autopilot-ai\backend
node src/db/init_db.js
```

> **Warning**: This will drop existing tables and recreate them. Any existing user data will be lost.

---

## Step 4: Restart Backend Server

After updating the `.env` file and database schema, restart your backend server:

1. Stop the current server (Ctrl+C)
2. Start it again:
```powershell
cd c:\Users\Asus\Desktop\autopilot-ai\backend
npm run dev
```

---

## Step 5: Test OAuth Authentication

### Test Google OAuth

1. Open your browser and go to `http://localhost:3000/auth/signin`
2. Click the **Google** button
3. You should be redirected to Google's login page
4. Sign in with your Google account
5. After successful authentication, you should be redirected back to the home page
6. Check your browser's localStorage to verify user session

### Test GitHub OAuth

1. Go to `http://localhost:3000/auth/signin`
2. Click the **GitHub** button
3. You should be redirected to GitHub's authorization page
4. Click **Authorize**
5. After successful authentication, you should be redirected back to the home page

---

## Troubleshooting

### "Redirect URI mismatch" error

- Make sure the callback URLs in Google Cloud Console and GitHub OAuth App settings exactly match:
  - Google: `http://localhost:5000/api/auth/google/callback`
  - GitHub: `http://localhost:5000/api/auth/github/callback`

### "OAuth not working" - Check:

1. Environment variables are correctly set in `backend/.env`
2. Backend server is running on port 5000
3. Frontend server is running on port 3000
4. Database has been reinitialized with the new schema

### "User not being created in database"

- Check backend console logs for errors
- Verify database connection is working
- Make sure the users table has the `oauth_provider` and `oauth_id` columns

---

## Security Notes for Production

> [!WARNING]
> **Current Implementation is for Development Only**

For production deployment:

1. **Use HTTPS**: Update all URLs (callback URLs, frontend URL) to use HTTPS
2. **Secure Sessions**: Use a strong, randomly generated `SESSION_SECRET`
3. **Environment Variables**: Never commit `.env` files with real credentials
4. **CORS**: Update CORS settings to only allow your production domain
5. **Token-based Auth**: Consider implementing JWT tokens instead of URL parameters
6. **Rate Limiting**: Add rate limiting to OAuth endpoints
7. **Error Handling**: Improve error messages (don't expose sensitive info)

---

## Next Steps

Once OAuth is working:

- Test sign-up flow with OAuth
- Verify existing email/password authentication still works
- Test user profile functionality with OAuth users
- Consider adding account linking (link OAuth to existing email account)
