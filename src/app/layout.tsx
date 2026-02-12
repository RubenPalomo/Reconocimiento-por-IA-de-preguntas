import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "../components/providers/theme-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Proyecto X",
  description: "Conexión con IA inteligente",
  manifest: "/manifest.json",
  icons: [
    { rel: "apple-touch-icon", url: "/icon-512x512.png", sizes: "512x512" },
    { rel: "icon", url: "/icon-512x512.png", sizes: "512x512" },
  ],
};

export const viewport: Viewport = {
  themeColor: "#ff0000",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
    >
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
