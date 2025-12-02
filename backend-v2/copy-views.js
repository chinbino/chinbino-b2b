const fs = require('fs');
const path = require('path');

console.log('🚀 ========== اجرای copy-views.js ==========');

// مسیرهای اصلی
const srcBase = path.join(__dirname, 'src');
const distBase = path.join(__dirname, 'dist');

console.log('📍 ریشه پروژه:', __dirname);
console.log('📍 مسیر src:', srcBase);
console.log('📍 مسیر dist:', distBase);

// بررسی وجود src
if (!fs.existsSync(srcBase)) {
  console.error('❌ پوشه src وجود ندارد!');
  process.exit(1);
}

// پوشه views ادمین
const adminViewsSrc = path.join(srcBase, 'admin/views');
const adminViewsDist = path.join(distBase, 'admin/views');

console.log('\n🔍 بررسی پوشه‌های views:');
console.log('   مبدأ:', adminViewsSrc);
console.log('   مقصد:', adminViewsDist);
console.log('   مبدأ وجود دارد:', fs.existsSync(adminViewsSrc));

if (!fs.existsSync(adminViewsSrc)) {
  console.error('❌ پوشه views ادمین در مبدأ یافت نشد!');
  console.log('📁 محتوای src/admin:', fs.readdirSync(path.join(srcBase, 'admin')));
  process.exit(1);
}

// حذف پوشه مقصد اگر وجود دارد
if (fs.existsSync(adminViewsDist)) {
  console.log('🗑️ حذف پوشه dist/admin/views قدیمی...');
  fs.rmSync(adminViewsDist, { recursive: true, force: true });
}

// ایجاد پوشه‌های لازم در dist
console.log('📂 ایجاد پوشه‌های dist...');
fs.mkdirSync(path.join(distBase, 'admin'), { recursive: true });
fs.mkdirSync(adminViewsDist, { recursive: true });

// تابع کپی بازگشتی
function copyDirectory(src, dest) {
  const items = fs.readdirSync(src);
  
  items.forEach(item => {
    const srcPath = path.join(src, item);
    const destPath = path.join(dest, item);
    
    const stat = fs.statSync(srcPath);
    
    if (stat.isDirectory()) {
      // کپی پوشه
      fs.mkdirSync(destPath, { recursive: true });
      copyDirectory(srcPath, destPath);
      console.log(`📁 کپی پوشه: admin/views/${path.relative(adminViewsSrc, srcPath)}/`);
    } else if (stat.isFile()) {
      // کپی فایل
      fs.copyFileSync(srcPath, destPath);
      console.log(`✅ کپی فایل: ${item}`);
    }
  });
}

// اجرای کپی
console.log('\n📦 شروع کپی viewها...');
copyDirectory(adminViewsSrc, adminViewsDist);

// تأیید کپی
console.log('\n🔍 تأیید کپی:');
const srcFiles = fs.readdirSync(adminViewsSrc);
const distFiles = fs.readdirSync(adminViewsDist);

console.log(`   تعداد فایل‌های مبدأ: ${srcFiles.length}`);
console.log(`   تعداد فایل‌های مقصد: ${distFiles.length}`);
console.log(`   فایل‌های مقصد: ${distFiles.join(', ')}`);

// بررسی layouts
const layoutsDist = path.join(adminViewsDist, 'layouts');
if (fs.existsSync(layoutsDist)) {
  const layoutFiles = fs.readdirSync(layoutsDist);
  console.log(`   فایل‌های layouts: ${layoutFiles.join(', ')}`);
}

if (srcFiles.length === distFiles.length) {
  console.log('\n🎉 ========== کپی viewها با موفقیت انجام شد ==========');
  console.log(`✅ ${srcFiles.length} فایل کپی شدند`);
} else {
  console.error(`\n⚠️ تعداد فایل‌ها مطابقت ندارد!`);
  console.log(`   مبدأ: ${srcFiles.length}، مقصد: ${distFiles.length}`);
  process.exit(1);
}
