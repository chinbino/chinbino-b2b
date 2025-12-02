const fs = require('fs');
const path = require('path');

console.log('📁 شروع کپی viewهای ادمین...');

// مسیرهای مبدأ و مقصد
const srcPath = path.join(__dirname, 'src/admin/views');
const distPath = path.join(__dirname, 'dist/admin/views');

console.log('📍 مبدأ:', srcPath);
console.log('📍 مقصد:', distPath);

// بررسی وجود مبدأ
if (!fs.existsSync(srcPath)) {
  console.error('❌ پوشه مبدأ وجود ندارد:', srcPath);
  process.exit(1);
}

// ایجاد پوشه مقصد اگر وجود ندارد
if (!fs.existsSync(distPath)) {
  console.log('📂 ایجاد پوشه dist/admin/views');
  fs.mkdirSync(distPath, { recursive: true });
}

// کپی فایل‌ها
const files = fs.readdirSync(srcPath);
console.log(`📄 تعداد فایل‌ها: ${files.length}`);

files.forEach(file => {
  const srcFile = path.join(srcPath, file);
  const distFile = path.join(distPath, file);
  
  fs.copyFileSync(srcFile, distFile);
  console.log(`✅ کپی شد: ${file}`);
});

console.log('🎉 کپی viewها کامل شد!');
