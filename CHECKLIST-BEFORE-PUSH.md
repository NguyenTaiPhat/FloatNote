# Checklist Before Pushing to GitHub

## ✅ Files & Configuration

### Private files đã được gitignore:
- [ ] `electron-builder-private.json` - ignored
- [ ] `.env.private` - ignored
- [ ] `GH_TOKEN.txt` - ignored
- [ ] Database files (`*.db`, `*.db-shm`, `*.db-wal`) - ignored

### Verify gitignore:
```bash
git status
```
Không thấy các files trên trong "Untracked files"

## ✅ Sensitive Data

### Check không có hardcoded secrets:
- [ ] `src/lib/constants.ts` - API keys load từ settings ✅
- [ ] `electron/updater.ts` - Không có private token ✅
- [ ] `electron/main.ts` - Không có sensitive data
- [ ] `package.json` - Không có private publish config

### Search toàn bộ code:
```bash
# Search for potential API keys
grep -r "api[_-]key\s*=" src/
grep -r "token\s*=" electron/
grep -r "secret\s*=" src/
```

## ✅ Build Configuration

### Public build setup:
- [ ] `package.json` - Build section **không có** `publish` config
- [ ] Chỉ có scripts: `build:win`, `build`, `dev`
- [ ] **Không có** scripts: `publish:private`

### GitHub Actions ready:
- [ ] `.github/workflows/build.yml` - exists
- [ ] `.github/workflows/release.yml` - exists
- [ ] `.gitattributes` - exists

## ✅ Documentation

- [ ] `README.md` - Updated và complete
- [ ] `CONTRIBUTING.md` - Has contribution guidelines
- [ ] `DEPLOY-PUBLIC.md` - Has deployment guide
- [ ] `CHANGELOG.md` - Updated with latest changes
- [ ] `LICENSE` - MIT license

## ✅ Code Quality

### Run checks:
```bash
# Type check
npm run type-check

# Lint
npm run lint

# Format check
npm run format:check
```

All should pass without errors.

### Test build:
```bash
npm run build:win
```

Should build successfully and create files in `release/`

## ✅ Version

- [ ] Version trong `package.json` đúng (vd: `1.0.0`)
- [ ] Ready to tag với `v1.0.0`

## ✅ Git

### Clean working directory:
```bash
git status
```
Should be clean or only have intended changes.

### Commit messages clear:
```bash
git log --oneline -5
```
Recent commits should have meaningful messages.

## 🚀 Ready to Push

### First time push:

1. **Create GitHub repo** (public)

2. **Add remote:**
```bash
git remote add origin https://github.com/YOUR_USERNAME/floatnote.git
```

3. **Push code:**
```bash
git branch -M main
git push -u origin main
```

4. **Push tags (if any):**
```bash
git push origin --tags
```

### First release:

1. **Tăng version** (nếu chưa):
```bash
npm version 1.0.0
```

2. **Push tag:**
```bash
git push origin v1.0.0
```

3. **GitHub Actions sẽ:**
   - Build Windows installer
   - Create GitHub Release
   - Upload artifacts

4. **Check GitHub:**
   - Actions tab → See workflow running
   - Releases tab → See new release sau khi xong

## ⚠️ Final Checks

### Security:
- [ ] Không có private token nào trong code
- [ ] Không có database files trong git
- [ ] Không có node_modules trong git
- [ ] Không có build artifacts trong git

### Files to ignore (already in .gitignore):
```
node_modules/
dist/
dist-electron/
release/
*.db
*.db-shm
*.db-wal
electron-builder-private.json
.env.private
```

### Repository Settings (sau khi push):

1. **Settings → General:**
   - Description: "Premium desktop second brain with intelligent cards"
   - Website: (nếu có)
   - Topics: `electron`, `typescript`, `react`, `desktop-app`, `note-taking`

2. **Settings → Actions → General:**
   - Workflow permissions: "Read and write permissions" ✅

3. **Settings → Pages:**
   - (Optional) Deploy documentation

## 🎉 Done!

Sau khi push:
- [ ] GitHub repo accessible
- [ ] GitHub Actions workflows running
- [ ] No sensitive data exposed
- [ ] README renders correctly
- [ ] Users có thể clone và build

---

**Next Steps:**
1. Create first release via GitHub UI hoặc push tag `v1.0.0`
2. Wait for GitHub Actions to build
3. Download artifacts và test
4. Share với users! 🚀
