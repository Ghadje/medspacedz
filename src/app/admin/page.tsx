import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, BookOpen, CheckSquare, CreditCard, TrendingUp, UserCheck, AlertCircle } from "lucide-react"

const adminStats = [
  { label: "Étudiants actifs", value: "8,432", icon: Users, color: "text-blue-600", bg: "bg-blue-100" },
  { label: "Cours publiés", value: "156", icon: BookOpen, color: "text-emerald-600", bg: "bg-emerald-100" },
  { label: "Questions validées", value: "12,890", icon: CheckSquare, color: "text-amber-600", bg: "bg-amber-100" },
  { label: "Revenu mensuel", value: "1.2M", icon: CreditCard, color: "text-purple-600", bg: "bg-purple-100" },
]

export default function AdminPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Vue d'ensemble</h1>
        <p className="text-slate-500">Gérez votre plateforme d'éducation médicale.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {adminStats.map((stat, index) => (
          <Card key={index} className="border-none shadow-sm">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl ${stat.bg}`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div>
                  <div className="text-sm font-medium text-slate-500">{stat.label}</div>
                  <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Dernières Inscriptions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold">
                      {i === 1 ? "JS" : i === 2 ? "MK" : "AB"}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-800">Utilisateur {i}</div>
                      <div className="text-xs text-slate-500">Inscrit il y a {i * 10} min</div>
                    </div>
                  </div>
                  <div className="text-xs font-semibold px-2 py-1 rounded bg-blue-50 text-blue-600 uppercase tracking-wider">
                    Médecine
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Alertes Système</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex gap-4 p-4 rounded-xl bg-amber-50 border border-amber-100">
                <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
                <div>
                  <div className="text-sm font-bold text-amber-900">12 abonnements expirent bientôt</div>
                  <div className="text-xs text-amber-700">Envoyez des notifications de rappel aux étudiants concernés.</div>
                </div>
              </div>
              <div className="flex gap-4 p-4 rounded-xl bg-blue-50 border border-blue-100">
                <UserCheck className="w-5 h-5 text-blue-600 shrink-0" />
                <div>
                  <div className="text-sm font-bold text-blue-900">8 nouveaux tuteurs à valider</div>
                  <div className="text-xs text-blue-700">Vérifiez les profils et activez les comptes administrateurs.</div>
                </div>
              </div>
              <div className="flex gap-4 p-4 rounded-xl bg-emerald-50 border border-emerald-100">
                <TrendingUp className="w-5 h-5 text-emerald-600 shrink-0" />
                <div>
                  <div className="text-sm font-bold text-emerald-900">Pic de trafic détecté</div>
                  <div className="text-xs text-emerald-700">+25% d'activité enregistrée ce matin durant l'examen blanc.</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
