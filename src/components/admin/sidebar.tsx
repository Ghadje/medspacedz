"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { 
  LayoutDashboard, 
  Users, 
  MapPin, 
  Calendar, 
  Layers, 
  BookOpen, 
  HelpCircle, 
  CheckSquare, 
  CreditCard, 
  Bell, 
  Settings,
  ShieldCheck,
  LogOut
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { signOut } from "next-auth/react"

const adminMenuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/admin" },
  { icon: ShieldCheck, label: "Spécialités", href: "/admin/specialties" },
  { icon: MapPin, label: "Facultés", href: "/admin/faculties" },
  { icon: Calendar, label: "Années d'étude", href: "/admin/years" },
  { icon: Layers, label: "Modules", href: "/admin/modules" },
  { icon: BookOpen, label: "Cours", href: "/admin/courses" },
  { icon: CheckSquare, label: "Quizzes", href: "/admin/quizzes" },
  { icon: HelpCircle, label: "Questions", href: "/admin/questions" },
  { icon: Users, label: "Étudiants", href: "/admin/students" },
  { icon: CreditCard, label: "Abonnements", href: "/admin/subscriptions" },
  { icon: Bell, label: "Notifications", href: "/admin/notifications" },
  { icon: Settings, label: "Paramètres", href: "/admin/settings" },
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <div className="w-64 border-r border-border bg-slate-950 text-slate-200 flex flex-col h-screen sticky top-0">
      <div className="p-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-lg">
            M
          </div>
          <span className="font-bold text-lg tracking-tight text-white">
            MedSpace <span className="text-primary">Admin</span>
          </span>
        </Link>
      </div>

      <div className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
        {adminMenuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all group",
              pathname === item.href 
                ? "bg-primary text-white" 
                : "text-slate-400 hover:bg-slate-900 hover:text-white"
            )}
          >
            <item.icon className={cn(
              "w-5 h-5",
              pathname === item.href ? "text-white" : "text-slate-500 group-hover:text-white"
            )} />
            {item.label}
          </Link>
        ))}
      </div>

      <div className="p-4 border-t border-slate-900">
        <Button 
          variant="ghost" 
          className="w-full justify-start gap-3 text-slate-400 hover:text-white hover:bg-slate-900"
          onClick={() => signOut({ callbackUrl: "/" })}
        >
          <LogOut className="w-5 h-5" />
          Déconnexion
        </Button>
      </div>
    </div>
  )
}
