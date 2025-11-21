export default function HomePage() {
  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial, sans-serif' }}>
      <header style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{ color: '#2c5aa0', fontSize: '2.5rem' }}>
          🚀 ChinBino B2B
        </h1>
        <p style={{ fontSize: '1.2rem', color: '#666' }}>
          پلتفرم تجارت چین و ایران - China-Iran B2B Platform
        </p>
      </header>

      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ color: '#2c5aa0' }}>📦 درباره پلتفرم</h2>
          <p>
            ChinBino اولین پلتفرم تخصصی تجارت B2B بین چین (بازار فوتین ایوو) و ایران. 
            امکان خرید مستقیم از فروشندگان چینی با پشتیبانی چندزبانه.
          </p>
        </section>

        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ color: '#2c5aa0' }}>🌍 ویژگی‌ها</h2>
          <ul style={{ lineHeight: '1.8' }}>
            <li>✅ نمایش قیمت به یوان و تومان</li>
            <li>✅ پشتیبانی از زبان فارسی و چینی</li>
            <li>✅ محاسبه هزینه ارسال (ایوو، دبی، ایران)</li>
            <li>✅ مدیریت فروشندگان چینی</li>
            <li>✅ سیستم سفارش‌دهی کارتن‌محور</li>
          </ul>
        </section>

        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ color: '#2c5aa0' }}>🔗 لینک‌های مفید</h2>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <a 
              href="/products" 
              style={{
                padding: '0.5rem 1rem',
                background: '#2c5aa0',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '5px'
              }}
            >
              مشاهده محصولات
            </a>
            <a 
              href="/api/health" 
              style={{
                padding: '0.5rem 1rem',
                background: '#28a745',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '5px'
              }}
            >
              وضعیت سرویس
            </a>
          </div>
        </section>
      </div>
    </div>
  )
}
