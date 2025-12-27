# Deployment Guide - Insyd Inventory Management

This guide will help you deploy the Insyd Inventory Management application to **Render** and **Netlify**.

## Prerequisites

1. **GitHub Account** - Your code should be in a GitHub repository
2. **Render Account** - Sign up at [render.com](https://render.com)
3. **Netlify Account** - Sign up at [netlify.com](https://netlify.com)

---

## Option 1: Deploy to Render

### Step 1: Push Code to GitHub

```bash
# Initialize git if not already done
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - Inventory Management App"

# Add your GitHub repository (replace with your repo URL)
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# Push to GitHub
git push -u origin main
```

### Step 2: Deploy on Render

1. **Go to Render Dashboard**
   - Visit [dashboard.render.com](https://dashboard.render.com)
   - Sign in or create an account

2. **Create New Web Service**
   - Click "New +" button
   - Select "Web Service"

3. **Connect Repository**
   - Connect your GitHub account if not already connected
   - Select your repository

4. **Configure Service**
   - **Name**: `insyd-inventory` (or your preferred name)
   - **Environment**: `Node`
   - **Region**: Choose closest to you (e.g., `Oregon (US West)`)
   - **Branch**: `main` (or your default branch)
   - **Root Directory**: Leave empty (or `.` if needed)
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`

5. **Environment Variables** (Optional)
   - If you need any environment variables later, you can add them in the "Environment" section
   - For now, no env vars are needed since we're using localStorage

6. **Deploy**
   - Click "Create Web Service"
   - Render will automatically:
     - Install dependencies
     - Build your Next.js app
     - Start the service
   - Wait 5-10 minutes for the first deployment

7. **Access Your App**
   - Once deployed, you'll get a URL like: `https://insyd-inventory.onrender.com`
   - Your app will be live!

### Render Settings Summary:
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm start`
- **Node Version**: Auto-detected (or set to 18+ in settings)

### Notes for Render:
- Free tier includes 750 hours/month
- App sleeps after 15 minutes of inactivity (on free tier)
- Takes 30-60 seconds to wake up after sleep
- Consider upgrading for always-on service

---

## Option 2: Deploy to Netlify

### Step 1: Push Code to GitHub

(Same as Render Step 1 - skip if already done)

### Step 2: Deploy on Netlify

#### Method A: Via Netlify Dashboard (Recommended)

1. **Go to Netlify Dashboard**
   - Visit [app.netlify.com](https://app.netlify.com)
   - Sign in or create an account

2. **Add New Site**
   - Click "Add new site" → "Import an existing project"

3. **Connect Repository**
   - Choose "Deploy with GitHub"
   - Authorize Netlify to access your GitHub
   - Select your repository

4. **Configure Build Settings**
   - Netlify should auto-detect Next.js, but verify:
   - **Build command**: `npm run build`
   - **Publish directory**: `.next` (Netlify Next.js plugin handles this)
   - **Node version**: Set to `18` or higher in site settings

5. **Deploy**
   - Click "Deploy site"
   - Wait 2-5 minutes for build and deployment

6. **Access Your App**
   - Once deployed, you'll get a URL like: `https://random-name-12345.netlify.app`
   - You can customize the domain name in site settings

#### Method B: Via Netlify CLI

```bash
# Install Netlify CLI globally
npm install -g netlify-cli

# Login to Netlify
netlify login

# Deploy
netlify deploy --prod
```

### Netlify Configuration:

The `netlify.toml` file is already included in your project with the correct settings:
- Builds with Next.js plugin
- Automatically handles Next.js routing
- Uses Node 18

### Notes for Netlify:
- Free tier includes 100GB bandwidth/month
- Builds are instant for small apps
- Always-on (no sleep)
- Great for static/hybrid sites like Next.js

---

## Post-Deployment Checklist

### Both Platforms:

1. ✅ **Test the Application**
   - Visit your deployed URL
   - Navigate to `/inventory`
   - Test adding/editing/deleting items
   - Verify localStorage works (data persists on refresh)

2. ✅ **Custom Domain** (Optional)
   - Both platforms support custom domains
   - Add your domain in site settings
   - Configure DNS as instructed

3. ✅ **Environment Variables** (If needed later)
   - Add in platform settings
   - Rebuild after adding

4. ✅ **Monitor Build Logs**
   - Check build logs if deployment fails
   - Common issues: dependency errors, build timeouts

---

## Troubleshooting

### Common Issues:

#### Build Fails on Render/Netlify:

1. **Dependency Issues**
   ```bash
   # Test build locally first
   npm install
   npm run build
   ```

2. **Node Version**
   - Ensure Node 18+ is specified
   - Check in platform settings

3. **Build Timeout**
   - Free tiers have build time limits
   - Optimize dependencies if needed

#### App Works Locally but Not on Platform:

1. **Check Build Logs**
   - Look for errors in deployment logs
   - Common: missing dependencies, path issues

2. **Verify Start Command**
   - Render: `npm start`
   - Netlify: Handled automatically

3. **Check Environment**
   - Ensure `NODE_ENV=production` (usually auto-set)

### localStorage Concerns:

Since this app uses **localStorage** (browser storage):
- ✅ Works perfectly on both platforms
- ⚠️ Data is stored in user's browser (not server)
- ⚠️ Each user has separate data
- ⚠️ Data clears if user clears browser data

**This is expected behavior** for a frontend-only app!

---

## Quick Comparison

| Feature | Render | Netlify |
|---------|--------|---------|
| **Free Tier** | ✅ 750 hrs/month | ✅ 100GB bandwidth |
| **Sleep After Inactivity** | ⚠️ 15 min (free tier) | ❌ Always on |
| **Build Speed** | Medium | Fast |
| **Custom Domain** | ✅ Free | ✅ Free |
| **Next.js Support** | ✅ Good | ✅ Excellent |
| **Best For** | Full-stack apps | Static/hybrid sites |

**Recommendation**: Use **Netlify** for this inventory app (faster, always-on, great Next.js support)

---

## Next Steps

1. **Choose a Platform** (Netlify recommended)
2. **Follow deployment steps above**
3. **Test your deployed app**
4. **Share the URL** with your users!

Your inventory management app will be live and accessible from anywhere! 🚀

