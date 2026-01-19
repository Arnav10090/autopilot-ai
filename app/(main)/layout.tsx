'use client';

import { Header } from "@/components/global/Header";
import { SideNav } from "@/components/global/SideNav";
import { SkipLinks } from "@/components/global/SkipLinks";
import { Footer } from "@/components/global/Footer";
import { ChatWidget } from "@/components/global/ChatWidget";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { ChatProvider } from "@/contexts/ChatContext";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();

  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (!user) {
      router.replace('/auth/signin');
    } else {
      setIsAuthorized(true);
    }
  }, [router]);

  if (!isAuthorized) {
    return null; // Or a loading spinner
  }

  return (
    <LanguageProvider>
      <ChatProvider>
        <SidebarProvider>
          <SkipLinks />
          <Header />
          <div className="flex min-h-screen">
            <SideNav />
            <MainContentWrapper>
              {children}
            </MainContentWrapper>
          </div>
          <Footer />
          <ChatWidget />
        </SidebarProvider>
      </ChatProvider>
    </LanguageProvider>
  );
}

// Separate component to use the context
import { SidebarProvider, useSidebar } from "@/contexts/SidebarContext";

function MainContentWrapper({ children }: { children: React.ReactNode }) {
  const { isCollapsed } = useSidebar();
  
  return (
    <main 
      id="main-content" 
      className={`flex-1 transition-all duration-300 ${isCollapsed ? 'lg:ml-20' : 'lg:ml-64'}`}
    >
      {children}
    </main>
  );
}
