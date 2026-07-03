# i18n Testing Instructions

## Test Language Selector

### Steps to test:
1. Chạy app: `npm run dev` (trong terminal riêng)
2. Mở FloatNote
3. Click vào **Settings** trong sidebar (biểu tượng Settings ở dưới cùng)
4. Tab **General** sẽ mở mặc định
5. Tìm section **Language** 
6. Click vào dropdown selector (hiện tại hiển thị ngôn ngữ active)
7. Chọn ngôn ngữ khác:
   - **English** - Tiếng Anh
   - **Tiếng Việt** - Vietnamese (ưu tiên) ⭐
   - **中文** - Chinese
   - **日本語** - Japanese

### Expected behavior:
- ✅ Dropdown mở và hiển thị 4 options
- ✅ Option hiện tại có checkmark (✓)
- ✅ Click option → dropdown đóng
- ✅ UI text thay đổi ngay lập tức theo ngôn ngữ mới
- ✅ Toast message "Setting updated" / "Đã cập nhật cài đặt" hiển thị
- ✅ Reload page → ngôn ngữ vẫn được giữ

## What to check after changing language:

### Sidebar (Navigation)
- Home / Trang chủ
- Favorites / Yêu thích  
- Archived / Lưu trữ
- Graph View / Sơ đồ
- Workspaces / Không gian làm việc
- Settings / Cài đặt

### Settings Tabs
- General / Chung
- API Keys
- Appearance / Giao diện
- Backup / Sao lưu
- Notifications / Thông báo

### General Settings Section
- Language / Ngôn ngữ
- Default View / Chế độ xem mặc định
- Cards Per Page / Số thẻ mỗi trang
- Preferences / Tùy chọn
- Auto Save / Tự động lưu
- Notifications / Thông báo
- Confirm Before Delete / Xác nhận trước khi xóa
- Enable Animations / Bật hiệu ứng
- Enable Sounds / Bật âm thanh
- Reset to Defaults / Đặt lại mặc định

### HomePage
- Cards header text
- "Add Card" button / "Thẻ mới"
- View mode tooltips (Grid/List/Timeline)

### Card Operations
- Create / Tạo
- Edit / Sửa
- Delete / Xóa
- Save / Lưu
- Cancel / Hủy

### Toast Messages
Check toast messages khi:
- Creating card → "Card created successfully" / "Đã tạo thẻ thành công"
- Updating card → "Card updated successfully" / "Đã cập nhật thẻ thành công"
- Deleting card → "Card deleted successfully" / "Đã xóa thẻ thành công"
- Saving settings → "Setting updated" / "Đã cập nhật cài đặt"

## Debug Issues

### If language selector doesn't open:
1. Check browser console for errors
2. Verify Select component is rendered
3. Check z-index của dropdown (should be 200)

### If language doesn't change:
1. Check localStorage: `localStorage.getItem('locale')`
2. Check React DevTools → I18nProvider context value
3. Verify `setLocale()` được gọi trong handleSettingChange

### If text doesn't update:
1. Component chưa dùng `useTranslation()` hook
2. Translation key không tồn tại
3. Component cần thêm import: `import { useTranslation } from '@lib/i18n'`

## Browser DevTools Commands

```javascript
// Check current locale
localStorage.getItem('locale')

// Check all settings
JSON.parse(localStorage.getItem('generalSettings'))

// Manually change locale
localStorage.setItem('locale', 'vi')
location.reload()

// Clear and reset
localStorage.clear()
location.reload()
```

## Known Working Components

✅ Fully working with i18n:
- GeneralSettings
- ApiKeysSettings  
- AppearanceSettings
- Sidebar
- HomePage
- NoteCardRenderer
- MovieCardRenderer
- SettingsPage

⚠️ Partial i18n (need more work):
- GitHubCardRenderer
- YouTubeCardRenderer
- GlobalSearch
- CommandPalette

## Files Modified

Key files that were changed:
```
src/main.tsx                              # Added I18nProvider
src/lib/i18n/                            # New i18n system
src/features/settings/GeneralSettings.tsx # Language selector
src/pages/SettingsPage.tsx               # Settings tabs i18n
src/layouts/Sidebar.tsx                  # Navigation i18n
src/pages/HomePage.tsx                   # Home page i18n
```

## Success Criteria

Language switching works if:
1. ✅ Can select language from dropdown
2. ✅ UI immediately updates to new language
3. ✅ Language persists after reload
4. ✅ All migrated components show correct translations
5. ✅ Date/number formatting follows locale rules
