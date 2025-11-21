export const metadata = {
  title: 'ChinBino - B2B China-Iran Marketplace',
  description: 'پلتفرم تجارت B2B چین و ایران',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fa" dir="rtl">
      <body>{children}</body>
    </html>
  )
}
