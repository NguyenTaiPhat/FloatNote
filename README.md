# FloatNote

**Bộ Não Thứ Hai Cho Desktop Của Bạn**

FloatNote là ứng dụng desktop mã nguồn mở giúp bạn tổ chức mọi thứ thành các thẻ tương tác thông minh. Kết hợp ghi chú, bookmark, knowledge base, widgets và AI assistant trong một workspace đẹp mắt.

![FloatNote](https://via.placeholder.com/1200x600/0a0a0a/3b82f6?text=FloatNote)

---

## 🔒 Bảo Mật & Riêng Tư

⭐ **100% Mã Nguồn Mở** - Toàn bộ code có thể kiểm tra và đóng góp tại [GitHub](https://github.com/NguyenTaiPhat/FloatNote)

🔐 **Không Thu Thập Dữ Liệu** - Không có telemetry, analytics, hoặc tracking bất kỳ

💾 **Dữ Liệu Lưu Local** - Tất cả notes, bookmarks, settings được lưu trên máy bạn

🚫 **Không Có Mã Độc** - Code được public hoàn toàn, có thể tự build và kiểm tra

🔑 **API Keys An Toàn** - Các API keys (TMDB, GitHub, YouTube) bạn nhập được lưu trong:
- **Windows:** `%APPDATA%/floatnote/config.json`
- Chỉ ở local, không gửi đi đâu
- Bạn tự đăng ký và quản lý keys của mình

🗄️ **Database Offline** - SQLite database (`floatnote.db`) lưu local tại:
- **Dev:** `./floatnote.db`
- **Production:** `%APPDATA%/floatnote/`

---

## ✨ Tính Năng

### 🎴 Hệ Thống Thẻ Thông Minh
Mọi thứ bạn lưu đều tự động chuyển thành thẻ tương tác:
- **Thẻ Ghi Chú** - Rich text notes với markdown support
- **Thẻ Website** - Tự động fetch metadata, favicon, OG images
- **Thẻ GitHub** - Thông tin repo, stars, forks, topics, preview README
- **Thẻ YouTube** - Thumbnail, duration, channel, views, watch later
- **Thẻ Phim** - Tích hợp TMDB/IMDb, ratings, posters, streaming links
- **Thẻ Spotify** - Album covers, artists, track counts
- Và nhiều hơn: Reddit, Medium, PDF, Images, Files, Todo, Countdown, Calendar

### 🔍 Tự Động Nhận Diện Link
Paste bất kỳ URL nào, FloatNote tự động:
- Nhận diện loại service
- Fetch toàn bộ metadata
- Tạo card layout đẹp
- Cache mọi thứ offline

### 🤖 AI Hiểu Nội Dung (Local First)
AI tự động:
- Tóm tắt nội dung
- Tạo tags phù hợp
- Tìm categories
- Trích xuất keywords
- Gợi ý thẻ liên quan
- Tạo connections

### 🌐 Graph View
Visualize mối liên hệ giữa các thẻ:
- Interactive node graph
- Zoom và pan
- Độ mạnh relationship
- Gợi ý thông minh

### 🎨 Floating Widgets
Biến bất kỳ thẻ nào thành widget trên desktop:
- Always on top
- Custom opacity
- Compact/Normal/Expanded modes
- Kéo thả tùy ý
- Hỗ trợ nhiều màn hình

### 📌 Edge Dock
Sidebar ẩn mở ra khi hover:
- Quick access pinned cards
- Recent notes
- Bookmarks
- Widgets
- Quick actions

### ⚡ Global Search (Alt + Space)
Tìm kiếm instant fuzzy search:
- Tất cả cards
- Nội dung notes
- Bookmarks
- Tags
- Projects
- History

### ⌨️ Command Palette (Ctrl + Shift + P)
Thực thi mọi thứ bằng bàn phím:
- Tạo cards mới
- Chuyển workspaces
- Đổi views
- Chạy commands

### 👻 Boss Mode (Ctrl + Alt + B)
Ẩn mọi thứ ngay lập tức:
- Tất cả windows
- Floating widgets
- Edge dock
- Tùy chọn PIN protection
- Windows Hello support

### 🏢 Workspaces
Tổ chức theo ngữ cảnh:
- Personal
- Coding
- Movies
- School
- Business
- Photography

Mỗi workspace có cards, widgets, layouts riêng.

### 📊 Timeline & History
- Theo dõi mọi thay đổi
- Timeline trực quan
- Restore bất kỳ version nào
- Auto backup system

---

## 🚀 Cài Đặt & Sử Dụng

### Tải Về

**Option 1: Tải Installer (Khuyên Dùng)**
- Vào [GitHub Releases](https://github.com/NguyenTaiPhat/FloatNote/releases/latest)
- Tải `FloatNote-Setup-x.x.x.exe`
- Chạy installer

**Option 2: Build Từ Source**
```bash
# Clone repo
git clone https://github.com/NguyenTaiPhat/FloatNote.git
cd FloatNote

# Cài dependencies
npm install

# Chạy development mode
npm run dev

# Build production
npm run build:win
```

Installer sẽ nằm trong folder `release/`

### Cấu Hình API Keys (Tùy Chọn)

Để dùng một số tính năng nâng cao, bạn có thể đăng ký API keys miễn phí:

**TMDB (cho thẻ phim):**
1. Đăng ký tại: https://www.themoviedb.org/settings/api
2. Settings → API Keys → Paste key

**GitHub (cho thẻ GitHub repo):**
1. GitHub → Settings → Developer settings → Personal access tokens
2. Tạo token với scope `public_repo`
3. Settings → API Keys → Paste token

**YouTube (cho thẻ YouTube video):**
1. Google Cloud Console → Create API Key
2. Enable YouTube Data API v3
3. Settings → API Keys → Paste key

**Lưu ý:** Tất cả keys được lưu local tại `%APPDATA%/floatnote/config.json`, không gửi đi đâu.

---

## 🎯 Sử Dụng

### Tạo Thẻ

**Từ URL:**
```
Paste: https://github.com/electron/electron
Kết quả: Thẻ GitHub với đầy đủ metadata
```

**Từ Text:**
```
Nhập: Nhớ update documentation
Kết quả: Thẻ ghi chú với timestamp
```

**Tìm Phim:**
```
Command Palette → "Add Movie" → "Fight Club"
Kết quả: Thẻ phim với poster, rating, thể loại
```

### Phím Tắt

| Phím Tắt | Chức Năng |
|----------|-----------|
| `Alt + Space` | Global Search |
| `Ctrl + Shift + P` | Command Palette |
| `Ctrl + Alt + B` | Boss Mode |
| `Ctrl + N` | Thẻ Mới |
| `Ctrl + S` | Lưu |
| `Delete` | Xóa Thẻ |
| `ESC` | Đóng Modal |

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

## 🎨 Design

**Colors:**
- Background: `#0a0a0a`
- Surface: `#1e1e1e`
- Primary: `#3b82f6`
- Accents: Purple, Pink, Orange, Green, Yellow

**Typography:**
- System fonts
- -apple-system, BlinkMacSystemFont, Segoe UI

**Animations:**
- 60 FPS smooth transitions
- Framer Motion powered
- Spring physics

---

## ⚡ Performance

- Cold launch: <1 giây
- RAM usage: <150MB
- Hỗ trợ 10,000+ thẻ
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

## 🤝 Đóng Góp

Mọi đóng góp đều được chào đón! Xem [CONTRIBUTING.md](CONTRIBUTING.md) để biết thêm chi tiết.

### Cách Đóng Góp:

1. Fork repo
2. Tạo branch: `git checkout -b feature/amazing-feature`
3. Commit: `git commit -m "feat: add amazing feature"`
4. Push: `git push origin feature/amazing-feature`
5. Mở Pull Request

---

## 📝 License

MIT License - Xem [LICENSE](LICENSE)

---

## 🙏 Credits

Lấy cảm hứng từ:
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

FloatNote là project mã nguồn mở, hoàn toàn miễn phí. Không có quảng cáo, không thu thập dữ liệu, không có mã độc. 

Nếu bạn lo ngại về bảo mật, bạn có thể:
- Đọc toàn bộ source code tại GitHub
- Build từ source để kiểm tra
- Review dependencies trong `package.json`
- Kiểm tra network traffic (app không gửi dữ liệu đi đâu)

---

**Made with ❤️ for productivity enthusiasts**

**Vietnamese Version** | [English Version](README.en.md)
