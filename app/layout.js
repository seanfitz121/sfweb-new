export const metadata = {
  title: 'SFWeb – Web Design for Local Businesses',
  description: 'Premium websites built specifically for local service businesses in Ireland.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}