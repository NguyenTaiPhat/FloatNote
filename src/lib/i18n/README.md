# Internationalization (i18n)

FloatNote hỗ trợ đa ngôn ngữ với 4 ngôn ngữ hiện tại:
- **English (en)** - Mặc định
- **Tiếng Việt (vi)** - Ưu tiên
- **中文 (zh)** - Tiếng Trung
- **日本語 (ja)** - Tiếng Nhật

## Sử dụng

### Trong React Components

```tsx
import { useTranslation } from '@lib/i18n';

function MyComponent() {
    const { t, locale, setLocale } = useTranslation();
    
    return (
        <div>
            <h1>{t.settings.generalSettings}</h1>
            <p>{t.settings.managePreferences}</p>
        </div>
    );
}
```

### Format Dates và Numbers

```tsx
import { formatDate, formatDateTime, formatNumber, useTranslation } from '@lib/i18n';

function MyComponent() {
    const { locale } = useTranslation();
    
    const date = formatDate(new Date(), locale);
    const dateTime = formatDateTime(new Date(), locale);
    const number = formatNumber(12345, locale);
    
    return <div>{date} - {number}</div>;
}
```

## Cấu trúc

```
src/lib/i18n/
├── types.ts          # TypeScript definitions
├── context.tsx       # React Context & Provider
├── index.ts          # Main exports
├── locales/
│   ├── index.ts      # Export all locales
│   ├── en.ts         # English
│   ├── vi.ts         # Vietnamese
│   ├── zh.ts         # Chinese
│   └── ja.ts         # Japanese
└── README.md         # This file
```

## Thêm ngôn ngữ mới

1. Tạo file `locales/[code].ts`
2. Import trong `locales/index.ts`
3. Thêm vào type `Locale` trong `types.ts`
4. Cập nhật locale mapping trong `context.tsx`
5. Thêm option vào Settings

## Quy tắc

- Tất cả text hiển thị phải qua `t.*`
- Không hardcode text trong component
- Giữ translation keys có cấu trúc rõ ràng
- Dùng format functions cho dates/numbers
