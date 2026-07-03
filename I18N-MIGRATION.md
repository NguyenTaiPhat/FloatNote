# i18n Migration Guide

## Tổng quan

FloatNote giờ đã hỗ trợ đầy đủ đa ngôn ngữ (i18n) với 4 ngôn ngữ:
- English (en)
- Tiếng Việt (vi) - Ưu tiên
- 中文 (zh)
- 日本語 (ja)

## Đã triển khai

### Phase 1: Core Infrastructure ✅
- `src/lib/i18n/types.ts` - Type definitions
- `src/lib/i18n/context.tsx` - React Context & Provider
- `src/lib/i18n/locales/` - Translation files (en, vi, zh, ja)
- Format helpers: `formatDate()`, `formatDateTime()`, `formatNumber()`

### Phase 2: Integration ✅
- `main.tsx` - Wrapped app với I18nProvider
- `GeneralSettings.tsx` - Language selector hoàn chỉnh
- `Sidebar.tsx` - Navigation labels đa ngôn ngữ
- `HomePage.tsx` - UI text đa ngôn ngữ
- `utils.ts` - Updated date formatting với locale
- `ExportManager.ts` - Export với locale formatting

## Các component chưa migrate

Để migrate các component còn lại, làm theo pattern:

```tsx
// 1. Import useTranslation
import { useTranslation } from '@lib/i18n';

// 2. Dùng hook trong component
function MyComponent() {
    const { t } = useTranslation();
    
    // 3. Thay hardcoded text bằng t.*
    return <h1>{t.nav.home}</h1>;
}
```

### Components cần migrate

#### Settings Pages
- `ApiKeysSettings.tsx` - API key labels
- `AppearanceSettings.tsx` - Theme & color labels
- Các settings pages khác

#### Card Renderers
- `GitHubCardRenderer.tsx` - GitHub card labels
- `YouTubeCardRenderer.tsx` - YouTube card labels  
- `MovieCardRenderer.tsx` - Movie card labels
- `WebsiteCardRenderer.tsx` - Website card labels
- `SpotifyCardRenderer.tsx` - Spotify card labels
- `NoteCardRenderer.tsx` - Note card labels

#### Features
- `GlobalSearch.tsx` - Search labels
- `CommandPalette.tsx` - Command labels
- `GraphView.tsx` - Graph labels
- `Timeline.tsx` - Timeline labels
- `WorkspaceDialog.tsx` - Workspace form labels

#### Shared Components
- `Modal.tsx` - Modal labels nếu có
- `Toast.tsx` - Toast messages
- Các shared components khác

## Pattern cần thay

### Dates
```tsx
// Before
new Date().toLocaleDateString('en-US')

// After
import { formatDate, useTranslation } from '@lib/i18n';
const { locale } = useTranslation();
formatDate(new Date(), locale)
```

### Numbers
```tsx
// Before
value.toLocaleString()

// After
import { formatNumber, useTranslation } from '@lib/i18n';
const { locale } = useTranslation();
formatNumber(value, locale)
```

### Hardcoded Text
```tsx
// Before
<h1>Settings</h1>

// After
const { t } = useTranslation();
<h1>{t.nav.settings}</h1>
```

## Thêm translation mới

Nếu cần thêm text mới:

1. Thêm vào `types.ts`:
```typescript
export interface Translation {
    mySection: {
        myLabel: string;
    };
}
```

2. Thêm vào tất cả locale files (`en.ts`, `vi.ts`, `zh.ts`, `ja.ts`):
```typescript
export const vi: Translation = {
    mySection: {
        myLabel: 'Nhãn của tôi',
    },
};
```

## Testing

1. Mở Settings → General
2. Chọn ngôn ngữ khác nhau
3. Kiểm tra UI đã đổi ngôn ngữ
4. Kiểm tra dates/numbers format đúng

## Notes

- Locale được lưu trong `localStorage`
- Auto load locale khi app start
- Backward compatible: các component chưa migrate vẫn hoạt động
- Utils formatDate/formatDateTime tự động dùng locale từ localStorage
