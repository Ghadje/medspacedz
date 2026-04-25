import { Stethoscope, Pill, Microscope } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

const specialties = [
  {
    name: "Médecine",
    description: "Cursus complet pour les futurs médecins généralistes et spécialistes.",
    icon: Stethoscope,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
  },
  {
    name: "Médecine Dentaire",
    description: "Tout le support nécessaire pour les étudiants en chirurgie dentaire.",
    icon: Microscope,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  {
    name: "Pharmacie",
    description: "Modules spécialisés et supports de cours pour les futurs pharmaciens.",
    icon: Pill,
    color: "text-amber-500",
    bg: "bg-amber-500/10",
  },
]

export function Offers() {
  return (
    <section id="offers" className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Que proposons-nous ?</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Une plateforme adaptée à chaque parcours d'étude médicale.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {specialties.map((specialty, index) => (
            <Card key={index} className="border-white/5 bg-white/[0.02] overflow-hidden group hover:border-primary/50 transition-all">
              <CardContent className="p-0">
                <div className="h-2 bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="p-8 text-center">
                  <div className={`w-20 h-20 rounded-2xl ${specialty.bg} flex items-center justify-center mx-auto mb-6 group-hover:rotate-12 transition-transform`}>
                    <specialty.icon className={`w-10 h-10 ${specialty.color}`} />
                  </div>
                  <h3 className="text-2xl font-bold mb-3">{specialty.name}</h3>
                  <p className="text-muted-foreground mb-6">
                    {specialty.description}
                  </p>
                  <div className="pt-4 border-t border-white/5 flex items-center justify-center gap-4 text-sm font-semibold">
                    <span>Cours</span>
                    <span className="w-1 h-1 rounded-full bg-muted-foreground"></span>
                    <span>QCM</span>
                    <span className="w-1 h-1 rounded-full bg-muted-foreground"></span>
                    <span>Résumés</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
