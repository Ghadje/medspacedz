import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Bell, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      <DashboardSidebar />
      <div className="flex-1 flex flex-col">
        <header className="h-20 border-b border-[#E5EAF3] bg-white/80 backdrop-blur-md sticky top-0 z-40 px-10 flex items-center justify-between">
          <div className="flex items-center gap-4 w-full max-w-xl">
            <div className="relative w-full group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#082B66]/30 group-focus-within:text-[#1368E8] transition-colors" />
              <Input 
                placeholder="Rechercher un cours, un module..." 
                className="h-12 pl-12 bg-[#F3F7FF] border-none rounded-2xl font-bold text-[#082B66] placeholder:text-[#082B66]/30 focus-visible:ring-2 focus-visible:ring-[#1368E8]/20 transition-all"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <Button variant="ghost" size="icon" className="relative w-12 h-12 rounded-2xl bg-[#F3F7FF] hover:bg-[#1368E8]/10 text-[#082B66] transition-all">
              <Bell className="w-6 h-6" />
              <span className="absolute top-3 right-3 w-3 h-3 bg-[#1368E8] rounded-full border-2 border-white shadow-sm"></span>
            </Button>
            
            <div className="flex items-center gap-4 pl-6 border-l border-[#E5EAF3]">
              <div className="text-right hidden sm:block">
                <div className="text-sm font-black text-[#082B66]">Ahmed Bensaid</div>
                <div className="text-[10px] font-black text-[#1368E8] uppercase tracking-widest">3ème année Médecine</div>
              </div>
              <Avatar className="h-12 w-12 border-2 border-[#1368E8]/20 rounded-2xl overflow-hidden shadow-lg shadow-[#1368E8]/5 transition-transform hover:scale-105 cursor-pointer">
                <AvatarImage src="" />
                <AvatarFallback className="bg-[#1368E8] text-white font-black text-sm">AB</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>
        
        <main className="flex-1 p-10 max-w-[1600px] mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
