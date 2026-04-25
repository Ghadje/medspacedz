import { Card, CardContent } from "@/components/ui/card"
import { BookOpen, CheckCircle2, BarChart3, Clock, Layout, FileText } from "lucide-react"

const features = [
  {
    title: "Supports de cours",
    description: "Accédez à une bibliothèque complète de supports de cours structurés par module.",
    icon: BookOpen,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  {
    title: "QCM par module",
    description: "Entraînez-vous avec des milliers de questions ciblées sur vos modules d'étude.",
    icon: CheckCircle2,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
  },
  {
    title: "Correction instantanée",
    description: "Obtenez des explications détaillées immédiatement après chaque réponse.",
    icon: Clock,
    color: "text-amber-500",
    bg: "bg-amber-500/10",
  },
  {
    title: "Suivi de progression",
    description: "Visualisez vos points forts et les domaines nécessitant plus d'attention.",
    icon: BarChart3,
    color: "text-purple-500",
    bg: "bg-purple-500/10",
  },
  {
    title: "Sessions d'examen",
    description: "Simulez des conditions d'examen réelles avec des minuteurs et des séries mixtes.",
    icon: Layout,
    color: "text-rose-500",
    bg: "bg-rose-500/10",
  },
  {
    title: "Statistiques détaillées",
    description: "Des analyses approfondies de vos performances par spécialité et par année.",
    icon: FileText,
    color: "text-cyan-500",
    bg: "bg-cyan-500/10",
  },
]

export function Features() {
  return (
    <section id="features" className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Fonctionnalités Clés</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Tout ce dont vous avez besoin pour réussir vos études de médecine dans une interface intuitive.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-all duration-300 group">
              <CardContent className="pt-8">
                <div className={`w-12 h-12 rounded-xl ${feature.bg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <feature.icon className={`w-6 h-6 ${feature.color}`} />
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
