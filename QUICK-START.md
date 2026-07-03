# 🚀 Quick Start Guide

## Installation

```bash
cd "d:\NOTE PROJECT\project\floatnote"
npm install
```

## Development

```bash
npm run dev
```

This will:
1. Compile TypeScript electron files
2. Start Vite dev server (React on http://localhost:5173)
3. Launch Electron application

## Production Build

```bash
# Build the application
npm run build

# Package with Electron Builder
npm run build:electron
```

## Verification

```bash
# Check TypeScript types
npm run type-check

# Check code quality
npm run lint
```

## Architecture Overview

- **Main Process**: `electron/main.ts` (database, IPC, system)
- **Preload**: `electron/preload.ts` (secure IPC bridge)
- **Renderer**: `src/` (React UI, uses window.api.*)

## Common Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development mode |
| `npm run build` | Build for production |
| `npm run build:electron` | Package Electron app |
| `npm run type-check` | Check TypeScript |
| `npm run lint` | Lint code |

## Troubleshooting

### Build Errors
If electron files fail to compile:
```bash
node scripts/build-electron.js
```

### Database Issues
Database file location:
- Development: `d:\NOTE PROJECT\project\floatnote\floatnote.db`
- Production: User data directory

### Type Errors
Ensure TypeScript definitions are loaded:
```typescript
// Should be available globally
window.api.cards.findAll()
window.api.workspaces.findAll()
```

## Documentation

- `ARCHITECTURE.md` - Complete architecture details
- `MIGRATION-COMPLETE.md` - Migration summary
- `README.md` - Project overview
