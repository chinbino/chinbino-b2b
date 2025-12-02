#!/bin/bash
echo "🚀 ========== شروع render-start.sh =========="
echo "📁 مسیر جاری: $(pwd)"
echo "📁 لیست فایل‌ها:"
ls -la

echo "🔍 بررسی dist..."
if [ -d "dist" ]; then
    echo "📁 محتوای dist:"
    ls -la dist/
    
    if [ -f "dist/main.js" ]; then
        echo "✅ dist/main.js پیدا شد"
        echo "🚀 اجرای dist/main.js..."
        node dist/main
    else
        echo "❌ dist/main.js یافت نشد"
    fi
else
    echo "❌ پوشه dist وجود ندارد"
fi

echo "🔍 بررسی src..."
if [ -f "src/main.ts" ]; then
    echo "✅ src/main.ts پیدا شد"
    echo "🔄 تلاش برای اجرای مستقیم nest..."
    nest start
else
    echo "❌ src/main.ts یافت نشد"
    echo "📁 محتوای src:"
    ls -la src/
fi

echo "========== پایان render-start.sh =========="
