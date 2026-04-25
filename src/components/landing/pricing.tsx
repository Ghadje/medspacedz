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
    <section id="pricing" className="py-24 bg-white/[0.01]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 text-gradient">Nos Abonnements</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Des plans adaptés à votre rythme et à vos besoins pour chaque spécialité.
          </p>
        </div>

        <div className="mb-12 text-center">
          <h3 id="medecine" className="text-2xl font-bold mb-8 inline-block px-6 py-2 rounded-full glass border border-primary/20 text-primary">
            Médecine
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            {medPricing.map((plan, index) => (
              <Card key={index} className={`border-white/5 bg-white/[0.02] flex flex-col transition-all duration-300 ${plan.highlight ? "border-primary/50 shadow-2xl shadow-primary/10 scale-105 z-10 bg-white/[0.04]" : ""}`}>
                <CardHeader>
                  <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                  <div className="mt-4 flex items-baseline gap-1">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-muted-foreground font-medium">DZD / an</span>
                  </div>
                </CardHeader>
                <CardContent className="flex-1">
                  <ul className="space-y-4">
                    {plan.features.map((feature, fIndex) => (
                      <li key={fIndex} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-primary shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button className="w-full h-12 rounded-xl font-bold" variant={plan.highlight ? "default" : "outline"}>
                    {plan.buttonText}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>

        <div className="text-center pt-16 border-t border-white/5">
          <h3 id="dentaire" className="text-2xl font-bold mb-8 inline-block px-6 py-2 rounded-full glass border border-blue-500/20 text-blue-500">
            Médecine Dentaire
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
             {/* Dentaire pricing would be similar, just changing names or colors if needed */}
             {medPricing.map((plan, index) => (
              <Card key={index} className={`border-white/5 bg-white/[0.02] flex flex-col transition-all duration-300 ${plan.highlight ? "border-blue-500/50 shadow-2xl shadow-blue-500/10 scale-105 z-10 bg-white/[0.04]" : ""}`}>
                <CardHeader>
                  <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                  <div className="mt-4 flex items-baseline gap-1">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-muted-foreground font-medium">DZD / an</span>
                  </div>
                </CardHeader>
                <CardContent className="flex-1">
                  <ul className="space-y-4">
                    {plan.features.map((feature, fIndex) => (
                      <li key={fIndex} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-blue-500 shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button className="w-full h-12 rounded-xl font-bold" variant={plan.highlight ? "default" : "outline"}>
                    {plan.buttonText}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
