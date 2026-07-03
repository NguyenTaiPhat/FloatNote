# FloatNote
## ✨ Features

### 🎴 Smart Cards System
Every saved item automatically transforms into a premium interactive card:
- **Note Cards** - Rich text notes with markdown support
- **Website Cards** - Auto-fetch metadata, favicon, OG images
- **GitHub Cards** - Repository info, stars, forks, topics, README preview
- **YouTube Cards** - Thumbnail, duration, channel, views, watch later
- **Movie Cards** - TMDB/IMDb integration, ratings, posters, streaming links
- **Spotify Cards** - Album covers, artists, track counts
- And more: Reddit, Medium, PDF, Images, Files, Todo, Countdown, Calendar

### 🔍 Auto Link Detection
Paste any URL and FloatNote automatically:
- Detects the service type
- Fetches complete metadata
- Generates beautiful card layout
- Caches everything locally

### 🤖 AI Understanding (Local First)
AI automatically:
- Summarizes content
- Generates relevant tags
- Finds categories
- Extracts keywords
- Suggests related cards
- Creates connections

### 🌐 Graph View
Visualize connections between cards:
- Interactive node graph
- Zoom and pan
- Relationship strength
- Smart suggestions

### 🎨 Floating Widgets
Transform any card into a desktop widget:
- Always on top
- Custom opacity
- Compact/Normal/Expanded modes
- Drag anywhere
- Multiple monitors support

### 📌 Edge Dock
Hidden sidebar that expands on hover:
- Quick access to pinned cards
- Recent notes
- Bookmarks
- Widgets
- Quick actions

### ⚡ Global Search (Alt + Space)
Instant fuzzy search across:
- All cards
- Notes content
- Bookmarks
- Tags
- Projects
- History

### ⌨️ Command Palette (Ctrl + Shift + P)
Execute everything by keyboard:
- Create new cards
- Switch workspaces
- Change views
- Run commands

### 👻 Boss Mode (Ctrl + Alt + B)
Instantly hide everything:
- All windows
- Floating widgets
- Edge dock
- Optional PIN protection
- Windows Hello support

### 🏢 Workspaces
Organize by context:
- Personal
- Coding
- Movies
- School
- Business
- Photography

Each workspace has independent cards, widgets, and layouts.

### 📊 Timeline & History
- Track every change
- Visual timeline
- Restore any version
- Auto backup system

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run development mode
npm run dev

# Build for production
npm run build

# Build desktop app
npm run build:electron
```

## 🎯 Usage

### Creating Cards

**From URL:**
```
Paste: https://github.com/electron/electron
Result: Premium GitHub card with full metadata
```

**From Text:**
```
Type: Remember to update documentation
Result: Note card with timestamp
```

**Movie Search:**
```
Command Palette → "Add Movie" → "Fight Club"
Result: Movie card with poster, rating, genres
```

### Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Alt + Space` | Global Search |
| `Ctrl + Shift + P` | Command Palette |
| `Ctrl + Alt + B` | Boss Mode |
| `Ctrl + N` | New Card |
| `Ctrl + S` | Save |
| `Delete` | Delete Card |
| `ESC` | Close Modal |

## 🛠️ Architecture

```
floatnote/
├── electron/              # Electron main process
│   ├── main.js           # App entry point
│   └── preload.js        # Context bridge
├── src/
│   ├── features/         # Feature modules
│   │   ├── cards/        # Card system
│   │   │   ├── extractors/
│   │   │   ├── renderers/
│   │   │   ├── CardDetector.ts
│   │   │   └── CardFactory.ts
│   │   ├── search/       # Global search
│   │   └── command-palette/
│   ├── shared/           # UI components
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Modal.tsx
│   │   └── Card.tsx
│   ├── layouts/          # App layouts
│   ├── pages/            # Main pages
│   ├── store/            # Zustand stores
│   ├── db/               # SQLite database
│   ├── lib/              # Utilities
│   └── App.tsx
└── package.json
```

## 🎨 Design System

**Colors:**
- Background: `#0a0a0a`
- Surface: `#1e1e1e`
- Primary: `#3b82f6`
- Accent: Purple, Pink, Orange, Green, Yellow

**Typography:**
- System fonts
- -apple-system, BlinkMacSystemFont, Segoe UI

**Border Radius:**
- Components: `18px`
- Cards: `18px`
- Buttons: `12px`

**Animations:**
- 60 FPS smooth transitions
- Framer Motion powered
- Spring physics

## 🔧 Configuration

### API Keys

Edit `src/lib/constants.ts`:

```typescript
export const TMDB_API_KEY = 'your_tmdb_api_key';
export const GITHUB_TOKEN = 'your_github_token';
```

### Database

SQLite database stored at:
- Development: `./floatnote.db`
- Production: `%APPDATA%/floatnote/floatnote.db`

## 📦 Tech Stack

- **Framework:** Electron 29
- **UI:** React 18 + TypeScript
- **Styling:** TailwindCSS 3
- **Animations:** Framer Motion 11
- **State:** Zustand 4
- **Database:** better-sqlite3 9
- **Search:** Fuse.js 7
- **Icons:** Lucide React

## 🎯 Performance

- Cold launch: <1 second
- RAM usage: <150MB
- Supports 10,000+ cards
- 60 FPS animations
- Instant search

## 🔜 Roadmap

- [ ] Plugin system
- [ ] Cloud sync
- [ ] Git sync
- [ ] Browser extension
- [ ] Mobile apps (iOS/Android)
- [ ] OCR support
- [ ] Voice notes
- [ ] AI assistant chat
- [ ] Multi-window mode

## 📝 License

MIT

## 🙏 Credits

Inspired by:
- Notion
- Raycast
- Arc Browser
- Linear
- Obsidian
- Apple Human Interface Guidelines
- Windows 11 Fluent Design

---

**Built with ❤️ for productivity enthusiasts**
=======
Mã Nguồn Free
>>>>>>> c8dc6ee9e2952824e2e1fd18179e8a777a5518ce
