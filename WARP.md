# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React application containing an interactive educational game called "Should I Delegate This?" designed for school leaders and educators. The game helps users learn when to delegate tasks to AI versus when to keep them human-driven through timed decision-making scenarios.

**Status**: Successfully deployed on Vercel as a static export application.

## Development Setup

This project is a Next.js application configured for static export and Vercel deployment:

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Run linter
npm run lint
```

## Architecture

- **Next.js 15.5.3**: App Router architecture with static export configuration
- **React 18**: Modern React app using functional components and hooks
- **Game State Machine**: Manages four distinct states: `setup`, `playing`, `results`, `finished`
- **Timer System**: 45-second countdown per scenario with visual progress indicators
- **Scoring System**: 100 points per correct decision with percentage-based final scoring
- **Static Export**: Configured for static site generation and edge deployment

## Current Dependencies

- **React 18**: Core framework
- **Next.js 15.5.3**: Full-stack React framework with app router
- **Tailwind CSS 3.4.1**: Utility-first styling framework
- **lucide-react 0.460.0**: Modern icon library
- **TypeScript 5**: Full type safety implementation

## Core Game Mechanics

- **Scenarios**: 6 predefined educational scenarios covering different delegation contexts
- **Decision Flow**: Group discussion → timed decision → immediate feedback → next scenario
- **Feedback System**: Provides both correct/incorrect explanations and humorous "what went wrong" examples
- **Round Structure**: Scenarios are grouped into rounds (changes at scenario 3)

## Key Data Structures

- **Game State**: Controls UI flow between setup, gameplay, and results screens
- **Scenarios Array**: Contains predefined scenarios with metadata:
  - `category`: Type of educational task
  - `scenario`: The decision prompt
  - `shouldDelegate`: Boolean indicating correct answer
  - `feedback`: Correct/incorrect explanations
  - `funnyWrong`: Humorous consequence examples

## Deployment Configuration

- **Vercel**: Primary hosting platform using `@vercel/static-build`
- **Static Export**: Configured in `next.config.js` with `output: 'export'`
- **Build Output**: Static files generated in `out/` directory
- **Vercel Config**: Uses `vercel.json` with static build configuration
- **Domain**: Accessible at custom domain or vercel.app subdomain
- **Build Optimization**: Tailwind purging and React production builds

## Content Modification

To modify game content:
- Edit the `scenarios` array in the main component
- Adjust timer duration (currently 45 seconds)
- Modify scoring system (currently 100 points per correct answer)
- Update styling via Tailwind classes

## Current File Structure

```
/
├── app/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   └── ShouldIDelegateGame.tsx
├── out/                    # Generated static export directory
├── node_modules/
├── package.json
├── next.config.js         # Configured for static export
├── vercel.json            # Static build configuration
├── tailwind.config.ts
├── postcss.config.js
├── tsconfig.json
├── WARP.md
└── CLAUDE.md
```

## Deployment Configuration Details

### next.config.js
- **Static Export**: `output: 'export'` for static site generation
- **Trailing Slash**: `trailingSlash: true` for better static hosting
- **Skip Redirects**: `skipTrailingSlashRedirect: true` for static compatibility
- **Images**: `unoptimized: true` for static export compatibility
- **File Tracing**: `outputFileTracingRoot: __dirname` for proper workspace detection

### vercel.json
- **Build System**: Uses `@vercel/static-build` instead of Next.js runtime
- **Output Directory**: `distDir: "out"` points to static export directory
- **Version**: Uses Vercel v2 build configuration

### Deployment Process
1. Vercel detects `vercel.json` and uses static build configuration
2. Runs `npm run build` which generates static files in `out/`
3. Serves static files directly without Next.js server-side features
4. Avoids `routes-manifest.json` requirement by bypassing Next.js runtime

## Troubleshooting Deployment

### Common Issues Resolved
- **routes-manifest.json not found**: Fixed by using `@vercel/static-build` instead of Next.js runtime
- **Server-side features**: All components are client-side only with no server dependencies
- **Image optimization**: Disabled with `unoptimized: true` for static export compatibility
- **Workspace warnings**: Resolved with `outputFileTracingRoot: __dirname`

### Key Success Factors
1. **Static Export Configuration**: `output: 'export'` in `next.config.js`
2. **Vercel Static Build**: Using `@vercel/static-build` in `vercel.json`
3. **No Server Dependencies**: Pure client-side React application
4. **Build Verification**: Always test `npm run build` locally before deployment

### If Deployment Fails
1. Verify `out/` directory is generated after `npm run build`
2. Check that `vercel.json` uses `@vercel/static-build`
3. Ensure no server-side Next.js features are used in components
4. Confirm `next.config.js` has proper static export settings
