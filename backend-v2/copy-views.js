const fs = require('fs');
const path = require('path');

console.log('🚀 شروع کپی viewها...');

const srcPath = path.join(__dirname, 'src/admin/views');
const dist1 = path.join(__dirname, 'dist/views/admin');
const dist2 = path.join(__dirname, 'dist/admin/views');

console.log('📁 مسیر مبدأ:', srcPath);
console.log('📁 مسیرهای مقصد:', dist1, 'و', dist2);

if (!fs.existsSync(srcPath)) {
    console.log('❌ پوشه مبدأ viewها یافت نشد، کپی رد می‌شود.');
    process.exit(0);
}

console.log('✅ پوشه مبدأ یافت شد');

// کپی به هر دو مسیر مقصد
[dist1, dist2].forEach(dist => {
    console.log(`\n📦 کپی به: ${path.relative(__dirname, dist)}`);
    
    // حذف نسخه قدیمی
    if (fs.existsSync(dist)) {
        fs.rmSync(dist, { recursive: true, force: true });
        console.log('   🗑️ نسخه قدیمی حذف شد');
    }
    
    // ایجاد پوشه مقصد
    fs.mkdirSync(dist, { recursive: true });
    
    // کپی فایل‌ها
    try {
        fs.cpSync(srcPath, dist, { recursive: true });
        const files = fs.readdirSync(dist);
        console.log(`   ✅ ${files.length} فایل کپی شد`);
        console.log('   📄 فایل‌ها:', files.join(', '));
    } catch (error) {
        console.log(`   ⚠️ خطا در کپی: ${error.message}`);
    }
});

console.log('\n🎉 کپی viewها کامل شد.');
