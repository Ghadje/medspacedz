import { auth } from "@/auth"
import { redirect } from "next/navigation"
import prisma from "@/lib/prisma"
import { Trophy, CheckCircle, XCircle, RefreshCcw, Home, ArrowRight, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { Progress } from "@/components/ui/progress"

interface QuizResultPageProps {
  params: Promise<{ sessionId: string }>
}

export default async function QuizResultPage({ params }: QuizResultPageProps) {
  const session = await auth()
  if (!session?.user?.id) {
    redirect("/auth/login")
  }

  const { sessionId } = await params

  const quizSession = await prisma.quizSession.findUnique({
    where: { 
      id: sessionId,
      userId: session.user.id
    },
    include: {
      quiz: {
        include: {
          module: true
        }
      }
    }
  })

  if (!quizSession || quizSession.status !== "COMPLETED") {
    redirect("/dashboard/quizzes")
  }

  const score = Math.round(quizSession.score)
  const isPass = score >= 50

  return (
    <div className="min-h-screen bg-[#F8FBFF] flex flex-col items-center justify-center p-4 lg:p-8">
      <div className="w-full max-w-2xl space-y-8 animate-in zoom-in-95 duration-500">
        
        {/* Score Card */}
        <Card className="border-none rounded-[40px] shadow-2xl shadow-[#1368E8]/10 overflow-hidden bg-white">
          <CardContent className="p-0">
            <div className={cn(
              "p-12 text-center flex flex-col items-center gap-6",
              isPass ? "bg-emerald-500 text-white" : "bg-[#082B66] text-white"
            )}>
              <div className="w-20 h-20 rounded-[28px] bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <Trophy className="w-10 h-10" />
              </div>
              
              <div>
                <h1 className="text-3xl lg:text-4xl font-black uppercase tracking-tight">
                  {isPass ? "Félicitations !" : "Continuez vos efforts"}
                </h1>
                <p className="text-white/70 font-bold uppercase tracking-widest text-xs mt-2">
                  Vous avez terminé le quiz {quizSession.quiz.title}
                </p>
              </div>

              <div className="relative w-48 h-48 flex items-center justify-center mt-4">
                <svg className="w-full h-full -rotate-90">
                  <circle
                    cx="96"
                    cy="96"
                    r="88"
                    stroke="currentColor"
                    strokeWidth="12"
                    fill="transparent"
                    className="text-white/10"
                  />
                  <circle
                    cx="96"
                    cy="96"
                    r="88"
                    stroke="currentColor"
                    strokeWidth="12"
                    fill="transparent"
                    strokeDasharray={2 * Math.PI * 88}
                    strokeDashoffset={2 * Math.PI * 88 * (1 - score / 100)}
                    strokeLinecap="round"
                    className="text-white transition-all duration-1000 ease-out"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-5xl font-black tracking-tighter">{score}%</span>
                  <span className="text-[10px] font-black uppercase tracking-widest opacity-70">Score Total</span>
                </div>
              </div>
            </div>

            <div className="p-8 grid grid-cols-2 gap-4">
              <div className="bg-[#F8FBFF] rounded-3xl p-6 border border-[#E5EAF3] flex flex-col items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <span className="text-2xl font-black text-[#082B66]">{quizSession.correctAnswers}</span>
                <span className="text-[10px] font-black uppercase tracking-widest text-[#082B66]/40">Correctes</span>
              </div>

              <div className="bg-[#F8FBFF] rounded-3xl p-6 border border-[#E5EAF3] flex flex-col items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center text-red-600">
                  <XCircle className="w-6 h-6" />
                </div>
                <span className="text-2xl font-black text-[#082B66]">{quizSession.wrongAnswers}</span>
                <span className="text-[10px] font-black uppercase tracking-widest text-[#082B66]/40">Fausses</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href={`/dashboard/quizzes/${quizSession.quizId}/start`} className="flex-1">
            <Button className="w-full h-14 rounded-2xl bg-[#1368E8] hover:bg-[#082B66] text-white font-black uppercase text-xs tracking-widest shadow-xl shadow-[#1368E8]/20 transition-all gap-3">
              <RefreshCcw className="w-5 h-5" />
              Réessayer le quiz
            </Button>
          </Link>
          
          <Link href="/dashboard/quizzes" className="flex-1">
            <Button variant="outline" className="w-full h-14 rounded-2xl border-[#E5EAF3] bg-white text-[#082B66] font-black uppercase text-xs tracking-widest shadow-sm hover:bg-[#F3F7FF] transition-all gap-3">
              <Home className="w-5 h-5" />
              Retour aux quiz
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(" ")
}
