import { Check } from "lucide-react"

const specs = [
  "Médecine, Médecine Dentaire & Pharmacie",
  "Toutes les années d'étude (1ère à 6ème)",
  "Modules complets par spécialité",
  "Supports de cours via Google Drive",
  "Quiz liés directement aux cours",
  "Interface SaaS responsive ultra-rapide",
  "Suivi de progression en temps réel",
  "Sessions d'examen chronométrées",
]

export function Specs() {
  return (
    <section id="specs" className="py-24 bg-[#F3F7FF] relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#1368E8]/5 rounded-full blur-3xl"></div>
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-block px-4 py-1.5 rounded-full bg-[#1368E8]/10 text-[#1368E8] text-sm font-bold mb-6">
              Spécifications techniques
            </div>
            <h2 className="text-3xl md:text-5xl font-extrabold mb-8 text-[#082B66] leading-tight">
              Une plateforme <br /> <span className="text-[#1368E8]">complète</span> pour réussir
            </h2>
            <p className="text-[#082B66]/60 text-lg mb-10 leading-relaxed">
              MedSpace AI regroupe tous les outils nécessaires pour vos études médicales en Algérie, de la première année jusqu'à l'internat.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-8">
              {specs.map((spec, index) => (
                <div key={index} className="flex items-center gap-4 group">
                  <div className="w-8 h-8 rounded-xl bg-[#12B76A] flex items-center justify-center shrink-0 shadow-lg shadow-[#12B76A]/20 group-hover:scale-110 transition-transform">
                    <Check className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-[#082B66] font-bold text-base leading-tight">{spec}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="relative">
            <div className="absolute inset-0 bg-white/40 blur-[80px] rounded-full -z-10"></div>
            <div className="bg-white rounded-[32px] p-10 border border-[#E5EAF3] shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#1368E8]/5 rounded-bl-full"></div>
              
              <div className="space-y-8">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-[#12B76A]/10 flex items-center justify-center text-[#12B76A]">
                        <span className="text-xl font-black">99</span>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-[#082B66]">Performance</div>
                        <div className="text-sm text-[#082B66]/50">Optimisé pour la vitesse</div>
                      </div>
                    </div>
                    <span className="text-sm font-black text-[#12B76A]">99%</span>
                  </div>
                  <div className="h-3 w-full bg-[#F3F7FF] rounded-full overflow-hidden">
                    <div className="h-full w-[99%] bg-[#12B76A] rounded-full"></div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-[#1368E8]/10 flex items-center justify-center text-[#1368E8]">
                        <span className="text-xl font-black">15</span>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-[#082B66]">Utilisateurs</div>
                        <div className="text-sm text-[#082B66]/50">Étudiants actifs (k)</div>
                      </div>
                    </div>
                    <span className="text-sm font-black text-[#1368E8]">85%</span>
                  </div>
                  <div className="h-3 w-full bg-[#F3F7FF] rounded-full overflow-hidden">
                    <div className="h-full w-[85%] bg-[#1368E8] rounded-full"></div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-[#FDB022]/10 flex items-center justify-center text-[#FDB022]">
                        <span className="text-xl font-black">50</span>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-[#082B66]">Questions</div>
                        <div className="text-sm text-[#082B66]/50">Base de données QCM (k)</div>
                      </div>
                    </div>
                    <span className="text-sm font-black text-[#FDB022]">92%</span>
                  </div>
                  <div className="h-3 w-full bg-[#F3F7FF] rounded-full overflow-hidden">
                    <div className="h-full w-[92%] bg-[#FDB022] rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
