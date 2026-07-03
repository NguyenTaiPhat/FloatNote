# FloatNote Developer Documentation

Complete technical guide for developers working on FloatNote.

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Project Structure](#project-structure)
3. [Development Setup](#development-setup)
4. [Core Systems](#core-systems)
5. [Adding Features](#adding-features)
6. [Testing](#testing)
7. [Building](#building)
8. [Contributing](#contributing)

---

## Architecture Overview

### Technology Stack

```typescript
// Frontend
React 18.3        // UI framework
TypeScript 5.2    // Type safety
Tailwind CSS 3.4  // Styling
Framer Motion 11  // Animations
Zustand 4.5       // State management

// Backend
Electron 29       // Desktop framework
better-sqlite3 11 // Database
Node.js 18+       // Runtime

// Tools
Vite 5.2         // Build tool
ESLint 8         // Linting
Prettier         // Code formatting
```

### Security Architecture

```
┌─────────────────────────────────────────┐
│         Main Process (Electron)         │
│  - Full Node.js access                  │
│  - Database operations                  │
│  - File system access                   │
│  - IPC request handlers                 │
│  - Window management                    │
│  - Global shortcuts                     │
└────────────┬────────────────────────────┘
             │
             │ Secure IPC via contextBridge
             │
┌────────────▼────────────────────────────┐
│       Renderer Process (React)          │
│  - NO Node.js access                    │
│  - contextIsolation: true               │
│  - nodeIntegration: false               │
│  - sandbox: false (for preload)         │
│  - Only window.api & window.electron    │
└─────────────────────────────────────────┘
```

**Key Security Features:**
- Process isolation prevents renderer from accessing Node.js
- Context isolation prevents scripts from accessing Electron APIs
- All database operations go through IPC handlers
- No remote code execution
- Preload script is the only bridge

---

## Project Structure

```
floatnote/
├── electron/                   # Main process code
│   ├── main.ts                # Application entry point
│   ├── preload.ts             # IPC bridge (contextBridge)
│   ├── database.ts            # SQLite database manager
│   ├── backup.ts              # Backup system
│   └── ipc/                   # IPC handlers
│       ├── cards.ts           # Card CRUD operations
│       └── workspaces.ts      # Workspace operations
│
├── src/                       # Renderer process (React)
│   ├── App.tsx               # Root component
│   ├── main.tsx              # React entry point
│   ├── index.css             # Global styles
│   │
│   ├── features/             # Feature modules (domain logic)
│   │   ├── cards/            # Card system
│   │   │   ├── CardDetector.ts        # URL pattern detection
│   │   │   ├── CardFactory.ts         # Card creation logic
│   │   │   ├── extractors/            # Metadata extraction
│   │   │   │   ├── index.ts
│   │   │   │   ├── GitHubExtractor.ts
│   │   │   │   ├── YouTubeExtractor.ts
│   │   │   │   ├── MovieExtractor.ts
│   │   │   │   ├── SpotifyExtractor.ts
│   │   │   │   └── WebsiteExtractor.ts
│   │   │   └── renderers/             # Card UI components
│   │   │       ├── index.tsx
│   │   │       ├── NoteCardRenderer.tsx
│   │   │       ├── GitHubCardRenderer.tsx
│   │   │       └── ...
│   │   │
│   │   ├── ai/               # AI & ML features
│   │   │   ├── SmartRelationships.ts  # Relationship detection
│   │   │   ├── RelatedCards.tsx       # Related cards UI
│   │   │   └── CardSuggestions.ts     # AI suggestions
│   │   │
│   │   ├── search/           # Global search
│   │   │   └── GlobalSearch.tsx
│   │   │
│   │   ├── command-palette/  # Command palette
│   │   │   └── CommandPalette.tsx
│   │   │
│   │   ├── graph/            # Graph visualization
│   │   │   └── GraphView.tsx
│   │   │
│   │   ├── timeline/         # Timeline view
│   │   │   └── Timeline.tsx
│   │   │
│   │   ├── widgets/          # Floating widgets
│   │   │   ├── index.ts
│   │   │   ├── ClockWidget.tsx
│   │   │   ├── WeatherWidget.tsx
│   │   │   ├── TodoWidget.tsx
│   │   │   └── ...
│   │   │
│   │   ├── settings/         # Settings UI
│   │   │   ├── Settings.tsx
│   │   │   ├── BackupSettings.tsx
│   │   │   └── AppearanceSettings.tsx
│   │   │
│   │   └── export/           # Export functionality
│   │       └── ExportManager.ts
│   │
│   ├── layouts/              # Layout components
│   │   ├── MainLayout.tsx    # Main app layout
│   │   ├── Sidebar.tsx       # Navigation sidebar
│   │   └── TitleBar.tsx      # Custom title bar
│   │
│   ├── pages/                # Route pages
│   │   ├── HomePage.tsx      # Main cards page
│   │   ├── GraphPage.tsx     # Graph visualization
│   │   ├── SettingsPage.tsx  # Settings
│   │   ├── WidgetPage.tsx    # Widget windows
│   │   └── EdgeDockPage.tsx  # Edge dock
│   │
│   ├── shared/               # Shared UI components
│   │   ├── Button.tsx
│   │   ├── IconButton.tsx
│   │   ├── Input.tsx
│   │   ├── Modal.tsx
│   │   ├── Tooltip.tsx
│   │   ├── Card.tsx
│   │   ├── ErrorBoundary.tsx
│   │   └── LoadingStates.tsx
│   │
│   ├── store/                # Zustand state stores
│   │   ├── index.ts
│   │   ├── useCardStore.ts
│   │   ├── useWorkspaceStore.ts
│   │   └── useUIStore.ts
│   │
│   ├── lib/                  # Utilities & helpers
│   │   ├── constants.ts      # App constants
│   │   ├── utils.ts          # General utilities
│   │   ├── types.ts          # TypeScript types
│   │   ├── theme.ts          # Theme system
│   │   └── performance.ts    # Performance utilities
│   │
│   ├── db/                   # Database types
│   │   └── index.ts          # Type exports
│   │
│   └── types/                # Global type definitions
│       └── window.d.ts       # Window API types
│
├── scripts/                  # Build & utility scripts
│   ├── build-electron.js     # TypeScript build for Electron
│   └── generate-sample-data.js
│
├── .vscode/                  # VS Code settings
├── node_modules/
├── dist/                     # Build output
│
├── package.json              # Dependencies & scripts
├── tsconfig.json             # TypeScript config
├── vite.config.ts            # Vite config
├── tailwind.config.js        # Tailwind CSS config
├── postcss.config.js         # PostCSS config
├── .eslintrc.cjs            # ESLint config
├── .prettierrc              # Prettier config
└── .gitignore
```

---

## Development Setup

### Prerequisites

```bash
# Required
Node.js 18+
npm 9+

# Recommended
VS Code
Git
```

### Installation

```bash
# Clone repository
git clone https://github.com/yourusername/floatnote.git
cd floatnote

# Install dependencies
npm install

# Start development
npm run dev
```

### Development Workflow

```bash
# Terminal 1: Vite dev server (React)
npm run dev:vite

# Terminal 2: Electron app (after Vite is ready)
npm run dev:electron

# Or run both together
npm run dev
```

### Development Tools

**VS Code Extensions:**
- ESLint
- Prettier
- Tailwind CSS IntelliSense
- TypeScript Vue Plugin (Volar)

**Chrome DevTools:**
- Open with `Ctrl+Shift+I` in Electron window
- React DevTools available
- Network tab for API debugging
- Performance profiling

---

## Core Systems

### 1. Database System

**Location:** `electron/database.ts`

**Schema:**
```sql
CREATE TABLE cards (
    id TEXT PRIMARY KEY,
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    content TEXT,
    url TEXT,
    thumbnail TEXT,
    category TEXT,
    tags TEXT,
    favorite INTEGER DEFAULT 0,
    archived INTEGER DEFAULT 0,
    workspace_id TEXT,
    created_at INTEGER,
    updated_at INTEGER
);

CREATE TABLE workspaces (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    color TEXT,
    description TEXT,
    created_at INTEGER
);

-- More tables: relationships, history, widgets, settings
```

**Usage:**
```typescript
// All database operations in main process only
// Renderer uses IPC

// Main process
import { db } from './database';
const cards = db.prepare('SELECT * FROM cards').all();

// Renderer process
const cards = await window.api.cards.findAll();
```

### 2. IPC Communication

**Pattern:**
```typescript
// 1. Define in preload.ts
contextBridge.exposeInMainWorld('api', {
    cards: {
        findAll: (filters) => ipcRenderer.invoke('cards:findAll', filters)
    }
});

// 2. Handle in main.ts
ipcMain.handle('cards:findAll', async (_event, filters) => {
    return CardRepository.findAll(filters);
});

// 3. Use in renderer
const cards = await window.api.cards.findAll({ archived: false });
```

### 3. State Management

**Zustand Stores:**

```typescript
// src/store/useCardStore.ts
export const useCardStore = create<CardStore>((set, get) => ({
    cards: [],
    loading: false,
    
    loadCards: async (filters) => {
        set({ loading: true });
        const cards = await window.api.cards.findAll(filters);
        set({ cards, loading: false });
    },
    
    addCard: async (cardData) => {
        const card = await window.api.cards.create(cardData);
        set(state => ({ cards: [card, ...state.cards] }));
    },
}));

// Usage in components
function MyComponent() {
    const { cards, loadCards } = useCardStore();
    
    useEffect(() => {
        loadCards();
    }, []);
    
    return <div>{cards.length} cards</div>;
}
```

### 4. Card System

**Adding a New Card Type:**

```typescript
// 1. Create Extractor
// src/features/cards/extractors/CustomExtractor.ts
export class CustomExtractor {
    static async extract(url: string) {
        const response = await fetch(url);
        const html = await response.text();
        
        return {
            title: extractTitle(html),
            description: extractDescription(html),
            thumbnail: extractThumbnail(html),
        };
    }
}

// 2. Create Renderer
// src/features/cards/renderers/CustomCardRenderer.tsx
export function CustomCardRenderer({ card }: { card: Card }) {
    return (
        <div className="glass rounded-xl p-4">
            <h3>{card.title}</h3>
            <p>{card.description}</p>
        </div>
    );
}

// 3. Register in CardFactory
// src/features/cards/CardFactory.ts
if (url.includes('custom.com')) {
    const data = await CustomExtractor.extract(url);
    return { ...baseCard, type: 'custom', ...data };
}

// 4. Add to renderer map
// src/features/cards/renderers/index.tsx
case 'custom':
    return <CustomCardRenderer card={card} />;
```

---

## Adding Features

### 1. New Feature Module

```typescript
// src/features/my-feature/
├── MyFeature.tsx           # Main component
├── useMyFeature.ts         # Custom hook
├── myFeatureStore.ts       # Zustand store (if needed)
└── utils.ts                # Helper functions

// Export from feature
export { MyFeature } from './MyFeature';
```

### 2. New IPC Handler

```typescript
// electron/ipc/my-feature.ts
import { ipcMain } from 'electron';

export function setupMyFeatureHandlers() {
    ipcMain.handle('my-feature:action', async (_event, data) => {
        // Do something
        return result;
    });
}

// Register in main.ts
import { setupMyFeatureHandlers } from './ipc/my-feature';
setupMyFeatureHandlers();

// Add to preload.ts
contextBridge.exposeInMainWorld('api', {
    myFeature: {
        action: (data) => ipcRenderer.invoke('my-feature:action', data)
    }
});

// Update window.d.ts
interface API {
    myFeature: {
        action: (data: any) => Promise<any>;
    };
}
```

### 3. New Page/Route

```typescript
// 1. Create page component
// src/pages/MyPage.tsx
export default function MyPage() {
    return <div>My Page</div>;
}

// 2. Add route in App.tsx
import MyPage from '@/pages/MyPage';

<Route path="/my-page" element={<MyPage />} />

// 3. Add navigation in Sidebar
<NavItem
    icon={<Icon size={18} />}
    label="My Page"
    onClick={() => navigate('/my-page')}
/>
```

---

## Testing

### Manual Testing Checklist

**Core Features:**
- [ ] Create card from URL
- [ ] Create note card
- [ ] Search cards
- [ ] Switch workspaces
- [ ] Toggle views (grid/list/timeline)
- [ ] Open graph view
- [ ] Create backup
- [ ] Restore backup
- [ ] Change theme

**Global Shortcuts:**
- [ ] Alt + Space (search)
- [ ] Ctrl + Shift + P (palette)
- [ ] Ctrl + Alt + B (boss mode)

**Edge Cases:**
- [ ] Invalid URL handling
- [ ] Network offline
- [ ] Large datasets (1000+ cards)
- [ ] Window resize
- [ ] Multi-monitor setup

### Performance Testing

```typescript
// Use performance monitor
import { usePerformanceMonitor } from '@lib/performance';

function MyComponent() {
    usePerformanceMonitor('MyComponent');
    // Component renders >16ms trigger warning
}
```

---

## Building

### Development Build

```bash
npm run build
```

Output: `dist/` folder

### Production Build

```bash
# Build renderer
npm run build

# Build main process
node scripts/build-electron.js

# Package application
npm run build:electron
```

### Build Configuration

**electron-builder** (`package.json`):
```json
{
    "build": {
        "appId": "com.floatnote.app",
        "productName": "FloatNote",
        "files": ["dist/**/*", "electron/**/*"],
        "win": { "target": "nsis" },
        "mac": { "target": "dmg" },
        "linux": { "target": "AppImage" }
    }
}
```

---

## Contributing

### Code Style

**TypeScript:**
```typescript
// Use explicit types
function processCard(card: Card): ProcessedCard {
    return { ...card, processed: true };
}

// Prefer interfaces over types
interface CardProps {
    card: Card;
    onClick?: () => void;
}

// Use const for immutable values
const MAX_CARDS = 1000;
```

**React:**
```typescript
// Named exports
export function MyComponent() { }

// Props destructuring
function MyComponent({ title, onClose }: Props) { }

// Early returns
if (!data) return null;
return <div>{data}</div>;
```

**CSS (Tailwind):**
```tsx
// Use utility classes
<div className="flex items-center gap-3 p-4 rounded-xl" />

// Extract complex styles to classes
<div className="glass-strong card-shadow" />
```

### Git Workflow

```bash
# Create feature branch
git checkout -b feature/my-feature

# Make changes
git add .
git commit -m "feat: add my feature"

# Push and create PR
git push origin feature/my-feature
```

**Commit Convention:**
```
feat: new feature
fix: bug fix
docs: documentation
style: formatting
refactor: code restructure
perf: performance
test: tests
chore: maintenance
```

### Pull Request Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation

## Testing
- [ ] Manual testing done
- [ ] All existing tests pass
- [ ] New tests added

## Screenshots
(if applicable)
```

---

## Debugging

### Main Process Debugging

```bash
# Launch with debugger
electron --inspect=5858 .

# Attach VS Code debugger
# .vscode/launch.json configured
```

### Renderer Process Debugging

```bash
# Open DevTools (in app)
Ctrl + Shift + I

# React DevTools available in Development
```

### Common Issues

**Database Locked:**
```typescript
// Use WAL mode (already enabled)
db.pragma('journal_mode = WAL');
```

**IPC Timeout:**
```typescript
// Increase timeout or use events instead of invoke
ipcRenderer.send('long-task');
ipcRenderer.on('long-task-done', callback);
```

**Memory Leaks:**
```typescript
// Clean up listeners
useEffect(() => {
    const handler = () => {};
    window.addEventListener('event', handler);
    return () => window.removeEventListener('event', handler);
}, []);
```

---

## Resources

- [Electron Docs](https://electronjs.org/docs)
- [React Docs](https://react.dev)
- [TypeScript Handbook](https://typescriptlang.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Zustand](https://github.com/pmndrs/zustand)

---

**Happy coding! 🚀**
