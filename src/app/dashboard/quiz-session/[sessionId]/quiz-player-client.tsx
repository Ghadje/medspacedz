"use client"

import * as React from "react"
import { 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Flag,
  Lightbulb,
  Check,
  X,
  Loader2,
  ArrowRight,
  Save,
  LogOut,
  Trophy
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import axios from "axios"
import { useRouter } from "next/navigation"

interface QuizPlayerClientProps {
  session: any
}

export function QuizPlayerClient({ session }: QuizPlayerClientProps) {
  const router = useRouter()
  const [currentIndex, setCurrentIndex] = React.useState(0)
  const [selectedAnswers, setSelectedAnswers] = React.useState<Record<string, string | null>>({})
  const [isAnswering, setIsAnswering] = React.useState(false)
  const [isCompleting, setIsCompleting] = React.useState(false)
  
  const questions = session.quiz.questions || []
  const currentQuestion = questions[currentIndex]
  const durationInSeconds = (session.quiz.durationMinutes || 0) * 60
  const [timeLeft, setTimeLeft] = React.useState<number | null>(
    durationInSeconds > 0 ? durationInSeconds : null
  )
  
  // Timer effect
  React.useEffect(() => {
    if (timeLeft === null || isCompleting) return

    if (timeLeft <= 0) {
      handleComplete()
      return
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => (prev !== null ? prev - 1 : null))
    }, 1000)

    return () => clearInterval(timer)
  }, [timeLeft, isCompleting])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }
  
  // Load existing answers if any
  React.useEffect(() => {
    const existing = {} as any
    session.answers?.forEach((ans: any) => {
      existing[ans.questionId] = ans.selectedAnswerId
    })
    setSelectedAnswers(existing)
  }, [session.answers])

  const handleSelectAnswer = async (answerId: string) => {
    if (isAnswering || !currentQuestion || selectedAnswers[currentQuestion.id] || isCompleting) return
    
    setIsAnswering(true)
    try {
      const isCorrect = currentQuestion.answers.find((a: any) => a.id === answerId)?.isCorrect
      
      setSelectedAnswers(prev => ({
        ...prev,
        [currentQuestion.id]: answerId
      }))

      // Save answer to API
      await axios.post(`/api/student/quiz-session/${session.id}/answer`, {
        questionId: currentQuestion.id,
        answerId: answerId,
        isCorrect: isCorrect
      })
      
    } catch (error) {
      console.error("Error saving answer:", error)
    } finally {
      setIsAnswering(false)
    }
  }

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1)
    }
  }

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
    }
  }

  const handleComplete = async () => {
    if (isCompleting) return
    setIsCompleting(true)
    try {
      await axios.post(`/api/student/quiz-session/${session.id}/complete`)
      router.push(`/dashboard/quiz-session/${session.id}/result`)
    } catch (error) {
      console.error("Error completing session:", error)
      setIsCompleting(false)
    }
  }

  if (questions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-8 text-center bg-[#F8FBFF]">
        <div className="w-20 h-20 bg-orange-50 rounded-3xl flex items-center justify-center mb-6">
          <XCircle className="w-10 h-10 text-orange-500" />
        </div>
        <h2 className="text-2xl font-black text-[#082B66] mb-2">Quiz vide</h2>
        <p className="text-[#082B66]/50 font-medium max-w-sm mb-8">
          Ce quiz ne contient aucune question pour le moment.
        </p>
        <Button 
          onClick={() => router.push("/dashboard/quizzes")}
          className="h-12 px-8 rounded-xl bg-[#1368E8] text-white font-black uppercase text-xs tracking-widest shadow-xl shadow-[#1368E8]/20"
        >
          Retour aux quiz
        </Button>
      </div>
    )
  }

  const progress = ((currentIndex + 1) / questions.length) * 100
  const isLastQuestion = currentIndex === questions.length - 1
  const currentAnswer = currentQuestion ? selectedAnswers[currentQuestion.id] : null

  return (
    <div className="flex flex-col min-h-screen">
      {/* Top Bar */}
      <header className="sticky top-0 z-10 bg-white border-b border-[#E5EAF3] px-4 py-3 lg:px-8">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon" 
              className="rounded-xl text-[#082B66]/40 hover:text-[#082B66]"
              onClick={() => router.push("/dashboard/quizzes")}
            >
              <ChevronLeft className="w-6 h-6" />
            </Button>
            <div>
              <h1 className="text-sm lg:text-base font-black text-[#082B66] truncate max-w-[200px] lg:max-w-md">
                {session.quiz.title}
              </h1>
              <p className="text-[10px] font-bold text-[#082B66]/40 uppercase tracking-widest">
                Question {currentIndex + 1} sur {questions.length}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 lg:gap-6">
            <div className="hidden sm:flex flex-col items-end">
              <div className={cn(
                "flex items-center gap-2 font-black text-sm transition-colors duration-300",
                timeLeft !== null && timeLeft < 60 ? "text-red-500 animate-pulse" : "text-[#082B66]/60"
              )}>
                <Clock className={cn("w-4 h-4", timeLeft !== null && timeLeft < 60 ? "text-red-500" : "text-[#1368E8]")} />
                <span>{timeLeft !== null ? formatTime(timeLeft) : "--:--"}</span>
              </div>
            </div>
            
            <Button 
              variant="outline" 
              className="h-10 rounded-xl border-[#E5EAF3] text-[#082B66] font-black text-[10px] uppercase tracking-widest gap-2"
              onClick={handleComplete}
              disabled={isCompleting}
            >
              {isCompleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogOut className="w-4 h-4" />}
              Quitter
            </Button>
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="w-full bg-[#E5EAF3] h-1.5">
        <div 
          className="bg-[#1368E8] h-full transition-all duration-500 ease-out shadow-[0_0_10px_rgba(19,104,232,0.5)]"
          style={{ width: `${progress}%` }}
        />
      </div>

      <main className="flex-1 p-4 lg:p-8 flex flex-col items-center">
        <div className="w-full max-w-3xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          
          {/* Question Card */}
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-[#1368E8]/5 border-[#1368E8]/10 text-[#1368E8] font-black text-[10px] py-1 px-3 rounded-full">
                {currentQuestion.type === "QCM" ? "Multiple Choices" : "Single Choice"}
              </Badge>
              {currentQuestion.difficulty && (
                <Badge variant="outline" className="bg-orange-50 border-orange-100 text-orange-600 font-black text-[10px] py-1 px-3 rounded-full">
                  {currentQuestion.difficulty}
                </Badge>
              )}
            </div>

            <h2 className="text-xl lg:text-2xl font-bold text-[#082B66] leading-relaxed">
              {currentQuestion.statement}
            </h2>

            {/* Answers List */}
            <div className="grid grid-cols-1 gap-3">
              {currentQuestion.answers.map((answer: any, index: number) => {
                const isSelected = currentAnswer === answer.id
                const isAnswered = !!currentAnswer
                const isCorrect = answer.isCorrect
                
                // Styling logic
                let cardStyle = "bg-white border-[#E5EAF3] text-[#082B66]"
                let icon = <div className="w-6 h-6 rounded-lg border-2 border-[#E5EAF3] flex items-center justify-center text-[10px] font-black text-[#082B66]/40 group-hover:border-[#1368E8]/30 group-hover:text-[#1368E8]/30 transition-all">{String.fromCharCode(65 + index)}</div>
                
                if (isAnswered) {
                  if (isSelected) {
                    if (isCorrect) {
                      cardStyle = "bg-emerald-50 border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.15)] ring-1 ring-emerald-500"
                      icon = <div className="w-6 h-6 rounded-lg bg-emerald-500 flex items-center justify-center text-white"><Check className="w-4 h-4" /></div>
                    } else {
                      cardStyle = "bg-red-50 border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.15)] ring-1 ring-red-500"
                      icon = <div className="w-6 h-6 rounded-lg bg-red-500 flex items-center justify-center text-white"><X className="w-4 h-4" /></div>
                    }
                  } else if (isCorrect) {
                    cardStyle = "bg-emerald-50/50 border-emerald-500/50"
                    icon = <div className="w-6 h-6 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-500"><Check className="w-4 h-4" /></div>
                  } else {
                    cardStyle = "opacity-50 border-[#E5EAF3]"
                  }
                } else {
                  cardStyle = "hover:bg-[#F3F7FF] hover:border-[#1368E8]/30 hover:shadow-md transition-all cursor-pointer group"
                }

                return (
                  <Card 
                    key={answer.id} 
                    className={cn(
                      "border-2 rounded-2xl overflow-hidden transition-all duration-200",
                      cardStyle
                    )}
                    onClick={() => handleSelectAnswer(answer.id)}
                  >
                    <CardContent className="p-4 flex items-center gap-4">
                      {icon}
                      <span className={cn(
                        "flex-1 font-bold text-sm lg:text-base",
                        isAnswered && isSelected && !isCorrect ? "text-red-700" : 
                        isAnswered && (isSelected || isCorrect) ? "text-emerald-700" : ""
                      )}>
                        {answer.text}
                      </span>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>

          {/* Explanation Area */}
          {currentAnswer && currentQuestion.explanation && (
            <div className="bg-[#1368E8]/5 border border-[#1368E8]/10 rounded-[24px] p-6 space-y-3 animate-in zoom-in-95 duration-300">
              <div className="flex items-center gap-2 text-[#1368E8] font-black text-[10px] uppercase tracking-widest">
                <Lightbulb className="w-4 h-4" />
                Explication
              </div>
              <p className="text-[#082B66] text-sm leading-relaxed font-medium">
                {currentQuestion.explanation}
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Navigation Footer */}
      <footer className="sticky bottom-0 bg-white border-t border-[#E5EAF3] p-4 lg:p-6 shadow-[0_-10px_30px_rgba(0,0,0,0.02)]">
        <div className="max-w-3xl mx-auto flex items-center justify-between gap-4">
          <Button 
            variant="ghost" 
            className="h-12 rounded-xl text-[#082B66] font-black text-xs uppercase tracking-widest gap-2 px-6 disabled:opacity-30"
            onClick={handlePrevious}
            disabled={currentIndex === 0}
          >
            <ChevronLeft className="w-4 h-4" />
            Précédent
          </Button>

          {isLastQuestion ? (
            <Button 
              className="h-12 rounded-xl bg-[#082B66] hover:bg-[#1368E8] text-white font-black text-xs uppercase tracking-widest px-8 shadow-xl transition-all gap-2"
              onClick={handleComplete}
              disabled={isCompleting}
            >
              {isCompleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trophy className="w-4 h-4" />}
              Terminer le Quiz
            </Button>
          ) : (
            <Button 
              className="h-12 rounded-xl bg-[#1368E8] hover:bg-[#082B66] text-white font-black text-xs uppercase tracking-widest px-8 shadow-xl shadow-[#1368E8]/20 transition-all gap-2"
              onClick={handleNext}
              disabled={!currentAnswer}
            >
              Suivant
              <ChevronRight className="w-4 h-4" />
            </Button>
          )}
        </div>
      </footer>
    </div>
  )
}
