"use client"

import * as React from "react"
import { 
  Search, 
  Plus, 
  MoreVertical, 
  Edit, 
  Eye, 
  Trash2, 
  Loader2, 
  Filter, 
  Copy,
  ListTodo,
  CheckCircle2,
  XCircle,
  ChevronLeft,
  ChevronRight
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import axios from "axios"
import { toast } from "sonner"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"

const quizSchema = z.object({
  title: z.string().min(1, "Le titre est requis"),
  description: z.string().optional(),
  specialtyId: z.string().min(1, "Spécialité requise"),
  studyYearId: z.string().min(1, "Année d'étude requise"),
  moduleId: z.string().min(1, "Module requis"),
  courseSupportId: z.string().optional().nullable(),
  mode: z.enum(["TRAINING", "EXAM"]),
  durationMinutes: z.coerce.number().positive().optional().nullable(),
  order: z.coerce.number().int().default(0),
  isPublished: z.boolean().default(false),
})

type QuizFormValues = z.infer<typeof quizSchema>

export default function QuizClient() {
  const [quizzes, setQuizzes] = React.useState<any[]>([])
  const [loading, setLoading] = React.useState(true)
  const [total, setTotal] = React.useState(0)
  
  // Filters
  const [page, setPage] = React.useState(1)
  const [limit, setLimit] = React.useState(10)
  const [search, setSearch] = React.useState("")
  const [specialtyFilter, setSpecialtyFilter] = React.useState("")
  const [yearFilter, setYearFilter] = React.useState("")
  const [moduleFilter, setModuleFilter] = React.useState("")
  const [statusFilter, setStatusFilter] = React.useState("")
  const [modeFilter, setModeFilter] = React.useState("")

  // Filter Data
  const [specialties, setSpecialties] = React.useState<any[]>([])
  const [studyYears, setStudyYears] = React.useState<any[]>([])
  const [modules, setModules] = React.useState<any[]>([])
  const [courseSupports, setCourseSupports] = React.useState<any[]>([])

  // Dialogs
  const [isFormOpen, setIsFormOpen] = React.useState(false)
  const [isViewOpen, setIsViewOpen] = React.useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false)
  
  const [selectedQuiz, setSelectedQuiz] = React.useState<any | null>(null)
  
  const form = useForm<QuizFormValues>({
    resolver: zodResolver(quizSchema) as any,
    defaultValues: {
      title: "",
      description: "",
      specialtyId: "",
      studyYearId: "",
      moduleId: "",
      courseSupportId: "",
      mode: "TRAINING",
      durationMinutes: null,
      order: 0,
      isPublished: false,
    }
  })

  // Data Fetching
  const fetchFilterData = async () => {
    try {
      const [specRes, yearRes, modRes, supportRes] = await Promise.all([
        axios.get("/api/data/specialties"),
        axios.get("/api/data/study-years"),
        axios.get("/api/data/modules"),
        axios.get("/api/admin/course-supports?limit=1000") // Temp solution to get all supports
      ])
      setSpecialties(Array.isArray(specRes.data) ? specRes.data : specRes.data.specialties || [])
      setStudyYears(Array.isArray(yearRes.data) ? yearRes.data : yearRes.data.studyYears || [])
      setModules(Array.isArray(modRes.data) ? modRes.data : modRes.data.modules || [])
      setCourseSupports(Array.isArray(supportRes.data.data) ? supportRes.data.data : [])
    } catch (error) {
      console.error("Error fetching filter data:", error)
    }
  }

  const fetchQuizzes = React.useCallback(async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        search,
        specialtyId: specialtyFilter,
        studyYearId: yearFilter,
        moduleId: moduleFilter,
        status: statusFilter,
        mode: modeFilter
      })
      const res = await axios.get(`/api/admin/quizzes?${params.toString()}`)
      setQuizzes(res.data.quizzes)
      setTotal(res.data.total)
    } catch (error) {
      toast.error("Erreur lors de la récupération des quiz")
    } finally {
      setLoading(false)
    }
  }, [page, limit, search, specialtyFilter, yearFilter, moduleFilter, statusFilter, modeFilter])

  React.useEffect(() => {
    fetchFilterData()
  }, [])

  React.useEffect(() => {
    fetchQuizzes()
  }, [fetchQuizzes])

  // Form Handlers
  const handleAdd = () => {
    setSelectedQuiz(null)
    form.reset({
      title: "",
      description: "",
      specialtyId: "",
      studyYearId: "",
      moduleId: "",
      courseSupportId: "",
      mode: "TRAINING",
      durationMinutes: null,
      order: 0,
      isPublished: false,
    })
    setIsFormOpen(true)
  }

  const handleEdit = (quiz: any) => {
    setSelectedQuiz(quiz)
    form.reset({
      title: quiz.title,
      description: quiz.description || "",
      specialtyId: quiz.specialtyId,
      studyYearId: quiz.studyYearId,
      moduleId: quiz.moduleId,
      courseSupportId: quiz.courseSupportId || "",
      mode: quiz.mode,
      durationMinutes: quiz.durationMinutes,
      order: quiz.order,
      isPublished: quiz.isPublished,
    })
    setIsFormOpen(true)
  }

  const onSubmit = async (data: QuizFormValues) => {
    try {
      if (selectedQuiz) {
        await axios.patch(`/api/admin/quizzes/${selectedQuiz.id}`, data)
        toast.success("Quiz modifié avec succès")
      } else {
        await axios.post("/api/admin/quizzes", data)
        toast.success("Quiz créé avec succès")
      }
      setIsFormOpen(false)
      fetchQuizzes()
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Erreur lors de la sauvegarde")
    }
  }

  // Actions
  const handleTogglePublish = async (id: string, currentStatus: boolean) => {
    try {
      await axios.patch(`/api/admin/quizzes/${id}/publish`, { isPublished: !currentStatus })
      toast.success(currentStatus ? "Quiz dépublié" : "Quiz publié")
      fetchQuizzes()
    } catch (error) {
      toast.error("Erreur lors de la modification du statut")
    }
  }

  const handleDuplicate = async (id: string) => {
    try {
      await axios.post(`/api/admin/quizzes/${id}/duplicate`)
      toast.success("Quiz dupliqué avec succès")
      fetchQuizzes()
    } catch (error) {
      toast.error("Erreur lors de la duplication")
    }
  }

  const handleDelete = async () => {
    if (!selectedQuiz) return
    try {
      await axios.delete(`/api/admin/quizzes/${selectedQuiz.id}`)
      toast.success("Quiz supprimé avec succès")
      setIsDeleteDialogOpen(false)
      fetchQuizzes()
    } catch (error) {
      toast.error("Erreur lors de la suppression")
    }
  }

  return (
    <div className="space-y-6">
      {/* Filters & Actions */}
      <div className="flex flex-col xl:flex-row gap-4 justify-between bg-white p-6 rounded-[24px] border border-[#E5EAF3] shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#082B66]/30" />
            <Input 
              placeholder="Rechercher un quiz..." 
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="pl-10 h-12 rounded-xl border-[#E5EAF3] bg-[#F8FBFF] focus-visible:ring-[#1368E8]/20 font-bold text-[#082B66] placeholder:text-[#082B66]/30"
            />
          </div>
          
          <Select value={specialtyFilter} onValueChange={(v) => { setSpecialtyFilter(v === "all" ? "" : (v || "")); setYearFilter(""); setModuleFilter(""); setPage(1); }}>
            <SelectTrigger className="h-12 rounded-xl border-[#E5EAF3] bg-[#F8FBFF] font-bold text-[#082B66]">
              <SelectValue placeholder="Spécialité">
                {specialtyFilter ? specialties.find(s => s.id === specialtyFilter)?.name : "Toutes les spécialités"}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les spécialités</SelectItem>
              {specialties.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
            </SelectContent>
          </Select>

          <Select value={yearFilter} onValueChange={(v) => { setYearFilter(v === "all" ? "" : (v || "")); setModuleFilter(""); setPage(1); }} disabled={!specialtyFilter}>
            <SelectTrigger className="h-12 rounded-xl border-[#E5EAF3] bg-[#F8FBFF] font-bold text-[#082B66]">
              <SelectValue placeholder="Année">
                {yearFilter ? studyYears.find(y => y.id === yearFilter)?.name : "Toutes les années"}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les années</SelectItem>
              {studyYears.filter(y => y.specialtyId === specialtyFilter).map(y => <SelectItem key={y.id} value={y.id}>{y.name}</SelectItem>)}
            </SelectContent>
          </Select>

          <Select value={moduleFilter} onValueChange={(v) => { setModuleFilter(v === "all" ? "" : (v || "")); setPage(1); }} disabled={!yearFilter}>
            <SelectTrigger className="h-12 rounded-xl border-[#E5EAF3] bg-[#F8FBFF] font-bold text-[#082B66] whitespace-nowrap overflow-hidden text-ellipsis">
              <SelectValue placeholder="Module">
                {moduleFilter ? modules.find(m => m.id === moduleFilter)?.title : "Tous les modules"}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les modules</SelectItem>
              {modules.filter(m => m.studyYearId === yearFilter).map(m => <SelectItem key={m.id} value={m.id}>{m.title}</SelectItem>)}
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v === "all" ? "" : (v || "")); setPage(1); }}>
            <SelectTrigger className="h-12 rounded-xl border-[#E5EAF3] bg-[#F8FBFF] font-bold text-[#082B66]">
              <SelectValue placeholder="Statut">
                {statusFilter === "PUBLISHED" ? "Publié" : statusFilter === "DRAFT" ? "Brouillon" : "Tous les statuts"}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les statuts</SelectItem>
              <SelectItem value="PUBLISHED">Publié</SelectItem>
              <SelectItem value="DRAFT">Brouillon</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button 
          onClick={handleAdd}
          className="h-12 px-6 rounded-xl bg-[#1368E8] hover:bg-[#082B66] text-white font-black uppercase tracking-widest text-xs shadow-xl shadow-[#1368E8]/20 transition-all shrink-0"
        >
          <Plus className="w-4 h-4 mr-2" />
          Ajouter un quiz
        </Button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-[24px] border border-[#E5EAF3] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-[#F8FBFF]/50 border-b border-[#E5EAF3] hover:bg-[#F8FBFF]/50">
                <TableHead className="font-black uppercase text-[10px] tracking-widest text-[#082B66]/40 h-14 pl-6">Quiz</TableHead>
                <TableHead className="font-black uppercase text-[10px] tracking-widest text-[#082B66]/40 h-14">Module</TableHead>
                <TableHead className="font-black uppercase text-[10px] tracking-widest text-[#082B66]/40 h-14">Mode</TableHead>
                <TableHead className="font-black uppercase text-[10px] tracking-widest text-[#082B66]/40 h-14">Questions</TableHead>
                <TableHead className="font-black uppercase text-[10px] tracking-widest text-[#082B66]/40 h-14">Statut</TableHead>
                <TableHead className="font-black uppercase text-[10px] tracking-widest text-[#082B66]/40 h-14 text-right pr-6">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-32 text-center">
                    <Loader2 className="w-6 h-6 animate-spin text-[#1368E8] mx-auto" />
                  </TableCell>
                </TableRow>
              ) : quizzes.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-32 text-center font-bold text-[#082B66]/40">
                    Aucun quiz trouvé
                  </TableCell>
                </TableRow>
              ) : (
                quizzes.map((quiz) => (
                  <TableRow key={quiz.id} className="border-b border-[#E5EAF3] hover:bg-[#F8FBFF]">
                    <TableCell className="pl-6">
                      <div className="font-black text-sm text-[#082B66]">{quiz.title}</div>
                      <div className="text-[10px] font-bold text-[#082B66]/40 uppercase tracking-widest mt-1">
                        {quiz.specialty?.name} • {quiz.studyYear?.name}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-bold text-xs text-[#082B66]">
                        {quiz.module?.title}
                      </div>
                      {quiz.courseSupport && (
                        <div className="text-[10px] text-[#082B66]/40 mt-1 flex items-center gap-1">
                          <Filter className="w-3 h-3" />
                          {quiz.courseSupport.title}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={
                        quiz.mode === "EXAM" 
                          ? "border-purple-200 text-purple-600 bg-purple-50" 
                          : "border-blue-200 text-blue-600 bg-blue-50"
                      }>
                        {quiz.mode === "EXAM" ? "Examen" : "Entraînement"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="bg-[#F3F7FF] text-[#082B66]">
                        {quiz._count?.questions || 0}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant="secondary"
                        className={quiz.isPublished ? "bg-emerald-50 text-emerald-600 hover:bg-emerald-100" : "bg-orange-50 text-orange-600 hover:bg-orange-100"}
                      >
                        {quiz.isPublished ? "Publié" : "Brouillon"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right pr-6">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreVertical className="h-4 w-4 text-[#082B66]" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48 rounded-2xl border-[#E5EAF3] p-2">
                          <DropdownMenuItem onClick={() => { setSelectedQuiz(quiz); setIsViewOpen(true); }} className="rounded-xl focus:bg-[#F8FBFF] cursor-pointer">
                            <Eye className="w-4 h-4 mr-2" /> Voir
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEdit(quiz)} className="rounded-xl focus:bg-[#F8FBFF] cursor-pointer">
                            <Edit className="w-4 h-4 mr-2" /> Modifier
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild className="rounded-xl focus:bg-[#F8FBFF] cursor-pointer text-[#1368E8]">
                            <Link href={`/dashboard/admin/quizzes/${quiz.id}/questions`}>
                              <ListTodo className="w-4 h-4 mr-2" /> Gérer les questions
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator className="bg-[#E5EAF3]" />
                          <DropdownMenuItem onClick={() => handleDuplicate(quiz.id)} className="rounded-xl focus:bg-[#F8FBFF] cursor-pointer">
                            <Copy className="w-4 h-4 mr-2" /> Dupliquer
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleTogglePublish(quiz.id, quiz.isPublished)} className="rounded-xl focus:bg-[#F8FBFF] cursor-pointer">
                            {quiz.isPublished ? <XCircle className="w-4 h-4 mr-2 text-orange-500" /> : <CheckCircle2 className="w-4 h-4 mr-2 text-emerald-500" />} 
                            {quiz.isPublished ? "Dépublier" : "Publier"}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator className="bg-[#E5EAF3]" />
                          <DropdownMenuItem onClick={() => { setSelectedQuiz(quiz); setIsDeleteDialogOpen(true); }} className="text-red-600 rounded-xl focus:bg-red-50 cursor-pointer">
                            <Trash2 className="w-4 h-4 mr-2" /> Supprimer
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-[#E5EAF3] bg-[#F8FBFF]/50 flex items-center justify-between">
          <div className="text-xs font-bold text-[#082B66]/40">
            Affichage de {(page - 1) * limit + 1} à {Math.min(page * limit, total)} sur {total} quiz
          </div>
          <div className="flex items-center gap-4">
            <Select value={limit.toString()} onValueChange={(v) => { setLimit(Number(v)); setPage(1); }}>
              <SelectTrigger className="h-10 rounded-lg border-[#E5EAF3] bg-white w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex items-center gap-1 ml-4">
              <Button 
                variant="outline" 
                size="icon" 
                className="h-10 w-10 rounded-lg border-[#E5EAF3] bg-white disabled:opacity-30"
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button 
                variant="outline" 
                size="icon" 
                className="h-10 w-10 rounded-lg border-[#E5EAF3] bg-white disabled:opacity-30"
                onClick={() => setPage(page + 1)}
                disabled={page >= Math.ceil(total / limit) || total === 0}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen} modal={false}>
        <DialogContent className="sm:max-w-[600px] p-0 border-none rounded-[32px] shadow-2xl">
          <DialogHeader className="p-8 pb-4">
            <DialogTitle className="text-2xl font-black text-[#082B66]">
              {selectedQuiz ? "Modifier le quiz" : "Ajouter un quiz"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={form.handleSubmit(onSubmit as any)}>
            <div className="px-8 pb-8 space-y-6 max-h-[60vh] overflow-y-auto custom-scrollbar">
              
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-[#082B66]/60 ml-1">Spécialité</Label>
                <Select onValueChange={(val) => { form.setValue("specialtyId", val || ""); form.setValue("studyYearId", ""); form.setValue("moduleId", ""); }} value={form.watch("specialtyId")}>
                  <SelectTrigger className="h-12 rounded-xl border-[#E5EAF3] bg-[#F8FBFF]">
                    <SelectValue placeholder="Choisir...">
                      {specialties.find(s => s.id === form.watch("specialtyId"))?.name}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {specialties.length === 0
                      ? <div className="py-6 text-center text-xs font-bold text-[#082B66]/40">Aucune spécialité disponible.<br/>Créez-en une d'abord.</div>
                      : specialties.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)
                    }
                  </SelectContent>
                </Select>
                {form.formState.errors.specialtyId && <p className="text-[10px] text-red-500 font-bold">{form.formState.errors.specialtyId.message}</p>}
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-[#082B66]/60 ml-1">Année d'étude</Label>
                <Select onValueChange={(val) => { form.setValue("studyYearId", val || ""); form.setValue("moduleId", ""); }} value={form.watch("studyYearId")}>
                  <SelectTrigger className="h-12 rounded-xl border-[#E5EAF3] bg-[#F8FBFF]" disabled={!form.watch("specialtyId")}>
                    <SelectValue placeholder="Choisir...">
                      {studyYears.find(y => y.id === form.watch("studyYearId"))?.name}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {studyYears.filter(y => y.specialtyId === form.watch("specialtyId")).length === 0
                      ? <div className="py-6 text-center text-xs font-bold text-[#082B66]/40">Aucune année pour cette spécialité.</div>
                      : studyYears.filter(y => y.specialtyId === form.watch("specialtyId")).map(y => <SelectItem key={y.id} value={y.id}>{y.name}</SelectItem>)
                    }
                  </SelectContent>
                </Select>
                {form.formState.errors.studyYearId && <p className="text-[10px] text-red-500 font-bold">{form.formState.errors.studyYearId.message}</p>}
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-[#082B66]/60 ml-1">Module</Label>
                <Select onValueChange={(val) => form.setValue("moduleId", val || "")} value={form.watch("moduleId")}>
                  <SelectTrigger className="h-12 rounded-xl border-[#E5EAF3] bg-[#F8FBFF]" disabled={!form.watch("studyYearId")}>
                    <SelectValue placeholder="Choisir...">
                      {modules.find(m => m.id === form.watch("moduleId"))?.title}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {modules.filter(m => m.studyYearId === form.watch("studyYearId")).length === 0
                      ? <div className="py-6 text-center text-xs font-bold text-[#082B66]/40">Aucun module pour cette année.</div>
                      : modules.filter(m => m.studyYearId === form.watch("studyYearId")).map(m => <SelectItem key={m.id} value={m.id}>{m.title}</SelectItem>)
                    }
                  </SelectContent>
                </Select>
                {form.formState.errors.moduleId && <p className="text-[10px] text-red-500 font-bold">{form.formState.errors.moduleId.message}</p>}
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-[#082B66]/60 ml-1">Support de cours (Optionnel)</Label>
                <Select onValueChange={(val) => form.setValue("courseSupportId", val === "none" ? "" : val)} value={form.watch("courseSupportId") || "none"}>
                  <SelectTrigger className="h-12 rounded-xl border-[#E5EAF3] bg-[#F8FBFF]" disabled={!form.watch("moduleId")}>
                    <SelectValue placeholder="Choisir...">
                      {form.watch("courseSupportId") ? courseSupports.find(c => c.id === form.watch("courseSupportId"))?.title : "Aucun"}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Aucun support lié</SelectItem>
                    {courseSupports.filter(c => c.moduleId === form.watch("moduleId")).map(c => <SelectItem key={c.id} value={c.id}>{c.title}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-[#082B66]/60 ml-1">Nom du quiz</Label>
                <Input placeholder="Quiz 1 - Introduction" {...form.register("title")} className="h-12 rounded-xl border-[#E5EAF3] bg-[#F8FBFF]" />
                {form.formState.errors.title && <p className="text-[10px] text-red-500 font-bold">{form.formState.errors.title.message}</p>}
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-[#082B66]/60 ml-1">Description</Label>
                <Textarea placeholder="Description du quiz..." {...form.register("description")} className="rounded-xl border-[#E5EAF3] bg-[#F8FBFF]" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-[#082B66]/60 ml-1">Mode</Label>
                  <Select onValueChange={(val) => form.setValue("mode", val as "TRAINING" | "EXAM")} value={form.watch("mode")}>
                    <SelectTrigger className="h-12 rounded-xl border-[#E5EAF3] bg-[#F8FBFF]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="TRAINING">Entraînement</SelectItem>
                      <SelectItem value="EXAM">Examen</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-[#082B66]/60 ml-1">Durée (minutes) - Optionnel</Label>
                  <Input type="number" placeholder="ex: 30" {...form.register("durationMinutes", { valueAsNumber: true })} className="h-12 rounded-xl border-[#E5EAF3] bg-[#F8FBFF]" />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-[#082B66]/60 ml-1">Ordre d'affichage</Label>
                <Input type="number" {...form.register("order", { valueAsNumber: true })} className="h-12 rounded-xl border-[#E5EAF3] bg-[#F8FBFF]" />
              </div>

              <div className="flex items-center justify-between p-4 bg-[#F8FBFF] rounded-xl border border-[#E5EAF3]">
                <div className="space-y-0.5">
                  <Label className="text-sm font-black text-[#082B66]">Publier ce quiz</Label>
                  <p className="text-[10px] font-bold text-[#082B66]/40 uppercase tracking-widest">Le rendre visible aux étudiants</p>
                </div>
                <Switch 
                  checked={form.watch("isPublished")} 
                  onCheckedChange={(checked) => form.setValue("isPublished", checked)} 
                />
              </div>

            </div>
            <DialogFooter className="p-8 pt-4 border-t border-[#E5EAF3] bg-[#F8FBFF]/50 rounded-b-[32px] gap-3">
              <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)} className="h-14 flex-1 rounded-2xl border-[#E5EAF3] text-[#082B66] font-black uppercase text-xs tracking-widest">
                Annuler
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting} className="h-14 flex-1 rounded-2xl bg-[#1368E8] hover:bg-[#082B66] text-white font-black uppercase text-xs tracking-widest">
                {form.formState.isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : selectedQuiz ? "Enregistrer les modifications" : "Créer le quiz"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="rounded-[32px] border-[#E5EAF3] p-8">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl font-black text-[#082B66]">Supprimer le quiz ?</AlertDialogTitle>
            <AlertDialogDescription className="text-[#082B66]/60 font-medium">
              Êtes-vous sûr de vouloir supprimer ce quiz ? Toutes les questions associées seront également supprimées. Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-8 gap-3">
            <AlertDialogCancel className="h-14 rounded-2xl border-[#E5EAF3] text-[#082B66] font-black uppercase text-xs tracking-widest">
              Annuler
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="h-14 rounded-2xl bg-red-500 hover:bg-red-600 text-white font-black uppercase text-xs tracking-widest shadow-xl shadow-red-500/20">
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* View Details Dialog */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="sm:max-w-[500px] p-0 border-none rounded-[32px] shadow-2xl">
          <DialogHeader className="p-8 pb-4">
            <DialogTitle className="text-2xl font-black text-[#082B66]">Détails du quiz</DialogTitle>
          </DialogHeader>
          {selectedQuiz && (
            <div className="p-8 pt-0 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <Label className="text-[10px] font-black uppercase tracking-widest text-[#082B66]/40">Titre</Label>
                  <p className="font-bold text-[#082B66] mt-1">{selectedQuiz.title}</p>
                </div>
                <div>
                  <Label className="text-[10px] font-black uppercase tracking-widest text-[#082B66]/40">Statut</Label>
                  <p className="font-bold text-[#082B66] mt-1">
                    <Badge variant="secondary" className={selectedQuiz.isPublished ? "bg-emerald-50 text-emerald-600" : "bg-orange-50 text-orange-600"}>
                      {selectedQuiz.isPublished ? "Publié" : "Brouillon"}
                    </Badge>
                  </p>
                </div>
                <div>
                  <Label className="text-[10px] font-black uppercase tracking-widest text-[#082B66]/40">Spécialité</Label>
                  <p className="font-bold text-[#082B66] mt-1">{selectedQuiz.specialty?.name}</p>
                </div>
                <div>
                  <Label className="text-[10px] font-black uppercase tracking-widest text-[#082B66]/40">Année d'étude</Label>
                  <p className="font-bold text-[#082B66] mt-1">{selectedQuiz.studyYear?.name}</p>
                </div>
                <div className="col-span-full">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-[#082B66]/40">Module</Label>
                  <p className="font-bold text-[#082B66] mt-1">{selectedQuiz.module?.title}</p>
                </div>
                {selectedQuiz.courseSupport && (
                  <div className="col-span-full">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-[#082B66]/40">Support lié</Label>
                    <p className="font-bold text-[#082B66] mt-1">{selectedQuiz.courseSupport.title}</p>
                  </div>
                )}
                <div>
                  <Label className="text-[10px] font-black uppercase tracking-widest text-[#082B66]/40">Mode</Label>
                  <p className="font-bold text-[#082B66] mt-1">{selectedQuiz.mode === "EXAM" ? "Examen" : "Entraînement"}</p>
                </div>
                <div>
                  <Label className="text-[10px] font-black uppercase tracking-widest text-[#082B66]/40">Durée</Label>
                  <p className="font-bold text-[#082B66] mt-1">{selectedQuiz.durationMinutes ? `${selectedQuiz.durationMinutes} min` : "Non définie"}</p>
                </div>
                <div>
                  <Label className="text-[10px] font-black uppercase tracking-widest text-[#082B66]/40">Questions</Label>
                  <p className="font-bold text-[#082B66] mt-1">{selectedQuiz._count?.questions || 0} question(s)</p>
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-[#E5EAF3]">
                <Button 
                  onClick={() => { setIsViewOpen(false); handleEdit(selectedQuiz); }} 
                  className="flex-1 h-12 rounded-xl bg-[#F8FBFF] text-[#1368E8] hover:bg-[#1368E8] hover:text-white font-black uppercase tracking-widest text-xs transition-all"
                >
                  <Edit className="w-4 h-4 mr-2" /> Modifier
                </Button>
                <Button 
                  asChild
                  className="flex-1 h-12 rounded-xl bg-[#1368E8] hover:bg-[#082B66] text-white font-black uppercase tracking-widest text-xs transition-all"
                >
                  <Link href={`/dashboard/admin/quizzes/${selectedQuiz.id}/questions`}>
                    <ListTodo className="w-4 h-4 mr-2" /> Questions
                  </Link>
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
