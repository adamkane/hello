# App Example Template

A modern, minimalist React + TypeScript starter template for the AppWorks monorepo. Built with Vite, Tailwind CSS, and shadcn/ui for rapid application development.

## Features

- **React 18** - Latest React with concurrent features
- **TypeScript** - Type-safe development with strict mode
- **Vite** - Lightning-fast development and build tooling
- **Tailwind CSS** - Utility-first CSS framework with custom theme
- **shadcn/ui** - High-quality, accessible UI components built on Radix UI
- **React Router v6** - Modern client-side routing
- **Dark Mode** - Built-in theme switching with next-themes
- **Path Aliases** - Clean imports with `@/*` aliases

## Quick Start

```bash
# Navigate to the app directory
cd apps/example

# Install dependencies (from monorepo root)
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:4078`

## Prerequisites

- **Node.js** - Version 22.x or higher
- **npm** - Version 10.x or higher
- **Git** - For version control

## Project Structure

```
example/
├── src/
│   ├── components/          # React components
│   │   ├── ui/             # shadcn/ui components
│   │   ├── SiteHeader.tsx  # Main navigation
│   │   ├── SiteFooter.tsx  # Footer component
│   │   └── ThemeProvider.tsx # Dark mode provider
│   ├── pages/              # Page components
│   │   ├── HomePage.tsx
│   │   ├── AboutPage.tsx
│   │   └── ContactPage.tsx
│   ├── lib/                # Utility functions
│   │   └── utils.ts        # cn() helper and utilities
│   ├── App.tsx             # Main app with routing
│   ├── main.tsx            # Application entry point
│   └── index.css           # Global styles and Tailwind
├── public/                 # Static assets
├── .env.example            # Environment variables template
├── package.json            # Dependencies and scripts
├── tsconfig.json           # TypeScript configuration
├── vite.config.ts          # Vite configuration
├── tailwind.config.js      # Tailwind CSS configuration
├── postcss.config.js       # PostCSS configuration
└── components.json         # shadcn/ui configuration
```

## Available Scripts

### Development
```bash
npm run dev              # Start dev server on port 4078
npm run build            # Build for production
npm run preview          # Preview production build locally
```

### Code Quality (Coming Soon)
```bash
npm run lint             # Run ESLint
npm run format           # Format code with Prettier
npm run typecheck        # Type check without building
npm test                 # Run tests
npm run verify           # Run all quality checks
```

## Environment Variables

Create a `.env` file in the app root (copy from `.env.example`):

```env
# Example environment variables
VITE_APP_NAME=App Example
VITE_API_URL=http://localhost:3000

# Add your project-specific variables here
```

**Important:** Never commit real API keys or secrets to version control. Use `.env` for local development only (already gitignored).

## Adding UI Components

This template uses shadcn/ui. Add new components with:

```bash
# Add a specific component
npx shadcn-ui@latest add dialog

# Add multiple components
npx shadcn-ui@latest add form input label
```

Components will be added to `src/components/ui/` and can be imported like:

```typescript
import { Button } from '@/components/ui/button'
import { Dialog } from '@/components/ui/dialog'
```

## Styling

### Tailwind CSS

Use Tailwind utility classes for styling:

```tsx
<div className="flex items-center gap-4 p-6 bg-background">
  <h1 className="text-4xl font-bold text-foreground">Hello</h1>
</div>
```

### Theme Variables

The theme uses CSS variables defined in `src/index.css`. Customize colors in `tailwind.config.js`:

```javascript
colors: {
  background: 'hsl(var(--background))',
  foreground: 'hsl(var(--foreground))',
  primary: 'hsl(var(--primary))',
  // ... more theme colors
}
```

### Dark Mode

Dark mode is handled by `next-themes`. Toggle with:

```tsx
import { useTheme } from 'next-themes'

function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
      Toggle Theme
    </button>
  )
}
```

## Routing

Routes are defined in `src/App.tsx` using React Router v6:

```tsx
<BrowserRouter>
  <Routes>
    <Route path="/" element={<HomePage />} />
    <Route path="/about" element={<AboutPage />} />
    <Route path="/contact" element={<ContactPage />} />
  </Routes>
</BrowserRouter>
```

Add new routes by creating a page component and adding a route:

```tsx
// src/pages/NewPage.tsx
export default function NewPage() {
  return <div>New Page</div>
}

// src/App.tsx
<Route path="/new" element={<NewPage />} />
```

## Path Aliases

