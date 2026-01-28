# Account Setup Guide

This guide walks you through creating accounts on all required services for deploying AutoPilot AI.

## Prerequisites Completed ✓

- [x] Session secret generated: `4JwbezlDpU9Yq2AE60/fp1NURBC4uKzAA4d7HwtWeqk=`
- [x] Git repository verified: `https://github.com/Arnav10090/autopilot-ai.git`
- [x] .gitignore updated to protect deployment credentials

---

## Step 1: Create Vercel Account (Frontend Hosting)

1. Visit: https://vercel.com
2. Click "Sign Up"
3. **Recommended:** Sign up with GitHub for seamless integration
4. Verify your email address
5. Complete onboarding

**Why Vercel?**
- Native Next.js support
- 100 GB bandwidth/month (free tier)
- Automatic HTTPS and CDN
- Zero configuration deployments

---

## Step 2: Create Render Account (Backend Hosting)

1. Visit: https://render.com
2. Click "Get Started"
3. **Recommended:** Sign up with GitHub for easy repository access
4. Verify your email address
5. Complete onboarding

**Why Render?**
- 750 hours/month free (enough for one service)
- Automatic HTTPS
- Native Node.js support
- Auto-deploy from Git

**Note:** Free tier services spin down after 15 minutes of inactivity (30-60 second cold start)

---

## Step 3: Create Neon Account (PostgreSQL Database)

1. Visit: https://neon.tech
2. Click "Sign Up"
3. Sign up with GitHub or email
4. Verify your email address
5. Complete onboarding

**Why Neon?**
- 3 GB storage free
- Serverless PostgreSQL
- Instant provisioning
- Connection pooling included

---

## Step 4: Verify Existing OAuth Credentials

You should already have OAuth apps configured for local development. We'll update these with production URLs later.

### Google OAuth
- Console: https://console.cloud.google.com
- Location: APIs & Services > Credentials
- You should have an existing OAuth 2.0 Client ID

### GitHub OAuth
- Settings: https://github.com/settings/developers
- Location: OAuth Apps
- You should have an existing OAuth App

**Action:** Locate your existing Client IDs and Secrets - you'll need them for deployment.

---

## Step 5: Verify API Keys

### Groq API
- Console: https://console.groq.com
- You should already have an API key from local development
- Locate it in your local `backend/.env` file

### Google Generative AI (if used)
- Console: https://makersuite.google.com/app/apikey
- Check if you're using this in your backend code
- Locate the key if applicable

---

## Step 6: Prepare Git Repository

Before deployment, ensure your repository is clean and up to date:

```bash
# Check current status
git status

# Add spec files (if you want to track them)
git add .kiro/specs/

# Commit any pending changes
git commit -m "Add deployment specifications"

# Push to GitHub
git push origin main
```

**Current Status:**
- Branch: `main`
- Remote: `https://github.com/Arnav10090/autopilot-ai.git`
- Pending changes: `components/global/UserMenu.tsx`, `.kiro/` directory

---

## Completion Checklist

Mark each item as you complete it:

- [ ] Vercel account created
- [ ] Render account created
- [ ] Neon account created
- [ ] Google OAuth credentials located
- [ ] GitHub OAuth credentials located
- [ ] Groq API key located
- [ ] Git repository pushed to GitHub
- [ ] All credentials documented in DEPLOYMENT_CHECKLIST.md

---

## Next Steps

Once all accounts are created and credentials are documented:

1. Proceed to **Task 2**: Provision and configure Neon PostgreSQL database
2. Keep DEPLOYMENT_CHECKLIST.md handy - you'll update it with service URLs
3. Have all API keys and OAuth credentials ready for environment variable configuration

---

## Security Reminders

- ✓ DEPLOYMENT_CHECKLIST.md is in .gitignore
- ✓ Never commit API keys or secrets to Git
- ✓ Use environment variables for all sensitive data
- ✓ Keep your session secret secure
- ✓ Rotate credentials if accidentally exposed

---

## Troubleshooting

**Can't find OAuth credentials?**
- Check your local `backend/.env` file
- Look in Google Cloud Console and GitHub Developer Settings

**Git push fails?**
- Verify you have push access to the repository
- Check if you need to authenticate with GitHub

**Need help?**
- Vercel docs: https://vercel.com/docs
- Render docs: https://render.com/docs
- Neon docs: https://neon.tech/docs
