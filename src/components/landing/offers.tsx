import { Stethoscope, Pill, Microscope } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

const specialties = [
  {
    name: "Médecine",
    description: "Cursus complet pour les futurs médecins généralistes et spécialistes.",
    icon: Stethoscope,
    color: "text-[#12B76A]",
    bg: "bg-[#12B76A]/10",
  },
  {
    name: "Médecine Dentaire",
    description: "Tout le support nécessaire pour les étudiants en chirurgie dentaire.",
    icon: Microscope,
    color: "text-[#1368E8]",
    bg: "bg-[#1368E8]/10",
  },
  {
    name: "Pharmacie",
    description: "Modules spécialisés et supports de cours pour les futurs pharmaciens.",
    icon: Pill,
    color: "text-[#FDB022]",
    bg: "bg-[#FDB022]/10",
  },
]

export function Offers() {
  return (
    <section id="offers" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="inline-block px-4 py-1.5 rounded-full bg-[#1368E8]/10 text-[#1368E8] text-sm font-bold mb-4">
            Parcours d'étude
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold mb-4 text-[#082B66]">Que proposons-nous ?</h2>
          <p className="text-[#082B66]/60 text-lg max-w-2xl mx-auto">
            Une plateforme adaptée à chaque spécialité pour un apprentissage ciblé et efficace.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {specialties.map((specialty, index) => (
            <Card key={index} className="border-[#E5EAF3] bg-white overflow-hidden group hover:border-[#1368E8]/30 hover:shadow-2xl hover:shadow-[#1368E8]/5 transition-all duration-500 rounded-[32px]">
              <CardContent className="p-0">
                <div className="h-2 bg-[#1368E8] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="p-10 text-center">
                  <div className={`w-24 h-24 rounded-[30px] ${specialty.bg} flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform duration-500`}>
                    <specialty.icon className={`w-12 h-12 ${specialty.color}`} />
                  </div>
                  <h3 className="text-2xl font-black mb-4 text-[#082B66]">{specialty.name}</h3>
                  <p className="text-[#082B66]/60 mb-8 text-base leading-relaxed">
                    {specialty.description}
                  </p>
                  <div className="pt-6 border-t border-[#E5EAF3] flex items-center justify-center gap-6 text-sm font-black text-[#082B66]/40 uppercase tracking-widest">
                    <span>Cours</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#1368E8]/30"></span>
                    <span>QCM</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#1368E8]/30"></span>
                    <span>Examens</span>
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
