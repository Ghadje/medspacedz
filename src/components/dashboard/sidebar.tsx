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
    <div className="w-64 border-r border-border bg-card flex flex-col h-screen sticky top-0">
      <div className="p-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-lg">
            M
          </div>
          <span className="font-bold text-lg tracking-tight">
            MedSpace <span className="text-primary">AI</span>
          </span>
        </Link>
      </div>

      <div className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all group",
              pathname === item.href 
                ? "bg-primary/10 text-primary" 
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <item.icon className={cn(
              "w-5 h-5",
              pathname === item.href ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
            )} />
            {item.label}
          </Link>
        ))}
      </div>

      <div className="p-4 border-t border-border">
        <Button 
          variant="ghost" 
          className="w-full justify-start gap-3 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
          onClick={() => signOut({ callbackUrl: "/" })}
        >
          <LogOut className="w-5 h-5" />
          Déconnexion
        </Button>
      </div>
    </div>
  )
}
