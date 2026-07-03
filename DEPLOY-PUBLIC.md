# Public Build & GitHub Release

## Workflow tự động với GitHub Actions

### Setup

1. **Push code lên GitHub:**
```bash
git remote add origin https://github.com/YOUR_USERNAME/floatnote.git
git branch -M main
git push -u origin main
```

2. **GitHub Actions tự động build:**
   - Push vào `main` hoặc `develop` → `.github/workflows/build.yml` chạy
   - Kiểm tra type-check, lint, build
   - Upload artifacts (có thể download trong Actions tab)

### Release Process

**Option 1: Via GitHub UI (Recommended)**

1. Tăng version trong `package.json`:
```json
{
  "version": "1.0.0"
}
```

2. Commit và push:
```bash
git add package.json
git commit -m "Bump version to 1.0.0"
git push origin main
```

3. Vào GitHub repo → **Releases** → **Draft a new release**
4. **Choose a tag** → Tạo tag mới: `v1.0.0`
5. **Target:** `main` branch
6. **Release title:** `FloatNote v1.0.0`
7. **Description:** Copy từ CHANGELOG.md
8. Click **Publish release**

→ Workflow `.github/workflows/release.yml` tự động:
- Build Windows installer (x64 + ia32)
- Upload `.exe` files lên release
- Tạo release notes tự động

**Option 2: Via Git Tag**

```bash
# Tăng version trong package.json
npm version 1.0.0  # Tự động tạo commit và tag

# Push cả code và tag
git push origin main
git push origin v1.0.0
```

→ Workflow `release.yml` tự động chạy khi detect tag `v*`

### Release Artifacts

Sau khi workflow chạy xong, GitHub Release sẽ có:

- `FloatNote-Setup-1.0.0.exe` - NSIS installer (hỗ trợ x64 và ia32)
- `FloatNote-1.0.0.exe` - Portable version (chỉ x64)
- `latest.yml` - Metadata file (không dùng cho public build vì không có auto-update)

### Download Flow cho Users

Users có 2 cách:

**1. Download pre-built installer:**
- Vào GitHub Releases
- Download `FloatNote-Setup-x.x.x.exe`
- Chạy installer

**2. Build from source:**
```bash
git clone https://github.com/YOUR_USERNAME/floatnote.git
cd floatnote
npm install
npm run build:win
```

Installer sẽ nằm trong folder `release/`

### Version Management

```bash
# Patch: 1.0.0 → 1.0.1 (bug fixes)
npm version patch

# Minor: 1.0.0 → 1.1.0 (new features)
npm version minor

# Major: 1.0.0 → 2.0.0 (breaking changes)
npm version major

# Push tag để trigger release workflow
git push origin --tags
```

### Workflow Files

**`.github/workflows/build.yml`:**
- Trigger: Push vào `main`, `develop`, hoặc Pull Requests
- Build và test trên mỗi commit
- Upload artifacts (lưu 7 ngày)
- Không tạo GitHub Release

**`.github/workflows/release.yml`:**
- Trigger: Push tag `v*` (vd: `v1.0.0`)
- Build production version
- Tạo GitHub Release tự động
- Upload installers lên Release
- Generate release notes từ commits

### Notes

#### Public Build vs Private Build

**Public Build (repo này):**
- ❌ **Không có auto-update**
- ✅ Mọi người build từ source
- ✅ Download installer từ GitHub Releases
- ✅ Hoàn toàn miễn phí
- ✅ Open source

**Private Build (theo PRIVATE-BUILD.md):**
- ✅ **Có auto-update**
- ✅ Chỉ cho developer
- ✅ Cần private GitHub repo riêng
- ✅ Cần GitHub token

#### GitHub Token

Workflow dùng `GITHUB_TOKEN` tự động:
- GitHub tự động tạo token cho workflow
- **Không cần config gì thêm**
- Chỉ có quyền trong repo này
- Không cần Personal Access Token

#### Testing Workflow

**Test build workflow:**
```bash
# Push code lên branch develop hoặc main
git push origin main

# Vào GitHub repo → Actions tab
# Xem workflow "Build FloatNote" chạy
# Download artifacts sau khi xong
```

**Test release workflow:**
```bash
# Tạo test tag
git tag v1.0.0-beta
git push origin v1.0.0-beta

# Vào GitHub repo → Actions tab
# Xem workflow "Release FloatNote" chạy
# Kiểm tra GitHub Releases có release mới
```

### Troubleshooting

**Build fails:**
- Check logs trong Actions tab
- Thường do: dependencies, lint errors, type errors

**Release không tạo:**
- Kiểm tra tag format phải là `v*` (vd: `v1.0.0`)
- Kiểm tra permissions: Settings → Actions → Workflow permissions → "Read and write permissions"

**Upload artifacts fails:**
- Check `release/` folder có files không
- Check electron-builder config trong package.json

### Best Practices

1. **Luôn test trước khi release:**
   - Push vào `develop` branch
   - Đợi build workflow pass
   - Download artifacts và test
   - Merge vào `main` và tạo tag

2. **Version naming:**
   - Dùng semantic versioning: `MAJOR.MINOR.PATCH`
   - Prefix tag bằng `v`: `v1.0.0`

3. **Release notes:**
   - GitHub tự động generate từ commits
   - Hoặc edit manual để rõ ràng hơn
   - List new features, bug fixes, breaking changes

4. **Keep CHANGELOG.md updated:**
   - Document changes trong file này
   - Copy vào GitHub Release description

### Security

Files được gitignore (không push lên GitHub):

```gitignore
# Private configuration
electron-builder-private.json
.env.private
GH_TOKEN.txt

# Database
*.db
*.db-shm
*.db-wal
```

**Checklist trước khi push:**
- ✅ Không có hardcoded API keys
- ✅ Không có private tokens
- ✅ Database files đã ignored
- ✅ Private config files đã ignored

### Summary

**Workflow tự động:**
1. Push code → Build tự động
2. Push tag `v*` → Release tự động
3. Users download từ Releases

**Không cần:**
- ❌ Manual build trên máy local
- ❌ Upload files manually
- ❌ GitHub token (workflow tự động có)

**Chỉ cần:**
1. Tăng version trong `package.json`
2. Commit và push tag
3. Done!
