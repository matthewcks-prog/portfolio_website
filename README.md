# Matthew's Portfolio — Neon Hologrid

A modern, interactive portfolio built with Next.js 14, TypeScript, Tailwind CSS, Framer Motion, and React Three Fiber. Features a dark "Neon Hologrid" theme with 3D graphics, smooth animations, and production-ready performance.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm

### Installation

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Type check
pnpm typecheck

# Lint
pnpm lint
```

Open [http://localhost:3000](http://localhost:3000) to view in your browser.

## 📂 Project Structure

```
portfolio_website/
├── src/
│   ├── app/              # Next.js 14 App Router pages
│   │   ├── layout.tsx    # Root layout with fonts & analytics
│   │   ├── page.tsx      # Home page with hero & projects
│   │   ├── api/          # API routes (contact form)
│   │   ├── robots.ts     # SEO robots.txt
│   │   └── sitemap.ts    # XML sitemap
│   ├── components/
│   │   ├── 3d/           # React Three Fiber scenes
│   │   │   └── HeroScene.tsx
│   │   ├── ui/           # Reusable UI components
│   │   │   ├── Button.tsx
│   │   │   └── GlassCard.tsx
│   │   ├── Nav.tsx
│   │   └── ProjectCard.tsx
│   ├── lib/              # Utilities & helpers
│   │   ├── utils.ts      # cn() helper
│   │   └── seo.ts        # Default metadata
│   ├── styles/
│   │   └── globals.css   # Global styles & CSS variables
│   └── content/
│       └── projects/     # MDX project content
├── public/               # Static assets (add your resume here!)
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.js
```

## 🎨 Features

- **3D Hero Scene**: Interactive holographic grid with floating AI core
- **Ambient Background Audio**: Looped ambient soundscape with mute/volume controls
- **Scroll-Scrubbed Video**: Immersive video section that scrubs with scroll progress
- **Adaptive Performance**: Automatic quality reduction on low-end devices
- **Accessibility First**: WCAG 2.1 compliant, keyboard navigation, reduced motion support
- **Glass Morphism UI**: Modern frosted glass cards with backdrop blur
- **Smooth Animations**: Framer Motion with optimized easing curves
- **Type-Safe**: Full TypeScript coverage
- **SEO Optimized**: Metadata, sitemap, robots.txt
- **Analytics Ready**: Vercel Analytics integrated

## 🛠️ Customization

### Add Your Projects

1. Create MDX files in `src/content/projects/`
2. Update the home page grid in `src/app/page.tsx`
3. Use the `ProjectCard` component for consistent styling

### Update Personal Info

- **Metadata**: Edit `src/app/layout.tsx` and `src/lib/seo.ts`
- **Navigation**: Modify links in `src/components/Nav.tsx`
- **Resume**: Add `resume.pdf` to the `public/` folder

### Add Media Assets

See [MEDIA_ASSETS.md](./MEDIA_ASSETS.md) for detailed instructions.

**Required files:**

- `public/audio/ambient.mp3` - Background audio loop (10-30s, seamless)
- `public/video/immersive.mp4` - Scroll-scrubbed video (5-12s, 1080p/720p)
- `public/video/poster.jpg` - Video poster frame

**Quick placeholder generation:**

```bash
# Silent audio for testing
ffmpeg -f lavfi -i anullsrc=r=44100:cl=stereo -t 10 -c:a libmp3lame public/audio/ambient.mp3

# Gradient video for testing
ffmpeg -f lavfi -i color=c=0x0A0F1A:s=1920x1080:d=8 -c:v libx264 -t 8 -pix_fmt yuv420p public/video/immersive.mp4
ffmpeg -i public/video/immersive.mp4 -vframes 1 public/video/poster.jpg
```

### Theme Colors

Edit CSS variables in `src/styles/globals.css`:

```css
:root {
  --c-cyan: #22d3ee;
  --c-indigo: #6366f1;
  --c-violet: #a78bfa;
  /* etc. */
}
```

## ⚡ Performance Budgets

- **Hero Scene**: < 1.5MB total assets
- **Adaptive DPR**: Scales from 1.0 to 1.75 based on device
- **Code Split**: Automatic via Next.js
- **Reduced Motion**: Fallback static poster for accessibility

## 📧 Contact Form

The contact API route is at `/api/contact`. Currently logs to console.

**To integrate email:**

1. Install your provider (e.g., Resend):

   ```bash
   pnpm add resend
   ```

2. Add API key to `.env.local`:

   ```
   RESEND_API_KEY=your_key_here
   ```

3. Update `src/app/api/contact/route.ts` with your integration

## 🚢 Deployment

### Vercel (Recommended)

```bash
vercel deploy
```

Or connect your GitHub repo to Vercel for automatic deployments.

### Other Platforms

```bash
pnpm build
pnpm start
```

Make sure environment variables are configured in your hosting platform.

## 📄 License

MIT License - see LICENSE file for details.

---

Built with ❤️ by Matthew
