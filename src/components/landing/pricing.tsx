import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Check } from "lucide-react"

const medPricing = [
  {
    name: "Free",
    price: "0",
    description: "Pour commencer sereinement",
    features: ["Supports de cours de base", "100 QCM par module", "Correction standard", "Accès mobile"],
    buttonText: "Commencer gratuitement",
    highlight: false,
  },
  {
    name: "Pro",
    price: "2500",
    description: "L'essentiel pour réussir",
    features: ["Tous les supports de cours", "QCM illimités", "Corrections détaillées", "Statistiques de base", "Mode examen"],
    buttonText: "Choisir Pro",
    highlight: true,
  },
  {
    name: "Premium",
    price: "4500",
    description: "L'expérience ultime",
    features: ["Tout le contenu Pro", "Sessions d'examen coachées", "Statistiques avancées", "Support prioritaire 24/7", "Accès hors-ligne"],
    buttonText: "Choisir Premium",
    highlight: false,
  },
]

export function Pricing() {
  return (
    <section id="pricing" className="py-24 bg-[#F8FBFF]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="inline-block px-4 py-1.5 rounded-full bg-[#1368E8]/10 text-[#1368E8] text-sm font-bold mb-4">
            Nos Abonnements
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold mb-4 text-[#082B66]">Des plans adaptés à tous</h2>
          <p className="text-[#082B66]/60 text-lg max-w-2xl mx-auto">
            Choisissez l'abonnement qui correspond le mieux à vos objectifs académiques.
          </p>
        </div>

        <div className="mb-20">
          <div className="flex items-center justify-center gap-4 mb-12">
            <div className="h-px w-12 bg-[#E5EAF3]"></div>
            <h3 id="medecine" className="text-xl font-black text-[#082B66] uppercase tracking-[0.2em]">
              Médecine
            </h3>
            <div className="h-px w-12 bg-[#E5EAF3]"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            {medPricing.map((plan, index) => (
              <PricingCard key={index} plan={plan} accentColor="#1368E8" />
            ))}
          </div>
        </div>

        <div className="pt-20 border-t border-[#E5EAF3]">
          <div className="flex items-center justify-center gap-4 mb-12">
            <div className="h-px w-12 bg-[#E5EAF3]"></div>
            <h3 id="dentaire" className="text-xl font-black text-[#082B66] uppercase tracking-[0.2em]">
              Médecine Dentaire
            </h3>
            <div className="h-px w-12 bg-[#E5EAF3]"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            {medPricing.map((plan, index) => (
              <PricingCard key={index} plan={plan} accentColor="#1368E8" />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function PricingCard({ plan, accentColor }: { plan: any, accentColor: string }) {
  return (
    <Card className={`flex flex-col border-[#E5EAF3] bg-white rounded-[32px] transition-all duration-500 overflow-hidden ${plan.highlight ? "ring-2 ring-[#1368E8] shadow-2xl shadow-[#1368E8]/10 scale-105 z-10" : "hover:border-[#1368E8]/30 hover:shadow-xl"}`}>
      {plan.highlight && (
        <div className="bg-[#1368E8] text-white text-[10px] font-black uppercase tracking-widest text-center py-2">
          Recommandé
        </div>
      )}
      <CardHeader className="p-8 pb-4">
        <CardTitle className="text-2xl font-black text-[#082B66]">{plan.name}</CardTitle>
        <CardDescription className="text-[#082B66]/60 font-medium">{plan.description}</CardDescription>
        <div className="mt-6 flex items-baseline gap-1">
          <span className="text-5xl font-black text-[#082B66]">{plan.price}</span>
          <span className="text-[#082B66]/40 font-bold uppercase text-xs tracking-tighter">DZD / an</span>
        </div>
      </CardHeader>
      <CardContent className="p-8 pt-4 flex-1">
        <ul className="space-y-4">
          {plan.features.map((feature: string, fIndex: number) => (
            <li key={fIndex} className="flex items-start gap-3">
              <div className="mt-1 w-5 h-5 rounded-full bg-[#1368E8]/10 flex items-center justify-center shrink-0">
                <Check className="w-3.5 h-3.5 text-[#1368E8] stroke-[3]" />
              </div>
              <span className="text-sm font-bold text-[#082B66]/80">{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter className="p-8 pt-0">
        <Button 
          className={`w-full h-14 rounded-2xl font-black text-sm uppercase tracking-widest transition-all active:scale-95 ${plan.highlight ? "bg-[#1368E8] hover:bg-[#1368E8]/90 text-white shadow-lg shadow-[#1368E8]/20" : "bg-white border-2 border-[#E5EAF3] text-[#082B66] hover:bg-[#F3F7FF] hover:border-[#1368E8]/30"}`}
          variant="ghost"
        >
          {plan.buttonText}
        </Button>
      </CardFooter>
    </Card>
  )
}
