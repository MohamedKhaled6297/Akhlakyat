# أخلاقيات - GitHub Pages

## الملفات
- `index.html` : الصفحة الرئيسية.
- `style.css` : التصميم.
- `config.js` : الروابط الخاصة بكل زر.
- `app.js` : إنشاء الأزرار من الإعدادات.

## أول تعديل
افتح `config.js` واستبدل القيم التي تبدأ بـ `PASTE_` بالروابط الحقيقية.

مثال:
```js
url: "https://script.google.com/macros/s/DEPLOYMENT_ID/exec?page=transaction"
```

أو:
```js
url: "https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit"
```

## GitHub Pages
ارفع الملفات إلى root في repository ثم:
Settings > Pages > Deploy from a branch > main > /(root)
