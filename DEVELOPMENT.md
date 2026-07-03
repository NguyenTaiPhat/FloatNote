# FloatNote Development Guide

## Setup

```bash
# Install dependencies
npm install

# Start development
npm run dev
```

## Project Structure

### Core Modules

**Electron (`electron/`)**
- `main.js` - Main process, window management, global shortcuts
- `preload.js` - Context bridge for IPC

**React App (`src/`)**
- `App.tsx` - Root component with routing
- `main.tsx` - React entry point
- `index.css` - Global styles

**Features (`src/features/`)**
- `cards/` - Smart card system
  - `extractors/` - Metadata extractors for each service
  - `renderers/` - Card UI components
  - `CardDetector.ts` - URL pattern detection
  - `CardFactory.ts` - Card creation logic
- `search/` - Global search
- `command-palette/` - Command system

**Shared (`src/shared/`)**
- Reusable UI components
- Design system primitives

**Database (`src/db/`)**
- SQLite schema
- Repository pattern
- Type-safe queries

**Store (`src/store/`)**
- Zustand stores
- UI state
- Card management
- Workspace state

## Adding New Card Type

1. **Add type to constants**
```typescript
// src/lib/constants.ts
export const CARD_TYPES = [..., 'newtype'] as const;
```

2. **Create extractor**
```typescript
// src/features/cards/extractors/NewTypeExtractor.ts
export class NewTypeExtractor {
  static async extract(url: string): Promise<Partial<Card>> {
    // Fetch metadata
    // Return card data
  }
}
```

3. **Add detection**
```typescript
// src/features/cards/CardDetector.ts
private static isNewTypeUrl(url: string): boolean {
  return /pattern/.test(url);
}
```

4. **Create renderer**
```typescript
// src/features/cards/renderers/NewTypeCardRenderer.tsx
export function NewTypeCardRenderer({ card }: Props) {
  return <Card>...</Card>;
}
```

5. **Register renderer**
```typescript
// src/features/cards/renderers/index.tsx
case 'newtype':
  return <NewTypeCardRenderer card={card} />;
```

## Database Schema

**cards**
- id, type, title, description, content, url
- metadata (JSON), tags (JSON)
- category, color
- favorite, archived
- workspace_id
- created_at, updated_at

**workspaces**
- id, name, type, color, icon
- description
- created_at, updated_at

**relationships**
- id, source_card_id, target_card_id
- type, strength
- created_at

**history**
- id, card_id, action
- snapshot (JSON)
- timestamp

**widgets**
- id, type, card_id
- position (x, y), size (width, height)
- mode, opacity, always_on_top
- settings (JSON)
- created_at

## State Management

**useCardStore**
- `cards` - All cards array
- `loadCards()` - Load from DB
- `addCard()` - Create new card
- `updateCard()` - Update existing
- `deleteCard()` - Remove card
- `toggleFavorite()` - Toggle favorite status

**useWorkspaceStore**
- `workspaces` - All workspaces
- `activeWorkspaceId` - Current workspace
- `loadWorkspaces()` - Load from DB
- `setActiveWorkspace()` - Switch workspace

**useUIStore**
- `isSearchOpen` - Global search state
- `isCommandPaletteOpen` - Command palette state
- `viewMode` - grid/list/timeline
- `theme` - dark/light

## Styling

**Tailwind Classes**
- `glass` - Glass morphism effect
- `glass-strong` - Stronger glass effect
- `card-shadow` - Card shadow
- `widget-shadow` - Widget shadow

**Colors**
```css
background: #0a0a0a
background-secondary: #141414
surface: #1e1e1e
border: #2a2a2a
primary: #3b82f6
text-primary: #ffffff
text-secondary: #a1a1aa
text-tertiary: #71717a
```

## Global Shortcuts

Register in `electron/main.js`:
```javascript
globalShortcut.register('Alt+Space', () => {
  mainWindow.webContents.send('global-search-toggle');
});
```

Listen in React:
```typescript
useEffect(() => {
  window.electron?.onGlobalSearch(() => toggleSearch());
}, []);
```

## Testing Extractors

```typescript
// Test GitHub
const card = await GitHubExtractor.extract(
  'https://github.com/electron/electron'
);

// Test YouTube
const card = await YouTubeExtractor.extract(
  'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
);

// Test Movie
const card = await MovieExtractor.extractByTitle('Inception');
```

## Performance Tips

1. **Lazy load card metadata**
   - Only fetch when card is visible
   - Cache in database

2. **Virtualize long lists**
   - Use react-window for 1000+ cards

3. **Optimize images**
   - Use thumbnails for previews
   - Lazy load full images

4. **Debounce search**
   - Wait 300ms before searching
   - Use Fuse.js for fuzzy search

## Build & Distribution

```bash
# Development build
npm run build

# Production build with Electron
npm run build:electron

# Output: dist/ and release/
```

## Debugging

**Main Process**
```bash
# Enable dev tools
mainWindow.webContents.openDevTools();
```

**Renderer Process**
- Chrome DevTools available
- React DevTools supported
- Zustand DevTools ready

**Database**
```bash
# View database
sqlite3 floatnote.db
.tables
.schema cards
SELECT * FROM cards LIMIT 10;
```

## Common Issues

**Database locked**
- Close all connections
- Check WAL mode enabled

**Extractors failing**
- Check API keys in constants.ts
- Verify network connectivity
- Check CORS for web scraping

**Hot reload not working**
- Restart dev server
- Clear Vite cache

## Code Style

- TypeScript strict mode
- ESLint + Prettier
- No `any` types
- Handle all errors
- Write JSDoc for utilities

## Git Workflow

```bash
# Feature branch
git checkout -b feature/new-card-type

# Commit
git commit -m "feat: add twitter card support"

# Push
git push origin feature/new-card-type
```

## Resources

- [Electron Docs](https://electronjs.org/docs)
- [React Docs](https://react.dev)
- [TailwindCSS](https://tailwindcss.com)
- [Framer Motion](https://framer.com/motion)
- [Zustand](https://zustand-demo.pmnd.rs)
