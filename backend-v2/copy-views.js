const fs = require('fs');
const path = require('path');

console.log('📦 ========== شروع کپی viewهای ادمین ==========');

// مسیرها
const srcPath = path.join(__dirname, 'src/admin/views');
const distPath = path.join(__dirname, 'dist/admin/views');

console.log('📍 مبدأ:', srcPath);
console.log('📍 مقصد:', distPath);

// بررسی وجود مبدأ
if (!fs.existsSync(srcPath)) {
    console.error('❌ پوشه مبدأ وجود ندارد:', srcPath);
    console.log('📁 لیست پوشه src:', fs.readdirSync(path.join(__dirname, 'src')));
    console.log('📁 آیا src/admin وجود دارد؟', fs.existsSync(path.join(__dirname, 'src/admin')));
    if (fs.existsSync(path.join(__dirname, 'src/admin'))) {
        console.log('📁 محتوای src/admin:', fs.readdirSync(path.join(__dirname, 'src/admin')));
    }
    process.exit(1);
}

// بررسی فایل‌های مبدأ
const files = fs.readdirSync(srcPath);
console.log(`📄 تعداد فایل‌ها در مبدأ: ${files.length}`);
if (files.length === 0) {
    console.error('❌ هیچ فایلی در مبدأ نیست!');
    process.exit(1);
}
console.log('📋 فایل‌های مبدأ:', files.join(', '));

// حذف dist قدیمی اگر وجود دارد
if (fs.existsSync(distPath)) {
    console.log('🗑️ حذف dist قدیمی...');
    fs.rmSync(distPath, { recursive: true, force: true });
}

// ایجاد پوشه‌های لازم
console.log('📂 ایجاد پوشه مقصد...');
fs.mkdirSync(distPath, { recursive: true });

// کپی هر فایل
let copiedCount = 0;
files.forEach(file => {
    const srcFile = path.join(srcPath, file);
    const distFile = path.join(distPath, file);
    
    try {
        // بررسی آیا فایل است یا پوشه
        if (fs.lstatSync(srcFile).isDirectory()) {
            // کپی بازگشتی پوشه
            fs.cpSync(srcFile, distFile, { recursive: true });
            console.log(`📁 کپی پوشه: ${file}/`);
        } else {
            // کپی فایل
            fs.copyFileSync(srcFile, distFile);
            console.log(`✅ کپی فایل: ${file}`);
        }
        copiedCount++;
    } catch (error) {
        console.error(`❌ خطا در کپی ${file}:`, error.message);
    }
});

// تأیید کپی
console.log(`\n📊 ${copiedCount} از ${files.length} فایل کپی شدند`);

if (fs.existsSync(distPath)) {
    const distFiles = fs.readdirSync(distPath);
    console.log('📋 فایل‌های مقصد:', distFiles.join(', '));
    
    // بررسی layout
    const layoutsPath = path.join(distPath, 'layouts');
    if (fs.existsSync(layoutsPath)) {
        console.log('📁 محتوای layouts:', fs.readdirSync(layoutsPath));
    }
} else {
    console.error('❌ پوشه مقصد ایجاد نشد!');
    process.exit(1);
}

console.log('🎉 ========== کپی viewها کامل شد ==========\n');
