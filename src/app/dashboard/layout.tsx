"use client"

import { useState, useEffect } from "react";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Search, Menu, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [open, setOpen] = useState(false);

  // Handle window resize to detect mobile/tablet
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      
      // Auto-collapse on tablet/small desktop if not already set
      if (window.innerWidth < 1280 && window.innerWidth >= 1024) {
        setCollapsed(true);
      }
    };
    
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      {/* Desktop/Tablet Sidebar */}
      <aside className={cn(
        "hidden lg:block transition-all duration-300 ease-in-out",
        collapsed ? "w-20" : "w-[260px]"
      )}>
        <DashboardSidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 transition-all duration-300">
        <header className="h-20 border-b border-[#E5EAF3] bg-white/80 backdrop-blur-md sticky top-0 z-40 px-6 lg:px-10 flex items-center justify-between">
          <div className="flex items-center gap-4 w-full max-w-xl">
            {/* Mobile Menu Trigger */}
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden h-12 w-12 rounded-2xl bg-[#F3F7FF] text-[#082B66] hover:bg-[#1368E8]/10 transition-all">
                  <Menu className="w-6 h-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-[280px] border-none shadow-2xl">
                <DashboardSidebar collapsed={false} setCollapsed={() => {}} isMobile={true} />
              </SheetContent>
            </Sheet>

            <h1 className="text-xl font-black text-[#082B66] lg:hidden truncate">MedSpace AI</h1>

            {/* Desktop Search */}
            <div className="relative w-full group hidden md:block">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#082B66]/30 group-focus-within:text-[#1368E8] transition-colors" />
              <Input 
                placeholder="Rechercher un cours, un module..." 
                className="h-12 pl-12 bg-[#F3F7FF] border-none rounded-2xl font-bold text-[#082B66] placeholder:text-[#082B66]/30 focus-visible:ring-2 focus-visible:ring-[#1368E8]/20 transition-all"
              />
            </div>

            {/* Mobile Search Icon only */}
            <Button variant="ghost" size="icon" className="md:hidden h-10 w-10 rounded-xl bg-[#F3F7FF] text-[#082B66]">
              <Search className="w-5 h-5" />
            </Button>
          </div>
          
          <div className="flex items-center gap-3 lg:gap-6 ml-4 shrink-0">
            <div className="flex items-center gap-3 lg:gap-4 pl-3 lg:pl-6 border-l border-[#E5EAF3]">
              <div className="text-right hidden sm:block">
                <div className="text-sm font-black text-[#082B66] truncate max-w-[120px]">Ahmed Bensaid</div>
                <div className="text-[10px] font-black text-[#1368E8] uppercase tracking-widest truncate max-w-[120px]">3ème année</div>
              </div>
              <Avatar className="h-10 w-10 lg:h-12 lg:h-12 border-2 border-[#1368E8]/20 rounded-xl lg:rounded-2xl overflow-hidden shadow-lg shadow-[#1368E8]/5 transition-transform hover:scale-105 cursor-pointer">
                <AvatarImage src="" />
                <AvatarFallback className="bg-[#1368E8] text-white font-black text-sm">AB</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>
        
        <main className="flex-1 p-4 md:p-8 lg:p-10 max-w-[1600px] mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
