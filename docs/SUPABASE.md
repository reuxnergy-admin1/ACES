# Supabase Integration Guide — ACES Aerodynamics

This guide provides comprehensive instructions for integrating Supabase as the backend-as-a-service (BaaS) solution for the ACES Aerodynamics website. Supabase provides PostgreSQL database, authentication, real-time subscriptions, storage, and edge functions.

## Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Initial Setup](#initial-setup)
4. [Database Configuration](#database-configuration)
5. [Authentication Setup](#authentication-setup)
6. [Client Integration](#client-integration)
7. [Example Use Cases](#example-use-cases)
8. [Security Best Practices](#security-best-practices)
9. [Testing and Development](#testing-and-development)
10. [Deployment](#deployment)
11. [Troubleshooting](#troubleshooting)

## Overview

### What is Supabase?

Supabase is an open-source Firebase alternative providing:
- **PostgreSQL Database**: Powerful relational database with full SQL support
- **Authentication**: Built-in user authentication and authorization
- **Realtime**: Subscribe to database changes in real-time
- **Storage**: File storage with CDN integration
- **Edge Functions**: Serverless functions for custom backend logic
- **Row Level Security (RLS)**: Database-level access control

### When to Use Supabase

Consider Supabase for:
- **Contact Forms**: Store form submissions in a database
- **User Authentication**: Secure sign-in for customer portal or admin area
- **Content Management**: Store and manage blog posts, products, or testimonials
- **File Uploads**: Handle document uploads (specs, orders, etc.)
- **Real-time Features**: Live chat, notifications, or collaborative features
- **Custom Orders**: Track and manage customer orders and quotes

## Prerequisites

- Supabase account (free tier available at [supabase.com](https://supabase.com))
- Node.js 22+ installed
- pnpm 9.12.3+ installed
- Basic understanding of SQL (helpful but not required)
- Deployed or local Next.js application

## Initial Setup

### Step 1: Create Supabase Project

1. **Sign Up / Sign In**
   ```
   a. Go to https://supabase.com
   b. Click "Start your project"
   c. Sign in with GitHub (recommended) or email
   ```

2. **Create New Project**
   ```
   a. Click "New Project"
   b. Select your organization (or create one)
   c. Fill in project details:
      - Project name: aces-aerodynamics-production
      - Database password: [generate strong password]
      - Region: Choose closest to your users (e.g., US East, EU West)
      - Pricing plan: Free (upgrade as needed)
   d. Click "Create new project"
   e. Wait 2-3 minutes for provisioning
   ```

3. **Note Your Credentials**
   
   Once created, save these from Project Settings → API:
   ```
   Project URL: https://xxxxxxxxxxxxx.supabase.co
   Anon (public) key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   Service role key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```
   
   ⚠️ **Security Note**: 
   - Anon key: Safe for client-side use
   - Service role key: Server-side only, never expose to client

### Step 2: Install Supabase Client

```bash
cd /home/runner/work/ACES/ACES

# Install Supabase JavaScript client
pnpm add @supabase/supabase-js

# Install types (if using TypeScript)
pnpm add -D @supabase/supabase-js
```

### Step 3: Configure Environment Variables

1. **Create Environment Files**

Create `.env.local` for local development:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Server-side only (for API routes and server components)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Optional: Database Direct Connection (for migrations)
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.xxxxxxxxxxxxx.supabase.co:5432/postgres
```

2. **Add to Netlify/Vercel**

For production, add these to your hosting platform:

**Netlify:**
```bash
netlify env:set NEXT_PUBLIC_SUPABASE_URL "https://xxxxxxxxxxxxx.supabase.co"
netlify env:set NEXT_PUBLIC_SUPABASE_ANON_KEY "eyJhbG..."
netlify env:set SUPABASE_SERVICE_ROLE_KEY "eyJhbG..." --secret
```

**Vercel:**
```bash
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add SUPABASE_SERVICE_ROLE_KEY
```

3. **Update .gitignore**

Ensure `.env.local` is in `.gitignore` (already configured in this project).

## Database Configuration

### Creating Tables

#### Option A: Using Supabase Dashboard (Recommended for Beginners)

1. **Navigate to Table Editor**
   ```
   a. Open Supabase Dashboard
   b. Click "Table Editor" in sidebar
   c. Click "Create a new table"
   ```

2. **Create Contact Form Table Example**
   ```
   Table name: contact_submissions
   
   Columns:
   - id (uuid, primary key, auto-generated)
   - created_at (timestamp with timezone, default: now())
   - name (text, required)
   - email (text, required)
   - company (text, optional)
   - phone (text, optional)
   - message (text, required)
   - status (text, default: 'new')
   
   Enable RLS: ✓ (checked)
   ```

3. **Set Up Row Level Security (RLS)**
   ```sql
   -- Allow anyone to insert (submit contact form)
   CREATE POLICY "Allow public inserts"
   ON contact_submissions
   FOR INSERT
   TO public
   WITH CHECK (true);
   
   -- Only authenticated admins can view
   CREATE POLICY "Allow authenticated reads"
   ON contact_submissions
   FOR SELECT
   TO authenticated
   USING (true);
   ```

#### Option B: Using SQL Editor

1. **Navigate to SQL Editor**
   ```
   a. Open Supabase Dashboard
   b. Click "SQL Editor" in sidebar
   c. Click "New query"
   ```

2. **Run SQL Script**

```sql
-- Create contact submissions table
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

-- Create policies
CREATE POLICY "Allow public inserts"
  ON public.contact_submissions
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Allow authenticated reads"
  ON public.contact_submissions
  FOR SELECT
  TO authenticated
  USING (true);

-- Create index for better query performance
CREATE INDEX idx_contact_submissions_created_at 
  ON public.contact_submissions(created_at DESC);

-- Add comment for documentation
COMMENT ON TABLE public.contact_submissions IS 
  'Stores contact form submissions from the website';
```

### Example Database Schema

Here's a comprehensive schema for common ACES use cases:

```sql
-- ===================================
-- PRODUCTS TABLE
-- ===================================
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  specifications JSONB,
  price_range TEXT,
  category TEXT,
  image_url TEXT,
  is_active BOOLEAN DEFAULT true
);

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Products are viewable by everyone"
  ON public.products FOR SELECT
  TO public
  USING (is_active = true);

-- ===================================
-- QUOTE REQUESTS TABLE
-- ===================================
CREATE TABLE IF NOT EXISTS public.quote_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT now(),
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  company_name TEXT,
  phone TEXT,
  product_id UUID REFERENCES public.products(id),
  requirements TEXT,
  quantity INTEGER,
  timeline TEXT,
  status TEXT DEFAULT 'pending',
  notes TEXT
);

ALTER TABLE public.quote_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public quote submissions"
  ON public.quote_requests FOR INSERT
  TO public
  WITH CHECK (true);

-- ===================================
-- BLOG POSTS TABLE (if adding CMS)
-- ===================================
CREATE TABLE IF NOT EXISTS public.blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT,
  author TEXT,
  cover_image_url TEXT,
  published BOOLEAN DEFAULT false,
  published_at TIMESTAMPTZ,
  tags TEXT[]
);

ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Published posts are viewable by everyone"
  ON public.blog_posts FOR SELECT
  TO public
  USING (published = true);

-- ===================================
-- NEWSLETTER SUBSCRIPTIONS
-- ===================================
CREATE TABLE IF NOT EXISTS public.newsletter_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT now(),
  email TEXT UNIQUE NOT NULL,
  status TEXT DEFAULT 'active',
  subscribed_at TIMESTAMPTZ DEFAULT now(),
  unsubscribed_at TIMESTAMPTZ,
  CONSTRAINT email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

ALTER TABLE public.newsletter_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public newsletter subscriptions"
  ON public.newsletter_subscriptions FOR INSERT
  TO public
  WITH CHECK (true);

-- ===================================
-- HELPER FUNCTIONS
-- ===================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger for products table
CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger for blog_posts table
CREATE TRIGGER update_blog_posts_updated_at
  BEFORE UPDATE ON public.blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

## Authentication Setup

### Step 1: Configure Authentication

1. **Navigate to Authentication Settings**
   ```
   a. Open Supabase Dashboard
   b. Click "Authentication" in sidebar
   c. Click "Providers" tab
   ```

2. **Enable Auth Providers**

**Email/Password (Basic):**
```
- Enable "Email" provider
- Configure email templates (optional)
- Set redirect URLs
```

**OAuth Providers (Optional):**
```
- Google: For Google sign-in
- GitHub: For developer/admin access
- Others: LinkedIn, Twitter, etc.
```

### Step 2: Configure Redirect URLs

Add your application URLs:

```
Site URL: https://www.acesaerodynamics.com
Redirect URLs:
  - http://localhost:3000/**
  - https://www.acesaerodynamics.com/**
  - https://*.netlify.app/**
```

### Step 3: Create Admin Users

```sql
-- In SQL Editor, create an admin user
INSERT INTO auth.users (
  email,
  encrypted_password,
  email_confirmed_at,
  role,
  raw_user_meta_data
) VALUES (
  'admin@acesaerodynamics.com',
  crypt('your-secure-password', gen_salt('bf')),
  now(),
  'authenticated',
  '{"admin": true}'::jsonb
);
```

## Client Integration

### Step 1: Create Supabase Client

Create `lib/supabase/client.ts`:

```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});
```

### Step 2: Create Server-Side Client

Create `lib/supabase/server.ts`:

```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase server environment variables');
}

// Server-side client with elevated privileges
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});
```

### Step 3: Create TypeScript Types

Create `lib/supabase/types.ts`:

```typescript
// Database types for type-safe queries
export type Database = {
  public: {
    Tables: {
      contact_submissions: {
        Row: {
          id: string;
          created_at: string;
          name: string;
          email: string;
          company: string | null;
          phone: string | null;
          message: string;
          status: string;
        };
        Insert: {
          id?: string;
          created_at?: string;
          name: string;
          email: string;
          company?: string | null;
          phone?: string | null;
          message: string;
          status?: string;
        };
        Update: {
          id?: string;
          created_at?: string;
          name?: string;
          email?: string;
          company?: string | null;
          phone?: string | null;
          message?: string;
          status?: string;
        };
      };
      // Add other tables here
    };
  };
};
```

### Step 4: Generate Types Automatically

```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Link your project
supabase link --project-ref xxxxxxxxxxxxx

# Generate TypeScript types
supabase gen types typescript --linked > lib/supabase/database.types.ts
```

## Example Use Cases

### Example 1: Contact Form Submission

Create `app/api/contact/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, company, phone, message } = body;

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Insert into database
    const { data, error } = await supabase
      .from('contact_submissions')
      .insert([
        {
          name,
          email,
          company,
          phone,
          message,
          status: 'new',
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to submit form' },
        { status: 500 }
      );
    }

    // Optional: Send email notification
    // await sendEmailNotification(data);

    return NextResponse.json(
      { message: 'Form submitted successfully', id: data.id },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error processing contact form:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

Update your contact form component:

```typescript
'use client';

import { useState } from 'react';

export function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit form');
      }

      setStatus('success');
      setFormData({ name: '', email: '', company: '', phone: '', message: '' });
    } catch (error) {
      console.error('Error:', error);
      setStatus('error');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Form fields */}
      <input
        type="text"
        placeholder="Name"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        required
      />
      <input
        type="email"
        placeholder="Email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        required
      />
      {/* Add other fields */}
      <button type="submit" disabled={status === 'loading'}>
        {status === 'loading' ? 'Submitting...' : 'Submit'}
      </button>
      {status === 'success' && <p>Thank you! We'll be in touch soon.</p>}
      {status === 'error' && <p>Error submitting form. Please try again.</p>}
    </form>
  );
}
```

### Example 2: Fetch and Display Products

Create `app/products/page.tsx`:

```typescript
import { supabase } from '@/lib/supabase/client';

async function getProducts() {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching products:', error);
    return [];
  }

  return data;
}

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <div>
      <h1>Our Products</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product.id} className="border p-4 rounded">
            <h2>{product.name}</h2>
            <p>{product.description}</p>
            {product.price_range && <p>Price: {product.price_range}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}
```

### Example 3: Real-time Updates

```typescript
'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';

export function RealtimeNotifications() {
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    // Subscribe to new contact submissions
    const channel = supabase
      .channel('contact_submissions_changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'contact_submissions',
        },
        (payload) => {
          console.log('New submission:', payload.new);
          setNotifications((prev) => [payload.new, ...prev]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div>
      <h3>Recent Submissions</h3>
      {notifications.map((notif) => (
        <div key={notif.id}>
          New message from {notif.name}
        </div>
      ))}
    </div>
  );
}
```

## Security Best Practices

### 1. Row Level Security (RLS)

Always enable RLS on tables:

```sql
ALTER TABLE your_table ENABLE ROW LEVEL SECURITY;
```

### 2. Secure API Keys

- ✅ Use `NEXT_PUBLIC_` prefix only for anon key
- ✅ Keep service role key server-side only
- ✅ Never commit keys to Git
- ✅ Rotate keys if compromised

### 3. Input Validation

```typescript
// Validate and sanitize inputs
function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Use Zod or similar for schema validation
import { z } from 'zod';

const contactSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  message: z.string().min(10).max(5000),
});
```

### 4. Rate Limiting

Implement rate limiting for public endpoints:

```typescript
// Simple rate limiting example
const rateLimiter = new Map<string, number>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const lastRequest = rateLimiter.get(ip) || 0;
  
  if (now - lastRequest < 5000) { // 5 second cooldown
    return false;
  }
  
  rateLimiter.set(ip, now);
  return true;
}
```

### 5. CSP Configuration

Update middleware to allow Supabase:

```typescript
// In middleware.ts, update connect-src
const directives: string[] = [
  // ... other directives
  "connect-src 'self' https://*.supabase.co wss://*.supabase.co",
];
```

## Testing and Development

### Local Development

```bash
# Install Supabase CLI
npm install -g supabase

