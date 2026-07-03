# Architecture Documentation

## Electron Security Best Practices Implementation

This project follows Electron security best practices with proper process isolation.

### Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                       Main Process                          │
│  (electron/main.ts)                                        │
│                                                            │
│  - Database Management (electron/database.ts)              │
│  - IPC Handlers (electron/ipc/)                            │
│  - Window Management                                       │
│  - System Access                                           │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   │ IPC Communication
                   │ (Secure contextBridge)
                   │
┌──────────────────▼──────────────────────────────────────────┐
│                    Renderer Process                         │
│  (React Application)                                        │
│                                                            │
│  - UI Components (src/)                                    │
│  - State Management (src/store/)                           │
│  - NO direct Node.js access                                │
│  - NO direct database access                               │
└─────────────────────────────────────────────────────────────┘
```

### Security Configuration

**BrowserWindow Settings:**
```typescript
webPreferences: {
    nodeIntegration: false,      // ✅ Node.js disabled in renderer
    contextIsolation: true,      // ✅ Isolate renderer from main
    sandbox: false,              // Disabled for preload script
    preload: 'preload.js'        // Secure bridge only
}
```

### File Structure

```
electron/
├── main.ts           # Main process entry point
├── preload.ts        # Secure IPC bridge (contextBridge)
├── database.ts       # SQLite database management
└── ipc/
    ├── cards.ts      # Card CRUD operations
    └── workspaces.ts # Workspace CRUD operations

src/
├── store/
│   ├── useCardStore.ts       # Calls window.api.cards.*
│   └── useWorkspaceStore.ts  # Calls window.api.workspaces.*
├── types/
│   └── window.d.ts           # TypeScript definitions for window.api
└── db/
    └── index.ts              # Type exports only (no logic)
```

### IPC Channels

**Card Operations:**
- `cards:create` - Create new card
- `cards:findById` - Get card by ID
- `cards:findAll` - Get all cards with optional filters
- `cards:update` - Update card
- `cards:delete` - Delete card
- `cards:search` - Full-text search

**Workspace Operations:**
- `workspaces:create` - Create workspace
- `workspaces:findById` - Get workspace by ID
- `workspaces:findAll` - Get all workspaces
- `workspaces:update` - Update workspace
- `workspaces:delete` - Delete workspace

### API Usage

**React Components:**
```typescript
// Old (INSECURE - direct database access)
import { CardRepository } from '@db/index';
const cards = CardRepository.findAll();

// New (SECURE - IPC communication)
const cards = await window.api.cards.findAll();
```

**Store Example:**
```typescript
export const useCardStore = create<CardStore>((set) => ({
    loadCards: async (filters) => {
        const cards = await window.api.cards.findAll(filters);
        set({ cards });
    },
    
    addCard: async (cardData) => {
        const card = { ...cardData, id: generateId() };
        await window.api.cards.create(card);
        set(state => ({ cards: [card, ...state.cards] }));
    }
}));
```

### Database Schema

All database operations are in the **Main Process** only.

**Tables:**
- `cards` - Main content storage
- `workspaces` - Organization units
- `relationships` - Card connections
- `history` - Change tracking
- `widgets` - Widget state
- `settings` - App configuration

### Build Process

1. **Development:**
   ```bash
   npm run dev
   ```
   - Compiles TypeScript electron files
   - Starts Vite dev server (React)
   - Launches Electron with hot reload

2. **Production:**
   ```bash
   npm run build
   npm run build:electron
   ```
   - Compiles React app
   - Compiles TypeScript electron files
   - Packages with electron-builder

### Migration Summary

**Removed:**
- ❌ `src/db/database.ts` (moved to `electron/database.ts`)
- ❌ `src/db/repositories/CardRepository.ts` (moved to `electron/ipc/cards.ts`)
- ❌ `src/db/repositories/WorkspaceRepository.ts` (moved to `electron/ipc/workspaces.ts`)
- ❌ All direct `better-sqlite3` usage in renderer
- ❌ All direct `electron` imports in renderer

**Added:**
- ✅ `electron/main.ts` - Secure main process
- ✅ `electron/preload.ts` - Secure IPC bridge
- ✅ `electron/database.ts` - Database management
- ✅ `electron/ipc/cards.ts` - Card IPC handlers
- ✅ `electron/ipc/workspaces.ts` - Workspace IPC handlers
- ✅ `src/types/window.d.ts` - TypeScript definitions
- ✅ `scripts/build-electron.js` - Build automation

**Changed:**
- 🔄 `src/store/useCardStore.ts` - Uses `window.api.cards.*`
- 🔄 `src/store/useWorkspaceStore.ts` - Uses `window.api.workspaces.*`
- 🔄 `src/layouts/MainLayout.tsx` - Removed `initDatabase()` call
- 🔄 `vite.config.ts` - Externalized node modules
- 🔄 `package.json` - Updated build scripts

### Security Benefits

1. **Process Isolation:** Renderer cannot access Node.js APIs directly
2. **No Code Injection:** `contextIsolation: true` prevents script injection
3. **Controlled IPC:** Only exposed APIs via `contextBridge`
4. **Database Safety:** SQLite runs in main process only
5. **Type Safety:** Full TypeScript coverage with strict types

### Testing

```bash
# Type checking
npm run type-check

# Linting
npm run lint

# Development
npm run dev
```

### Notes

- Database file: `floatnote.db` (created automatically)
- WAL mode enabled for better concurrency
- All IPC handlers return Promises
- Main process initializes database on app startup
- Database closes automatically on app quit
