# Security Best Practices

This document outlines security guidelines for developing applications based on the example template.

## Table of Contents

- [Environment Variables](#environment-variables)
- [API Keys and Secrets](#api-keys-and-secrets)
- [Authentication](#authentication)
- [Data Validation](#data-validation)
- [Dependencies](#dependencies)
- [Common Vulnerabilities](#common-vulnerabilities)
- [Deployment Security](#deployment-security)
- [Security Checklist](#security-checklist)

---

## Environment Variables

### Rules

1. **Always use `.env` for local development secrets**
   - Never commit `.env` to version control
   - `.env` is already in `.gitignore`

2. **Use `.env.example` as template**
   - Contains placeholder values only
   - Documents all required environment variables
   - Safe to commit to version control

3. **Vite environment variable prefix**
   - All client-side env vars **must** start with `VITE_`
   - Example: `VITE_API_URL`, `VITE_APP_NAME`
   - Accessed via `import.meta.env.VITE_*`

### ⚠️ Critical Warning

**DO NOT** put secret API keys in `VITE_` prefixed variables:

```env
# ❌ WRONG - This will be exposed in client-side bundle!
VITE_SECRET_API_KEY=sk-secret-123456

# ✅ CORRECT - Use backend API to proxy requests
VITE_API_URL=https://api.yourapp.com
```

**Why?** All `VITE_` prefixed variables are bundled into your JavaScript and publicly visible in the browser.

### Example: Safe Environment Variables

```env
# .env

# ✅ Safe for client-side (public information)
VITE_APP_NAME=My App
VITE_API_URL=https://api.example.com
VITE_ENABLE_DEBUG=false

# ✅ Backend-only secrets (not prefixed with VITE_)
DATABASE_URL=postgresql://...
SECRET_API_KEY=sk-secret-123456
JWT_SECRET=your-jwt-secret
```

### Accessing Environment Variables

```typescript
// Client-side code
const apiUrl = import.meta.env.VITE_API_URL
const appName = import.meta.env.VITE_APP_NAME

// ❌ This won't work (no VITE_ prefix)
const secret = import.meta.env.SECRET_API_KEY  // undefined
```

---

## API Keys and Secrets

### Storage Options

#### 1. Backend Proxy (Recommended)

Never expose API keys in frontend code. Use a backend API:

```typescript
// ❌ Bad - API key exposed in frontend
const response = await fetch('https://api.service.com/data', {
  headers: {
    'Authorization': `Bearer ${import.meta.env.VITE_API_KEY}`
  }
})

// ✅ Good - API key stored in backend
const response = await fetch('/api/data')  // Your backend handles auth
```

#### 2. Serverless Functions

Use Vercel/Netlify serverless functions for API key storage:

```typescript
// api/data.ts (Vercel serverless function)
export default async function handler(req, res) {
  const apiKey = process.env.SECRET_API_KEY  // Not exposed to client
  const data = await fetch('https://api.service.com/data', {
    headers: { 'Authorization': `Bearer ${apiKey}` }
  })
  res.json(await data.json())
}
```

#### 3. Secrets Management Services

For production applications, use:
- **Doppler** - Secrets sync and rotation
- **AWS Secrets Manager** - Enterprise secrets management
- **HashiCorp Vault** - Self-hosted secrets storage
- **1Password Secrets Automation** - Team-based secrets

### Key Rotation

1. **Generate unique keys per environment**
   - Development keys
   - Staging keys
   - Production keys

2. **Rotate keys regularly**
   - Quarterly for low-risk services
   - Monthly for high-risk services
   - Immediately if compromised

3. **Monitor key usage**
   - Log API key usage
   - Set up alerts for unusual activity
   - Revoke unused keys

---

## Authentication

### Best Practices

1. **Use established authentication libraries**
   ```bash
   # Recommended auth solutions
   npm install @supabase/supabase-js    # Supabase Auth
   npm install @auth0/auth0-react        # Auth0
   npm install firebase                  # Firebase Auth
   ```

2. **Never roll your own crypto**
   - Use bcrypt for password hashing (on backend)
   - Use JWT for tokens (with secure signing)
   - Use HTTPS for all authentication requests

3. **Implement proper session management**
   ```typescript
   // ✅ Good - Secure token storage
   localStorage.setItem('auth_token', token)  // Only for non-sensitive tokens

   // ✅ Better - HTTP-only cookies (backend managed)
   // Set via backend: Set-Cookie: token=...; HttpOnly; Secure; SameSite=Strict
   ```

4. **Add CSRF protection**
   - Use CSRF tokens for state-changing operations
   - Implement SameSite cookie attribute
   - Validate origin headers

### Example: Secure Authentication Flow

```typescript
// src/lib/auth.ts
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY  // Safe: public anon key
)

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })

  if (error) throw error
  return data
}

export async function signOut() {
  await supabase.auth.signOut()
}

export function getCurrentUser() {
  return supabase.auth.getUser()
}
```

---

## Data Validation

### Input Validation

**Always validate user input on both client and server:**

```typescript
// ✅ Good - Validation with Zod
import { z } from 'zod'

const userSchema = z.object({
  email: z.string().email(),
  age: z.number().min(18).max(120),
  username: z.string().min(3).max(20).regex(/^[a-zA-Z0-9_]+$/)
})

function handleSubmit(data: unknown) {
  try {
    const validated = userSchema.parse(data)
    // Use validated data
  } catch (error) {
    // Handle validation errors
  }
}
```

### XSS Prevention

1. **React's default XSS protection**
   - React escapes content by default
   - Avoid `dangerouslySetInnerHTML`

   ```tsx
   // ✅ Safe - React escapes automatically
   <div>{userInput}</div>

   // ⚠️ Dangerous - Only use with sanitized HTML
   <div dangerouslySetInnerHTML={{ __html: sanitizedHTML }} />
   ```

2. **Sanitize HTML if needed**
   ```bash
   npm install dompurify
   ```

   ```typescript
   import DOMPurify from 'dompurify'

   const sanitized = DOMPurify.sanitize(userHTML)
   ```

### SQL Injection Prevention

**Never build SQL queries with string concatenation:**

```typescript
// ❌ Bad - SQL injection vulnerability
const query = `SELECT * FROM users WHERE id = ${userId}`

// ✅ Good - Parameterized queries (Supabase example)
const { data } = await supabase
  .from('users')
  .select()
  .eq('id', userId)
```

---

## Dependencies

### Package Security

1. **Audit dependencies regularly**
   ```bash
   npm audit                    # Check for vulnerabilities
   npm audit fix                # Auto-fix vulnerabilities
   npm audit fix --force        # Force major version updates
   ```

2. **Keep dependencies updated**
   ```bash
   npm outdated                 # Check outdated packages
   npm update                   # Update to latest minor/patch
   npx npm-check-updates -u     # Update to latest major versions
   ```

3. **Review before installing**
   - Check package downloads (popular = more vetted)
   - Check last update date (recent = maintained)
   - Check GitHub stars and issues
   - Review package permissions

4. **Use lock files**
   - Commit `package-lock.json`
   - Ensures reproducible builds
   - Prevents supply chain attacks

### Recommended Security Tools

```bash
# Snyk - Vulnerability scanning
npm install -g snyk
snyk test

# npm-audit-resolver - Interactive audit fixing
npm install -g npm-audit-resolver
npm-audit-resolver

# Dependency-cruiser - Detect circular dependencies
npm install -D dependency-cruiser
```

---

## Common Vulnerabilities

### 1. Cross-Site Scripting (XSS)

**Prevention:**
- Use React's default escaping
- Validate and sanitize user input
- Set Content Security Policy headers

```tsx
// ✅ Safe
<div>{userComment}</div>

// ⚠️ Only if sanitized
<div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(html) }} />
```

### 2. Cross-Site Request Forgery (CSRF)

**Prevention:**
- Use CSRF tokens
- Implement SameSite cookies
- Verify Origin/Referer headers

```typescript
// Backend: Generate CSRF token
const csrfToken = crypto.randomBytes(32).toString('hex')

// Frontend: Include in requests
fetch('/api/action', {
  method: 'POST',
  headers: {
    'X-CSRF-Token': csrfToken
  }
})
```

### 3. Sensitive Data Exposure

**Prevention:**
- Never log sensitive data
- Remove sensitive data from error messages
- Use HTTPS everywhere

```typescript
// ❌ Bad - Logs sensitive data
console.log('User data:', { email, password })

// ✅ Good - Omit sensitive fields
console.log('User data:', { email, passwordLength: password.length })
```

### 4. Broken Access Control

**Prevention:**
- Implement proper authorization
- Verify permissions on backend
- Don't trust client-side checks

```typescript
// ❌ Bad - Client-side only check
if (user.isAdmin) {
  // Show admin panel
}

// ✅ Good - Backend verification
const response = await fetch('/api/admin/action')
if (response.status === 403) {
  // User not authorized
}
```

---

## Deployment Security

### Production Checklist

- [ ] Remove all console.log statements
- [ ] Enable HTTPS/TLS
- [ ] Set security headers (CSP, HSTS, X-Frame-Options)
- [ ] Configure CORS properly
- [ ] Use environment-specific configs
- [ ] Enable rate limiting
- [ ] Set up monitoring and alerts
- [ ] Implement error tracking (Sentry)
- [ ] Regular backups
- [ ] Disaster recovery plan

### Security Headers

Configure in your deployment platform or backend:

```typescript
// Example security headers (backend/serverless function)
res.setHeader('X-Frame-Options', 'DENY')
res.setHeader('X-Content-Type-Options', 'nosniff')
res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin')
res.setHeader('Permissions-Policy', 'geolocation=(), microphone=()')
res.setHeader(
  'Content-Security-Policy',
  "default-src 'self'; script-src 'self' 'unsafe-inline'"
)
```

### Vercel Deployment (Example)

```json
// vercel.json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        }
      ]
    }
  ]
}
```

---

## Security Checklist

### Development Phase

- [ ] Use `.env` for local secrets (never commit)
- [ ] Create `.env.example` with placeholders
- [ ] Prefix client variables with `VITE_`
- [ ] Never expose API keys in frontend
- [ ] Use TypeScript strict mode
- [ ] Validate all user input
- [ ] Implement proper authentication
- [ ] Use HTTPS for all API requests

### Pre-Deployment

- [ ] Run `npm audit` and fix vulnerabilities
- [ ] Remove development/debug code
- [ ] Test with production environment variables
- [ ] Review all third-party scripts
- [ ] Enable production error tracking
- [ ] Configure security headers
- [ ] Set up monitoring and alerts

### Post-Deployment

- [ ] Monitor error logs
- [ ] Track API usage
- [ ] Regular security audits
- [ ] Keep dependencies updated
- [ ] Rotate API keys quarterly
- [ ] Review access logs
- [ ] Test security measures

---

## Additional Resources

### Security Tools

- **OWASP ZAP** - Security testing tool
- **Snyk** - Dependency vulnerability scanning
- **SonarQube** - Code quality and security
- **Burp Suite** - Web security testing

### Documentation

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [MDN Web Security](https://developer.mozilla.org/en-US/docs/Web/Security)
- [React Security Best Practices](https://react.dev/learn/escape-hatches#security)
- [Vite Security](https://vitejs.dev/guide/env-and-mode.html#security-notes)

### Reporting Security Issues

If you discover a security vulnerability in this template:

1. **Do not** open a public GitHub issue
2. Email security concerns to: [your-security-email]
3. Include steps to reproduce
4. Allow time for fix before public disclosure

---

**Last Updated:** November 24, 2025
**Version:** 1.0.0
