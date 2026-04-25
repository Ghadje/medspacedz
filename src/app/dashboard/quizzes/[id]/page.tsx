"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2, 
  XCircle, 
  Info, 
  Flag,
  Timer,
  Layout
} from "lucide-react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"

const sampleQuestions = [
  {
    id: 1,
    statement: "Quel est le principal muscle responsable de l'abduction du bras entre 15° et 90° ?",
    options: [
      { id: "a", text: "Le muscle supra-épineux" },
      { id: "b", text: "Le muscle deltoïde" },
      { id: "c", text: "Le muscle grand pectoral" },
      { id: "d", text: "Le muscle grand rond" }
    ],
    correctId: "b",
    explanation: "Le muscle deltoïde est le principal abducteur du bras. Le supra-épineux initie l'abduction (0-15°).",
    reference: "N°11 (2022 UE01)"
  },
  {
    id: 2,
    statement: "La mitose se termine par la formation de :",
    options: [
      { id: "a", text: "Deux cellules filles haploïdes" },
      { id: "b", text: "Deux cellules filles diploïdes" },
      { id: "c", text: "Quatre cellules filles haploïdes" },
      { id: "d", text: "Quatre cellules filles diploïdes" }
    ],
    correctId: "b",
    explanation: "La mitose produit deux cellules génétiquement identiques à la cellule mère (diploïdes). La méiose en produit quatre haploïdes.",
    reference: "BioCell 2023"
  }
]

