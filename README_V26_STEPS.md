# أخلاقيات Public Dashboard V26

## الفكرة

صفحة GitHub Pages عامة للتشجيع تعرض إحصائيات مجمعة فقط:

- إجمالي المتسابقين.
- إجمالي المشاركات.
- المقبول وغير المقبول.
- إجمالي النقاط.
- حفلات التكريم.
- المكرمين الفعليين / المرفوعين.
- إجمالي البونص.
- المشاركات حسب الشهر.
- حالة التقييم.
- أعلى الفروع والمحافظات.
- أعلى الأنشطة.
- متوسط Rate الفرق من تقييم المقيمين.
- روابط أخلاقيات.
- الفيديوهات التوضيحية.

لا يتم إرجاع بيانات شخصية إلى GitHub Dashboard.

---

# الخطوة 1 - Apps Script

استبدل Code.gs الحالي بالملف:

Akhlaqiat_Code_Full_Public_Dashboard_v26.gs

ثم Save.

شغل Function:

testPublicDashboardV26

يجب أن يظهر في Execution Log:

✅ PUBLIC DASHBOARD V26 SUCCESSFUL

بعدها:

Deploy
> Manage deployments
> Edit
> New version
> Deploy

استخدم نفس Web App URL الحالي:

https://script.google.com/macros/s/AKfycbwmhq-k0fexP1qrMC2gH24TlNvfC3kL3ieA5lsb1nxLkcF1y8QferKu-X1odS6urLLWLg/exec

---

# الخطوة 2 - GitHub

ارفع محتويات Folder:

github-pages

إلى Root الـ Repository:

- index.html
- style.css
- config.js
- app.js

ثم:

GitHub
> Settings
> Pages
> Deploy from a branch
> main
> /(root)
> Save

بعد النشر سيظهر رابط GitHub Pages الخاص بالـ Repository.

---

# إضافة رابط جديد

افتح:

config.js

وأضف داخل links:

```js
{
  title: "اسم الرابط",
  description: "الوصف",
  url: "https://...",
  icon: "🔗"
}
```

# إضافة فيديو جديد

أضف داخل videos:

```js
{
  title: "اسم الفيديو",
  description: "الوصف",
  url: "https://...",
  icon: "▶️"
}
```

---

# مصدر الإحصائيات

المشاركات:
تقيم المسابقة الفردية 2

التكريمات:
تقييم حفلة المسابقة 2

تقييم الفرق:
أول Tab في Spreadsheet تقييم المقيمين الحالي.

---

# ملاحظة Cache

Public Dashboard تستخدم Cache قصير 3 دقائق فقط لتقليل الضغط على Google Sheets.

يعني الإحصائيات العامة قد تتأخر بحد أقصى دقائق قليلة، بينما تقارير المستخدم داخل منظومة أخلاقيات تظل بمنطقها الحالي.
