# FloatNote User Guide

Complete guide to mastering FloatNote productivity features.

---

## Table of Contents

1. [Getting Started](#getting-started)
2. [Creating Cards](#creating-cards)
3. [Organizing with Workspaces](#organizing-with-workspaces)
4. [Search & Navigation](#search--navigation)
5. [Views & Visualization](#views--visualization)
6. [Widgets & Floating Windows](#widgets--floating-windows)
7. [Backup & Data Management](#backup--data-management)
8. [Keyboard Shortcuts](#keyboard-shortcuts)
9. [Tips & Tricks](#tips--tricks)

---

## Getting Started

### First Launch

When you first open FloatNote:
1. A default workspace "Personal" is created
2. Sample cards demonstrate features
3. The sidebar shows navigation
4. Global shortcuts are registered

### Interface Overview

```
┌────────────────────────────────────────────┐
│ Title Bar                                  │
├──────┬────────────────────────────────────┤
│      │ Header: All Cards (24)             │
│      ├────────────────────────────────────┤
│ Side │                                    │
│ bar  │         Card Grid/List             │
│      │                                    │
│      │                                    │
└──────┴────────────────────────────────────┘
```

---

## Creating Cards

### Method 1: Quick Add Button

1. Click **"Add Card"** button (top right)
2. Paste URL or type text
3. Press **"Create Card"**

### Method 2: Command Palette

1. Press **Ctrl + Shift + P**
2. Type "Add Card"
3. Enter content

### Method 3: Keyboard Shortcut

- **Ctrl + N** - New card dialog

### Supported URL Types

| Service | Example URL | Result |
|---------|-------------|--------|
| **GitHub** | `github.com/user/repo` | Repo card with stars, forks, topics |
| **YouTube** | `youtube.com/watch?v=...` | Video card with thumbnail, duration |
| **Spotify** | `open.spotify.com/track/...` | Track card with album art |
| **Movie** | TMDB movie link | Movie card with poster, rating |
| **Website** | Any URL | OpenGraph card with metadata |

### Card Fields

All cards support:
- **Title** - Main heading
- **Description** - Detailed text
- **Tags** - Comma-separated keywords
- **Category** - Grouping label
- **Favorite** - Star toggle
- **Archive** - Hide from main view

---

## Organizing with Workspaces

### Create Workspace

1. Click **"+"** next to Workspaces in sidebar
2. Enter workspace name
3. Choose color
4. Press Create

### Switch Workspaces

- Click workspace name in sidebar
- Active workspace shows primary color

### Workspace Features

Each workspace has:
- Independent card collection
- Separate settings
- Custom layout preferences
- Unique widgets

### Best Practices

```
Personal - Life, hobbies, interests
Work - Projects, tasks, meetings
Learning - Courses, tutorials, books
Projects - Per-project organization
Archive - Completed or inactive items
```

---

## Search & Navigation

### Global Search (Alt + Space)

**Fuzzy search** across:
- Card titles
- Descriptions
- Content
- Tags
- URLs

**Features:**
- Instant results as you type
- Keyboard navigation (↑↓)
- Preview cards
- Press Enter to open
- ESC to close

**Search Tips:**
```
github          → Find all GitHub cards
project:web     → Cards tagged "web"
@starred        → Favorite cards
type:youtube    → All YouTube cards
```

### Command Palette (Ctrl + Shift + P)

Quick actions:
- Create new cards
- Switch views
- Change workspaces
- Toggle features
- Run commands

**Navigation:**
- Type to filter
- ↑↓ to select
- Enter to execute
- ESC to cancel

---

## Views & Visualization

### Grid View

**Best for:** Visual browsing, images, thumbnails

- Cards in responsive grid
- 2-4 columns depending on window size
- Hover to see details
- Click to open

### List View

**Best for:** Text-heavy content, scanning

- Full-width cards
- Compact spacing
- More content visible
- Easy scrolling

### Timeline View

**Best for:** Chronological exploration

- Groups by date
- Most recent first
- Visual timeline line
- Date headers

### Graph View

**Best for:** Discovering connections

**Features:**
- Interactive force-directed graph
- Color-coded by type
- Zoom with mouse wheel
- Pan by dragging
- Click nodes to focus

**Controls:**
- 🔍+ Zoom in
- 🔍- Zoom out
- ⛶ Fit to view

**Legend:**
Shows card type colors:
- Blue: Note
- Purple: Website
- Pink: GitHub
- Red: YouTube
- Green: Spotify
- Orange: Movie

---

## Widgets & Floating Windows

### Available Widgets

1. **Clock Widget**
   - Real-time clock
   - Date display
   - Multiple formats

2. **Weather Widget**
   - Current weather
   - Forecast
   - Location-based

3. **Todo Widget**
   - Quick tasks
   - Check off items
   - Sync with cards

4. **Countdown Widget**
   - Track deadlines
   - Visual progress
   - Notifications

5. **Quote Widget**
   - Daily inspiration
   - Random quotes
   - Custom collections

6. **System Monitor**
   - CPU usage
   - RAM usage
   - Disk space

### Creating Widget Windows

1. Press **Ctrl + Shift + P**
2. Type "Create Widget"
3. Select widget type
4. Widget opens as floating window

### Widget Features

- **Always on top** - Stays above other windows
- **Transparent** - Glass morphism design
- **Draggable** - Move anywhere
- **Resizable** - Adjust size
- **Multi-monitor** - Works across displays

---

## Backup & Data Management

### Auto-Backup System

**Automatic backups:**
- Runs every 60 minutes
- Keeps last 10 backups
- Stored in user data folder
- No configuration needed

### Manual Backup

1. Go to **Settings → Backup**
2. Click **"Create Backup Now"**
3. Backup added to list

### Restore from Backup

1. Go to **Settings → Backup**
2. Find backup in list
3. Click restore icon (↑)
4. Confirm restoration
5. **Restart app** to apply

### Export Database

1. Go to **Settings → Backup**
2. Click **"Export Database"**
3. Choose save location
4. Full database exported

**Use cases:**
- Moving to new computer
- Manual backup before major changes
- Sharing data across devices
- Creating archive copy

### Import Database

1. Replace database file
2. Restart FloatNote
3. Data loaded automatically

**Database location:**
- Windows: `%APPDATA%\floatnote\floatnote.db`
- macOS: `~/Library/Application Support/floatnote/floatnote.db`
- Linux: `~/.config/floatnote/floatnote.db`

---

## Keyboard Shortcuts

### Global Shortcuts

| Shortcut | Action |
|----------|--------|
| `Alt + Space` | Open Global Search |
| `Ctrl + Shift + P` | Open Command Palette |
| `Ctrl + Alt + B` | Toggle Boss Mode |

### Application Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl + N` | New Card |
| `Ctrl + S` | Save Changes |
| `Ctrl + F` | Focus Search |
| `Ctrl + W` | Close Modal |
| `Delete` | Delete Selected Card |
| `Ctrl + D` | Duplicate Card |
| `Ctrl + E` | Edit Card |

### Navigation

| Shortcut | Action |
|----------|--------|
| `↑↓` | Navigate Lists |
| `←→` | Switch Tabs |
| `Enter` | Open/Select |
| `ESC` | Cancel/Close |
| `Tab` | Next Field |
| `Shift + Tab` | Previous Field |

### View Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl + 1` | Grid View |
| `Ctrl + 2` | List View |
| `Ctrl + 3` | Timeline View |
| `Ctrl + G` | Graph View |

---

## Tips & Tricks

### Productivity Workflows

**Quick Capture:**
```
1. Alt + Space
2. Type or paste URL
3. Enter
→ Card created in seconds
```

**Batch Organization:**
```
1. Create cards freely
2. Use Tags for categorization
3. Sort with Graph View later
4. Refine connections as needed
```

**Focus Mode:**
```
1. Create dedicated workspace
2. Add only relevant cards
3. Hide distractions
4. Use Boss Mode when needed
```

### Power User Features

**Smart Tags:**
- Use consistent tag naming
- Combine tags for filtering
- Create tag hierarchies
- Example: `project/web`, `project/mobile`

**Workspace Strategy:**
- Keep workspace count reasonable (5-7)
- Use colors for quick recognition
- Archive old workspaces instead of deleting
- Switch contexts, not tasks

**Related Cards:**
- Check Related Cards panel
- Discover hidden connections
- Build knowledge graph organically
- Review relationships weekly

### Performance Optimization

**Keep FloatNote Fast:**
- Archive old cards (> 1000 cards)
- Clear unused workspaces
- Delete duplicate cards
- Regular backups prevent corruption

**Search Tips:**
- Use specific keywords
- Filter by type
- Leverage tags
- Star important cards

### Data Safety

**Best Practices:**
- Enable auto-backup (default on)
- Manual backup before major changes
- Export monthly archives
- Keep backups on external drive
- Test restore occasionally

---

## Troubleshooting

### Common Issues

**Search not working:**
- Restart FloatNote
- Rebuild search index
- Check card content

**Cards not loading:**
- Check internet connection
- Verify API keys (GitHub, TMDB)
- Clear cache and restart

**Slow performance:**
- Archive old cards
- Close unused widgets
- Restart application
- Check system resources

**Backup failed:**
- Check disk space
- Verify permissions
- Try manual backup
- Contact support

---

## Getting Help

- **Documentation:** Built-in help system
- **Community:** GitHub Discussions
- **Issues:** GitHub Issues
- **Email:** support@floatnote.app

---

**Happy organizing! 🚀**
