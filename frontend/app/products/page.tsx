async function getProducts() {
  try {
    const res = await fetch('https://chinbino-backend.onrender.com/products', {
      cache: 'no-store'
    })
    
    if (!res.ok) {
      return []
    }
    
    return await res.json()
  } catch (error) {
    return []
  }
}

export default async function ProductsPage() {
  const products = await getProducts()

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial, sans-serif' }}>
      <header style={{ marginBottom: '2rem' }}>
        <h1 style={{ color: '#2c5aa0' }}>📦 محصولات</h1>
        <p>لیست محصولات موجود از فروشندگان چینی</p>
      </header>

      {products.length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '3rem',
          background: '#f8f9fa',
          borderRadius: '10px'
        }}>
          <p>هنوز محصولی اضافه نشده است.</p>
          <p>به زودی محصولات فروشندگان چینی نمایش داده می‌شود.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '1rem' }}>
          {products.map((product: any) => (
            <div 
              key={product.id}
              style={{
                padding: '1rem',
                border: '1px solid #ddd',
                borderRadius: '8px',
                background: 'white'
              }}
            >
              <h3 style={{ color: '#2c5aa0', margin: '0 0 0.5rem 0' }}>
                {product.name}
              </h3>
              <p style={{ margin: '0.5rem 0', color: '#666' }}>
                {product.description}
              </p>
              <div style={{ display: 'flex', gap: '2rem', fontSize: '0.9rem' }}>
                <span>💰 {product.pricing.price_toman?.toLocaleString()} تومان</span>
                <span>📦 {product.specifications.items_per_carton} عدد در کارتن</span>
                <span>⚖️ {product.specifications.weight_kg} کیلوگرم</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
