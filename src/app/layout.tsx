import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "กระปุกออมสิน Smart — Krungthai",
  description: "กระปุกออมสิน Smart ที่เชื่อมกับแอปมือถือของกรุงไทย",
  appleWebApp: {
    capable: true,
    title: "Krungthai Smart",
    statusBarStyle: "default",
  },
  icons: {
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th" className="h-full">
      <body className="min-h-full flex flex-col bg-kt-bg antialiased">
        {children}
      </body>
    </html>
  );
}
