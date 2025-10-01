# Production Deployment Checklist

**Project:** ACES Aerodynamics Website  
**Status:** Alpha - Production Ready  
**Target Domain:** www.acesaerodynamics.com

## Pre-Deployment Assets

### Required Asset Files

The following asset files need to be created before production deployment:

**Favicon Files** (Place in `/public/`)
- [ ] `favicon.ico` (32×32 or 16×16, multi-size ICO)
- [ ] `apple-touch-icon.png` (180×180px, PNG)
- [ ] `android-chrome-192x192.png` (192×192px, PNG)
- [ ] `android-chrome-512x512.png` (512×512px, PNG)

**Social Media Images** (Place in `/public/`)
- [ ] `og-image.png` (1200×630px, PNG or JPG)
  - Used for OpenGraph (Facebook, LinkedIn)
  - Used for Twitter Cards
  - Should include ACES logo and tagline
  - Keep text readable at smaller sizes

**Optional Assets**
- [ ] `favicon-16x16.png` (16×16px)
- [ ] `favicon-32x32.png` (32×32px)
- [ ] Additional OG images for specific pages

### Asset Generation Tools

**Favicon Generator:**
- RealFaviconGenerator: https://realfavicongenerator.net/
- Upload your logo/icon design
- Generate all required sizes

**OG Image Creation:**
- Figma or Canva templates (1200×630px)
- Include ACES logo, tagline, and relevant visuals
- Test on Facebook Sharing Debugger: https://developers.facebook.com/tools/debug/
- Test on Twitter Card Validator: https://cards-dev.twitter.com/validator

## Technical Deployment Checklist

### Code Verification
- [x] ✅ Linting passes (`pnpm lint`)
- [x] ✅ Build succeeds (`pnpm build`)
- [x] ✅ TypeScript compilation succeeds
- [x] ✅ No console errors in production build
- [x] ✅ All routes accessible

### Security & Performance
- [x] ✅ CSP headers configured
- [x] ✅ Security headers in middleware
- [x] ✅ HTTPS will be enforced (via hosting platform)
- [x] ✅ No sensitive data in client code
- [x] ✅ Dependencies audited
- [x] ✅ Performance optimized

### SEO Configuration
- [x] ✅ Metadata complete (`app/layout.tsx`)
- [x] ✅ Sitemap generated (`/sitemap.xml`)
- [x] ✅ Robots.txt configured (`/robots.txt`)
- [x] ✅ OpenGraph tags present
- [x] ✅ Twitter Card tags present
- [ ] ⏳ Search Console verification codes (add when available)
- [ ] ⏳ Bing Webmaster verification (add when available)

### Content Review
- [x] ✅ Business information correct (acesaerodynamics.com)
- [x] ✅ Contact email verified (info@acesaerodynamics.com)
- [x] ✅ Social media links correct
- [ ] ⏳ Final content copywriting review
- [ ] ⏳ Legal pages reviewed by legal team
- [ ] ⏳ All example pages removed or updated

## Deployment Steps (Vercel)

### 1. Pre-Deployment
- [ ] Create Vercel account (if not exists)
- [ ] Install Vercel CLI: `npm i -g vercel`
- [ ] Login: `vercel login`

### 2. Initial Deployment
```bash
# From project root
cd /home/runner/work/ACES/ACES

# Deploy to Vercel
vercel

# Follow prompts:
# - Link to existing project? No (first time)
# - Project name: aces-aerodynamics
# - Directory: ./
# - Override settings? No
```

### 3. Production Deployment
```bash
# Deploy to production
vercel --prod

# Or via GitHub integration:
# - Connect GitHub repository to Vercel
# - Push to main branch
# - Automatic deployment
```

### 4. Domain Configuration
- [ ] Log in to Vercel dashboard
- [ ] Go to Project Settings > Domains
- [ ] Add custom domain: `www.acesaerodynamics.com`
- [ ] Add redirect: `acesaerodynamics.com` → `www.acesaerodynamics.com`
- [ ] Configure DNS records as instructed by Vercel
- [ ] Wait for SSL certificate (automatic)

### 5. Environment Variables (if needed)
```bash
# Via Vercel CLI
vercel env add NEXT_PUBLIC_GA_ID production
vercel env add SENTRY_DSN production

# Or via Vercel Dashboard:
# Settings > Environment Variables
```

## Post-Deployment Verification

### Immediate Checks (First 24 Hours)

**Functionality**
- [ ] Homepage loads correctly
- [ ] All navigation links work
- [ ] Forms submit (or open email client)
- [ ] Images load properly
- [ ] Background animation works
- [ ] Page transitions function
- [ ] Mobile menu works
- [ ] No console errors

