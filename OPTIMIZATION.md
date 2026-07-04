# FloatNote - Bundle Size Optimization

## 🔍 Problem Analysis

### Before Optimization
- **app.asar**: 914 MB
- **Setup.exe**: 495 MB
- **Root cause**: All node_modules packed into app.asar (~12,531 files)

### Major Contributors
1. **electron** (254MB) - Dev dependency wrongly packed
2. **app-builder-bin** (121MB) - Dev dependency
3. **typescript** (22MB) - Dev dependency
4. **lucide-react** (21MB) - Could be tree-shaken better
5. **date-fns** (21MB) - Already optimized (using specific imports)
6. **@img/sharp** (18MB) - Image processing, needed
7. **better-sqlite3** (11MB) - Database, needed

## ✅ Optimization Steps Applied

### 1. Electron-Builder Config
**File**: `package.json` → `build` section

Added exclusions:
```json
"files": [
  "dist/**/*",
  "electron/**/*.js",
  "assets/**/*",
  "package.json",
  "!electron/**/*.ts",
  "!**/node_modules/**/{CHANGELOG.md,README.md,README,readme.md,readme}",
  "!**/node_modules/**/{test,__tests__,tests,powered-test,example,examples}",
  "!**/node_modules/**/*.d.ts",
  "!**/node_modules/.bin"
]
```

### 2. Native Module Handling
**asarUnpack** for native modules:
```json
"asarUnpack": [
  "node_modules/better-sqlite3/**/*",
  "node_modules/sharp/**/*"
]
```

### 3. Compression
```json
"compression": "maximum",
"removePackageScripts": true,
"npmRebuild": true
```

### 4. Dev Dependencies Cleanup
Moved to `devDependencies`:
- prettier
- rimraf
- All @types/*
- eslint packages
- Build tools

### 5. Advanced Config
**File**: `.electron-builder.js`

Hooks to prune dev dependencies before packing:
```javascript
beforePack: async (context) => {
    execSync('npm prune --production');
}
```

## 📊 Results

### After Optimization
- **app.asar**: 333 MB (~64% reduction from 914MB)
- **Setup.exe**: ~200 MB (estimated)
- **Files in asar**: Still ~12,500 (need further optimization)

## 🎯 Further Optimization Ideas

### Phase 2 (Can implement)

#### 1. Split Dependencies
Move some large libraries to externals:
```javascript
// vite.config.ts
export default {
  build: {
    rollupOptions: {
      external: ['sharp', 'better-sqlite3']
    }
  }
}
```

#### 2. Dynamic Imports
Lazy load heavy features:
```typescript
// Before
import { GraphView } from './GraphView';

// After
const GraphView = lazy(() => import('./GraphView'));
```

#### 3. Replace Heavy Libraries

**Replace sharp** (18MB):
- Only use for server-side resize
- Use Canvas API for client-side
- Or use lighter alternative: `jimp` (3MB)

**Replace lucide-react** (21MB):
- Use @iconify/react (tree-shakable)
- Or create custom icon subset

#### 4. Code Splitting
Split by route:
```typescript
const HomePage = lazy(() => import('./pages/HomePage'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));
const GraphPage = lazy(() => import('./pages/GraphPage'));
```

#### 5. Remove Unused Dependencies
Check with:
```bash
npx depcheck
```

Candidates:
- `file-type`: Only used in one place?
- `fuse.js`: Can use simpler search?
- `react-force-graph-2d`: Heavy, only for graph view

#### 6. Optimize Images/Assets
- Compress icon.ico
- Use WebP for assets
- Remove unused fonts

### Phase 3 (Advanced)

#### 1. Two-Stage Loading
- Ship minimal core (~50MB)
- Download features on-demand
- Cache in AppData

#### 2. Native Modules Alternative
- Replace better-sqlite3 with sql.js (wasm, smaller)
- Use IndexedDB for simple cases

#### 3. Webpack Bundle Analyzer
```bash
npm install --save-dev webpack-bundle-analyzer
```

Analyze what's taking space in app.asar

## 🚀 Quick Wins (Immediate Impact)

### 1. Remove Sharp (if not critical)
**Savings**: ~18MB

If not doing server-side image processing:
```bash
npm uninstall sharp
```

### 2. Tree-shake lucide-react better
Already using named imports ✅

### 3. Use production build
```bash
NODE_ENV=production npm run build:win
```

### 4. Compress with UPX (Windows)
```bash
upx --best dist/win-unpacked/FloatNote.exe
```
**Savings**: 30-40% exe size

## 📝 Target Goals

### Realistic Targets
- **app.asar**: 150-200 MB (from 333MB)
- **Setup.exe**: 100-150 MB (from 495MB)
- **Portable.exe**: 80-120 MB

### Aggressive Targets
- **app.asar**: 80-100 MB
- **Setup.exe**: 60-80 MB
- Would require:
  - Replace/remove sharp
  - Replace/remove heavy deps
  - Extensive code splitting
  - External module loading

## 🔧 Implementation Plan

### Week 1: Low-hanging Fruit
- [x] Configure electron-builder exclusions
- [x] Add compression: maximum
- [x] Move dev deps correctly
- [ ] Run depcheck and remove unused
- [ ] Compress assets
- [ ] UPX compression

### Week 2: Code Splitting
- [ ] Lazy load routes
- [ ] Lazy load widgets
- [ ] Lazy load graph view
- [ ] Dynamic import for heavy features

### Week 3: Dependencies
- [ ] Audit with webpack-bundle-analyzer
- [ ] Replace sharp if possible
- [ ] Consider lucide-react alternatives
- [ ] Remove unused features

### Week 4: Advanced
- [ ] Two-stage loading architecture
- [ ] External module system
- [ ] Progressive download

## 📈 Monitoring

Track bundle size with each release:

```bash
# Check app.asar size
npm run build:win
ls -lh dist/win-unpacked/resources/app.asar

# Count files
npx asar list dist/win-unpacked/resources/app.asar | wc -l

# Analyze dependencies
npx depcheck
npx npm-why <package-name>
```

## 🎯 Benchmark (Target vs Others)

| App | Size | Notes |
|-----|------|-------|
| VS Code | ~80MB | Heavily optimized |
| Slack | ~150MB | Electron app |
| Discord | ~100MB | Electron app |
| **FloatNote (current)** | **495MB** | Before optimization |
| **FloatNote (optimized)** | **~200MB** | After basic optimization |
| **FloatNote (target)** | **100-150MB** | Aggressive optimization |

---

**Last Updated**: 2026-07-04
**Version**: 1.0.1
