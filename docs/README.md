# ACES Aerodynamics Documentation

This directory contains comprehensive documentation for deploying, configuring, and maintaining the ACES Aerodynamics website.

## 📚 Documentation Index

### Deployment & Infrastructure

#### 🚀 [Quick Start Deployment](./QUICK-START-DEPLOYMENT.md)
**30-minute streamlined deployment guide**
- Get your site live quickly
- Choose between static-only or full-stack deployment
- Step-by-step with minimal configuration
- Perfect for first-time deployment

#### 📖 [Complete Deployment Guide](./DEPLOYMENT-GUIDE.md)
**Comprehensive end-to-end deployment workflow**
- Full Netlify + Supabase integration
- Domain configuration and SSL setup
- Environment variables and security
- Post-deployment checklist
- Monitoring and maintenance procedures
- ~60 minutes for complete setup

#### 🌐 [Netlify Deployment Guide](./NETLIFY.md)
**Detailed Netlify hosting configuration**
- Netlify account setup
- Build configuration and optimization
- Custom domain and DNS setup
- Continuous deployment from GitHub
- Environment variables management
- Performance optimization
- Troubleshooting common issues

#### 🗄️ [Supabase Integration Guide](./SUPABASE.md)
**Backend-as-a-Service setup with Supabase**
- PostgreSQL database configuration
- Authentication setup
- Row Level Security (RLS) policies
- Real-time subscriptions
- File storage and CDN
- Client integration examples
- API endpoints and security best practices

### Project Information

#### 📋 Project Documentation (Parent Directory)
- **[README.md](../README.md)** — Project overview and quick start
- **[HANDOVER.md](../HANDOVER.md)** — Comprehensive project handover document
- **[README-OPS.md](../README-OPS.md)** — Operations, security, and maintenance
- **[DEPLOYMENT-CHECKLIST.md](../DEPLOYMENT-CHECKLIST.md)** — Pre-deployment verification
- **[AUDIT.md](../AUDIT.md)** — Code audit and quality standards

#### 🎨 Design & Development
- **[UI-UX-PATTERNS.md](../UI-UX-PATTERNS.md)** — Design system and UI patterns
- **[BRAND.md](../BRAND.md)** — Brand guidelines
- **[README-LAYOUT.md](../README-LAYOUT.md)** — Layout system documentation
- **[README-STAGGER.md](../README-STAGGER.md)** — Animation system documentation

## 🎯 Choose Your Path

### For First-Time Deployment
Start here → **[Quick Start Deployment](./QUICK-START-DEPLOYMENT.md)**

### For Complete Setup with Backend
Full workflow → **[Complete Deployment Guide](./DEPLOYMENT-GUIDE.md)**

### For Platform-Specific Details
- Hosting platform: **[Netlify Guide](./NETLIFY.md)**
- Backend services: **[Supabase Guide](./SUPABASE.md)**

### For Development Setup
Development workflow → **[README.md](../README.md)** → Quick Start section

## 📊 Deployment Options Comparison

| Feature | Static Only | Netlify + Supabase |
|---------|-------------|-------------------|
| **Time to Deploy** | ~20 minutes | ~30 minutes |
| **Difficulty** | Easy | Moderate |
| **Cost** | Free | Free (with limits) |
| **Contact Forms** | No | ✅ Yes |
| **User Auth** | No | ✅ Yes |
| **Database** | No | ✅ PostgreSQL |
| **Real-time Features** | No | ✅ Yes |
| **File Storage** | No | ✅ Yes |
| **Best For** | Marketing sites | Full applications |

## 🔧 Technology Stack

- **Frontend**: Next.js 15 + React 19 + TypeScript
- **Styling**: Tailwind CSS 4
- **Hosting**: Netlify (or Vercel)
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Testing**: Playwright + Lighthouse CI
- **CI/CD**: GitHub Actions + Netlify/Vercel

## 📝 Environment Variables

See `.env.example` in the root directory for a complete list of environment variables with descriptions.

Key variables:
- `NEXT_PUBLIC_SUPABASE_URL` — Supabase project URL (public)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Supabase anonymous key (public)
- `SUPABASE_SERVICE_ROLE_KEY` — Supabase service key (secret)
- `NODE_VERSION` — Node.js version (22)
- `PNPM_VERSION` — pnpm version (9.12.3)

## 🛠️ Development Commands

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Run tests
pnpm test:e2e

# Run linting
pnpm lint

# Run Lighthouse audit
pnpm lh:ci
```

## 🔒 Security Considerations

- **Environment Variables**: Never commit `.env.local` to Git
- **API Keys**: Keep service role keys server-side only
- **CSP Headers**: Applied automatically via middleware
- **Row Level Security**: Always enable RLS on Supabase tables
- **HTTPS**: Enforced automatically on Netlify/Vercel
- **Dependencies**: Regularly audit with `pnpm audit`

## 📈 Monitoring & Analytics

### Recommended Tools

**Uptime Monitoring:**
- UptimeRobot (free tier available)
- Pingdom
- StatusCake

**Error Tracking:**
- Sentry (recommended)
- Rollbar
- Bugsnag

**Analytics:**
- Netlify Analytics (privacy-friendly)
- Google Analytics 4
- Plausible Analytics

**Performance:**
- Lighthouse CI (included)
- WebPageTest
- Chrome DevTools

## 🆘 Getting Help

### Documentation
- **Netlify**: [docs.netlify.com](https://docs.netlify.com/)
- **Supabase**: [supabase.com/docs](https://supabase.com/docs)
- **Next.js**: [nextjs.org/docs](https://nextjs.org/docs)

### Community Support
- **Netlify**: [answers.netlify.com](https://answers.netlify.com/)
- **Supabase**: [discord.supabase.com](https://discord.supabase.com/)
- **Next.js**: [github.com/vercel/next.js/discussions](https://github.com/vercel/next.js/discussions)

### Project Contacts
- **Business**: info@acesaerodynamics.com
- **GitHub Issues**: For bug reports and feature requests
- **Pull Requests**: For code contributions

## 📅 Maintenance Schedule

### Daily
- Monitor error logs
- Check uptime reports

### Weekly
- Review analytics
- Check for security advisories
- Test critical paths

### Monthly
- Update dependencies: `pnpm update`
- Run security audit: `pnpm audit`
- Review performance metrics
- Check backup status (Supabase)

### Quarterly
- Comprehensive security review
- Accessibility audit
- Performance optimization
- Content strategy review

## 🎓 Learning Resources

### Next.js
- [Next.js Learn](https://nextjs.org/learn)
- [Next.js Examples](https://github.com/vercel/next.js/tree/canary/examples)

### Supabase
- [Supabase University](https://supabase.com/docs/guides/getting-started)
- [Supabase Examples](https://github.com/supabase/supabase/tree/master/examples)

### Netlify
- [Netlify Blog](https://www.netlify.com/blog/)
- [Jamstack Resources](https://jamstack.org/resources/)

## 📄 License & Contributing

See [CONTRIBUTING.md](../CONTRIBUTING.md) for contribution guidelines.

---

**Documentation Version**: 1.0  
**Last Updated**: 2025-01-02  
**Maintained By**: ACES Aerodynamics Development Team

For questions or improvements to this documentation, please open an issue or pull request on GitHub.