**Cross-Browser Testing**
- [ ] Chrome (desktop & mobile)
- [ ] Firefox (desktop & mobile)
- [ ] Safari (desktop & mobile)
- [ ] Edge (desktop)

**Device Testing**
- [ ] Desktop (1920×1080, 1366×768)
- [ ] Tablet (iPad, Android tablet)
- [ ] Mobile (iPhone, Android phone)
- [ ] Small mobile (320px width)

**Performance**
- [ ] Lighthouse audit score ≥90
- [ ] First Load JS ≤150kB
- [ ] LCP ≤2.5s
- [ ] CLS ≤0.1
- [ ] INP ≤200ms

**Security**
- [ ] Security headers present (check: securityheaders.com)
- [ ] HTTPS enforced
- [ ] CSP not blocking required resources
- [ ] No mixed content warnings

**SEO**
- [ ] Meta tags present (view source)
- [ ] OpenGraph tags present
- [ ] Twitter Card preview works
- [ ] Sitemap accessible: `/sitemap.xml`
- [ ] Robots.txt accessible: `/robots.txt`

### Setup External Services

**Google Search Console**
- [ ] Add property: www.acesaerodynamics.com
- [ ] Verify ownership (add meta tag or DNS record)
- [ ] Submit sitemap: `https://www.acesaerodynamics.com/sitemap.xml`
- [ ] Request indexing for homepage

**Bing Webmaster Tools**
- [ ] Add site: www.acesaerodynamics.com
- [ ] Verify ownership
- [ ] Submit sitemap
- [ ] Request indexing

**Analytics** (Optional but Recommended)
- [ ] Google Analytics 4 setup
  - Create property
  - Get measurement ID
  - Add to environment variables
  - Verify tracking works
- [ ] Or Plausible Analytics (privacy-focused)
  - Create account
  - Add script or integrate via environment variable
  - Verify tracking

**Error Tracking** (Recommended)
- [ ] Sentry setup
  - Create project
  - Get DSN
  - Add to environment variables
  - Test error reporting
- [ ] Or alternative service (Rollbar, Bugsnag)

**Uptime Monitoring** (Recommended)
- [ ] UptimeRobot or Pingdom
  - Add monitor: www.acesaerodynamics.com
  - Set check interval: 5 minutes
  - Configure alerts
- [ ] StatusCake or alternative

## Week 1 Post-Launch Tasks

### Monitoring & Optimization
- [ ] Review analytics data
- [ ] Check error logs
- [ ] Monitor performance metrics
- [ ] Review user feedback
- [ ] Check uptime reports

### SEO & Indexing
- [ ] Verify Google indexing status
- [ ] Verify Bing indexing status
- [ ] Check search appearance
- [ ] Monitor search console for issues
- [ ] Review and fix any crawl errors

### Content & UX
- [ ] Gather initial user feedback
- [ ] Review heatmaps (if implemented)
- [ ] Check form submissions
- [ ] Review any contact enquiries
- [ ] Make minor content adjustments as needed

## Ongoing Maintenance

### Weekly Tasks
- [ ] Review analytics
- [ ] Check error reports
- [ ] Monitor uptime
- [ ] Review security advisories

### Monthly Tasks
- [ ] Dependency updates (`pnpm update`)
- [ ] Security audit (`pnpm audit`)
- [ ] Performance audit (`pnpm lh:ci`)
- [ ] Content updates
- [ ] Backup verification

### Quarterly Tasks
- [ ] Comprehensive security review
- [ ] Performance optimization review
- [ ] Accessibility audit
- [ ] Content strategy review
- [ ] SEO performance review

## Emergency Contacts

**Technical Issues:**
- Development Team: [contact info]
- Hosting Support: Vercel Support

**Business Issues:**
- ACES Aerodynamics: info@acesaerodynamics.com
- [Additional contacts as needed]

## Rollback Procedure

If critical issues arise post-deployment:

**Via Vercel Dashboard:**
1. Go to Deployments
2. Find previous working deployment
3. Click "..." menu
4. Select "Promote to Production"

**Via Vercel CLI:**
```bash
vercel rollback
```

**Via Git:**
```bash
git revert <commit-hash>
git push origin main
# Vercel auto-deploys
```

## Success Criteria

The deployment is considered successful when:
- ✅ All pages load without errors
- ✅ Forms function correctly
- ✅ Performance metrics met (Lighthouse ≥90)
- ✅ Security headers verified
- ✅ Cross-browser compatibility confirmed
- ✅ Mobile responsiveness verified
- ✅ Search engines can crawl site
- ✅ Analytics tracking works
- ✅ Monitoring alerts configured

---

**Document Version:** 1.0  
**Last Updated:** 2025-01-01  
**Next Review:** Post-deployment + 7 days
