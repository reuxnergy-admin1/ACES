# Complete Deployment Guide — ACES Aerodynamics

This guide provides a comprehensive, step-by-step walkthrough for deploying the ACES Aerodynamics website with full Supabase and Netlify integration.

## Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Deployment Path Selection](#deployment-path-selection)
4. [Step-by-Step Deployment](#step-by-step-deployment)
5. [Post-Deployment](#post-deployment)
6. [Maintenance](#maintenance)

## Overview

### Technology Stack

- **Frontend Framework**: Next.js 15 with React 19
- **Hosting**: Netlify (recommended) or Vercel
- **Database/Backend**: Supabase (PostgreSQL + Auth + Storage)
- **CDN**: Netlify Edge Network
- **Domain**: www.acesaerodynamics.com

### Deployment Architecture

```
┌─────────────────┐
│   Custom Domain │
│ acesaerodynamics│
│      .com       │
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│  Netlify CDN    │
│  (Edge Network) │
└────────┬────────┘
         │
    ┌────┴─────┐
    │          │
    ↓          ↓
┌────────┐  ┌────────┐
│ Next.js│  │Supabase│
│  App   │←→│Backend │
└────────┘  └────────┘
```

### Why This Stack?

**Netlify:**
- Automatic SSL certificates
- Global CDN with edge caching
- Instant rollbacks
- Built-in form handling
- Deploy previews for PRs
- Free tier with generous limits

**Supabase:**
- Open-source PostgreSQL database
- Built-in authentication
- Real-time subscriptions
- File storage with CDN
- Automatic API generation
- Free tier with 500MB database

## Prerequisites

### Required Accounts

- [ ] GitHub account with repository access
- [ ] Netlify account ([netlify.com](https://netlify.com))
- [ ] Supabase account ([supabase.com](https://supabase.com))
- [ ] Domain registrar account (for DNS)

### Required Tools (for local testing)

```bash
# Check Node.js version (22+ required)
node --version

# Install pnpm globally
npm install -g pnpm@10

# Install Netlify CLI (optional but recommended)
npm install -g netlify-cli

# Install Supabase CLI (optional)
npm install -g supabase
```

### Required Knowledge

- Basic Git operations (clone, commit, push)
- Understanding of environment variables
- Basic DNS configuration
- Familiarity with terminal/command line (helpful)

## Deployment Path Selection

Choose your deployment path based on your needs:

### Path A: Full Stack (Recommended)
**Includes:** Netlify + Supabase + Custom Domain  
**Best for:** Complete production deployment with database  
**Time:** ~60 minutes  
**Difficulty:** Moderate

### Path B: Static Hosting Only
**Includes:** Netlify + Custom Domain (no database)  
**Best for:** Basic marketing site without forms/auth  
**Time:** ~30 minutes  
**Difficulty:** Easy

### Path C: Development Setup
**Includes:** Local development with optional Supabase  
**Best for:** Testing and development  
**Time:** ~15 minutes  
**Difficulty:** Easy

This guide covers **Path A** (Full Stack). For other paths, skip relevant sections.

## Step-by-Step Deployment

### Phase 1: Repository Setup (5 minutes)

1. **Clone Repository (if not already done)**

```bash
# Clone the repository
git clone https://github.com/IAmJonoBo/ACES.git
cd ACES

# Install dependencies
pnpm install

# Verify build works locally
pnpm build
```

2. **Review Configuration Files**

Verify these files exist:
- `netlify.toml` - Netlify configuration
- `.env.example` - Environment variables template
- `docs/NETLIFY.md` - Detailed Netlify guide
- `docs/SUPABASE.md` - Detailed Supabase guide

### Phase 2: Supabase Setup (15 minutes)

**Step 1: Create Supabase Project**

1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project" and sign in
3. Click "New Project"
4. Fill in details:
   ```
   Organization: [Your organization]
   Project name: aces-aerodynamics-production
   Database password: [Generate strong password - SAVE THIS]
   Region: [Choose closest to users]
   Pricing plan: Free (or Pro if needed)
   ```
5. Click "Create new project"
6. Wait 2-3 minutes for provisioning

**Step 2: Save Credentials**

1. Go to Project Settings → API
2. Copy and save these values securely:
   ```
   Project URL: https://xxxxxxxxxxxxx.supabase.co
   anon public key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   service_role key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

**Step 3: Create Database Tables**

1. Click "SQL Editor" in sidebar
2. Click "New query"
3. Copy and paste this SQL:

```sql
-- Contact form submissions table
CREATE TABLE IF NOT EXISTS public.contact_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT now(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  company TEXT,
  phone TEXT,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'new',
  CONSTRAINT email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- Enable Row Level Security
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

-- Allow anyone to submit forms
CREATE POLICY "Allow public inserts"
  ON public.contact_submissions
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Only authenticated users can read submissions
CREATE POLICY "Allow authenticated reads"
  ON public.contact_submissions
  FOR SELECT
  TO authenticated
  USING (true);

-- Create index for performance
CREATE INDEX idx_contact_submissions_created_at 
  ON public.contact_submissions(created_at DESC);
```

4. Click "Run" (bottom right)
5. Verify success message

**Step 4: Configure Authentication (Optional)**

If you need user authentication:

1. Click "Authentication" → "Providers"
2. Enable "Email" provider
3. Configure redirect URLs:
   ```
   Site URL: https://www.acesaerodynamics.com
   Redirect URLs:
     - http://localhost:3000/**
     - https://www.acesaerodynamics.com/**
     - https://*.netlify.app/**
   ```
4. Click "Save"

For detailed Supabase setup, see [docs/SUPABASE.md](./SUPABASE.md).

### Phase 3: Netlify Setup (20 minutes)

**Step 1: Create Netlify Account**

1. Go to [netlify.com](https://netlify.com)
2. Click "Sign up" → "Sign up with GitHub"
3. Authorize Netlify to access GitHub
4. Complete profile setup

**Step 2: Connect Repository**

1. Click "Add new site" → "Import an existing project"
2. Click "Deploy with GitHub"
3. Search for and select: `IAmJonoBo/ACES`
4. Configure build settings:
   ```
   Branch to deploy: main
   Base directory: (leave empty)
   Build command: pnpm build
   Publish directory: .next
   ```
5. Click "Show advanced"

**Step 3: Add Environment Variables**

Click "Add environment variables" and add these:

**Required (if using Supabase):**
```
NEXT_PUBLIC_SUPABASE_URL = https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Build Configuration:**
```
NODE_VERSION = 22
PNPM_VERSION = 9.12.3
```

**Optional (add later if needed):**
```
NEXT_PUBLIC_GA_MEASUREMENT_ID = G-XXXXXXXXXX
SENTRY_DSN = https://xxxxx@xxxxx.ingest.sentry.io/xxxxx
```

**Step 4: Deploy Site**

1. Click "Deploy [site-name]"
2. Wait for build (2-5 minutes)
3. Watch build log for errors
4. Note temporary URL: `random-name-12345.netlify.app`
5. Click the URL to verify deployment

**Step 5: Configure Site Settings**

1. Go to Site Settings → General
2. Change site name:
   ```
   Site name: aces-aerodynamics
   Your site will be: aces-aerodynamics.netlify.app
   ```
3. Click "Save"

For detailed Netlify setup, see [docs/NETLIFY.md](./NETLIFY.md).

### Phase 4: Domain Configuration (15 minutes)

**Step 1: Add Custom Domain in Netlify**

1. Go to Site Settings → Domain management
2. Click "Add custom domain"
3. Enter: `www.acesaerodynamics.com`
4. Click "Verify"
5. Click "Add domain"

**Step 2: Add Domain Redirect**

1. Click "Add domain alias"
2. Enter: `acesaerodynamics.com`
3. Click "Add domain"
4. This will redirect non-www to www

**Step 3: Configure DNS**

**Option A: Use Netlify DNS (Recommended)**

1. In Domain Management, click "Set up Netlify DNS"
2. Note the nameservers:
   ```
   dns1.p01.nsone.net
   dns2.p01.nsone.net
   dns3.p01.nsone.net
   dns4.p01.nsone.net
   ```
3. Go to your domain registrar (GoDaddy, Namecheap, etc.)
4. Find "Nameservers" or "DNS Settings"
5. Change from default to custom nameservers
6. Enter the Netlify nameservers
7. Save changes
8. Return to Netlify and click "Verify DNS configuration"

**Option B: Use External DNS**

1. Go to your domain registrar's DNS settings
2. Add these records:

For `www.acesaerodynamics.com`:
```
Type: CNAME
Name: www
Value: aces-aerodynamics.netlify.app
TTL: 3600
```

For root domain `acesaerodynamics.com`:
```
Type: A
Name: @
Value: 75.2.60.5
TTL: 3600
```

3. Save DNS changes

**Step 4: Wait for DNS Propagation**

- DNS changes can take 24-48 hours to propagate
- Check status: https://dnschecker.org/
- Netlify will automatically provision SSL certificate

**Step 5: Enable HTTPS**

1. Go to Domain Settings → HTTPS
2. Wait for SSL certificate (automatic via Let's Encrypt)
3. Once active, enable "Force HTTPS"
4. Optionally enable "HSTS" for added security

### Phase 5: Integration Testing (10 minutes)

**Test Basic Functionality:**

```bash
# Test site loads
curl -I https://www.acesaerodynamics.com

# Check for SSL
curl -I https://www.acesaerodynamics.com | grep -i "strict-transport"

# Check specific pages
curl -I https://www.acesaerodynamics.com/about/
curl -I https://www.acesaerodynamics.com/products/
curl -I https://www.acesaerodynamics.com/contact/
```

**Test in Browser:**

1. Open https://www.acesaerodynamics.com
2. Check homepage loads correctly
3. Test navigation menu
4. Test all page links
5. Test mobile menu
6. Submit contact form (if implemented)
7. Check console for errors (F12 → Console)

**Test on Multiple Devices:**

- [ ] Desktop (Chrome, Firefox, Safari, Edge)
- [ ] Mobile (iOS Safari, Android Chrome)
- [ ] Tablet (iPad, Android tablet)

**Run Lighthouse Audit:**

```bash
# From project directory
pnpm lh:ci

# Or use Chrome DevTools:
# F12 → Lighthouse → Generate report
```

Target scores:
- Performance: ≥90
- Accessibility: ≥95
- Best Practices: ≥95
- SEO: ≥95

### Phase 6: Monitoring Setup (10 minutes)

**Setup Error Tracking (Optional but Recommended)**

1. **Create Sentry Account**
   - Go to [sentry.io](https://sentry.io)
   - Sign up and create project
   - Select "Next.js"
   - Copy DSN

2. **Add to Netlify**
   ```bash
   netlify env:set SENTRY_DSN "https://xxxxx@xxxxx.ingest.sentry.io/xxxxx"
   netlify env:set NEXT_PUBLIC_SENTRY_DSN "https://xxxxx@xxxxx.ingest.sentry.io/xxxxx"
   ```

3. **Redeploy to apply**
   - Netlify Dashboard → Deploys → Trigger deploy

**Setup Analytics (Optional)**

1. **Google Analytics 4**
   - Create GA4 property
   - Copy Measurement ID
   - Add to Netlify:
     ```bash
     netlify env:set NEXT_PUBLIC_GA_MEASUREMENT_ID "G-XXXXXXXXXX"
     ```

2. **Or use Netlify Analytics**
   - Site Settings → Analytics
   - Enable Analytics ($9/month)

**Setup Uptime Monitoring**

1. **UptimeRobot (Free)**
   - Go to [uptimerobot.com](https://uptimerobot.com)
   - Add monitor: https://www.acesaerodynamics.com
   - Set check interval: 5 minutes
   - Add email alerts

## Post-Deployment

### Immediate Tasks (Day 1)

**Security Verification:**
- [ ] Test HTTPS is enforced
- [ ] Check security headers: https://securityheaders.com/
- [ ] Verify CSP doesn't block required resources
- [ ] Test form submissions work
- [ ] Check for console errors

**SEO Setup:**
- [ ] Submit sitemap to Google Search Console
- [ ] Submit sitemap to Bing Webmaster Tools
- [ ] Verify meta tags in source code
- [ ] Test social media previews
- [ ] Request indexing for homepage

**Documentation:**
- [ ] Document environment variables
- [ ] Update team on deployment
- [ ] Share admin credentials (securely)
- [ ] Create runbook for common issues

### Week 1 Tasks

**Monitoring:**
- [ ] Review error logs daily
- [ ] Monitor uptime reports
- [ ] Check analytics data
- [ ] Review form submissions
- [ ] Monitor performance metrics

**Optimization:**
- [ ] Review Lighthouse reports
- [ ] Optimize any slow pages
- [ ] Check image loading
- [ ] Test on various devices
- [ ] Gather user feedback

**SEO:**
- [ ] Verify indexing status
- [ ] Check search appearance
- [ ] Monitor crawl errors
- [ ] Review analytics traffic sources
- [ ] Adjust meta descriptions if needed

### Month 1 Tasks

**Maintenance:**
- [ ] Update dependencies: `pnpm update`
- [ ] Security audit: `pnpm audit`
- [ ] Review error trends
- [ ] Backup database (if using Supabase)
- [ ] Review and optimize queries

**Content:**
- [ ] Update any placeholder content
- [ ] Add new products/services
- [ ] Publish blog posts (if applicable)
- [ ] Update testimonials
- [ ] Refresh images if needed

## Maintenance

### Weekly Tasks

```bash
# Review deployment status
netlify status

# Check for security advisories
pnpm audit

# Review analytics
# Visit Netlify/Google Analytics dashboard
```

### Monthly Tasks

```bash
# Update dependencies
pnpm update

# Run full test suite
pnpm lint
pnpm build
pnpm test:e2e

# Run Lighthouse audit
pnpm lh:ci

# Check for outdated packages
pnpm outdated
```

### Quarterly Tasks

- Comprehensive security review
- Performance optimization pass
- Accessibility audit
- Content strategy review
- SEO performance analysis
- User experience testing
- Backup verification

### Updating the Site

**For content changes:**
```bash
# Make changes locally
git add .
git commit -m "Update content"
git push origin main

# Netlify automatically deploys
# View progress: Netlify Dashboard → Deploys
```

**For dependency updates:**
```bash
# Update dependencies
pnpm update

# Test locally
pnpm build
pnpm start

# Commit and push
git add package.json pnpm-lock.yaml
git commit -m "Update dependencies"
git push origin main
```

**For database changes:**
```bash
# Use Supabase Dashboard → SQL Editor
# Or use migration files with Supabase CLI
supabase migration new your_migration_name
# Edit migration file, then apply:
supabase db push
```

### Emergency Procedures

**Site is down:**
```bash
# Check Netlify status
netlify status

# View recent deploys
netlify deploy:list

# Rollback to previous deploy
# Netlify Dashboard → Deploys → [...] → Publish deploy
```

**Database issues:**
```bash
# Check Supabase project status
# Dashboard → Project Settings → General

# If paused (free tier), restore from backup
# Dashboard → Database → Backups
```

**Domain issues:**
```bash
# Check DNS propagation
# https://dnschecker.org/

# Verify SSL certificate
curl -vI https://www.acesaerodynamics.com 2>&1 | grep -i "SSL"

# Contact Netlify support if needed
# support@netlify.com
```

## Success Checklist

Your deployment is complete when:

- [x] Site loads at www.acesaerodynamics.com
- [x] HTTPS is enforced and working
- [x] All pages are accessible
- [x] Forms submit successfully (if applicable)
- [x] Performance scores are ≥90
- [x] Security headers are present
- [x] Mobile responsive design works
- [x] Search engines can crawl site
- [x] Monitoring and alerts configured
- [x] Team has access and documentation

## Getting Help

### Documentation
- This project: See `README.md`, `README-OPS.md`, `HANDOVER.md`
- Netlify: [docs/NETLIFY.md](./NETLIFY.md)
- Supabase: [docs/SUPABASE.md](./SUPABASE.md)

### Support Channels
- **Netlify Support**: https://answers.netlify.com/
- **Supabase Support**: https://discord.supabase.com/
- **Next.js Docs**: https://nextjs.org/docs

### Emergency Contacts
- Development Team: [your-team@example.com]
- ACES Business: info@acesaerodynamics.com
- Netlify Support: support@netlify.com (paid plans)

---

**Document Version:** 1.0  
**Last Updated:** 2025-01-02  
**Next Review:** After first successful deployment

## Appendix

### Useful Commands

```bash
# Netlify CLI
netlify login                    # Login to Netlify
netlify link                     # Link local repo to site
netlify dev                      # Run local dev server
netlify deploy                   # Deploy to preview
netlify deploy --prod            # Deploy to production
netlify open                     # Open site in browser
netlify env:list                 # List environment variables
netlify logs                     # View site logs

# Supabase CLI
supabase login                   # Login to Supabase
supabase link                    # Link to project
supabase db pull                 # Pull database schema
supabase db push                 # Push migrations
supabase gen types typescript    # Generate TypeScript types

# Project Scripts
pnpm dev                         # Run development server
pnpm build                       # Build for production
pnpm start                       # Start production server
pnpm lint                        # Lint code
pnpm test:e2e                    # Run E2E tests
pnpm lh:ci                       # Run Lighthouse audit
```

### Environment Variables Reference

See `.env.example` for complete list with descriptions.

### Troubleshooting Links
- [Netlify Troubleshooting](./NETLIFY.md#troubleshooting)
- [Supabase Troubleshooting](./SUPABASE.md#troubleshooting)
- [General Operations](../README-OPS.md)
