"use client"

import * as React from "react"
import {
  Search,
  Layers,
  BookOpen,
  ChevronRight,
  Filter,
  ChevronDown,
  Loader2,
  Play,
  Clock,
  ListChecks,
  Zap,
  FileText,
  Trophy,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"
import axios from "axios"
import { cn } from "@/lib/utils"
import Link from "next/link"

interface QuizzesClientProps {
  user: any
}

export function QuizzesClient({ user }: QuizzesClientProps) {
  const [specialties, setSpecialties] = React.useState<any[]>([])
  const [studyYears, setStudyYears] = React.useState<any[]>([])
  const [modules, setModules] = React.useState<any[]>([])
  const [supports, setSupports] = React.useState<any[]>([])
  const [quizzes, setQuizzes] = React.useState<any[]>([])

  const [selectedSpecialty, setSelectedSpecialty] = React.useState("")
  const [selectedYear, setSelectedYear] = React.useState("")
  const [selectedModule, setSelectedModule] = React.useState("")
  const [selectedSupport, setSelectedSupport] = React.useState("")
  const [quizSearch, setQuizSearch] = React.useState("")
  const [moduleSearch, setModuleSearch] = React.useState("")

  const [loadingFilters, setLoadingFilters] = React.useState(true)
  const [loadingQuizzes, setLoadingQuizzes] = React.useState(false)

  // Fetch specialties on mount
  React.useEffect(() => {
    const fetchInitial = async () => {
      try {
        setLoadingFilters(true)
        const res = await axios.get("/api/student/quiz-filters")
        setSpecialties(res.data.specialties || [])
      } catch (e) {
        console.error(e)
      } finally {
        setLoadingFilters(false)
      }
    }
    fetchInitial()
  }, [])

  // Fetch years when specialty changes
  React.useEffect(() => {
    if (!selectedSpecialty) {
      setStudyYears([])
      setModules([])
      setSupports([])
      setQuizzes([])
      setSelectedYear("")
      setSelectedModule("")
      setSelectedSupport("")
      return
    }
    const fetchYears = async () => {
      try {
        const res = await axios.get(`/api/student/quiz-filters?specialtyId=${selectedSpecialty}`)
        setStudyYears(res.data.studyYears || [])
        setModules([])
        setSupports([])
        setQuizzes([])
        setSelectedYear("")
        setSelectedModule("")
        setSelectedSupport("")
      } catch (e) { console.error(e) }
    }
    fetchYears()
  }, [selectedSpecialty])

  // Fetch modules when year changes
  React.useEffect(() => {
    if (!selectedYear) {
      setModules([])
      setSupports([])
      setQuizzes([])
      setSelectedModule("")
      setSelectedSupport("")
      return
    }
    const fetchModules = async () => {
      try {
        const res = await axios.get(`/api/student/quiz-filters?specialtyId=${selectedSpecialty}&studyYearId=${selectedYear}`)
        setModules(res.data.modules || [])
        setSupports([])
        setQuizzes([])
        setSelectedModule("")
        setSelectedSupport("")
      } catch (e) { console.error(e) }
    }
    fetchModules()
  }, [selectedYear, selectedSpecialty])

  // Fetch supports + quizzes when module changes
  React.useEffect(() => {
    if (!selectedModule) {
      setSupports([])
      setQuizzes([])
      setSelectedSupport("")
      return
    }
    const fetchModuleData = async () => {
      try {
        setLoadingQuizzes(true)
        const [filtersRes, quizzesRes] = await Promise.all([
          axios.get(`/api/student/quiz-filters?moduleId=${selectedModule}`),
          axios.get(`/api/student/quizzes?moduleId=${selectedModule}&specialtyId=${selectedSpecialty}&studyYearId=${selectedYear}`),
        ])
        setSupports(filtersRes.data.supports || [])
        setQuizzes(quizzesRes.data.quizzes || [])
        setSelectedSupport("")
      } catch (e) {
        console.error(e)
      } finally {
        setLoadingQuizzes(false)
      }
    }
    fetchModuleData()
  }, [selectedModule, selectedSpecialty, selectedYear])

  // Re-fetch quizzes when support or search changes
  React.useEffect(() => {
    if (!selectedModule) return
    const fetchQuizzes = async () => {
      try {
        setLoadingQuizzes(true)
        const params = new URLSearchParams({
          moduleId: selectedModule,
          specialtyId: selectedSpecialty,
          studyYearId: selectedYear,
          search: quizSearch,
        })
        if (selectedSupport) params.set("courseSupportId", selectedSupport)
        const res = await axios.get(`/api/student/quizzes?${params}`)
        setQuizzes(res.data.quizzes || [])
      } catch (e) {
        console.error(e)
      } finally {
        setLoadingQuizzes(false)
      }
    }
    const debounce = setTimeout(fetchQuizzes, 300)
    return () => clearTimeout(debounce)
  }, [selectedSupport, quizSearch, selectedModule, selectedSpecialty, selectedYear])

  const filteredModules = modules.filter(m =>
    m.title.toLowerCase().includes(moduleSearch.toLowerCase())
  )

  const moduleName = modules.find(m => m.id === selectedModule)?.title || ""
  const selectedModuleObj = modules.find(m => m.id === selectedModule)

  const filterPanel = (
    <div className="flex flex-col h-full">
      {/* Panel Header */}
      <div className="p-6 border-b border-[#E5EAF3] bg-[#F8FBFF]/50">
        <h3 className="text-lg font-black text-[#082B66] flex items-center gap-2">
          <Layers className="w-5 h-5 text-[#1368E8]" />
          Choisir vos quiz
        </h3>
      </div>

      <div className="p-6 space-y-6 flex-1 overflow-y-auto">
        {/* Step 1: Specialty */}
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-[#082B66]/40 ml-1">
            Étape 1 : Spécialité
          </label>
          {loadingFilters ? (
            <Skeleton className="h-12 rounded-xl" />
          ) : (
            <Select value={selectedSpecialty} onValueChange={v => setSelectedSpecialty(v || "")}>
              <SelectTrigger className="h-12 rounded-xl border-[#E5EAF3] bg-[#F8FBFF] font-bold text-[#082B66]">
                <SelectValue placeholder="Sélectionner...">
                  {specialties.find(s => s.id === selectedSpecialty)?.name}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {specialties.length === 0
                  ? <div className="py-4 text-center text-xs text-[#082B66]/40 font-bold">Aucune spécialité</div>
                  : specialties.map(s => (
                    <SelectItem key={s.id} value={s.id} className="font-bold text-[#082B66]">{s.name}</SelectItem>
                  ))
                }
              </SelectContent>
            </Select>
          )}
        </div>

        {/* Step 2: Year */}
        <div className="space-y-2">
          <label className={cn(
            "text-[10px] font-black uppercase tracking-widest ml-1",
            !selectedSpecialty ? "text-[#082B66]/20" : "text-[#082B66]/40"
          )}>
            Étape 2 : Année d'étude
          </label>
          <Select
            value={selectedYear}
            onValueChange={v => setSelectedYear(v || "")}
            disabled={!selectedSpecialty}
          >
            <SelectTrigger className="h-12 rounded-xl border-[#E5EAF3] bg-[#F8FBFF] font-bold text-[#082B66] disabled:opacity-50">
              <SelectValue placeholder={!selectedSpecialty ? "---" : "Sélectionner..."}>
                {studyYears.find(y => y.id === selectedYear)?.name}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {studyYears.length === 0
                ? <div className="py-4 text-center text-xs text-[#082B66]/40 font-bold">Aucune année</div>
                : studyYears.map(y => (
                  <SelectItem key={y.id} value={y.id} className="font-bold text-[#082B66]">{y.name}</SelectItem>
                ))
              }
            </SelectContent>
          </Select>
        </div>

        {/* Step 3: Module */}
        <div className="space-y-3">
          <label className={cn(
            "text-[10px] font-black uppercase tracking-widest ml-1",
            !selectedYear ? "text-[#082B66]/20" : "text-[#082B66]/40"
          )}>
            Étape 3 : Module
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#082B66]/30" />
            <Input
              placeholder="Rechercher un module..."
              className="h-11 pl-10 rounded-xl border-[#E5EAF3] bg-[#F8FBFF] font-bold text-[#082B66] placeholder:text-[#082B66]/30 disabled:opacity-50"
              value={moduleSearch}
              onChange={e => setModuleSearch(e.target.value)}
              disabled={!selectedYear}
            />
          </div>

          {selectedYear && (
            <div className="space-y-1 max-h-[280px] overflow-y-auto pr-1">
              {filteredModules.length === 0 ? (
                <div className="py-8 text-center text-xs font-bold text-[#082B66]/30">
                  Aucun module trouvé
                </div>
              ) : filteredModules.map(m => (
                <button
                  key={m.id}
                  onClick={() => setSelectedModule(m.id)}
                  className={cn(
                    "w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all group",
                    selectedModule === m.id
                      ? "bg-[#1368E8] shadow-lg shadow-[#1368E8]/20"
                      : "bg-[#F8FBFF] hover:bg-[#EEF4FF] border border-[#E5EAF3]"
                  )}
                >
                  <div className={cn(
                    "w-9 h-9 rounded-lg flex items-center justify-center shrink-0",
                    selectedModule === m.id ? "bg-white/20" : "bg-[#1368E8]/10"
                  )}>
                    <BookOpen className={cn(
                      "w-4 h-4",
                      selectedModule === m.id ? "text-white" : "text-[#1368E8]"
                    )} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className={cn(
                      "font-black text-sm truncate",
                      selectedModule === m.id ? "text-white" : "text-[#082B66]"
                    )}>
                      {m.title}
                    </div>
                    <div className={cn(
                      "text-[10px] font-bold uppercase tracking-widest mt-0.5",
                      selectedModule === m.id ? "text-white/70" : "text-[#082B66]/40"
                    )}>
                      {m.quizCount} quiz
                    </div>
                  </div>
                  <ChevronRight className={cn(
                    "w-4 h-4 shrink-0",
                    selectedModule === m.id ? "text-white" : "text-[#082B66]/30"
                  )} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Step 4: Support (optional) */}
        {selectedModule && supports.length > 0 && (
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-widest text-[#082B66]/40 ml-1">
              Étape 4 : Support de cours (optionnel)
            </label>

            <div className="space-y-1 max-h-[200px] overflow-y-auto pr-1">
              {/* All quizzes option */}
              <button
                onClick={() => setSelectedSupport("")}
                className={cn(
                  "w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all",
                  !selectedSupport
                    ? "bg-[#082B66] text-white shadow-lg shadow-[#082B66]/20"
                    : "bg-[#F8FBFF] border border-[#E5EAF3] hover:bg-[#EEF4FF]"
                )}
              >
                <div className={cn(
                  "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
                  !selectedSupport ? "bg-white/20" : "bg-[#082B66]/10"
                )}>
                  <ListChecks className={cn("w-4 h-4", !selectedSupport ? "text-white" : "text-[#082B66]")} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className={cn("font-black text-sm", !selectedSupport ? "text-white" : "text-[#082B66]")}>
                    Tous les quiz
                  </div>
                  <div className={cn("text-[10px] font-bold uppercase tracking-widest mt-0.5", !selectedSupport ? "text-white/70" : "text-[#082B66]/40")}>
                    {selectedModuleObj?.quizCount || 0} quiz
                  </div>
                </div>
              </button>

              {supports.map(s => (
                <button
                  key={s.id}
                  onClick={() => setSelectedSupport(s.id)}
                  className={cn(
                    "w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all",
                    selectedSupport === s.id
                      ? "bg-[#1368E8] text-white shadow-lg shadow-[#1368E8]/20"
                      : "bg-[#F8FBFF] border border-[#E5EAF3] hover:bg-[#EEF4FF]"
                  )}
                >
                  <div className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
                    selectedSupport === s.id ? "bg-white/20" : "bg-[#1368E8]/10"
                  )}>
                    <FileText className={cn("w-4 h-4", selectedSupport === s.id ? "text-white" : "text-[#1368E8]")} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className={cn("font-black text-sm truncate", selectedSupport === s.id ? "text-white" : "text-[#082B66]")}>
                      {s.title}
                    </div>
                    <div className={cn("text-[10px] font-bold uppercase tracking-widest mt-0.5", selectedSupport === s.id ? "text-white/70" : "text-[#082B66]/40")}>
                      {s.quizCount} quiz
                    </div>
                  </div>
                  <ChevronRight className={cn("w-4 h-4 shrink-0", selectedSupport === s.id ? "text-white" : "text-[#082B66]/30")} />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )

  return (
    <div className="flex-1 flex flex-col lg:flex-row p-4 lg:p-8 gap-6 lg:gap-8 overflow-hidden bg-[#F8FBFF]">

      {/* Mobile Filter Trigger */}
      <div className="lg:hidden shrink-0">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="w-full h-14 rounded-2xl bg-white border-[#E5EAF3] text-[#082B66] font-black uppercase text-xs tracking-widest shadow-sm hover:bg-[#F3F7FF] flex items-center justify-between px-6">
              <div className="flex items-center gap-3">
                <Filter className="w-4 h-4 text-[#1368E8]" />
                {selectedModule ? moduleName : "Filtrer les quiz"}
              </div>
              <ChevronDown className="w-4 h-4 text-[#082B66]/40" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-full sm:w-[360px] border-none bg-white">
            {filterPanel}
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Left Panel */}
      <div className="hidden lg:flex lg:w-[300px] xl:w-[320px] shrink-0 flex-col bg-white rounded-[24px] border border-[#E5EAF3] shadow-sm overflow-hidden">
        {filterPanel}
      </div>

      {/* Right Content */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <div className="flex-1 overflow-y-auto">

          {/* Empty States */}
          {!selectedSpecialty && (
            <EmptyState
              icon={<Layers className="w-12 h-12 text-[#1368E8]/30" />}
              title="Sélectionnez une spécialité"
              description="Choisissez votre spécialité pour commencer à accéder aux quiz."
            />
          )}

          {selectedSpecialty && !selectedYear && (
            <EmptyState
              icon={<BookOpen className="w-12 h-12 text-[#1368E8]/30" />}
              title="Sélectionnez votre année d'étude"
              description="Choisissez l'année pour voir les modules disponibles."
            />
          )}

          {selectedYear && !selectedModule && (
            <EmptyState
              icon={<ListChecks className="w-12 h-12 text-[#1368E8]/30" />}
              title="Sélectionnez un module"
              description="Choisissez un module dans le panneau de gauche pour voir ses quiz."
            />
          )}

          {/* Quiz Content */}
          {selectedModule && (
            <div className="space-y-6">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h1 className="text-2xl lg:text-3xl font-black text-[#082B66]">
                    Quiz &amp; Entraînement
                  </h1>
                  <p className="text-sm text-[#082B66]/50 font-medium mt-1">
                    {moduleName} • {loadingQuizzes ? "..." : quizzes.length} quiz disponible{quizzes.length !== 1 ? "s" : ""}
                  </p>
                </div>
                <Button className="h-12 px-6 rounded-xl bg-[#1368E8] hover:bg-[#082B66] text-white font-black uppercase text-xs tracking-widest shadow-xl shadow-[#1368E8]/20 transition-all gap-2 shrink-0">
                  <Zap className="w-4 h-4" />
                  Mode Examen Rapide
                </Button>
              </div>

              {/* Search */}
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#082B66]/30" />
                <Input
                  placeholder="Rechercher un quiz..."
                  value={quizSearch}
                  onChange={e => setQuizSearch(e.target.value)}
                  className="h-12 pl-12 rounded-xl border-[#E5EAF3] bg-white focus-visible:ring-[#1368E8]/20 font-bold text-[#082B66] placeholder:text-[#082B66]/30 shadow-sm"
                />
              </div>

              {/* Quiz Grid */}
              {loadingQuizzes ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="bg-white rounded-[20px] border border-[#E5EAF3] p-6 space-y-4">
                      <div className="flex justify-between">
                        <Skeleton className="h-5 w-24 rounded-full" />
                        <Skeleton className="h-5 w-16 rounded-full" />
                      </div>
                      <Skeleton className="h-6 w-3/4 rounded-lg" />
                      <div className="flex gap-4">
                        <Skeleton className="h-4 w-20 rounded" />
                        <Skeleton className="h-4 w-20 rounded" />
                      </div>
                      <Skeleton className="h-px w-full" />
                      <div className="flex justify-between">
                        <Skeleton className="h-4 w-28 rounded" />
                        <Skeleton className="h-4 w-20 rounded" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : quizzes.length === 0 ? (
                <EmptyState
                  icon={<ListChecks className="w-12 h-12 text-[#1368E8]/30" />}
                  title="Aucun quiz trouvé"
                  description="Il n'y a pas encore de quiz pour cette sélection."
                />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-8">
                  {quizzes.map(quiz => (
                    <QuizCard key={quiz.id} quiz={quiz} />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

/* ── Quiz Card ─────────────────────────────────────── */
function QuizCard({ quiz }: { quiz: any }) {
  const questionCount = quiz._count?.questions || 0
  const hasDuration = !!quiz.durationMinutes

  const difficultyConfig: Record<string, { label: string; className: string }> = {
    EASY:   { label: "Facile",    className: "bg-emerald-50 text-emerald-600 border-emerald-200" },
    MEDIUM: { label: "Moyen",     className: "bg-orange-50  text-orange-600  border-orange-200"  },
    HARD:   { label: "Difficile", className: "bg-red-50     text-red-600     border-red-200"     },
  }

  // Get dominant difficulty from questions (if we ever expose it); fallback to mode badge
  const modeBadge = quiz.mode === "EXAM"
    ? { label: "Examen",       className: "bg-purple-50 text-purple-600 border-purple-200" }
    : { label: "Entraînement", className: "bg-blue-50   text-blue-600   border-blue-200"   }

  return (
    <div className="group bg-white rounded-[20px] border border-[#E5EAF3] shadow-sm hover:shadow-lg hover:shadow-[#1368E8]/10 hover:border-[#1368E8]/20 transition-all duration-200 flex flex-col">
      <div className="p-6 flex-1 flex flex-col gap-4">
        {/* Badges row */}
        <div className="flex items-center justify-between gap-2">
          <Badge
            variant="outline"
            className="text-[10px] font-black uppercase tracking-widest border-[#1368E8]/20 text-[#1368E8] bg-[#1368E8]/5 px-3 py-1 rounded-full"
          >
            {quiz.module?.title || "Module"}
          </Badge>
          <Badge
            variant="outline"
            className={cn("text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full", modeBadge.className)}
          >
            {modeBadge.label}
          </Badge>
        </div>

        {/* Title */}
        <h3 className="text-lg font-black text-[#082B66] leading-snug group-hover:text-[#1368E8] transition-colors">
          {quiz.title}
        </h3>

        {/* Info row */}
        <div className="flex items-center gap-5 text-[#082B66]/50">
          <div className="flex items-center gap-1.5">
            <ListChecks className="w-4 h-4 text-[#1368E8]" />
            <span className="text-xs font-black uppercase tracking-wider">
              {questionCount} QCM
            </span>
          </div>
          {hasDuration && (
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-[#1368E8]" />
              <span className="text-xs font-black uppercase tracking-wider">
                {quiz.durationMinutes} MIN
              </span>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="h-px bg-[#E5EAF3]" />

        {/* Bottom row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[#082B66]/30">
            <Trophy className="w-3.5 h-3.5" />
            <span className="text-[10px] font-black uppercase tracking-widest">
              Dernier score: —
            </span>
          </div>
          <Link href={`/dashboard/quizzes/${quiz.id}/start`}>
            <Button
              size="sm"
              className="h-9 px-4 rounded-xl bg-[#1368E8] hover:bg-[#082B66] text-white font-black uppercase text-[10px] tracking-widest shadow-lg shadow-[#1368E8]/20 transition-all gap-1.5"
            >
              <Play className="w-3 h-3" />
              Démarrer
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

/* ── Empty State ───────────────────────────────────── */
function EmptyState({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center px-8">
      <div className="w-24 h-24 bg-[#1368E8]/5 rounded-[28px] flex items-center justify-center mb-6">
        {icon}
      </div>
      <h3 className="text-xl font-black text-[#082B66] mb-2">{title}</h3>
      <p className="text-sm text-[#082B66]/50 font-medium max-w-xs">{description}</p>
    </div>
  )
}
