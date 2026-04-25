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
  Layout,
  RefreshCw,
  Home
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
  const router = useRouter()
  
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
      <div className="max-w-3xl mx-auto py-12 px-4 text-center">
        <div className="w-24 h-24 bg-[#12B76A]/10 rounded-[32px] flex items-center justify-center mx-auto mb-8 shadow-lg shadow-[#12B76A]/10 animate-bounce">
          <CheckCircle2 className="w-12 h-12 text-[#12B76A]" />
        </div>
        <h1 className="text-5xl font-black text-[#082B66] mb-4">Quiz Terminé !</h1>
        <p className="text-xl font-bold text-[#082B66]/40 mb-12 uppercase tracking-widest">Résultats de la session</p>
        
        <div className="text-8xl font-black text-[#1368E8] mb-16 tracking-tighter">
          {Math.round((score / sampleQuestions.length) * 100)}%
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-16">
          <Card className="bg-white border-[#E5EAF3] rounded-[32px] shadow-sm">
            <CardContent className="pt-8">
              <div className="text-3xl font-black text-[#12B76A] mb-1">{score}</div>
              <div className="text-xs font-black text-[#082B66]/30 uppercase tracking-widest">Correctes</div>
            </CardContent>
          </Card>
          <Card className="bg-white border-[#E5EAF3] rounded-[32px] shadow-sm">
            <CardContent className="pt-8">
              <div className="text-3xl font-black text-red-500 mb-1">{sampleQuestions.length - score}</div>
              <div className="text-xs font-black text-[#082B66]/30 uppercase tracking-widest">Fausses</div>
            </CardContent>
          </Card>
          <Card className="bg-white border-[#E5EAF3] rounded-[32px] shadow-sm">
            <CardContent className="pt-8">
              <div className="text-3xl font-black text-[#082B66] mb-1">{sampleQuestions.length}</div>
              <div className="text-xs font-black text-[#082B66]/30 uppercase tracking-widest">Total</div>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          <Button size="lg" className="w-full sm:w-auto h-16 rounded-2xl px-12 bg-[#1368E8] text-white font-black uppercase text-sm tracking-widest shadow-xl shadow-[#1368E8]/20 gap-3" onClick={() => window.location.reload()}>
            <RefreshCw className="w-5 h-5" /> Recommencer
          </Button>
          <Button size="lg" variant="outline" className="w-full sm:w-auto h-16 rounded-2xl px-12 border-2 border-[#E5EAF3] text-[#082B66] font-black uppercase text-sm tracking-widest hover:bg-[#F3F7FF] transition-all gap-3" onClick={() => router.push("/dashboard/quizzes")}>
            <Home className="w-5 h-5" /> Retour
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 pb-20 pt-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10 gap-6">
        <div className="flex items-center gap-6">
          <Button 
            variant="ghost" 
            size="icon" 
            className="w-14 h-14 rounded-2xl bg-white border border-[#E5EAF3] text-[#082B66] shadow-sm hover:bg-[#F3F7FF]" 
            onClick={() => router.back()}
          >
            <ChevronLeft className="w-8 h-8" />
          </Button>
          <div>
            <h1 className="text-2xl font-black text-[#082B66] line-clamp-1">{sampleQuestions[0].reference.split(' ')[0]} - Anatomie</h1>
            <div className="flex items-center gap-4 text-[10px] font-black text-[#082B66]/40 uppercase tracking-widest mt-1">
              <span>Question {currentQuestionIdx + 1} sur {sampleQuestions.length}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#E5EAF3]"></span>
              <span className="flex items-center gap-2 text-[#1368E8]"><Timer className="w-4 h-4" /> 14:20</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Button variant="outline" className="flex-1 sm:flex-none h-12 rounded-xl border-[#E5EAF3] text-[#082B66]/40 font-black text-[10px] uppercase tracking-widest gap-2 hover:bg-red-50 hover:text-red-500 hover:border-red-100 transition-all">
            <Flag className="w-4 h-4" /> Signaler
          </Button>
          <Button variant="outline" className="flex-1 sm:flex-none h-12 rounded-xl border-[#E5EAF3] text-[#082B66] font-black text-[10px] uppercase tracking-widest gap-2 hover:bg-[#F3F7FF] transition-all">
            <Layout className="w-4 h-4" /> Mode Zen
          </Button>
        </div>
      </div>

      <div className="mb-12">
        <div className="flex items-center justify-between mb-3 px-1">
          <span className="text-[10px] font-black text-[#1368E8] uppercase tracking-widest">Progression</span>
          <span className="text-[10px] font-black text-[#082B66]/40 uppercase tracking-widest">{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} className="h-3 rounded-full bg-[#E5EAF3] [&>div]:bg-[#1368E8]" />
      </div>

      <div className="space-y-10">
        <Card className="border-[#E5EAF3] bg-white rounded-[40px] shadow-xl shadow-[#082B66]/5 overflow-hidden">
          <CardHeader className="p-10 pb-6">
            <div className="flex items-center justify-between mb-8">
              <Badge className="bg-[#1368E8] text-white border-none font-black text-[10px] uppercase tracking-[0.2em] px-4 py-2 rounded-full">
                {currentQuestion.reference}
              </Badge>
              <div className="text-[10px] font-black text-[#082B66]/30 uppercase tracking-[0.2em]">DIFFICULTÉ : MOYEN</div>
            </div>
            <CardTitle className="text-2xl sm:text-3xl font-black text-[#082B66] leading-[1.4]">
              {currentQuestion.statement}
            </CardTitle>
          </CardHeader>
          <CardContent className="px-10 pb-10 space-y-4">
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
                    "w-full flex items-center gap-6 p-6 rounded-[28px] border-2 transition-all text-left group relative overflow-hidden",
                    !showResult && isSelected ? "border-[#1368E8] bg-[#1368E8]/5 shadow-lg shadow-[#1368E8]/5" : "border-[#E5EAF3] bg-white hover:border-[#1368E8]/30 hover:bg-[#F3F7FF]/50",
                    showResult && isCorrect ? "border-[#12B76A] bg-[#12B76A]/5" : "",
                    showResult && isWrong ? "border-red-500 bg-red-50" : ""
                  )}
                >
                  <div className={cn(
                    "w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg shrink-0 border-2 transition-all duration-300",
                    !showResult && isSelected ? "bg-[#1368E8] text-white border-[#1368E8] shadow-lg shadow-[#1368E8]/30" : "bg-white text-[#082B66]/20 border-[#E5EAF3] group-hover:border-[#1368E8]/30 group-hover:text-[#1368E8]",
                    showResult && isCorrect ? "bg-[#12B76A] text-white border-[#12B76A] shadow-lg shadow-[#12B76A]/30" : "",
                    showResult && isWrong ? "bg-red-500 text-white border-red-500" : ""
                  )}>
                    {option.id.toUpperCase()}
                  </div>
                  <span className={cn(
                    "flex-1 font-bold text-lg leading-tight transition-colors",
                    !showResult && isSelected ? "text-[#082B66]" : "text-[#082B66]/70",
                    showResult && isCorrect ? "text-[#12B76A]" : "",
                    showResult && isWrong ? "text-red-600" : ""
                  )}>
                    {option.text}
                  </span>
                  {showResult && isCorrect && <CheckCircle2 className="w-8 h-8 text-[#12B76A] animate-in zoom-in" />}
                  {showResult && isWrong && <XCircle className="w-8 h-8 text-red-500 animate-in zoom-in" />}
                </button>
              )
            })}
          </CardContent>
          <CardFooter className="flex-col gap-8 p-10 bg-[#F8FBFF] border-t border-[#E5EAF3]">
            {!showResult ? (
              <Button 
                className="w-full h-16 rounded-[24px] text-sm font-black uppercase tracking-[0.2em] bg-[#1368E8] text-white shadow-xl shadow-[#1368E8]/20 hover:bg-[#1368E8]/90 transition-all active:scale-[0.98]" 
                onClick={handleVerify}
                disabled={!selectedAnswer}
              >
                Valider la réponse
              </Button>
            ) : (
              <div className="w-full space-y-10 animate-in slide-in-from-bottom-4 duration-500">
                <div className="p-8 rounded-[32px] bg-white border border-[#E5EAF3] shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-2 h-full bg-[#1368E8]"></div>
                  <div className="flex items-center gap-3 text-[#1368E8] font-black uppercase text-xs tracking-widest mb-4">
                    <Info className="w-5 h-5" /> Explication pédagogique
                  </div>
                  <p className="text-[#082B66]/60 font-bold text-lg leading-relaxed">
                    {currentQuestion.explanation}
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row items-center gap-6">
                  <Button variant="outline" className="w-full sm:w-auto flex-1 h-16 rounded-[24px] border-2 border-[#E5EAF3] text-[#082B66] font-black uppercase text-xs tracking-widest hover:bg-[#F3F7FF] transition-all" onClick={handlePrevious}>
                    <ChevronLeft className="mr-2 w-5 h-5" /> Question précédente
                  </Button>
                  <Button className="w-full sm:w-auto flex-1 h-16 rounded-[24px] bg-[#082B66] text-white font-black uppercase text-xs tracking-widest hover:bg-[#082B66]/90 transition-all active:scale-[0.98]" onClick={handleNext}>
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
