import type { Metadata } from "next";
import { Header } from "@/components/global/Header";
import { SideNav } from "@/components/global/SideNav";
import { Footer } from "@/components/global/Footer";
import "./globals.css";

export const metadata: Metadata = {
  title: "AutoPilot AI - Project Planning Tool",
  description: "Transform vague software ideas into structured, execution-ready plans using agentic AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-bg dark:bg-bg-dark text-neutral-900 dark:text-neutral-50">
        <Header />
        <div className="flex min-h-screen">
          <SideNav />
          <main className="flex-1 lg:ml-0">
            {children}
          </main>
        </div>
        <Footer />
      </body>
    </html>
  );
}
