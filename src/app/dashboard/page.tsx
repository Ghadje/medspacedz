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
  { label: "Questions", value: "1,240", sub: "+12% ce mois", icon: CheckCircle, color: "text-[#12B76A]", bg: "bg-[#12B76A]/10" },
  { label: "Examens", value: "14", sub: "3 prévus cette semaine", icon: BookOpen, color: "text-[#1368E8]", bg: "bg-[#1368E8]/10" },
  { label: "Modules", value: "24", sub: "8 en cours", icon: Layers, color: "text-[#FDB022]", bg: "bg-[#FDB022]/10" },
  { label: "Progression", value: "68%", sub: "Top 5% de la faculté", icon: TrendingUp, color: "text-purple-600", bg: "bg-purple-100" },
]

export default function DashboardPage() {
  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-4xl font-black text-[#082B66] mb-2">Bienvenue, Ahmed ! 👋</h1>
        <p className="text-[#082B66]/60 text-lg font-medium">
          C'est une excellente journée pour apprendre. Voici votre progression.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((stat, index) => (
          <Card key={index} className="border-[#E5EAF3] bg-white shadow-sm rounded-[24px] overflow-hidden group hover:shadow-lg transition-all duration-300">
            <CardContent className="pt-8 p-8">
              <div className="flex items-center justify-between mb-6">
                <div className={`w-12 h-12 rounded-2xl ${stat.bg} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <span className="text-[10px] font-black text-[#12B76A] bg-[#12B76A]/10 px-3 py-1 rounded-full uppercase tracking-widest">
                  {stat.sub.split(' ')[0]}
                </span>
              </div>
              <div>
                <div className="text-3xl font-black text-[#082B66] mb-1">{stat.value}</div>
                <div className="text-sm font-bold text-[#082B66]/40 uppercase tracking-widest">{stat.label}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <Card className="lg:col-span-2 border-[#E5EAF3] bg-white rounded-[32px] overflow-hidden shadow-sm">
          <CardHeader className="p-8 flex flex-row items-center justify-between border-b border-[#E5EAF3]">
            <CardTitle className="text-xl font-black text-[#082B66]">Dernière session d'étude</CardTitle>
            <Button variant="ghost" size="sm" className="text-[#1368E8] font-black uppercase text-xs tracking-widest hover:bg-[#1368E8]/5">
              Voir tout <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </CardHeader>
          <CardContent className="p-8 space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 p-4 sm:p-6 rounded-[24px] bg-[#F8FBFF] border border-[#E5EAF3] hover:border-[#1368E8]/30 hover:shadow-md transition-all cursor-pointer group">
                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-white flex items-center justify-center font-black text-[#1368E8] border border-[#E5EAF3] text-lg sm:text-xl shadow-sm group-hover:rotate-6 transition-transform shrink-0">
                  {i === 1 ? "AN" : i === 2 ? "PH" : "CB"}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-base sm:text-lg font-black text-[#082B66] group-hover:text-[#1368E8] transition-colors mb-2 truncate">
                    {i === 1 ? "Anatomie : Le système nerveux central" : i === 2 ? "Pharmacologie : Les antibiotiques" : "Cardiologie : Insuffisance cardiaque"}
                  </div>
                  <div className="flex flex-wrap items-center gap-2 sm:gap-4">
                    <span className="flex items-center gap-1.5 text-[10px] sm:text-xs font-bold text-[#082B66]/40 uppercase tracking-widest">
                      <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> Il y a 2h
                    </span>
                    <span className="hidden sm:block w-1.5 h-1.5 rounded-full bg-[#E5EAF3]"></span>
                    <span className="text-[10px] sm:text-xs font-bold text-[#082B66]/40 uppercase tracking-widest">45 questions</span>
                    <span className="hidden sm:block w-1.5 h-1.5 rounded-full bg-[#E5EAF3]"></span>
                    <span className="text-[10px] sm:text-xs font-black text-[#12B76A] uppercase tracking-widest">85% réussite</span>
                  </div>
                </div>
                <Button size="sm" className="w-full sm:w-auto rounded-xl h-10 sm:h-12 px-6 sm:px-8 font-black text-[10px] sm:text-xs uppercase tracking-widest bg-white border-2 border-[#E5EAF3] text-[#082B66] hover:bg-[#1368E8] hover:text-white hover:border-[#1368E8] transition-all">
                  Revoir
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* <div className="space-y-10">
          <Card className="border-[#1368E8]/20 bg-[#1368E8] rounded-[32px] overflow-hidden shadow-xl shadow-[#1368E8]/20 text-white">
            <CardHeader className="p-8">
              <CardTitle className="text-xl font-black uppercase tracking-widest">Abonnement Pro</CardTitle>
            </CardHeader>
            <CardContent className="p-8 pt-0 space-y-6">
              <div className="text-sm font-bold text-white/80 leading-relaxed">
                Il vous reste <span className="text-white font-black underline decoration-2 underline-offset-4">124 jours</span> d'accès illimité à tous les modules.
              </div>
              <div className="h-3 w-full bg-white/20 rounded-full overflow-hidden">
                <div className="h-full w-[65%] bg-white rounded-full"></div>
              </div>
              <Button className="w-full h-14 rounded-2xl bg-white text-[#1368E8] font-black text-sm uppercase tracking-widest hover:bg-[#F3F7FF] transition-all active:scale-95">
                Renouveler
              </Button>
            </CardContent>
          </Card>


        </div> */}
      </div>
    </div>
  )
}
