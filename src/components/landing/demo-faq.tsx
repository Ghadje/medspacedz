import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Play } from "lucide-react"

const faqs = [
  {
    question: "Comment puis-je m'abonner ?",
    answer: "Vous pouvez vous abonner directement depuis votre tableau de bord après avoir créé un compte. Nous acceptons les paiements par carte CIB/Edahabia et virement CCP.",
  },
  {
    question: "Les cours sont-ils à jour ?",
    answer: "Oui, nos tuteurs mettent à jour les supports de cours et les QCM régulièrement en fonction du programme officiel de chaque faculté.",
  },
  {
    question: "Puis-je accéder à la plateforme sur mon téléphone ?",
    answer: "Absolument ! MedSpace AI est entièrement responsive et fonctionne parfaitement sur smartphones, tablettes et ordinateurs.",
  },
  {
    question: "Est-ce que je peux essayer gratuitement ?",
    answer: "Oui, nous proposons un plan 'Free' qui vous permet d'accéder à une sélection de supports et de QCM pour tester la plateforme.",
  },
  {
    question: "Comment fonctionne la correction instantanée ?",
    answer: "Dès que vous validez une réponse à un QCM, le système affiche si vous avez juste ou faux, accompagné d'une explication détaillée et de références au cours.",
  },
]

export function DemoAndFaq() {
  return (
    <>
      <section id="demo" className="py-24 bg-background relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-primary/5 blur-[120px] rounded-full -z-10"></div>
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="mb-12">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 italic">Voyez-le en action</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-10">
              Découvrez comment MedSpace AI transforme votre façon d'étudier avec une démonstration rapide de notre interface.
            </p>
            <div className="relative max-w-4xl mx-auto aspect-video rounded-3xl overflow-hidden glass border border-white/10 group cursor-pointer shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070&auto=format&fit=crop"
                alt="Demo Preview"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-60"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center shadow-2xl shadow-primary/40 group-hover:scale-110 transition-transform">
                  <Play className="w-8 h-8 text-white fill-current ml-1" />
                </div>
              </div>
            </div>
            <div className="mt-12">
              <Button size="lg" className="h-14 px-10 text-lg rounded-xl">
                Essayer la démo interactive
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section id="faq" className="py-24 bg-white/[0.01]">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Questions Fréquentes</h2>
            <p className="text-muted-foreground">Tout ce que vous devez savoir sur MedSpace AI.</p>
          </div>
          
          <Accordion type="single" collapsible className="w-full space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border border-white/5 bg-white/[0.02] rounded-xl px-6">
                <AccordionTrigger className="text-left font-bold text-lg py-6 hover:no-underline hover:text-primary transition-colors">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-base leading-relaxed pb-6">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>
    </>
  )
}
