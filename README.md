# BMSC ICT Club Website

A modern, responsive website for the BMSC ICT Club built with SvelteKit and Tailwind CSS.

## Features

- **Modern Design**: Clean, professional design with gradient backgrounds and smooth animations
- **Responsive Layout**: Fully responsive design that works on desktop, tablet, and mobile devices
- **3D Integration**: Interactive Spline 3D viewer integration for enhanced visual appeal
- **Component-Based**: Built with reusable Svelte components for maintainability
- **Fast Performance**: Leverages SvelteKit's optimizations for fast loading times

## Tech Stack

- **Framework**: SvelteKit
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL) — see [docs/DATABASE.md](docs/DATABASE.md)
- **Auth**: Supabase Auth
- **Build Tool**: Vite
- **Package Manager**: npm

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm

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
│   └── components/
│       ├── Navbar.svelte
│       ├── Hero.svelte
│       ├── About.svelte
│       └── Footer.svelte
├── routes/
│   ├── +layout.svelte
│   └── +page.svelte
├── app.css
└── app.html
static/
└── images/
    ├── club_logo.png
    └── futuristic-background-design_23-2148503793.avif
```

## Components

- **Navbar**: Responsive navigation with mobile menu
- **Hero**: Main hero section with 3D Spline viewer
- **About**: About us section with club information
- **Footer**: Footer with contact information and newsletter signup

## Deployment

To deploy the application:

1. Build the project:
```bash
npm run build
```

2. The built files will be in the `build` directory, ready for deployment to any static hosting service.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.