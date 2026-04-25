"use client"

import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { PlayCircle, Rocket } from "lucide-react"

export function Hero() {
  return (
    <section className="relative pt-32 pb-20 overflow-hidden hero-gradient">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center max-w-4xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-6 border border-primary/20">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              La nouvelle ère de l'apprentissage médical
            </span>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 leading-[1.1]">
              Apprenez la médecine plus <span className="text-gradient">intelligemment</span> avec l'IA
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-10 leading-relaxed max-w-2xl mx-auto">
              Accédez à vos cours, supports, QCM, examens et corrections instantanées dans une seule plateforme conçue pour les étudiants algériens.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Button size="lg" className="h-14 px-8 text-lg rounded-xl shadow-xl shadow-primary/25">
                <Rocket className="mr-2 h-5 w-5" />
                Commencer gratuitement
              </Button>
              <Button size="lg" variant="outline" className="h-14 px-8 text-lg rounded-xl glass">
                <PlayCircle className="mr-2 h-5 w-5" />
                Voir la démonstration
              </Button>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="relative max-w-5xl mx-auto"
        >
          <div className="absolute inset-0 bg-primary/20 blur-[100px] rounded-full -z-10 opacity-30"></div>
          <div className="glass rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
            <div className="h-10 bg-white/5 border-b border-white/5 flex items-center px-4 gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
              <div className="w-3 h-3 rounded-full bg-amber-500/50"></div>
              <div className="w-3 h-3 rounded-full bg-emerald-500/50"></div>
              <div className="ml-4 h-5 w-64 bg-white/5 rounded-md"></div>
            </div>
            <img
              src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=2070&auto=format&fit=crop"
              alt="MedSpace Dashboard Preview"
              className="w-full h-auto object-cover aspect-video opacity-90"
            />
          </div>
        </motion.div>
      </div>
    </section>
  )
}
