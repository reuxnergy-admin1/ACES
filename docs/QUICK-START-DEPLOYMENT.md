# Quick Start Deployment — 30 Minute Guide

Get your ACES Aerodynamics website live in 30 minutes with this streamlined guide.

## Prerequisites (5 minutes)

- [ ] GitHub account with repository access
- [ ] Netlify account ([sign up free](https://netlify.com))
- [ ] Optional: Supabase account ([sign up free](https://supabase.com)) if you need forms/database

## Option A: Static Site Only (20 minutes)

Perfect for marketing site without forms or backend.

### Step 1: Deploy to Netlify (10 minutes)

1. **Connect Repository**
   - Go to [netlify.com](https://netlify.com)
   - Click "Add new site" → "Import an existing project"
   - Choose "Deploy with GitHub"
   - Select repository: `IAmJonoBo/ACES`

2. **Configure Build**
   ```
   Build command: pnpm build
   Publish directory: .next
   Branch: main
   ```

3. **Set Environment Variables**
   ```
   NODE_VERSION = 22
   PNPM_VERSION = 9.12.3
   ```

4. **Deploy**
   - Click "Deploy site"
   - Wait 2-5 minutes
   - Your site is live at: `[random-name].netlify.app`

### Step 2: Add Custom Domain (10 minutes)

1. **Add Domain in Netlify**
   - Site Settings → Domain management
   - Add custom domain: `www.acesaerodynamics.com`

2. **Configure DNS**
   
   **Option A: Netlify DNS (Easiest)**
   - Use Netlify nameservers in your domain registrar
   - Netlify handles everything automatically
   
   **Option B: External DNS**
   Add these records at your domain registrar:
   ```
   Type: CNAME
   Name: www
   Value: [your-site].netlify.app
   
   Type: A
   Name: @
   Value: 75.2.60.5
   ```

3. **Enable HTTPS**
   - Automatic via Let's Encrypt (wait ~10 minutes)
   - Enable "Force HTTPS" when ready

### Done! Your site is live at www.acesaerodynamics.com

---

## Option B: Full Stack with Database (30 minutes)

Includes contact forms, database, and optional authentication.

### Step 1: Setup Supabase (10 minutes)

1. **Create Project**
   - Go to [supabase.com](https://supabase.com)
   - Click "New Project"
   - Name: `aces-aerodynamics-production`
   - Generate password (save it!)
   - Choose region closest to users
   - Wait 2-3 minutes

2. **Save Credentials**
   - Go to Project Settings → API
   - Copy these (you'll need them soon):
     - Project URL
     - anon (public) key
     - service_role key (keep secret!)

3. **Create Contact Form Table**
   - Click "SQL Editor" → "New query"
   - Paste and run:
   ```sql
   CREATE TABLE contact_submissions (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     created_at TIMESTAMPTZ DEFAULT now(),
     name TEXT NOT NULL,
     email TEXT NOT NULL,
     message TEXT NOT NULL,
     status TEXT DEFAULT 'new'
   );
   
   ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;
   
   CREATE POLICY "Allow public inserts"
     ON contact_submissions FOR INSERT
     TO public WITH CHECK (true);
   ```

### Step 2: Deploy to Netlify (15 minutes)

Follow Option A steps 1-2, but add these environment variables:

```
NODE_VERSION = 22
PNPM_VERSION = 9.12.3
NEXT_PUBLIC_SUPABASE_URL = [your-project-url]
NEXT_PUBLIC_SUPABASE_ANON_KEY = [your-anon-key]
SUPABASE_SERVICE_ROLE_KEY = [your-service-key]
```

### Step 3: Custom Domain (5 minutes)

Follow Option A Step 2.

### Done! Your site is live with backend capabilities

---

## Post-Deployment Checklist

**Immediate (5 minutes):**
- [ ] Test site loads: https://www.acesaerodynamics.com
- [ ] Check HTTPS is enabled
- [ ] Test all navigation links
- [ ] Test on mobile device
- [ ] Check for console errors (F12)

**Day 1:**
- [ ] Submit sitemap to Google Search Console
- [ ] Set up uptime monitoring (UptimeRobot is free)
- [ ] Review Netlify deploy logs
- [ ] Test contact form (if using Supabase)

**Week 1:**
- [ ] Monitor analytics
- [ ] Check error logs
- [ ] Gather user feedback
- [ ] Optimize any slow pages

---

## Troubleshooting

**Build fails:**
- Check build logs in Netlify Dashboard
- Verify environment variables are set correctly
- Ensure pnpm version is specified

**Domain not working:**
- Wait 24-48 hours for DNS propagation
- Check DNS records at [dnschecker.org](https://dnschecker.org)
- Verify nameservers or CNAME records

**SSL not provisioning:**
- Wait up to 24 hours
- Check domain ownership is verified
- Try manual certificate if needed

**Contact form not working:**
- Verify Supabase environment variables
- Check browser console for errors
- Verify RLS policies in Supabase

---

## Next Steps

- **Full Documentation**: [DEPLOYMENT-GUIDE.md](./DEPLOYMENT-GUIDE.md)
- **Netlify Details**: [NETLIFY.md](./NETLIFY.md)
- **Supabase Details**: [SUPABASE.md](./SUPABASE.md)
- **Operations**: [../README-OPS.md](../README-OPS.md)

## Need Help?

- **Netlify Support**: https://answers.netlify.com/
- **Supabase Support**: https://discord.supabase.com/
- **Project Docs**: See README.md and HANDOVER.md

---

**Pro Tips:**
- Enable Netlify deploy notifications in Slack
- Set up error tracking with Sentry
- Use Netlify Analytics for privacy-friendly stats
- Keep your Supabase database password secure
- Test deploy previews before merging to main

Your site is production-ready! 🚀
