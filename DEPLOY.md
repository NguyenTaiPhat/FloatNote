# Deployment & Auto-Update Guide

## Cách hoạt động của Auto-Update

### Quy trình tự động:

1. **Developer** tăng version trong `package.json` (vd: 1.0.0 → 1.0.1)
2. Build app: `npm run build`
3. Publish lên GitHub: `npm run publish:win` (hoặc mac/linux)
4. electron-builder tự động:
   - Build installer
   - Upload lên GitHub Releases
   - Tạo file `latest.yml` chứa thông tin version mới

5. **User app** tự động:
   - Check GitHub Releases mỗi khi mở app
   - Phát hiện version mới
   - Hiển thị notification "Update Available"
   - Download update in background
   - Prompt user để install

6. **User** click "Install Update"
   - App restart và cài đặt version mới
   - Tất cả dữ liệu được giữ nguyên

## Setup Requirements

### 1. Cài dependencies

```bash
npm install electron-updater electron-log --save
```

### 2. Config GitHub Repository

Trong `package.json`, đổi:
```json
{
  "build": {
    "publish": [{
      "provider": "github",
      "owner": "YOUR_GITHUB_USERNAME",  // ← Đổi thành username của bạn
      "repo": "floatnote",               // ← Đổi thành tên repo
      "releaseType": "release"
    }]
  }
}
```

### 3. Tạo GitHub Token

1. Vào GitHub → Settings → Developer settings → Personal access tokens
2. Generate new token (classic)
3. Chọn scopes: `repo` (full control)
4. Copy token

### 4. Set environment variable

**Windows:**
```cmd
set GH_TOKEN=your_github_token_here
```

**Mac/Linux:**
```bash
export GH_TOKEN=your_github_token_here
```

Hoặc tạo file `.env`:
```
GH_TOKEN=your_github_token_here
```

## Release Workflow

### Bước 1: Update Version

Sửa `package.json`:
```json
{
  "version": "1.0.1"  // Tăng version
}
```

### Bước 2: Commit & Tag

```bash
git add .
git commit -m "Release v1.0.1: Add new features"
git tag v1.0.1
git push origin main
git push origin v1.0.1
```

### Bước 3: Build & Publish

**Windows:**
```bash
npm run publish:win
```

**Mac:**
```bash
npm run publish:mac
```

**Linux:**
```bash
npm run publish:linux
```

**All platforms:**
```bash
npm run publish:all
```

### Bước 4: Verify GitHub Release

1. Vào GitHub repo → Releases
2. Sẽ thấy release mới (vd: v1.0.1)
3. Có các files:
   - `FloatNote-Setup-1.0.1.exe` (Windows)
   - `FloatNote-1.0.1.dmg` (Mac)
   - `FloatNote-1.0.1.AppImage` (Linux)
   - `latest.yml` (metadata cho updater)

## User Experience

### Khi có update mới:

1. **App khởi động** → Auto check GitHub releases
2. **Nếu có version mới:**
   - Toast notification: "Update available"
   - Badge trên Settings icon
   - Settings → Updates tab hiển thị update info

3. **User click "Check for Updates":**
   - Shows latest version
   - Shows release notes
   - Button "Download Update"

4. **Auto-download** (nếu bật):
   - Download in background
   - Progress bar hiển thị
   - Khi xong: "Update downloaded, ready to install"

5. **User click "Install Update":**
   - App đóng
   - Installer chạy
   - App mở lại với version mới

## Testing

### Test trong development:

Không thể test electron-updater trong dev mode. Cần:

1. Build production: `npm run build:win`
2. Install app đã build
3. Publish version mới lên GitHub
4. Mở app đã install → Sẽ detect update

### Test workflow:

1. Build v1.0.0 và install
2. Đổi version thành 1.0.1
3. Build và publish: `npm run publish:win`
4. Mở app v1.0.0
5. Check Settings → Updates
6. Sẽ thấy "Update available to v1.0.1"

## Configuration Options

### Auto-update settings:

**updater.ts:**
```typescript
autoUpdater.autoDownload = false;  // false = manual download
autoUpdater.autoInstallOnAppQuit = true;  // Install khi quit
```

**User có thể toggle:**
- Settings → Updates → Auto Update (toggle)
- Nếu bật: Tự động download updates
- Nếu tắt: Phải manual click "Download"

## Troubleshooting

### Update không detect:

**Check:**
1. App phải là production build (không phải dev mode)
2. GitHub repo phải có Releases
3. `latest.yml` phải có trong Release
4. Token GH_TOKEN phải valid
5. Internet connection

**Debug:**
```typescript
// Xem logs trong updater.ts
log.info('Checking for updates...');
```

### Build fails:

**Common issues:**
- Missing GH_TOKEN
- Invalid token scopes
- Network issues
- Code signing certificate (Mac/Windows)

## Best Practices

### Version naming:
- Dùng semantic versioning: `MAJOR.MINOR.PATCH`
- `1.0.0` → `1.0.1` (bug fixes)
- `1.0.0` → `1.1.0` (new features)
- `1.0.0` → `2.0.0` (breaking changes)

### Release notes:
- Viết clear release notes trong GitHub Release
- Liệt kê new features, bug fixes
- User sẽ thấy trong app

### Testing:
- Test update flow trước khi release
- Keep at least 2 versions để test upgrade path

## Security

### Code signing:

**Windows:**
- Cần certificate để sign .exe
- Không sign → Windows SmartScreen warning

**Mac:**
- Cần Apple Developer account
- Notarize app để bypass Gatekeeper

**Tạm thời:**
- Có thể release unsigned cho testing
- Production nên có code signing

## Summary

**Lợi ích:**
✅ User không cần download installer mới manually
✅ Tự động check updates khi mở app
✅ Download và install seamlessly
✅ Giữ nguyên data và settings
✅ Rollout updates nhanh cho tất cả users

**Để release update:**
1. Tăng version trong package.json
2. `npm run publish:win`
3. Done! All users sẽ nhận update notification

**User experience:**
- Mở app → Thấy notification "Update available"
- Click "Install Update" → App restart với version mới
- Toàn bộ data vẫn còn nguyên