The project uses TypeScript path aliases for cleaner imports:

```typescript
// ✅ Good - with alias
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

// ❌ Avoid - relative paths
import { Button } from '../../components/ui/button'
import { cn } from '../../lib/utils'
```

Aliases are configured in:
- `tsconfig.json` - For TypeScript
- `vite.config.ts` - For Vite resolution

## Customizing the Template

### For a New App

1. **Copy the template:**
   ```bash
   cp -r apps/example apps/my-new-app
   cd apps/my-new-app
   ```

2. **Update `package.json`:**
   ```json
   {
     "name": "my-new-app",
     "version": "0.1.0",
     "scripts": {
       "dev": "vite --port 4080"  // Choose different port
     }
   }
   ```

3. **Update page content:**
   - Edit `src/pages/HomePage.tsx` for your landing page
   - Customize `SiteHeader.tsx` navigation
   - Update `SiteFooter.tsx` branding

4. **Install dependencies:**
   ```bash
   npm install
   npm run dev
   ```

### Common Customizations

**Change Port:**
Edit `package.json`:
```json
"dev": "vite --port 4080"
```

**Add API Integration:**
Create `src/lib/api.ts`:
```typescript
const API_URL = import.meta.env.VITE_API_URL

export async function fetchData() {
  const response = await fetch(`${API_URL}/endpoint`)
  return response.json()
}
```

**Add Authentication:**
1. Install auth library (e.g., Supabase, Auth0)
2. Create `src/lib/auth.ts` for auth logic
3. Wrap App with auth provider
4. Create protected route wrapper component

## Monorepo Integration

This app is part of the AppWorks monorepo and benefits from:

- **Shared TypeScript config** - Consistent type checking
- **Turborepo caching** - Fast builds across packages
- **Workspace dependencies** - Share code between apps
- **Unified tooling** - Common ESLint, Prettier configs

### Using Shared Packages

Reference shared packages from `packages/` (when available):

```json
{
  "dependencies": {
    "@appworks/ui": "workspace:*",
    "@appworks/utils": "workspace:*"
  }
}
```

## Development Guidelines

### Code Style

- Use functional components with hooks
- Prefer `const` over `let`
- Use TypeScript strict mode
- Keep components small and focused
- Extract reusable logic to custom hooks

### Component Organization

```
components/
├── ui/              # shadcn/ui library components (don't modify)
├── shared/          # Shared/reusable components
├── features/        # Feature-specific components
└── layouts/         # Layout components
```

### Best Practices

- **Accessibility** - Use semantic HTML and ARIA attributes
- **Performance** - Lazy load routes with `React.lazy()`
- **Type Safety** - Avoid `any` types, use strict TypeScript
- **Testing** - Write tests for critical functionality (coming soon)
- **Documentation** - Comment complex logic

## Troubleshooting

### Port Already in Use

If port 4078 is busy, change it in `package.json`:
```json
"dev": "vite --port 4079"
```

### Module Not Found

Clear node_modules and reinstall:
```bash
rm -rf node_modules
npm install
```

### Type Errors

Run type checking to see detailed errors:
```bash
npm run typecheck
```

### Build Fails

1. Check TypeScript errors: `npm run typecheck`
2. Verify all dependencies are installed: `npm install`
3. Clear cache: `rm -rf dist node_modules/.vite`

## Related Documentation

- **Monorepo Root** - `../../CLAUDE.md` - AppWorks monorepo guidelines
- **ForgeBooks** - `../forgebooks/CLAUDE.md` - Production app reference
- **Vite** - https://vitejs.dev/guide/
- **React Router** - https://reactrouter.com/en/main
- **shadcn/ui** - https://ui.shadcn.com/docs
- **Tailwind CSS** - https://tailwindcss.com/docs

## Next Steps

1. **Review the code** - Explore `src/` to understand the structure
2. **Add features** - Start building your application
3. **Customize styling** - Update theme colors in `tailwind.config.js`
4. **Add components** - Use shadcn/ui CLI to add UI components
5. **Connect to API** - Set up data fetching in `src/lib/`
6. **Write tests** - Add test coverage as you build features

## Contributing

This is a template within the AppWorks monorepo. For general contribution guidelines, see the root `CONTRIBUTING.md` (if available).

## License

Part of the AppWorks monorepo. See root LICENSE file.

---

**Template Version:** 2025.11.22.6
**Last Updated:** November 24, 2025
**Maintainer:** ForgeFX Development Team
