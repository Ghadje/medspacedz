"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { 
  LayoutDashboard, 
  BookOpen, 
  FileText, 
  CheckSquare, 
  History, 
  BarChart2, 
  Bell, 
  CreditCard, 
  Settings,
  LogOut
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { signOut } from "next-auth/react"

const menuItems = [
  { icon: LayoutDashboard, label: "Tableau de bord", href: "/dashboard" },
  { icon: BookOpen, label: "Supports de cours", href: "/dashboard/courses" },
  { icon: FileText, label: "Modules", href: "/dashboard/modules" },
  { icon: CheckSquare, label: "Quiz", href: "/dashboard/quizzes" },
  { icon: History, label: "Sessions", href: "/dashboard/sessions" },
  { icon: BarChart2, label: "Statistiques", href: "/dashboard/stats" },
  { icon: Bell, label: "Notifications", href: "/dashboard/notifications" },
  { icon: CreditCard, label: "Abonnement", href: "/dashboard/subscription" },
  { icon: Settings, label: "Paramètres", href: "/dashboard/settings" },
]

export function DashboardSidebar() {
  const pathname = usePathname()

  return (
    <div className="w-72 border-r border-[#E5EAF3] bg-white flex flex-col h-screen sticky top-0">
      <div className="p-8">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-[#1368E8] rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-[#1368E8]/20 group-hover:rotate-6 transition-transform">
            M
          </div>
          <span className="font-black text-xl tracking-tight text-[#082B66]">
            MedSpace <span className="text-[#FDB022]">AI</span>
          </span>
        </Link>
      </div>

      <div className="flex-1 px-6 py-2 space-y-2 overflow-y-auto">
        <div className="text-[10px] font-black text-[#082B66]/30 uppercase tracking-[0.2em] mb-4 px-3">
          Menu Principal
        </div>
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-4 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all group relative overflow-hidden",
              pathname === item.href 
                ? "bg-[#1368E8]/10 text-[#1368E8]" 
                : "text-[#082B66]/60 hover:bg-[#F3F7FF] hover:text-[#082B66]"
            )}
          >
            {pathname === item.href && (
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#1368E8]"></div>
            )}
            <item.icon className={cn(
              "w-5 h-5 transition-transform group-hover:scale-110",
              pathname === item.href ? "text-[#1368E8]" : "text-[#082B66]/40 group-hover:text-[#082B66]"
            )} />
            {item.label}
          </Link>
        ))}
      </div>

      <div className="p-6 mt-auto">
        <div className="bg-[#F8FBFF] border border-[#E5EAF3] rounded-2xl p-4 mb-6">
          <div className="text-xs font-black text-[#082B66]/40 uppercase mb-2">Plan Actuel</div>
          <div className="text-sm font-black text-[#082B66]">Étudiant Pro</div>
          <Link href="/dashboard/subscription" className="text-[10px] font-black text-[#1368E8] uppercase mt-2 block hover:underline">
            Gérer mon offre
          </Link>
        </div>
        
        <Button 
          variant="ghost" 
          className="w-full justify-start gap-4 px-4 py-6 rounded-2xl text-[#082B66]/60 font-bold hover:text-red-500 hover:bg-red-50 transition-all"
          onClick={() => signOut({ callbackUrl: "/" })}
        >
          <LogOut className="w-5 h-5" />
          Déconnexion
        </Button>
      </div>
    </div>
  )
}
