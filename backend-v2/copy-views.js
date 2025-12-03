const fs = require('fs');
const path = require('path');

console.log('🚀 ========== کپی viewهای ادمین ==========');

// مسیرهای استاندارد
const srcPath = path.join(__dirname, 'src/admin/views');
const distPath = path.join(__dirname, 'dist/admin/views');

console.log('📁 مبدأ (ثابت):', srcPath);
console.log('📁 مقصد (ثابت):', distPath);

// بررسی وجود مبدأ
if (!fs.existsSync(srcPath)) {
    console.error('❌ پوشه مبدأ یافت نشد!');
    console.log('📁 ساختار src/admin:', fs.existsSync(path.join(__dirname, 'src/admin')) 
        ? fs.readdirSync(path.join(__dirname, 'src/admin'))
        : 'پوشه src/admin وجود ندارد');
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
    console.log('🗑️ حذف dist/admin/views قدیمی...');
    fs.rmSync(distPath, { recursive: true, force: true });
}

// ایجاد پوشه مقصد
console.log('📂 ایجاد پوشه‌های dist...');
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
