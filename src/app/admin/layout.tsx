import { AdminSidebar } from "@/components/admin/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        <header className="h-16 border-b border-border bg-white sticky top-0 z-40 px-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h2 className="font-bold text-slate-800">Panneau d'administration</h2>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <div className="text-sm font-bold text-slate-800">Admin User</div>
                <div className="text-xs text-muted-foreground">Super Admin</div>
              </div>
              <Avatar className="h-9 w-9 border border-border">
                <AvatarImage src="" />
                <AvatarFallback className="bg-slate-900 text-white font-bold">SA</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>
        <main className="flex-1 p-8 text-slate-900">
          {children}
        </main>
      </div>
    </div>
  );
}
