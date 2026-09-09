import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Anatome3D | Interactive 3D Human Anatomy Platform',
  description:
    'Advanced web-based 3D human anatomy educational platform built with Next.js, React Three Fiber, and Tailwind CSS.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark h-full">
      <body className="h-full w-full overflow-hidden bg-[#070b12] text-slate-100 antialiased">
        {children}
      </body>
    </html>
  );
}
