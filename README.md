# BMSC ICT Club Website

A modern, responsive website for the BMSC ICT Club built with SvelteKit 2 (Svelte 5) and Tailwind CSS.

## Features

- **Modern Design**: Clean, professional design with gradient backgrounds and smooth animations
- **Responsive Layout**: Fully responsive design that works on desktop, tablet, and mobile devices
- **3D Integration**: Interactive Spline 3D viewer integration for enhanced visual appeal
- **Component-Based**: Built with reusable Svelte components for maintainability
- **Fast Performance**: Leverages SvelteKit's optimizations for fast loading times
- **Database**: Supabase (PostgreSQL) with a custom Prisma-to-Supabase-REST adapter
- **Auth**: Supabase Auth with session-based authentication
- **SEO**: Optimized meta tags, structured data, and auto-generated sitemap/robots.txt
- **Accessibility**: WCAG-compliant with ARIA live regions, skip-to-content links, and keyboard navigation
- **PWA**: Service worker registration for offline support

## Tech Stack

- **Framework**: SvelteKit 2 (Svelte 5 with runes)
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL) — see [docs/DATABASE.md](docs/DATABASE.md)
- **Auth**: Supabase Auth
- **Build Tool**: Vite
- **Package Manager**: npm

## Getting Started

### Prerequisites

- Node.js (version 18 or higher)
- npm
- Supabase project (free tier works)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd bmsc-ict-club-website
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```
Edit `.env` with your Supabase credentials (never commit this file).

### Run locally

1. Start development server:
```bash
npm run dev
```
- The dev server uses the Vite config port 3000 and will open the app in your browser (http://localhost:3000).

2. Build for production:
```bash
npm run build
```

3. Preview production build locally:
```bash
npm run preview
```

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the project for production
- `npm run preview` - Preview the production build locally
- `npm run check` - Run Svelte type checking
- `npm run check:watch` - Run Svelte type checking in watch mode

## Project Structure

```
src/
├── lib/
│   ├── components/
│   │   ├── admin/            # Admin panel components
│   │   │   ├── tabs/         # Admin tab components (Overview, Users, Content, etc.)
│   │   │   ├── AdminSidebar.svelte
│   │   │   └── SecurityStats.svelte
│   │   ├── dashboard/        # User dashboard components
│   │   │   ├── Achievements.svelte
│   │   │   ├── OverviewCard.svelte
│   │   │   ├── PerformanceGraph.svelte
│   │   │   ├── ProfileSettingsForm.svelte
│   │   │   └── StatCard.svelte
│   │   ├── Navbar.svelte
│   │   ├── Footer.svelte
│   │   ├── Hero3D.svelte
│   │   ├── GlassCard.svelte
│   │   ├── Toast.svelte
│   │   ├── SEO.svelte
│   │   ├── LiveRegion.svelte
│   │   ├── ScrollReveal.svelte
│   │   ├── ParticleBackground.svelte
│   │   └── ... (20+ components)
│   ├── schemas/              # Validation schemas
│   ├── server/               # Server-side utilities
│   │   ├── prisma.js         # Supabase REST adapter (Prisma API surface)
│   │   ├── supabase.js       # Supabase client configuration
│   │   ├── auth.js           # Authentication helpers
│   │   ├── security.js       # Security middleware
│   │   └── ... (CSP, CSRF, validation, etc.)
│   ├── utils/                # Client-side utilities
│   └── stores.js             # Svelte stores (auth, courses, projects, etc.)
├── routes/
│   ├── api/                  # Server-side API endpoints
│   │   ├── badges/           # Badge CRUD
│   │   ├── contact/          # Contact form (Discord webhook)
│   │   ├── courses/          # Course listing + progress tracking
│   │   ├── discussions/      # Community discussions
│   │   ├── health/           # Health check endpoint
│   │   ├── notices/          # Notices/announcements
│   │   ├── projects/         # Projects listing
│   │   ├── team/             # Team members
│   │   └── users/            # User management + achievements/stats
│   ├── admin/                # Admin dashboard
│   ├── auth/callback/        # OAuth callback handler
│   ├── community/            # Community discussions
│   ├── contact/              # Contact page
│   ├── courses/              # Courses listing + individual course pages
│   ├── dashboard/            # User dashboard
│   ├── login/                # Login page
│   ├── notices/              # Notices listing + individual notice pages
│   ├── projects/             # Projects listing
│   ├── team/                 # Team page
│   ├── robots.txt/           # Dynamic robots.txt
│   ├── sitemap.xml/          # Dynamic sitemap
│   ├── +layout.svelte        # Root layout (navbar, footer, SEO)
│   └── +page.svelte          # Homepage
├── app.css                   # Global styles
└── app.html                  # HTML entry point
```

## Pages

| Route | Description |
|-------|-------------|
| `/` | Homepage with hero, about, features |
| `/courses` | Course catalog with video player |
| `/courses/[id]` | Individual course with topic navigation and progress tracking |
| `/team` | Team member cards with modal details |
| `/projects` | Project showcase with filtering |
| `/community` | Community discussions |
| `/notices` | Announcements and notices |
| `/contact` | Contact form (Discord webhook) |
| `/login` | Login page |
| `/dashboard` | User dashboard with achievements, stats, settings |
| `/admin` | Admin panel (content, users, security, logs) |

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/health` | GET | Health check |
| `/api/courses` | GET/POST | List/create courses |
| `/api/courses/[id]/progress` | GET/POST | Track course progress |
| `/api/team` | GET/POST | List/create team members |
| `/api/projects` | GET/POST | List/create projects |
| `/api/discussions` | GET/POST | List/create discussions |
| `/api/notices` | GET/POST | List/create notices |
| `/api/contact` | POST | Send contact message (Discord webhook) |
| `/api/badges` | GET/POST | Badge management |
| `/api/users` | GET/POST | User management |

## Components

- **Navbar**: Responsive navigation with mobile menu and auth state
- **Hero3D**: Main hero section with 3D Spline viewer
- **GlassCard**: Reusable glassmorphism card component
- **Toast**: Toast notification system
- **SEO**: Meta tags and structured data component
- **LiveRegion**: ARIA live region for screen reader announcements
- **ScrollReveal**: Intersection Observer-based reveal animations
- **ParticleBackground**: Animated particle background

## Deployment

To deploy the application:

1. Build the project:
```bash
npm run build
```

2. The built files will be in the `build` directory, ready for deployment to any static hosting service.

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `PUBLIC_SUPABASE_URL` | Supabase project URL | Yes |
| `PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | Yes |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key | Yes (server-side) |
| `DISCORD_WEBHOOK_URL` | Discord webhook for contact form | Optional |
| `JWT_SECRET` | JWT signing secret | Optional |

**Never commit `.env` files to version control.**

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
