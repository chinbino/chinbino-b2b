const fs = require('fs');
const path = require('path');

console.log('📦 ========== کپی viewهای ادمین ==========');

// مسیرها
const srcDir = path.join(__dirname, 'src/admin/views');
const distDir = path.join(__dirname, 'dist/admin/views');

console.log('📍 مبدأ:', srcDir);
console.log('📍 مقصد:', distDir);

// بررسی وجود مبدأ
if (!fs.existsSync(srcDir)) {
    console.error('❌ پوشه مبدأ وجود ندارد');
    process.exit(1);
}

// حذف dist قدیمی و ایجاد جدید
if (fs.existsSync(distDir)) {
    fs.rmSync(distDir, { recursive: true });
    console.log('🗑️ dist قدیمی حذف شد');
}

// کپی بازگشتی
function copyRecursive(src, dest) {
    if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true });
    }

    const items = fs.readdirSync(src);
    items.forEach(item => {
        const srcPath = path.join(src, item);
        const destPath = path.join(dest, item);
        
        if (fs.lstatSync(srcPath).isDirectory()) {
            copyRecursive(srcPath, destPath);
        } else {
            fs.copyFileSync(srcPath, destPath);
            console.log(`✅ ${item}`);
        }
    });
}

// اجرای کپی
copyRecursive(srcDir, distDir);

// تأیید
const totalFiles = fs.readdirSync(distDir).length;
console.log(`🎉 کپی کامل شد! (${totalFiles} فایل)`);
console.log('📂 محتوای dist/admin/views:', fs.readdirSync(distDir));
