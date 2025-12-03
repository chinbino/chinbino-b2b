const fs = require('fs');
const path = require('path');

console.log('🎯 ========== کپی viewها - مسیر واقعی پروژه ==========');

// در Render: __dirname = /opt/render/project/src/backend-v2
// در GitHub: __dirname = /chinbino-b2b/backend-v2

console.log('📍 ریشه پروژه NestJS (__dirname):', __dirname);
console.log('📁 محتوای ریشه:', fs.readdirSync(__dirname));

// مسیرهای ABSOLUTE REAL
const ABSOLUTE_SRC_PATH = path.join(__dirname, 'src/admin/views');
const ABSOLUTE_DIST_PATH = path.join(__dirname, 'dist/views/admin');

console.log('📁 مبدأ ABSOLUTE:', ABSOLUTE_SRC_PATH);
console.log('📁 مقصد ABSOLUTE:', ABSOLUTE_DIST_PATH);
console.log('📁 مبدأ وجود دارد؟', fs.existsSync(ABSOLUTE_SRC_PATH));

// اگر مبدأ وجود ندارد، ساختار را بررسی کن
if (!fs.existsSync(ABSOLUTE_SRC_PATH)) {
    console.error('❌ مبدأ viewها یافت نشد! ساختار:');
    
    // دیباگ کامل
    if (fs.existsSync(path.join(__dirname, 'src'))) {
        const srcContent = fs.readdirSync(path.join(__dirname, 'src'));
        console.log('📁 محتوای src:', srcContent);
        
        if (srcContent.includes('admin')) {
            const adminContent = fs.readdirSync(path.join(__dirname, 'src/admin'));
            console.log('📁 محتوای src/admin:', adminContent);
        }
    }
    
    console.log('🚫 نمی‌توان ادامه داد');
    process.exit(1);
}

// لیست فایل‌های مبدأ
const srcFiles = fs.readdirSync(ABSOLUTE_SRC_PATH);
console.log(`📄 ${srcFiles.length} فایل در مبدأ:`, srcFiles.join(', '));

// حذف dist قدیمی
if (fs.existsSync(ABSOLUTE_DIST_PATH)) {
    console.log('🗑️ حذف dist قدیمی...');
    fs.rmSync(ABSOLUTE_DIST_PATH, { recursive: true, force: true });
}

// ایجاد پوشه dist/views/admin
console.log('📂 ایجاد پوشه مقصد...');
fs.mkdirSync(path.dirname(ABSOLUTE_DIST_PATH), { recursive: true });

// کپی
console.log('📦 کپی viewها...');
try {
    fs.cpSync(ABSOLUTE_SRC_PATH, ABSOLUTE_DIST_PATH, { 
        recursive: true, 
        force: true,
        preserveTimestamps: true
    });
    console.log('✅ کپی موفق!');
} catch (error) {
    console.error('❌ خطا در کپی:', error.message);
    process.exit(1);
}

// تأیید
const distFiles = fs.readdirSync(ABSOLUTE_DIST_PATH);
console.log(`📄 ${distFiles.length} فایل در مقصد:`, distFiles.join(', '));

// بررسی layouts
const layoutsPath = path.join(ABSOLUTE_DIST_PATH, 'layouts');
if (fs.existsSync(layoutsPath)) {
    console.log('📁 layouts:', fs.readdirSync(layoutsPath));
}

console.log('🎉 ========== کپی با مسیر واقعی کامل شد ==========');
