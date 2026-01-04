import './globals.css';

export const metadata = {
  title: 'Ethnicaa',
  description: 'Wholesale Ethnic Wear Platform'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
