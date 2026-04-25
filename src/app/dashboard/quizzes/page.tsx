"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Play, Clock, HelpCircle, ChevronRight } from "lucide-react"
import Link from "next/link"

const quizList = [
  { id: "q1", title: "Anatomie : Membre Supérieur", module: "Anatomie", questions: 40, time: "30 min", difficulty: "Moyen" },
  { id: "q2", title: "Embryologie : 1ère Semaine", module: "Embryologie", questions: 25, time: "20 min", difficulty: "Facile" },
  { id: "q3", title: "Physiologie : Le Rein", module: "Physiologie", questions: 50, time: "45 min", difficulty: "Difficile" },
  { id: "q4", title: "Cardiologie : ECG de base", module: "Cardiologie", questions: 30, time: "25 min", difficulty: "Moyen" },
]

export default function QuizzesPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Quiz & Entraînement</h1>
          <p className="text-muted-foreground">Testez vos connaissances avec nos séries de QCM par module.</p>
        </div>
        <Button className="rounded-xl gap-2">
          <Play className="w-4 h-4" /> Mode Examen Rapide
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {quizList.map((quiz) => (
          <Card key={quiz.id} className="border-border/50 hover:border-primary/50 transition-all group overflow-hidden">
            <div className="flex h-full">
              <div className="w-2 bg-primary/20 group-hover:bg-primary transition-colors"></div>
              <div className="flex-1 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <Badge variant="outline" className="mb-2 bg-muted/50">{quiz.module}</Badge>
                    <CardTitle className="text-xl">{quiz.title}</CardTitle>
                  </div>
                  <Badge className={
                    quiz.difficulty === "Facile" ? "bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/10 border-emerald-500/20" :
                    quiz.difficulty === "Difficile" ? "bg-rose-500/10 text-rose-500 hover:bg-rose-500/10 border-rose-500/20" :
                    "bg-amber-500/10 text-amber-500 hover:bg-amber-500/10 border-amber-500/20"
                  }>
                    {quiz.difficulty}
                  </Badge>
                </div>
                
                <div className="flex items-center gap-6 text-sm text-muted-foreground mb-6">
                  <div className="flex items-center gap-2">
                    <HelpCircle className="w-4 h-4" /> {quiz.questions} questions
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" /> {quiz.time}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-border/50">
                  <div className="text-xs text-muted-foreground italic">Dernier score: 85%</div>
                  <Link href={`/dashboard/quizzes/${quiz.id}`}>
                    <Button variant="ghost" className="group/btn gap-2 text-primary hover:text-primary hover:bg-primary/5">
                      Démarrer <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
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
