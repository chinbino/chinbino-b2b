const fs = require('fs');
const path = require('path');

console.log('🚀 ========== اجرای copy-views.js ==========');

// مسیرهای جدید مطابق ساختار
const srcViews = path.join(__dirname, 'src/views/admin');
const distViews = path.join(__dirname, 'dist/views/admin');

console.log('📍 مبدأ:', srcViews);
console.log('📍 مقصد:', distViews);
console.log('📍 مبدأ وجود دارد:', fs.existsSync(srcViews));

if (!fs.existsSync(srcViews)) {
    console.error('❌ پوشه مبدأ یافت نشد!');
    console.log('📁 محتوای src/views:', fs.existsSync(path.join(__dirname, 'src/views')) 
        ? fs.readdirSync(path.join(__dirname, 'src/views'))
        : 'پوشه src/views وجود ندارد');
    process.exit(1);
}

// حذف dist قدیمی
if (fs.existsSync(distViews)) {
    fs.rmSync(distViews, { recursive: true, force: true });
    console.log('🗑️ dist قدیمی حذف شد');
}

// ایجاد پوشه مقصد
fs.mkdirSync(path.dirname(distViews), { recursive: true });

// کپی بازگشتی
fs.cpSync(srcViews, distViews, { recursive: true });

// تأیید
const files = fs.readdirSync(distViews);
console.log('✅ کپی کامل شد!');
console.log('📋 فایل‌های کپی شده:', files.join(', '));

// بررسی layouts
const layoutsPath = path.join(distViews, 'layouts');
if (fs.existsSync(layoutsPath)) {
    const layoutFiles = fs.readdirSync(layoutsPath);
    console.log('📁 فایل‌های layouts:', layoutFiles.join(', '));
}

console.log('🎉 ========== کپی viewها کامل شد ==========');
