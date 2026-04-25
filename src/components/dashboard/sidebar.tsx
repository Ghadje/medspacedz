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
  CreditCard, 
  Settings,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
  GraduationCap,
  ClipboardList,
  Users
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { signOut } from "next-auth/react"

const menuItems = [
  { icon: LayoutDashboard, label: "Tableau de bord", href: "/dashboard" },
  { icon: BookOpen, label: "Supports de cours", href: "/dashboard/courses" },
  { icon: FileText, label: "Modules", href: "/dashboard/modules" },
  { icon: CheckSquare, label: "Quiz", href: "/dashboard/quizzes" },
  { icon: History, label: "Sessions", href: "/dashboard/sessions" },
  { icon: CreditCard, label: "Abonnement", href: "/dashboard/subscription" },
  { icon: Settings, label: "Paramètres", href: "/dashboard/settings" },
]

interface DashboardSidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  isMobile?: boolean;
}

export function DashboardSidebar({ collapsed, setCollapsed, isMobile }: DashboardSidebarProps) {
  const pathname = usePathname()

  return (
    <div 
      className={cn(
        "border-r border-[#E5EAF3] bg-white flex flex-col h-screen sticky top-0 transition-all duration-300 ease-in-out z-50",
        collapsed ? "w-20" : "w-[260px]",
        isMobile && "w-full border-none"
      )}
    >
      {/* Header / Logo */}
      <div className={cn(
        "p-6 flex items-center justify-between h-20",
        collapsed && "justify-center px-2"
      )}>
        {!collapsed && (
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-[#1368E8] rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-[#1368E8]/20 group-hover:rotate-6 transition-transform">
              M
            </div>
            <span className="font-black text-xl tracking-tight text-[#082B66]">
              MedSpace <span className="text-[#FDB022]">AI</span>
            </span>
          </Link>
        )}
        
        {collapsed && (
          <div className="w-10 h-10 bg-[#1368E8] rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-[#1368E8]/20">
            M
          </div>
        )}

        {!isMobile && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCollapsed(!collapsed)}
            className={cn(
              "rounded-full border bg-white shadow-sm hover:bg-muted transition-all",
              collapsed ? "absolute -right-4 top-7 z-50" : ""
            )}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <PanelLeftOpen className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
          </Button>
        )}
      </div>

      {/* Navigation */}
      <div className={cn(
        "flex-1 px-4 py-4 space-y-2 overflow-y-auto overflow-x-hidden",
        collapsed && "px-2"
      )}>
        {!collapsed && (
          <div className="text-[10px] font-black text-[#082B66]/30 uppercase tracking-[0.2em] mb-4 px-3">
            Menu Principal
          </div>
        )}
        
        {menuItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center rounded-2xl transition-all group relative",
                collapsed ? "justify-center py-2" : "gap-4 px-4 py-3.5",
                isActive 
                  ? collapsed ? "" : "bg-[#1368E8]/10 text-[#1368E8]" 
                  : "text-[#082B66]/60 hover:bg-[#F3F7FF] hover:text-[#082B66]"
              )}
              title={collapsed ? item.label : ""}
            >
              {isActive && !collapsed && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#1368E8]"></div>
              )}
              
              <div className={cn(
                "flex items-center justify-center transition-all duration-200",
                collapsed 
                  ? cn(
                      "w-[44px] h-[44px] rounded-full",
                      isActive 
                        ? "bg-[#1368E8] text-white shadow-lg shadow-[#1368E8]/30" 
                        : "bg-[#082B66] text-white group-hover:bg-[#1368E8] group-hover:scale-110"
                    )
                  : ""
              )}>
                <item.icon className={cn(
                  "w-5 h-5",
                  !collapsed && isActive ? "text-[#1368E8]" : "",
                  !collapsed && !isActive ? "text-[#082B66]/40 group-hover:text-[#082B66]" : ""
                )} />
              </div>
              
              {!collapsed && (
                <span className={cn(
                  "text-sm font-bold truncate transition-opacity duration-200",
                  isActive ? "text-[#1368E8]" : "text-[#082B66]/60"
                )}>
                  {item.label}
                </span>
              )}
            </Link>
          )
        })}
      </div>

      {/* Footer / User / Plan */}
      <div className={cn(
        "p-4 mt-auto border-t border-[#E5EAF3]",
        collapsed && "flex flex-col items-center gap-4 py-6"
      )}>
        {!collapsed ? (
          <>
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
          </>
        ) : (
          <Button 
            variant="ghost" 
            size="icon"
            className="w-[44px] h-[44px] rounded-full bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-sm"
            onClick={() => signOut({ callbackUrl: "/" })}
            title="Déconnexion"
          >
            <LogOut className="w-5 h-5" />
          </Button>
        )}
      </div>
    </div>
  )
}
