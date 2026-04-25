import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  BookOpen, 
  CheckCircle, 
  Layers, 
  TrendingUp,
  Clock,
  ArrowRight
} from "lucide-react"
import { Button } from "@/components/ui/button"

const stats = [
  { label: "Questions", value: "1,240", sub: "+12% ce mois", icon: CheckCircle, color: "text-emerald-500", bg: "bg-emerald-500/10" },
  { label: "Examens", value: "14", sub: "3 prévus cette semaine", icon: BookOpen, color: "text-blue-500", bg: "bg-blue-500/10" },
  { label: "Modules", value: "24", sub: "8 en cours", icon: Layers, color: "text-amber-500", bg: "bg-amber-500/10" },
  { label: "Progression", value: "68%", sub: "Top 5% de la faculté", icon: TrendingUp, color: "text-purple-500", bg: "bg-purple-500/10" },
]

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Bienvenue, Dr. Ahmed ! 👋</h1>
        <p className="text-muted-foreground text-lg">
          Voici un aperçu de votre progression aujourd'hui. Continuez comme ça !
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="border-border/50 bg-card/30 backdrop-blur-sm">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-2 rounded-lg ${stat.bg}`}>
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <span className="text-xs font-medium text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                  {stat.sub.split(' ')[0]}
                </span>
              </div>
              <div>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 border-border/50">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Dernière session d'étude</CardTitle>
            <Button variant="ghost" size="sm" className="text-primary hover:text-primary hover:bg-primary/5">
              Voir tout <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-muted/30 border border-border/50 hover:border-primary/30 transition-all cursor-pointer group">
                  <div className="w-12 h-12 rounded-lg bg-background flex items-center justify-center font-bold text-primary border border-border">
                    {i === 1 ? "AN" : i === 2 ? "PH" : "CB"}
                  </div>
                  <div className="flex-1">
                    <div className="font-bold group-hover:text-primary transition-colors">
                      {i === 1 ? "Anatomie : Le système nerveux central" : i === 2 ? "Pharmacologie : Les antibiotiques" : "Cardiologie : Insuffisance cardiaque"}
                    </div>
                    <div className="text-xs text-muted-foreground flex items-center gap-3 mt-1">
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> Il y a 2h</span>
                      <span className="w-1 h-1 rounded-full bg-muted-foreground"></span>
                      <span>45 questions</span>
                      <span className="w-1 h-1 rounded-full bg-muted-foreground"></span>
                      <span className="text-emerald-500 font-medium">85% réussite</span>
                    </div>
                  </div>
                  <Button size="sm" variant="outline" className="rounded-lg group-hover:bg-primary group-hover:text-white transition-all">
                    Revoir
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-8">
          <Card className="border-border/50 bg-primary/5 border-primary/20">
            <CardHeader>
              <CardTitle className="text-lg">Abonnement Pro</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-sm text-muted-foreground">
                  Il vous reste <span className="text-foreground font-bold">124 jours</span> d'accès illimité.
                </div>
                <div className="h-2 w-full bg-primary/10 rounded-full overflow-hidden">
                  <div className="h-full w-[65%] bg-primary"></div>
                </div>
                <Button className="w-full rounded-xl">Renouveler l'abonnement</Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-lg">Dernières Notifications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-3 text-sm">
                  <div className="w-2 h-2 mt-1.5 rounded-full bg-primary shrink-0"></div>
                  <div>
                    <div className="font-bold">Nouveau cours disponible</div>
                    <div className="text-xs text-muted-foreground">Cardiologie : ECG Pratique</div>
                  </div>
                </div>
                <div className="flex gap-3 text-sm">
                  <div className="w-2 h-2 mt-1.5 rounded-full bg-blue-500 shrink-0"></div>
                  <div>
                    <div className="font-bold">Mise à jour QCM</div>
                    <div className="text-xs text-muted-foreground">50 nouvelles questions en Anatomie</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
