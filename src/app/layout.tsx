import type { Metadata } from "next";
import NextLink from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import { Provider } from "./provider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "English Learning Assistant",
  description: "English Learning Assistant",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Provider>
          <div className="min-h-screen bg-background">
            <header className="border-b">
              <div className="pl-4 py-4">
                <h1 className="text-2xl font-bold">
                  <NextLink href="/">English Learning Assistant</NextLink>
                </h1>
              </div>
            </header>
            <main className="py-6 container m-auto">{children}</main>
          </div>
        </Provider>
      </body>
    </html>
  );
}
