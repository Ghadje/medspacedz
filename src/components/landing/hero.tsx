"use client"

import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { Phone, ArrowRight, Star, GraduationCap, Users, BookOpen } from "lucide-react"

export function Hero() {
  return (
    <section className="relative pt-40 pb-24 overflow-hidden min-h-[820px] flex items-center bg-gradient-to-br from-[#F8FBFF] via-[#F3F7FF] to-[#FFFFFF]">
      {/* Decorative Background Shapes */}
      <div className="absolute top-20 left-10 w-24 h-24 bg-[#1368E8]/5 rounded-full blur-2xl animate-pulse"></div>
      <div className="absolute bottom-20 right-1/2 w-64 h-64 bg-[#FDB022]/5 rounded-full blur-3xl animate-float"></div>
      
      <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Side Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1368E8]/10 text-[#1368E8] text-sm font-bold border border-[#1368E8]/20">
              <Star className="w-4 h-4 fill-current" />
              100% Satisfaction Guarantee
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-[#082B66] leading-[1.1]">
              Apprenez la <span className="relative inline-block text-[#1368E8]">
                médecine
                <svg className="absolute -bottom-2 left-0 w-full h-3 text-[#FDB022]" viewBox="0 0 145 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1.00016 15.2711C18.1407 8.34427 70.832 -1.93441 144.473 12.3652" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                </svg>
              </span> avec les meilleurs supports
            </h1>
            
            <p className="text-lg md:text-xl text-[#082B66]/70 leading-relaxed max-w-xl">
              Accédez à des supports de cours, QCM, examens, corrections instantanées et statistiques de progression pour réussir vos études médicales.
            </p>
            
            <div className="flex flex-wrap items-center gap-6 pt-4">
              <Button size="lg" className="h-16 px-10 text-lg font-bold rounded-2xl bg-[#1368E8] hover:bg-[#1368E8]/90 text-white shadow-xl shadow-[#1368E8]/20 group transition-all">
                Explorer les cours
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-white border border-[#E5EAF3] flex items-center justify-center shadow-sm text-[#1368E8]">
                  <Phone className="w-5 h-5 fill-current" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-[#082B66]/60">Vous avez une question ?</span>
                  <a href="tel:0555001122" className="text-lg font-bold text-[#082B66] hover:text-[#1368E8] transition-colors">0555 00 11 22</a>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Side Content - Images & Floating Cards */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="relative z-10 flex justify-center">
              <img
                src="/medical_student_hero_1777123859317.png"
                alt="Medical Student"
                className="max-w-full h-auto drop-shadow-2xl relative z-20"
              />
              
              {/* Decorative Icons around student */}
              <div className="absolute top-10 right-10 w-16 h-16 bg-white rounded-2xl shadow-xl flex items-center justify-center animate-float z-30">
                <BookOpen className="w-8 h-8 text-[#1368E8]" />
              </div>
              <div className="absolute bottom-20 -left-10 w-14 h-14 bg-white rounded-2xl shadow-xl flex items-center justify-center animate-bounce z-30" style={{ animationDuration: '4s' }}>
                <GraduationCap className="w-7 h-7 text-[#FDB022]" />
              </div>
              
              {/* Floating Stat Cards */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="absolute top-1/4 -left-16 bg-white p-5 rounded-[20px] shadow-2xl border border-[#E5EAF3] flex items-center gap-4 z-40"
              >
                <div className="w-12 h-12 rounded-full bg-[#12B76A]/10 flex items-center justify-center text-[#12B76A]">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-2xl font-black text-[#082B66]">15k</div>
                  <div className="text-xs font-bold text-[#082B66]/50">Étudiants actifs</div>
                </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="absolute bottom-1/4 -right-12 bg-white p-5 rounded-[20px] shadow-2xl border border-[#E5EAF3] flex items-center gap-4 z-40"
              >
                <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-2xl font-black text-[#082B66]">34k</div>
                  <div className="text-xs font-bold text-[#082B66]/50">Cours complétés</div>
                </div>
              </motion.div>
              
              {/* Abstract Decorative Shapes */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] -z-10 pointer-events-none">
                <svg className="w-full h-full opacity-10" viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="250" cy="250" r="200" stroke="#1368E8" strokeWidth="2" strokeDasharray="10 10" />
                  <path d="M400 100C450 150 450 250 400 300" stroke="#FDB022" strokeWidth="4" strokeLinecap="round" />
                  <circle cx="100" cy="400" r="10" fill="#12B76A" />
                  <circle cx="450" cy="150" r="5" fill="#1368E8" />
                </svg>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Wave bottom shape if needed */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0]">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-[60px] fill-white">
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C58,115.34,124.3,101.44,185.34,81.18c41.25-13.72,83.02-27.42,136.05-24.74Z"></path>
        </svg>
      </div>
    </section>
  )
}