export default function QuizEnginePage({ params }: { params: { id: string } }) {
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [score, setScore] = useState(0)
  const [isCompleted, setIsCompleted] = useState(false)
  
  const currentQuestion = sampleQuestions[currentQuestionIdx]
  const progress = ((currentQuestionIdx + 1) / sampleQuestions.length) * 100

  const handleSelect = (id: string) => {
    if (showResult) return
    setSelectedAnswer(id)
  }

  const handleVerify = () => {
    if (!selectedAnswer) return
    setShowResult(true)
    setAnswers({ ...answers, [currentQuestion.id]: selectedAnswer })
    if (selectedAnswer === currentQuestion.correctId) {
      setScore(score + 1)
    }
  }

  const handleNext = () => {
    if (currentQuestionIdx < sampleQuestions.length - 1) {
      setCurrentQuestionIdx(currentQuestionIdx + 1)
      setSelectedAnswer(null)
      setShowResult(false)
    } else {
      setIsCompleted(true)
    }
  }

  const handlePrevious = () => {
    if (currentQuestionIdx > 0) {
      setCurrentQuestionIdx(currentQuestionIdx - 1)
      const prevAnswer = answers[sampleQuestions[currentQuestionIdx - 1].id]
      setSelectedAnswer(prevAnswer || null)
      setShowResult(!!prevAnswer)
    }
  }

  if (isCompleted) {
    return (
      <div className="max-w-3xl mx-auto py-12 text-center">
        <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-8">
          <CheckCircle2 className="w-12 h-12 text-primary" />
        </div>
        <h1 className="text-4xl font-bold mb-4">Quiz Terminé !</h1>
        <p className="text-xl text-muted-foreground mb-8">Vous avez obtenu un score de</p>
        <div className="text-6xl font-black text-primary mb-12">
          {Math.round((score / sampleQuestions.length) * 100)}%
        </div>
        
        <div className="grid grid-cols-3 gap-6 mb-12">
          <Card className="bg-emerald-500/5 border-emerald-500/20">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-emerald-500">{score}</div>
              <div className="text-xs text-muted-foreground">Correctes</div>
            </CardContent>
          </Card>
          <Card className="bg-rose-500/5 border-rose-500/20">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-rose-500">{sampleQuestions.length - score}</div>
              <div className="text-xs text-muted-foreground">Fausses</div>
            </CardContent>
          </Card>
          <Card className="bg-blue-500/5 border-blue-500/20">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-blue-500">{sampleQuestions.length}</div>
              <div className="text-xs text-muted-foreground">Total</div>
            </CardContent>
          </Card>
        </div>

        <div className="flex items-center justify-center gap-4">
          <Button size="lg" className="rounded-xl px-8" onClick={() => window.location.reload()}>
            Recommencer
          </Button>
          <Button size="lg" variant="outline" className="rounded-xl px-8" onClick={() => window.history.back()}>
            Quitter
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto pb-20">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="rounded-full" onClick={() => window.history.back()}>
            <ChevronLeft className="w-6 h-6" />
          </Button>
          <div>
            <h1 className="text-xl font-bold line-clamp-1">{sampleQuestions[0].reference.split(' ')[0]} - Anatomie</h1>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>Question {currentQuestionIdx + 1} sur {sampleQuestions.length}</span>
              <span className="w-1 h-1 rounded-full bg-muted-foreground"></span>
              <Timer className="w-3 h-3" /> 14:20 restantes
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="rounded-lg gap-2 text-muted-foreground">
            <Flag className="w-4 h-4" /> Signaler
          </Button>
          <Button variant="outline" size="sm" className="rounded-lg gap-2">
            <Layout className="w-4 h-4" /> Mode
          </Button>
        </div>
      </div>

      <Progress value={progress} className="h-1.5 mb-10" />

      <div className="space-y-8">
        <Card className="border-border/50 shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between mb-4">
              <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/10">{currentQuestion.reference}</Badge>
              <div className="text-xs text-muted-foreground">DIFFICULTÉ : MOYEN</div>
            </div>
            <CardTitle className="text-2xl leading-relaxed">
              {currentQuestion.statement}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {currentQuestion.options.map((option) => {
              const isSelected = selectedAnswer === option.id
              const isCorrect = showResult && option.id === currentQuestion.correctId
              const isWrong = showResult && isSelected && option.id !== currentQuestion.correctId

              return (
                <button
                  key={option.id}
                  onClick={() => handleSelect(option.id)}
                  disabled={showResult}
                  className={cn(
                    "w-full flex items-center gap-4 p-5 rounded-2xl border-2 transition-all text-left group",
                    !showResult && isSelected ? "border-primary bg-primary/5" : "border-border/50 bg-card hover:border-primary/30",
                    showResult && isCorrect ? "border-emerald-500 bg-emerald-500/10" : "",
                    showResult && isWrong ? "border-rose-500 bg-rose-500/10" : ""
                  )}
                >
                  <div className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm shrink-0 border transition-colors",
                    !showResult && isSelected ? "bg-primary text-white border-primary" : "bg-muted text-muted-foreground border-transparent",
                    showResult && isCorrect ? "bg-emerald-500 text-white border-emerald-500" : "",
                    showResult && isWrong ? "bg-rose-500 text-white border-rose-500" : ""
                  )}>
                    {option.id.toUpperCase()}
                  </div>
                  <span className="flex-1 font-medium">{option.text}</span>
                  {showResult && isCorrect && <CheckCircle2 className="w-6 h-6 text-emerald-500" />}
                  {showResult && isWrong && <XCircle className="w-6 h-6 text-rose-500" />}
                </button>
              )
            })}
          </CardContent>
          <CardFooter className="flex-col gap-6 pt-6 border-t border-border/50">
            {!showResult ? (
              <Button 
                className="w-full h-14 rounded-2xl text-lg font-bold shadow-lg shadow-primary/20" 
                onClick={handleVerify}
                disabled={!selectedAnswer}
              >
                Valider la réponse
              </Button>
            ) : (
              <div className="w-full space-y-6">
                <div className="p-6 rounded-2xl bg-primary/5 border border-primary/20">
                  <div className="flex items-center gap-2 text-primary font-bold mb-3">
                    <Info className="w-5 h-5" /> Explication
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    {currentQuestion.explanation}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <Button variant="outline" className="flex-1 h-12 rounded-xl" onClick={handlePrevious}>
                    Question précédente
                  </Button>
                  <Button className="flex-1 h-12 rounded-xl font-bold" onClick={handleNext}>
                    {currentQuestionIdx === sampleQuestions.length - 1 ? "Terminer le quiz" : "Question suivante"}
                    <ChevronRight className="ml-2 w-5 h-5" />
                  </Button>
                </div>
              </div>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
