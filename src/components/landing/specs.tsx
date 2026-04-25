import { Check } from "lucide-react"

const specs = [
  "Plateforme SaaS responsive (Mobile & Desktop)",
  "Accès par spécialité (Médecine, Dentaire, Pharmacie)",
  "Accès par année d'étude (1ère à 6ème année)",
  "Cours liés directement à Google Drive",
  "Quiz associés à chaque cours spécifique",
  "Interface d'administration complète pour les tuteurs",
  "Système de notification en temps réel",
  "Paiement sécurisé et gestion des abonnements",
]

export function Specs() {
  return (
    <section id="specs" className="py-24 bg-white/[0.01] border-y border-white/5">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl md:text-5xl font-bold mb-8 leading-tight">
              Spécifications <br /> <span className="text-primary">Techniques</span> de pointe
            </h2>
            <p className="text-muted-foreground text-lg mb-10 leading-relaxed">
              MedSpace AI utilise les dernières technologies web pour vous offrir une expérience fluide, rapide et fiable, accessible partout et à tout moment.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {specs.map((spec, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="mt-1 w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3 text-primary" />
                  </div>
                  <span className="text-sm font-medium">{spec}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-primary/10 blur-[80px] rounded-full -z-10"></div>
            <div className="glass rounded-2xl p-8 border border-white/10 shadow-2xl">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                      <div className="w-5 h-5 text-emerald-500 font-bold">99</div>
                    </div>
                    <div>
                      <div className="text-sm font-bold">Performance</div>
                      <div className="text-xs text-muted-foreground">Optimisé pour la vitesse</div>
                    </div>
                  </div>
                  <div className="h-2 w-32 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full w-[99%] bg-emerald-500"></div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                      <div className="w-5 h-5 text-blue-500 font-bold">10k</div>
                    </div>
                    <div>
                      <div className="text-sm font-bold">Utilisateurs</div>
                      <div className="text-xs text-muted-foreground">Inscrits en Algérie</div>
                    </div>
                  </div>
                  <div className="h-2 w-32 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full w-[85%] bg-blue-500"></div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center">
                      <div className="w-5 h-5 text-amber-500 font-bold">50k</div>
                    </div>
                    <div>
                      <div className="text-sm font-bold">Questions</div>
                      <div className="text-xs text-muted-foreground">Base de données QCM</div>
                    </div>
                  </div>
                  <div className="h-2 w-32 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full w-[92%] bg-amber-500"></div>
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