# Start local Supabase (Docker required)
supabase start

# This provides local services:
# - PostgreSQL: localhost:54322
# - API: http://localhost:54321
# - Studio: http://localhost:54323

# Update .env.local for local development
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-local-anon-key
```

### Testing Database Queries

Create `tests/supabase.test.ts`:

```typescript
import { supabase } from '@/lib/supabase/client';

describe('Supabase Integration', () => {
  it('should connect to Supabase', async () => {
    const { data, error } = await supabase
      .from('contact_submissions')
      .select('count');
    
    expect(error).toBeNull();
    expect(data).toBeDefined();
  });

  it('should insert contact submission', async () => {
    const { data, error } = await supabase
      .from('contact_submissions')
      .insert([
        {
          name: 'Test User',
          email: 'test@example.com',
          message: 'Test message',
        },
      ])
      .select()
      .single();

    expect(error).toBeNull();
    expect(data.name).toBe('Test User');
  });
});
```

## Deployment

### Production Checklist

- [ ] Set up production Supabase project
- [ ] Configure environment variables in Netlify/Vercel
- [ ] Enable RLS on all tables
- [ ] Test all database operations
- [ ] Set up monitoring and alerts
- [ ] Configure backup strategy
- [ ] Document database schema
- [ ] Set up admin access

### Monitoring

1. **Supabase Dashboard**
   - Monitor database usage
   - Review slow queries
   - Check API requests
   - Track storage usage

2. **Alerts**
   - Set up email alerts for errors
   - Monitor database performance
   - Track API rate limits

3. **Backups**
   - Supabase provides automatic daily backups (paid plans)
   - Consider additional backup strategies for critical data

## Troubleshooting

### Common Issues

**Issue: "Invalid API key"**
```
Solution:
- Verify environment variables are set correctly
- Check for typos in variable names
- Ensure NEXT_PUBLIC_ prefix for client-side
- Restart dev server after adding variables
```

**Issue: "Row Level Security policy violation"**
```
Solution:
- Check RLS policies are configured correctly
- Verify user authentication status
- Use service role key for admin operations (server-side only)
- Test policies in SQL Editor
```

**Issue: "Connection timeout"**
```
Solution:
- Check Supabase project is not paused (free tier)
- Verify network connectivity
- Check firewall/proxy settings
- Review Supabase status page
```

**Issue: "Type errors with Supabase client"**
```
Solution:
- Regenerate types: supabase gen types typescript
- Install latest @supabase/supabase-js
- Check TypeScript configuration
- Verify database schema matches types
```

## Additional Resources

### Documentation
- [Supabase Docs](https://supabase.com/docs)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Supabase CLI](https://supabase.com/docs/guides/cli)

### Community
- [Supabase Discord](https://discord.supabase.com/)
- [GitHub Discussions](https://github.com/supabase/supabase/discussions)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/supabase)

### Example Projects
- [Next.js + Supabase Starter](https://github.com/supabase/supabase/tree/master/examples/nextjs)
- [Supabase Examples](https://github.com/supabase/supabase/tree/master/examples)

## Next Steps

After successful integration:

1. ✅ Test all database operations
2. ✅ Implement authentication (if needed)
3. ✅ Set up monitoring
4. ✅ Configure backups
5. ✅ Document API endpoints
6. ✅ Train team on Supabase Dashboard
7. ✅ Set up staging environment
8. ✅ Implement error tracking

For deployment configuration, see [NETLIFY.md](./NETLIFY.md) for hosting setup.

---

**Last Updated:** 2025-01-02  
**Maintained by:** ACES Aerodynamics Development Team
