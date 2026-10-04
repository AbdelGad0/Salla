# موبايلاتي — ثيم Twilight لمتجر موبايلات (Demo)

ثيم Twilight حقيقي (Twig + Tailwind + Twilight SDK) مستوحى من `salla.com/digital-sector`، لبيع الموبايلات — عربي/إنجليزي مع سلة تفاعلية.

## التشغيل السريع (عرض العميل بدون حساب سلة)

افتح `index.html` مباشرة أو عبر سيرفر محلي:

```powershell
cd E:\MyProjects\Salla
npx serve .
# ثم افتح http://localhost:3000
```

## التركيب على سلة (Twilight الحقيقي)

1. حساب على `salla.partners` + ربط GitHub + متجر Demo
2. `npm install` ثم `salla theme preview` من جذر المشروع
3. المصدر المعتمد: `src/views/*.twig` + `twilight.json` + `src/locales/{ar,en}.json`
4. الصور محلية في `src/assets/images` — المصدر Unsplash (مجاني) :
   hero-phone, iphone-14, iphone-13blue, samsung-s23, iphone-x, pixel-7, phone-dark, earbuds, smartwatch

## البنية

- `twilight.json` — تعريف الثيم (features/components)
- `src/views/layouts/master.twig` — الهيكل + `{% hook 'body:end' %}` لحقن Twilight SDK
- `src/views/pages/index.twig` — الرئيسية (hero/stats/categories/products/features/faq)
- `src/views/components/...` — أقسام مستوحاة من صفحة سلة
- `src/assets/js/app.js` — منتجات + سلة localStorage + تبديل لغة + FAQ (متوافق مع `salla.cart` عند التركيب)
