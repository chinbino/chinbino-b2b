const fs = require('fs');
const path = require('path');

console.log('\n📦 ========== شروع کپی viewهای ادمین ==========');

// مسیرهای مبدأ و مقصد
const srcPath = path.join(__dirname, 'src/admin/views');
const distPath = path.join(__dirname, 'dist/admin/views');

console.log('📍 مبدأ (src):', srcPath);
console.log('📍 مقصد (dist):', distPath);

// بررسی وجود مبدأ
if (!fs.existsSync(srcPath)) {
  console.error('❌ پوشه مبدأ وجود ندارد:', srcPath);
  console.log('🔍 محتوای پوشه src/admin:');
  const adminDir = path.join(__dirname, 'src/admin');
  if (fs.existsSync(adminDir)) {
    const items = fs.readdirSync(adminDir);
    console.log('   ', items.join(', '));
  }
  process.exit(1);
}

// بررسی فایل‌های مبدأ
const files = fs.readdirSync(srcPath);
console.log(`📄 تعداد فایل‌ها در مبدأ: ${files.length}`);
console.log('📋 فایل‌ها:', files.join(', '));

// ایجاد پوشه مقصد اگر وجود ندارد
if (!fs.existsSync(distPath)) {
  console.log('📂 ایجاد پوشه dist/admin/views');
  fs.mkdirSync(distPath, { recursive: true });
} else {
  console.log('📂 پوشه مقصد از قبل وجود دارد');
}

// کپی فایل‌ها
let copiedCount = 0;
files.forEach(file => {
  const srcFile = path.join(srcPath, file);
  const distFile = path.join(distPath, file);
  
  try {
    fs.copyFileSync(srcFile, distFile);
    console.log(`✅ کپی شد: ${file}`);
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
}

console.log('🎉 ========== کپی viewها کامل شد ==========\n');
