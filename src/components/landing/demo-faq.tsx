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
      <section id="demo" className="py-24 bg-gradient-to-br from-[#1368E8] to-[#082B66] relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-white rounded-full blur-[100px]"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#FDB022] rounded-full blur-[100px]"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <div className="mb-16">
            <div className="inline-block px-4 py-1.5 rounded-full bg-white/10 text-white text-sm font-bold mb-4 backdrop-blur-md border border-white/20">
              Démonstration
            </div>
            <h2 className="text-3xl md:text-5xl font-extrabold mb-6 text-white leading-tight">Voyez MedSpace AI en action</h2>
            <p className="text-white/70 text-lg max-w-2xl mx-auto mb-12">
              Découvrez comment notre interface moderne et nos outils intelligents transforment votre apprentissage médical.
            </p>
            
            <div className="relative max-w-5xl mx-auto group cursor-pointer">
              <div className="absolute -inset-4 bg-white/5 rounded-[40px] blur-2xl group-hover:bg-white/10 transition-all duration-500"></div>
              <div className="relative aspect-video rounded-[32px] overflow-hidden border border-white/20 shadow-2xl bg-white/10 backdrop-blur-sm">
                <img
                  src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070&auto=format&fit=crop"
                  alt="Dashboard Preview"
                  className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-1000"
                />
                <div className="absolute inset-0 bg-[#082B66]/40 flex items-center justify-center group-hover:bg-[#082B66]/20 transition-all">
                  <div className="w-24 h-24 rounded-full bg-[#1368E8] flex items-center justify-center shadow-2xl shadow-[#1368E8]/40 group-hover:scale-110 transition-transform">
                    <Play className="w-10 h-10 text-white fill-current ml-1" />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-16">
              <Button size="lg" className="h-16 px-10 text-lg font-black rounded-2xl bg-[#FDB022] hover:bg-[#FDB022]/90 text-[#082B66] shadow-xl shadow-[#FDB022]/20 uppercase tracking-widest transition-all active:scale-95">
                Voir la démonstration
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section id="faq" className="py-24 bg-white relative">
        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-1.5 rounded-full bg-[#1368E8]/10 text-[#1368E8] text-sm font-bold mb-4">
              FAQ
            </div>
            <h2 className="text-3xl md:text-5xl font-extrabold mb-4 text-[#082B66]">Questions Fréquentes</h2>
            <p className="text-[#082B66]/60 text-lg">Tout ce que vous devez savoir pour bien commencer.</p>
          </div>
          
          <Accordion type="single" collapsible className="w-full space-y-6">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border border-[#E5EAF3] bg-white rounded-[24px] px-8 shadow-sm hover:shadow-md hover:border-[#1368E8]/20 transition-all">
                <AccordionTrigger className="text-left font-extrabold text-xl py-8 hover:no-underline text-[#082B66] transition-colors">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-[#082B66]/60 text-lg leading-relaxed pb-8 font-medium">
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
