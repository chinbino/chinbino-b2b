#!/bin/bash
echo "🚀 شروع راه‌اندازی در Render.com..."

# بررسی وجود dist/main
if [ -f "dist/main.js" ]; then
    echo "✅ dist/main.js پیدا شد"
    node dist/main
else
    echo "⚠️ dist/main.js یافت نشد، تلاش برای build..."
    
    # تلاش برای build
    npm run build 2>/dev/null || echo "Build failed"
    
    if [ -f "dist/main.js" ]; then
        echo "✅ build موفق، اجرای سرور..."
        node dist/main
    else
        echo "❌ build شکست خورد، اجرای nest مستقیم..."
        nest start
    fi
fi
