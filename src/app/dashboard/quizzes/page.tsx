"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Play, Clock, HelpCircle, ChevronRight, Zap } from "lucide-react"
import Link from "next/link"

const quizList = [
  { id: "q1", title: "Anatomie : Membre Supérieur", module: "Anatomie", questions: 40, time: "30 min", difficulty: "Moyen" },
  { id: "q2", title: "Embryologie : 1ère Semaine", module: "Embryologie", questions: 25, time: "20 min", difficulty: "Facile" },
  { id: "q3", title: "Physiologie : Le Rein", module: "Physiologie", questions: 50, time: "45 min", difficulty: "Difficile" },
  { id: "q4", title: "Cardiologie : ECG de base", module: "Cardiologie", questions: 30, time: "25 min", difficulty: "Moyen" },
]

export default function QuizzesPage() {
  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-[#082B66]">Quiz & Entraînement</h1>
          <p className="text-[#082B66]/60 text-lg font-medium mt-2">Testez vos connaissances avec nos séries de QCM certifiées.</p>
        </div>
        <Button className="w-full md:w-auto h-14 rounded-2xl bg-[#1368E8] hover:bg-[#1368E8]/90 text-white font-black text-sm uppercase tracking-widest shadow-xl shadow-[#1368E8]/20 gap-3 px-8">
          <Zap className="w-5 h-5 fill-current" /> Mode Examen Rapide
        </Button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {quizList.map((quiz) => (
          <Card key={quiz.id} className="border-[#E5EAF3] bg-white rounded-[32px] hover:border-[#1368E8]/30 transition-all group overflow-hidden shadow-sm hover:shadow-xl duration-300">
            <div className="flex flex-col sm:flex-row h-full">
              <div className="w-full sm:w-4 bg-[#F3F7FF] group-hover:bg-[#1368E8] transition-colors h-4 sm:h-auto"></div>
              <div className="flex-1 p-8">
                <div className="flex flex-col sm:flex-row items-start justify-between mb-6 gap-4">
                  <div>
                    <Badge className="mb-3 bg-[#1368E8]/10 text-[#1368E8] border-none font-black text-[10px] uppercase tracking-widest px-3 py-1 rounded-full">
                      {quiz.module}
                    </Badge>
                    <CardTitle className="text-2xl font-black text-[#082B66] leading-tight group-hover:text-[#1368E8] transition-colors">
                      {quiz.title}
                    </CardTitle>
                  </div>
                  <Badge className={
                    `px-4 py-1.5 rounded-full font-black text-[10px] uppercase tracking-widest border-none ${
                      quiz.difficulty === "Facile" ? "bg-[#12B76A]/10 text-[#12B76A]" :
                      quiz.difficulty === "Difficile" ? "bg-red-50 text-red-500" :
                      "bg-[#FDB022]/10 text-[#FDB022]"
                    }`
                  }>
                    {quiz.difficulty}
                  </Badge>
                </div>
                
                <div className="flex items-center gap-8 text-sm text-[#082B66]/40 font-bold uppercase tracking-widest mb-8">
                  <div className="flex items-center gap-2.5">
                    <HelpCircle className="w-5 h-5 text-[#1368E8]" /> {quiz.questions} QCM
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Clock className="w-5 h-5 text-[#1368E8]" /> {quiz.time}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between pt-6 border-t border-[#E5EAF3] gap-6">
                  <div className="text-xs font-black text-[#082B66]/30 uppercase tracking-[0.2em] italic">Dernier score: 85%</div>
                  <Link href={`/dashboard/quizzes/${quiz.id}`} className="w-full sm:w-auto">
                    <Button variant="ghost" className="w-full sm:w-auto h-12 px-8 rounded-xl group/btn gap-3 text-[#1368E8] font-black uppercase text-xs tracking-widest hover:bg-[#1368E8]/5 transition-all border-2 border-transparent hover:border-[#1368E8]/10">
                      Démarrer <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-2 transition-transform" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
