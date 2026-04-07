# Netlify Deployment Guide — ACES Aerodynamics

This guide provides step-by-step instructions for deploying the ACES Aerodynamics website to Netlify, a modern hosting platform optimized for static sites and serverless functions.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Quick Start Deployment](#quick-start-deployment)
3. [Configuration Details](#configuration-details)
4. [Environment Variables](#environment-variables)
5. [Custom Domain Setup](#custom-domain-setup)
6. [Continuous Deployment](#continuous-deployment)
7. [Monitoring and Analytics](#monitoring-and-analytics)
8. [Troubleshooting](#troubleshooting)

## Prerequisites

- GitHub account with access to the repository
- Netlify account (free tier available at [netlify.com](https://netlify.com))
- Domain name configured (acesaerodynamics.com)
- Node.js 22+ installed locally (for testing)
- pnpm 9.12.3+ installed locally

## Quick Start Deployment

### Option 1: Deploy via Netlify Dashboard (Recommended for First Deploy)

1. **Create Netlify Account**
   - Go to [netlify.com](https://netlify.com)
   - Sign up with GitHub (recommended for easier integration)
   - Verify your email address

2. **Connect Repository**
   ```
   a. Click "Add new site" → "Import an existing project"
   b. Choose "Deploy with GitHub"
   c. Authorize Netlify to access your GitHub account
   d. Select the repository: IAmJonoBo/ACES
   e. Choose the branch: main
   ```

3. **Configure Build Settings**
   
   Netlify should auto-detect Next.js, but verify these settings:
   
   ```
   Base directory: (leave empty)
   Build command: pnpm build
   Publish directory: .next
   ```

4. **Advanced Build Settings**
   
   Click "Show advanced" and add environment variables if needed:
   
   ```
   NODE_VERSION=22
   PNPM_VERSION=9.12.3
   ```

5. **Deploy Site**
   - Click "Deploy site"
   - Wait for build to complete (typically 2-5 minutes)
   - Note the temporary URL: `random-name-12345.netlify.app`

### Option 2: Deploy via Netlify CLI

```bash
# Install Netlify CLI globally
npm install -g netlify-cli

# Login to Netlify
netlify login

# Navigate to project directory
cd /home/runner/work/ACES/ACES

# Initialize Netlify site
netlify init

# Follow prompts:
# - Create & configure a new site
# - Choose your team
# - Enter site name: aces-aerodynamics
# - Build command: pnpm build
# - Directory to deploy: .next

# Deploy to production
netlify deploy --prod
```

## Configuration Details

### netlify.toml Configuration

The repository includes a `netlify.toml` file with optimized settings:

```toml
[build]
  command = "pnpm build"
  publish = ".next"
  
[build.environment]
  NODE_VERSION = "22"
  PNPM_VERSION = "9.12.3"
```

**Key Configuration Features:**

1. **Build Settings**
   - Uses pnpm for faster, more efficient builds
   - Targets Node.js 22 for latest features
   - Publishes Next.js output directory

2. **Security Headers**
   - X-Frame-Options, X-Content-Type-Options
   - Referrer Policy, Permissions Policy
   - CSP headers applied via middleware.ts

3. **Caching Strategy**
   - Static assets cached for 1 year
   - HTML/dynamic content revalidated on each request
   - Next.js static files marked as immutable

4. **URL Redirects**
   - Canonical domain redirect (non-www to www)
   - Trailing slash enforcement
   - Protocol upgrade to HTTPS

### Build Process

The build process follows these steps:

```
1. Install dependencies: pnpm install --frozen-lockfile
2. Run linting: pnpm lint (if configured)
3. Build application: pnpm build
4. Optimize assets
5. Deploy to Netlify Edge
```

## Environment Variables

### Required Environment Variables

Currently, the application requires **no environment variables** for basic operation. However, you may add them for enhanced functionality.

### Optional Environment Variables

Add these through Netlify Dashboard → Site Settings → Environment Variables:

```bash
# Analytics
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# Error Tracking (if using Sentry)
SENTRY_DSN=https://xxx@xxx.ingest.sentry.io/xxx
NEXT_PUBLIC_SENTRY_DSN=https://xxx@xxx.ingest.sentry.io/xxx

# Supabase (if integrated - see SUPABASE.md)
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyXxxx...
SUPABASE_SERVICE_ROLE_KEY=eyXxxx...

# Feature Flags
NEXT_PUBLIC_ENABLE_ANALYTICS=true

# Build-time Variables
NODE_ENV=production
```

### Setting Environment Variables

**Via Netlify Dashboard:**
```
1. Go to Site Settings
2. Navigate to "Environment Variables"
3. Click "Add a variable"
4. Enter key and value
5. Choose scope (all deploys, production only, etc.)
6. Click "Create variable"
```

**Via Netlify CLI:**
```bash
# Set environment variable for production
netlify env:set NEXT_PUBLIC_GA_MEASUREMENT_ID "G-XXXXXXXXXX"

# List all environment variables
netlify env:list

# Import from .env file
netlify env:import .env.production
```

## Custom Domain Setup

### Step 1: Add Custom Domain

1. **Via Netlify Dashboard:**
   ```
   a. Go to Site Settings → Domain Management
   b. Click "Add custom domain"
   c. Enter: www.acesaerodynamics.com
   d. Click "Verify"
   e. Netlify will check domain availability
   ```

2. **Add Domain Redirect (Optional but Recommended):**
   ```
   - Add secondary domain: acesaerodynamics.com
   - Configure to redirect to www.acesaerodynamics.com
   - This is handled by netlify.toml redirect rules
   ```

### Step 2: Configure DNS

You have two options for DNS configuration:

#### Option A: Use Netlify DNS (Recommended)

**Advantages:**
- Automatic SSL certificate provisioning
- Easier configuration
- Better integration with Netlify features

**Steps:**
```
1. In Domain Management, choose "Use Netlify DNS"
2. Update your domain registrar to use Netlify nameservers:
   - dns1.p01.nsone.net
   - dns2.p01.nsone.net
   - dns3.p01.nsone.net
   - dns4.p01.nsone.net
3. Wait for DNS propagation (can take 24-48 hours)
```

#### Option B: Use External DNS

**Steps:**
```
1. Log in to your domain registrar (GoDaddy, Namecheap, etc.)
2. Find DNS settings for acesaerodynamics.com
3. Add/Update these DNS records:

   For www.acesaerodynamics.com:
   Type: CNAME
   Name: www
   Value: [your-site].netlify.app
   TTL: 3600

   For root domain (acesaerodynamics.com):
   Type: A or ALIAS
   Name: @
   Value: 75.2.60.5 (Netlify load balancer IP)
   TTL: 3600

   Alternative for root:
   Type: NETLIFY
   Name: @
   Value: [your-site].netlify.app
```

### Step 3: Enable HTTPS

**Automatic SSL (Let's Encrypt):**
```
1. Netlify automatically provisions SSL certificates
2. Go to Domain Settings → HTTPS
3. Verify "SSL/TLS certificate" status is "Active"
4. Enable "Force HTTPS" to redirect all HTTP to HTTPS
5. Enable "HSTS" for additional security (optional)
```

**Custom SSL Certificate:**
```
If you have a custom certificate:
1. Go to Domain Settings → HTTPS
2. Click "Provide your own certificate"
3. Upload certificate, private key, and intermediate certificates
4. Click "Install certificate"
```

### Step 4: Verify Domain

```bash
# Test DNS propagation
nslookup www.acesaerodynamics.com

# Check SSL certificate
curl -I https://www.acesaerodynamics.com

# Verify site loads
curl https://www.acesaerodynamics.com
```

## Continuous Deployment

### Automatic Deployments

Netlify automatically deploys when you push to configured branches:

**Production Deploys:**
- Triggered by: Push to `main` branch
- URL: www.acesaerodynamics.com
- Build command: `pnpm build`

**Deploy Previews:**
- Triggered by: Pull requests
- URL: `deploy-preview-[PR-number]--[site-name].netlify.app`
- Useful for testing before merging

**Branch Deploys:**
- Triggered by: Push to other branches (if enabled)
- URL: `[branch-name]--[site-name].netlify.app`

### Deploy Contexts

Configure different settings for different deploy contexts in `netlify.toml`:

```toml
# Production context
[context.production]
  command = "pnpm build"
  
[context.production.environment]
  NODE_ENV = "production"

# Deploy Preview context
[context.deploy-preview]
  command = "pnpm build"
  
[context.deploy-preview.environment]
  NODE_ENV = "development"

# Branch deploy context
[context.branch-deploy]
  command = "pnpm build"
```

### Manual Deploys

**Via Dashboard:**
```
1. Go to Deploys tab
2. Click "Trigger deploy"
3. Choose "Deploy site"
4. Wait for build to complete
```

**Via CLI:**
```bash
# Deploy with build
netlify deploy --prod

# Deploy without build (use local build)
pnpm build
netlify deploy --prod --dir=.next
```

### Rollback

**Via Dashboard:**
```
1. Go to Deploys tab
2. Find the deployment you want to restore
3. Click the "..." menu
4. Select "Publish deploy"
5. Confirm the rollback
```

**Via CLI:**
```bash
# List previous deploys
netlify deploy:list

# Restore a specific deploy
netlify deploy:create --restore [deploy-id]
```

## Monitoring and Analytics

### Netlify Analytics

Enable Netlify's built-in analytics:

```
1. Go to Site Settings → Analytics
2. Click "Enable Analytics"
3. Choose plan (free tier available)
4. View metrics in Analytics tab:
   - Pageviews
   - Unique visitors
   - Top pages
   - Traffic sources
   - Bandwidth usage
```

### Build Notifications

Set up notifications for build events:

```
1. Go to Site Settings → Build & Deploy → Deploy notifications
2. Click "Add notification"
3. Choose trigger:
   - Deploy started
   - Deploy succeeded
   - Deploy failed
4. Choose notification type:
   - Email
   - Slack
   - Webhook
   - GitHub commit status
5. Configure details and save
```

### Performance Monitoring

**Built-in Lighthouse Audits:**
```bash
# Run locally
pnpm lh:ci

# View in Netlify
1. Go to Site Settings → Build & Deploy
2. Enable "Lighthouse" plugin
3. View reports in Deploys tab
```

**Third-party Monitoring:**
- Vercel Analytics (compatible with Netlify)
- Google Analytics 4
- Plausible Analytics
- Sentry for error tracking

## Troubleshooting

### Build Failures

**Issue: "pnpm: command not found"**
```
Solution:
1. Ensure PNPM_VERSION is set in environment variables
2. Check netlify.toml has correct pnpm configuration
3. Use @netlify/plugin-nextjs plugin
```

**Issue: "Node version mismatch"**
```
Solution:
1. Set NODE_VERSION=22 in environment variables
2. Update netlify.toml with correct version
3. Clear cache and redeploy:
   - Site Settings → Build & Deploy → Clear cache
```

**Issue: "Out of memory during build"**
```
Solution:
1. Upgrade to higher Netlify plan (if needed)
2. Optimize build:
   - Remove unused dependencies
   - Split large components
   - Enable incremental builds
```

### Deployment Issues

**Issue: "Site shows 404 after deployment"**
```
Solution:
1. Verify publish directory is ".next"
2. Check that build command completed successfully
3. Review build logs for errors
4. Ensure all required files are in repository
```

**Issue: "Environment variables not working"**
```
Solution:
1. Check variable names have NEXT_PUBLIC_ prefix for client-side
2. Verify variables are set in correct deploy context
3. Trigger a new deploy (variables need rebuild)
4. Check capitalization and spelling
```

### Domain Issues

**Issue: "Domain not resolving"**
```
Solution:
1. Check DNS records are correct
2. Wait for DNS propagation (up to 48 hours)
3. Use DNS checker: https://dnschecker.org/
4. Verify nameservers if using Netlify DNS
```

**Issue: "SSL certificate not provisioning"**
```
Solution:
1. Verify domain ownership
2. Check DNS records point to Netlify
3. Wait 24 hours for Let's Encrypt validation
4. Try manual certificate provisioning
5. Check for CAA records blocking Let's Encrypt
```

### Performance Issues

**Issue: "Slow site load times"**
```
Solution:
1. Enable Netlify CDN (automatic)
2. Check image optimization settings
3. Review bundle size: pnpm build (check output)
4. Enable asset compression in netlify.toml
5. Use Lighthouse CI for detailed analysis
```

**Issue: "High bandwidth usage"**
```
Solution:
1. Implement proper caching headers (in netlify.toml)
2. Optimize images (use Next/Image component)
3. Enable Netlify asset optimization
4. Consider lazy loading for heavy components
```

## Additional Resources

### Documentation
- [Netlify Docs](https://docs.netlify.com/)
- [Next.js on Netlify](https://docs.netlify.com/integrations/frameworks/next-js/)
- [Netlify CLI Docs](https://cli.netlify.com/)

### Support Channels
- Netlify Community Forums: https://answers.netlify.com/
- Netlify Support: support@netlify.com (paid plans)
- GitHub Issues: For code-related issues

### Useful Commands

```bash
# Check site status
netlify status

# View site in browser
netlify open

# View build logs
netlify logs

# Run local Netlify dev environment
netlify dev

# Link existing site to local repo
netlify link

# Unlink site
netlify unlink
```

## Next Steps

After successful deployment:

1. ✅ Verify all pages load correctly
2. ✅ Test forms and interactive features
3. ✅ Run Lighthouse audit
4. ✅ Set up monitoring and analytics
5. ✅ Configure error tracking
6. ✅ Test on multiple devices
7. ✅ Submit sitemap to search engines
8. ✅ Set up uptime monitoring

For database and authentication needs, see [SUPABASE.md](./SUPABASE.md) for Supabase integration.

---

**Last Updated:** 2025-01-02  
**Maintained by:** ACES Aerodynamics Development Team
