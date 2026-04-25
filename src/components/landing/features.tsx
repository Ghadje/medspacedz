import { Card, CardContent } from "@/components/ui/card"
import { BookOpen, CheckCircle2, BarChart3, Clock, Layout, FileText } from "lucide-react"

const features = [
  {
    title: "Supports de cours",
    description: "Accédez à une bibliothèque complète de supports de cours structurés par module.",
    icon: BookOpen,
    color: "text-[#1368E8]",
    bg: "bg-[#1368E8]/10",
  },
  {
    title: "QCM interactifs",
    description: "Entraînez-vous avec des milliers de questions ciblées sur vos modules d'étude.",
    icon: CheckCircle2,
    color: "text-[#12B76A]",
    bg: "bg-[#12B76A]/10",
  },
  {
    title: "Correction instantanée",
    description: "Obtenez des explications détaillées immédiatement après chaque réponse.",
    icon: Clock,
    color: "text-[#FDB022]",
    bg: "bg-[#FDB022]/10",
  },
  {
    title: "Progression détaillée",
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
    title: "Abonnements par spécialité",
    description: "Des offres adaptées à chaque spécialité : Médecine, Dentaire et Pharmacie.",
    icon: FileText,
    color: "text-cyan-500",
    bg: "bg-cyan-500/10",
  },
]

export function Features() {
  return (
    <section id="features" className="py-24 bg-white relative">
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-[#F8FBFF] to-white pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-block px-4 py-1.5 rounded-full bg-[#1368E8]/10 text-[#1368E8] text-sm font-bold mb-4">
            Fonctionnalités Clés
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold mb-4 text-[#082B66]">Tout ce dont vous avez besoin</h2>
          <p className="text-[#082B66]/60 text-lg max-w-2xl mx-auto">
            Une interface intuitive conçue pour maximiser votre efficacité d'apprentissage et votre réussite.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="border-[#E5EAF3] bg-white hover:border-[#1368E8]/30 hover:shadow-xl hover:shadow-[#1368E8]/5 transition-all duration-300 group rounded-[24px]">
              <CardContent className="pt-8 p-8">
                <div className={`w-14 h-14 rounded-2xl ${feature.bg} flex items-center justify-center mb-6 group-hover:rotate-6 transition-transform`}>
                  <feature.icon className={`w-7 h-7 ${feature.color}`} />
                </div>
                <h3 className="text-xl font-bold mb-3 text-[#082B66]">{feature.title}</h3>
                <p className="text-[#082B66]/60 leading-relaxed">
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
