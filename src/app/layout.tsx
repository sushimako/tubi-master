import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'TU Wien Bauingenieurwissenschaften MSc - Curriculum Planner',
  description: 'Plan your TU Wien Civil Engineering Master curriculum',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de">
      <body className="min-h-screen bg-gray-50 overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
