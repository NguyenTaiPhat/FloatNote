# Private Build & Auto-Update Setup

## Mục đích

- **Public repo**: Code mở nguồn, mọi người build từ source
- **Private builds**: Chỉ bạn có auto-update qua private GitHub repo

## Setup

### 1. Tạo Private GitHub Repository

```bash
# Tạo repo private riêng cho updates
# Ví dụ: https://github.com/YOUR_USERNAME/floatnote-private
```

### 2. Config Private Builder

File `electron-builder-private.json` (đã có, chỉ cần sửa):

```json
{
  "appId": "com.floatnote.app.private",
  "productName": "FloatNote Private",
  "publish": [
    {
      "provider": "github",
      "owner": "YOUR_USERNAME",           // ← Đổi thành username của bạn
      "repo": "floatnote-private",        // ← Tên private repo
      "private": true,
      "releaseType": "release"
    }
  ]
}
```

### 3. GitHub Token

Tạo token với quyền truy cập private repo:

**GitHub → Settings → Developer settings → Personal access tokens → Generate new token**

Scopes cần:
- `repo` (full control of private repositories)

Lưu token vào:

**Windows:**
```cmd
set GH_TOKEN=ghp_your_token_here
```

**Mac/Linux:**
```bash
export GH_TOKEN=ghp_your_token_here
```

Hoặc tạo file `.env.private`:
```
GH_TOKEN=ghp_your_token_here
```

## Workflow

### Public Build (cho mọi người):

```bash
npm run build:win
```

Output: `release/FloatNote-Setup-1.0.0.exe` (không auto-update)

### Private Build (chỉ cho bạn):

```bash
# Set token
set GH_TOKEN=ghp_your_token_here

# Build và publish
npm run publish:private
```

Sẽ:
1. Build app với appId riêng
2. Upload lên private GitHub repo
3. Tạo GitHub Release với `latest.yml`

## User Experience

### Public Users:
- Download installer từ GitHub releases (public repo)
- Build từ source code
- **Không có auto-update** (phải download installer mới manually)

### Your Private Build:
- Download từ private repo releases
- **Có auto-update** tự động
- App check private repo để update

## Update Flow (Private)

1. **Bạn phát triển tính năng mới**
2. **Tăng version** trong `package.json`:
   ```json
   "version": "1.0.1"
   ```

3. **Build và publish private**:
   ```bash
   npm run publish:private
   ```

4. **Máy của bạn** (chạy private build):
   - Auto check private repo
   - Thấy v1.0.1 available
   - Download và install automatically

## Security

### Private repo access:

App cần token để check private repo updates. Có 2 cách:

**Option 1: Hardcode trong build (recommended)**

Sửa `electron/updater.ts`:
```typescript
import { autoUpdater } from 'electron-updater';

// Private repo token (chỉ trong private builds)
const PRIVATE_TOKEN = 'ghp_your_token_here';

export function setupAutoUpdater(mainWindow: BrowserWindow) {
    // Set token for private repo
    autoUpdater.setFeedURL({
        provider: 'github',
        owner: 'YOUR_USERNAME',
        repo: 'floatnote-private',
        private: true,
        token: PRIVATE_TOKEN
    });
    
    // ... rest of setup
}
```

**Option 2: Environment variable**

```typescript
const token = process.env.GH_PRIVATE_TOKEN;
if (token) {
    autoUpdater.setFeedURL({
        provider: 'github',
        owner: 'YOUR_USERNAME',
        repo: 'floatnote-private',
        private: true,
        token: token
    });
}
```

## Gitignore

File `electron-builder-private.json` đã được ignore:

```gitignore
# Private configuration
electron-builder-private.json
.env.private
GH_TOKEN.txt
```

**Quan trọng:**
- Public repo: Không có private config
- Local machine: Có `electron-builder-private.json` với settings riêng

## Testing

### Test public build:
```bash
npm run build:win
# Install và test → Không có update tab/feature
```

### Test private build:
```bash
npm run publish:private
# Install private build
# Mở app → Settings → Updates
# Check for updates → Sẽ tìm trên private repo
```

## Distribution

### Public (GitHub public repo):
- Release source code
- Release public build (không auto-update)
- Users có thể build từ source

### Private (GitHub private repo):
- Release private build (có auto-update)
- Chỉ bạn download và dùng
- Auto-update seamlessly

## Commands Summary

```bash
# Development
npm run dev

# Public build (no auto-update)
npm run build:win

# Private build (with auto-update)  
npm run build:private

# Private publish (build + upload private repo)
set GH_TOKEN=your_token
npm run publish:private
```

## Notes

- Private builds có appId khác: `com.floatnote.app.private`
- Không conflict với public builds
- Cùng data và settings (nếu muốn)
- Auto-update chỉ work với private builds

## Best Practices

1. **Public repo**: Luôn giữ clean, không có private configs
2. **Private repo**: Chỉ chứa releases, không cần push code
3. **Local**: Giữ `electron-builder-private.json` local only
4. **Token**: Refresh token định kỳ để bảo mật
