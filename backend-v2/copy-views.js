const fs = require('fs');
const path = require('path');

console.log('🚀 ========== کپی viewهای ادمین ==========');

// مسیر مبدأ: src/admin/views (همیشه ثابت)
const srcPath = path.join(__dirname, 'src/admin/views');

// مسیر مقصد: dist/views/admin (بر اساس logها)
const distPath = path.join(__dirname, 'dist/views/admin');

console.log('📁 مبدأ (ثابت):', srcPath);
console.log('📁 مقصد (بر اساس logها):', distPath);
console.log('📁 مبدأ وجود دارد؟', fs.existsSync(srcPath));

if (!fs.existsSync(srcPath)) {
    console.error('❌ پوشه مبدأ یافت نشد!');
    process.exit(1);
}

// بررسی فایل‌های مبدأ
const files = fs.readdirSync(srcPath);
console.log(`📄 ${files.length} فایل در مبدأ:`, files.join(', '));

if (files.length === 0) {
    console.error('❌ هیچ فایلی در مبدأ نیست!');
    process.exit(1);
}

// حذف dist قدیمی
if (fs.existsSync(distPath)) {
    console.log('🗑️ حذف dist قدیمی...');
    fs.rmSync(distPath, { recursive: true, force: true });
}

// همچنین مسیر قدیمی را هم پاک کن (اگر وجود دارد)
const oldDistPath = path.join(__dirname, 'dist/admin/views');
if (fs.existsSync(oldDistPath)) {
    console.log('🗑️ حذف مسیر قدیمی dist/admin/views...');
    fs.rmSync(oldDistPath, { recursive: true, force: true });
}

// ایجاد پوشه مقصد
console.log('📂 ایجاد پوشه‌های مقصد...');
fs.mkdirSync(path.dirname(distPath), { recursive: true });

// کپی بازگشتی
console.log('📦 شروع کپی...');
try {
    fs.cpSync(srcPath, distPath, { recursive: true, force: true });
    console.log('✅ کپی موفق!');
} catch (error) {
    console.error('❌ خطا در کپی:', error.message);
    process.exit(1);
}

// تأیید نهایی
const distFiles = fs.readdirSync(distPath);
console.log(`📄 ${distFiles.length} فایل در مقصد:`, distFiles.join(', '));

if (files.length === distFiles.length) {
    console.log('🎉 ========== کپی کامل شد ==========');
} else {
    console.error(`⚠️ تعداد فایل‌ها مطابقت ندارد! (مبدأ: ${files.length}, مقصد: ${distFiles.length})`);
    process.exit(1);
}
