const fs = require('fs');
const path = require('path');

console.log('🚀 ========== کپی viewها برای محیط تولید ==========');

// مسیر مبدأ: src/admin/views
const srcPath = path.join(__dirname, 'src/admin/views');

// مسیر مقصد: dist/views/admin (برای محیط تولید)
const distPath = path.join(__dirname, 'dist/views/admin');

console.log('📁 مبدأ (src):', srcPath);
console.log('📁 مقصد (dist):', distPath);
console.log('📁 مبدأ وجود دارد؟', fs.existsSync(srcPath));

// بررسی وجود مبدأ
if (!fs.existsSync(srcPath)) {
    console.error('❌ پوشه مبدأ viewها یافت نشد!');
    console.log('📁 بررسی ساختار src:');
    
    const srcDir = path.join(__dirname, 'src');
    if (fs.existsSync(srcDir)) {
        console.log('📁 محتوای src:', fs.readdirSync(srcDir));
        
        const adminDir = path.join(srcDir, 'admin');
        if (fs.existsSync(adminDir)) {
            console.log('📁 محتوای src/admin:', fs.readdirSync(adminDir));
        }
    }
    
    console.log('⚠️ ادامه بدون کپی viewها...');
    process.exit(0);
}

// لیست فایل‌های مبدأ
const srcFiles = fs.readdirSync(srcPath);
console.log(`📄 ${srcFiles.length} فایل در مبدأ:`, srcFiles.join(', '));

// حذف مقصد قدیمی اگر وجود دارد
if (fs.existsSync(distPath)) {
    console.log('🗑️ حذف dist قدیمی...');
    fs.rmSync(distPath, { recursive: true, force: true });
}

// ایجاد پوشه‌های مقصد
console.log('📂 ایجاد پوشه‌های dist...');
fs.mkdirSync(path.dirname(distPath), { recursive: true });

// کپی بازگشتی
console.log('📦 شروع کپی viewها...');
try {
    fs.cpSync(srcPath, distPath, { recursive: true });
    console.log('✅ کپی موفق!');
} catch (error) {
    console.error('❌ خطا در کپی:', error.message);
    console.log('⚠️ ادامه بدون viewها...');
    process.exit(0);
}

// تأیید کپی
const distFiles = fs.readdirSync(distPath);
console.log(`📄 ${distFiles.length} فایل در مقصد:`, distFiles.join(', '));

// بررسی layouts
const layoutsPath = path.join(distPath, 'layouts');
if (fs.existsSync(layoutsPath)) {
    const layoutFiles = fs.readdirSync(layoutsPath);
    console.log(`📁 ${layoutFiles.length} فایل در layouts:`, layoutFiles.join(', '));
}

// همچنین به مسیر قدیمی هم کپی کن (برای اطمینان)
const oldDistPath = path.join(__dirname, 'dist/admin/views');
if (oldDistPath !== distPath) {
    console.log('\n📦 کپی اضافی برای سازگاری...');
    if (fs.existsSync(oldDistPath)) {
        fs.rmSync(oldDistPath, { recursive: true, force: true });
    }
    fs.mkdirSync(path.dirname(oldDistPath), { recursive: true });
    fs.cpSync(srcPath, oldDistPath, { recursive: true });
    console.log(`✅ کپی به ${path.relative(__dirname, oldDistPath)}`);
}

console.log('\n🎉 ========== آماده سازی viewها کامل شد ==========');
console.log(`✅ ${srcFiles.length} فایل به dist کپی شدند`);
