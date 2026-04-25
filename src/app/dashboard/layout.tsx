"use client"

import { useState, useEffect } from "react";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Search, Menu, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { useSession, signOut } from "next-auth/react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [open, setOpen] = useState(false);
  const { data: session } = useSession();

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

  const getInitials = (name?: string | null) => {
    if (!name) return "??";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  const roleLabels: Record<string, string> = {
    STUDENT: "Étudiant",
    ADMIN: "Administrateur",
    SUPER_ADMIN: "Super Admin",
  };

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

            <h1 className="text-xl font-black text-[#082B66] lg:hidden truncate">MedSpace OG</h1>
          </div>
          
          <div className="flex items-center gap-3 lg:gap-6 ml-4 shrink-0">
            <div className="flex items-center gap-3 lg:gap-4 pl-3 lg:pl-6 border-l border-[#E5EAF3]">
              <div className="text-right hidden sm:block">
                <div className="text-sm font-black text-[#082B66] truncate max-w-[150px]">
                  {session?.user?.name || "Utilisateur"}
                </div>
                <div className="text-[10px] font-black text-[#1368E8] uppercase tracking-widest truncate max-w-[150px]">
                  {roleLabels[session?.user?.role as string] || "Membre"}
                </div>
              </div>
              <Avatar className="h-10 w-10 lg:h-12 border-2 border-[#1368E8]/20 rounded-xl lg:rounded-2xl overflow-hidden shadow-lg shadow-[#1368E8]/5 transition-transform hover:scale-105 cursor-pointer">
                <AvatarImage src={session?.user?.image || ""} />
                <AvatarFallback className="bg-[#1368E8] text-white font-black text-sm">
                  {getInitials(session?.user?.name)}
                </AvatarFallback>
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
