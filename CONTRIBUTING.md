# Contributing to App Example Template

Thank you for contributing to the App Example template! This is the **starter template** for new apps in the monorepo.

## Quick Links

- **Root Contributing Guide**: [../../CONTRIBUTING.md](../../CONTRIBUTING.md)
- **App Documentation**: [CLAUDE.md](CLAUDE.md)
- **Production URL**: https://example.forgefx.dev

## Getting Started

```bash
# From monorepo root
pnpm install
pnpm dev --filter=example

# Or from this directory
pnpm dev
```

**Dev Server**: http://localhost:4078

## Template Guidelines

### Purpose

This app serves as the **canonical template** for creating new apps. Changes here affect every new app created from this template.

### What to Include

- Minimal, clean code patterns
- Best practices for React + TypeScript + Vite
- shadcn/ui component examples
- Dark mode support
- Mobile-first responsive design
- System health status indicator

### What NOT to Include

- App-specific business logic
- Heavy dependencies
- Complex state management (start simple)
- API integrations (add as needed per app)

### Tech Stack

- React 18 + TypeScript 5.5
- Vite 5.3 (port 4078)
- Tailwind CSS 3.4
- shadcn/ui components
- React Router v6
- next-themes for dark mode

### Mobile-First Design

- Target iPhone 15 Pro Max (430px viewport)
- Use Tailwind breakpoints: default (mobile), `sm:`, `md:`
- Include safe area insets for iOS
- Hamburger navigation on mobile

### System Health Status

The footer includes health status indicators:

- GitHub CI status
- Vercel deployment status
- Supabase status (when configured)
- Sentry status (when configured)

## Testing

```bash
pnpm test          # Vitest
pnpm typecheck     # TypeScript
pnpm lint          # ESLint
```

## Pull Request Checklist

- [ ] Changes are generic (not app-specific)
- [ ] Mobile responsive design works
- [ ] Dark mode works correctly
- [ ] Health status indicators functional
- [ ] Template documentation updated
- [ ] Minimal dependencies added
