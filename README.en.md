# FloatNote

**Your Second Brain for Desktop**

FloatNote is an open-source desktop application that transforms everything you save into intelligent interactive cards. Combining notes, bookmarks, knowledge base, widgets, and AI assistant in one beautiful workspace.

![FloatNote](https://via.placeholder.com/1200x600/0a0a0a/3b82f6?text=FloatNote)

---

## 🔒 Security & Privacy

⭐ **100% Open Source** - All code is available for review and contribution on [GitHub](https://github.com/NguyenTaiPhat/FloatNote)

🔐 **No Data Collection** - No telemetry, analytics, or tracking whatsoever

💾 **Local Storage** - All notes, bookmarks, and settings are stored on your machine

🚫 **No Malware** - Code is fully public, you can build and verify yourself

🔑 **Secure API Keys** - Your API keys (TMDB, GitHub, YouTube) are stored locally at:
- **Windows:** `%APPDATA%/floatnote/config.json`
- Stored locally only, never sent anywhere
- You register and manage your own keys

🗄️ **Offline Database** - SQLite database (`floatnote.db`) stored locally at:
- **Dev:** `./floatnote.db`
- **Production:** `%APPDATA%/floatnote/`

---

## ✨ Features

### 🎴 Smart Cards System
Every saved item automatically transforms into an interactive card:
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
- Caches everything offline

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

---

## 🚀 Installation

### Download

**Option 1: Download Installer (Recommended)**
- Go to [GitHub Releases](https://github.com/NguyenTaiPhat/FloatNote/releases/latest)
- Download `FloatNote-Setup-x.x.x.exe`
- Run installer

**Option 2: Build from Source**
```bash
# Clone repository
git clone https://github.com/NguyenTaiPhat/FloatNote.git
cd FloatNote

# Install dependencies
npm install

# Run development mode
npm run dev

# Build production
npm run build:win
```

Installer will be in `release/` folder

### Configure API Keys (Optional)

To use advanced features, you can register free API keys:

**TMDB (for movie cards):**
1. Register at: https://www.themoviedb.org/settings/api
2. Settings → API Keys → Paste key

**GitHub (for GitHub repo cards):**
1. GitHub → Settings → Developer settings → Personal access tokens
2. Create token with `public_repo` scope
3. Settings → API Keys → Paste token

**YouTube (for YouTube video cards):**
1. Google Cloud Console → Create API Key
2. Enable YouTube Data API v3
3. Settings → API Keys → Paste key

**Note:** All keys are stored locally at `%APPDATA%/floatnote/config.json`, never sent anywhere.

---

## 🎯 Usage

### Creating Cards

**From URL:**
```
Paste: https://github.com/electron/electron
Result: GitHub card with full metadata
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

---

## 🛠️ Tech Stack

- **Framework:** Electron 29
- **UI:** React 18 + TypeScript
- **Styling:** TailwindCSS 3
- **Animations:** Framer Motion 11
- **State:** Zustand 4
- **Database:** better-sqlite3 9 (Local SQLite)
- **Search:** Fuse.js 7
- **Icons:** Lucide React

---

## ⚡ Performance

- Cold launch: <1 second
- RAM usage: <150MB
- Supports 10,000+ cards
- 60 FPS animations
- Instant search

---

## 🔜 Roadmap

- [ ] Plugin system
- [ ] Cloud sync (optional, self-hosted)
- [ ] Git sync
- [ ] Browser extension
- [ ] Mobile apps (iOS/Android)
- [ ] OCR support
- [ ] Voice notes
- [ ] AI assistant chat
- [ ] Multi-window mode

---

## 🤝 Contributing

All contributions are welcome! See [CONTRIBUTING.md](CONTRIBUTING.md) for details.

### How to Contribute:

1. Fork the repository
2. Create branch: `git checkout -b feature/amazing-feature`
3. Commit: `git commit -m "feat: add amazing feature"`
4. Push: `git push origin feature/amazing-feature`
5. Open Pull Request

---

## 📝 License

MIT License - See [LICENSE](LICENSE)

---

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

## 💬 Support

- **Issues:** [GitHub Issues](https://github.com/NguyenTaiPhat/FloatNote/issues)
- **Discussions:** [GitHub Discussions](https://github.com/NguyenTaiPhat/FloatNote/discussions)

---

## ⚠️ Disclaimer

FloatNote is an open-source project, completely free. No ads, no data collection, no malware.

If you're concerned about security, you can:
- Read all source code on GitHub
- Build from source to verify
- Review dependencies in `package.json`
- Check network traffic (app doesn't send data anywhere)

---

**Made with ❤️ for productivity enthusiasts**

[Vietnamese Version](README.md) | **English Version**
