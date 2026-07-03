# Icon Setup Guide

## Files Cần Thiết

### 1. icon.ico (REQUIRED)
**Đường dẫn**: `assets/icon.ico`

**Mục đích**: 
- Window icon khi chạy app
- Taskbar icon
- File .exe icon sau khi build
- Installer icon

**Yêu cầu**:
```
Format: ICO
Size: Multi-resolution (256, 128, 64, 48, 32, 16)
Color: 32-bit with alpha
```

**Đã được set trong**:
- `electron/main.ts` - line ~16-17
- `package.json` - build.win.icon

### 2. favicon.ico (Optional - cho web)
**Đường dẫn**: `public/favicon.ico`

**Mục đích**: Browser tab icon khi load web version

## Trạng Thái Hiện Tại

✅ Code đã setup sẵn để load icon
❌ File icon.ico chưa có
❌ Thư mục public/ chưa có

## Cách Tạo Icon Nhanh

### Option 1: Tạo Icon Đơn Giản
```bash
# Tải template và convert online
1. Vào: https://www.favicon-generator.org/
2. Upload ảnh hoặc text "FloatNote"
3. Chọn Generate
4. Download ICO file
5. Đổi tên thành icon.ico
6. Copy vào assets/
```

### Option 2: Từ Logo/Text
```
1. Mở https://www.canva.com/
2. Tạo design 256x256px
3. Viết chữ "F" hoặc vẽ logo
4. Export PNG
5. Vào https://convertio.co/png-ico/
6. Convert và download
7. Rename thành icon.ico
8. Copy vào assets/
```

### Option 3: Dùng AI
```
1. ChatGPT/MidJourney: "Create a modern app icon for FloatNote"
2. Download PNG
3. Convert sang ICO (convertio.co)
4. Copy vào assets/
```

## Kiểm Tra Icon Đã Load

### Dev Mode
```bash
npm run dev
# Kiểm tra:
# - Window title bar có icon chưa?
# - Taskbar có icon chưa?
# Nếu không thấy -> icon.ico chưa đúng path
```

### Production Build
```bash
npm run build:win
# Sau khi build:
# - File .exe trong dist/ có icon chưa? (right-click > Properties)
# - Installer có icon chưa?
```

## Path Resolution

### Dev Mode
```typescript
// electron/main.ts
const iconPath = path.join(__dirname, '../assets/icon.ico')
// Resolve to: PROJECT_ROOT/assets/icon.ico
```

### Production Build
```typescript
// electron/main.ts
const iconPath = path.join(process.resourcesPath, 'assets/icon.ico')
// Resolve to: INSTALLED_APP/resources/assets/icon.ico
```

## Troubleshooting

### Icon không hiện trong dev mode?
- Kiểm tra file tồn tại: `d:\NOTE PROJECT\project\floatnote\assets\icon.ico`
- Kiểm tra console có lỗi không
- Restart app

### Icon không có trong build?
- Kiểm tra package.json: `build.win.icon` đúng path chưa
- Kiểm tra thư mục buildResources: `directories.buildResources: "assets"`
- Rebuild: `npm run clean && npm run build:win`

### Icon bị mờ/xấu?
- Tạo lại với resolution cao hơn (256x256)
- Đảm bảo có alpha channel (nền trong suốt)
- Dùng vector format trước khi convert

## Design Tips

**Màu sắc phù hợp với FloatNote**:
- Primary: Purple/Violet (#8B5CF6, #A855F7)
- Accent: Blue (#3B82F6)
- Background: Dark (#0A0A0A)

**Icon style**:
- Minimalist
- Flat design
- Clear silhouette
- Works well at small sizes (16x16)

## Next Steps

1. ✅ Tạo hoặc tải icon.ico
2. ✅ Đặt vào `assets/icon.ico`
3. ✅ Test dev mode: `npm run dev`
4. ✅ Test build: `npm run build:win`
5. ✅ Kiểm tra file .exe có icon chưa
