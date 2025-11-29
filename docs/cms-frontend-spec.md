---

## 2️⃣ سند فاز B – Frontend Integration

**محل پیشنهادی:**

`docs/cms-frontend-spec.md`

### محتوای فایل `docs/cms-frontend-spec.md`:

```markdown
# Chinbino CMS – Frontend Integration Spec (Phase B)

این سند مرجع رسمی فاز B برای اتصال CMS به فرانت‌اند public است.  
هدف این فاز: حداقل یک صفحه public (مثلاً Yiwu Market) مستقیماً از CMS تغذیه شود.

---

## 0. Environment & Constraints

- [x] **B0.1** – Backend روی Render:
  - `https://chinbino-api-v2.onrender.com`
- [x] **B0.2** – سورس‌کد روی GitHub مدیریت می‌شود.
- [x] **B0.3** – فعلاً محیط لوکال برای صاحب پروژه وجود ندارد (فقط Render/GitHub).
- [ ] **B0.4** – فرانت‌اند public می‌تواند روی همین NestJS/Render یا یک سرویس دیگر باشد، اما:
  - باید از CMS (`/api/contents`, `/api/render/...`) تغذیه شود.
  - بدون وابستگی به localhost تست شود.

---

## 1. هدف‌های اصلی Phase B

🎯 خروجی نهایی فاز B:

1. حداقل یک صفحه public مثل:
   - `/yiwu-market`
2. که:
   - محتوایش را از CMS با slug=`yiwu-market` می‌گیرد
   - بلوک‌ها را به HTML تبدیل می‌کند
   - SEO (title/meta description) را از فیلدهای `seo` می‌گیرد
3. روی یک URL واقعی روی Render قابل مشاهده است.

---

## 2. Block Rendering – Backend (B1.x)

### 2.1. سرویس BlockRenderer (B1.1)

- [ ] **B1.1** – وجود `BlockRendererService`:

مسیر پیشنهادی:

```text
src/cms/services/block-renderer.service.ts
