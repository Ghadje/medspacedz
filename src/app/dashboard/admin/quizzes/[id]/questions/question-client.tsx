"use client"

import * as React from "react"
import { 
  Search, 
  Plus, 
  MoreVertical, 
  Edit, 
  Trash2, 
  Loader2, 
  Copy,
  PlusCircle,
  X,
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
import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

const answerSchema = z.object({
  id: z.string().optional(),
  text: z.string().min(1, "Texte requis"),
  isCorrect: z.boolean().default(false),
  order: z.number().int().default(0)
})

const questionSchema = z.object({
  statement: z.string().min(1, "Énoncé requis"),
  explanation: z.string().optional().nullable(),
  difficulty: z.enum(["EASY", "MEDIUM", "HARD"]).optional().nullable(),
  yearReference: z.string().optional().nullable(),
  type: z.enum(["QCM", "QCS", "TRUE_FALSE"]),
  order: z.coerce.number().int().default(0),
  answers: z.array(answerSchema).min(2, "Au moins 2 réponses requises")
}).superRefine((data, ctx) => {
  const correctCount = data.answers.filter(a => a.isCorrect).length
  if (correctCount === 0) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Au moins une réponse doit être correcte",
      path: ["answers"]
    })
  }
  if ((data.type === "QCS" || data.type === "TRUE_FALSE") && correctCount > 1) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Ce type de question n'accepte qu'une seule réponse correcte",
      path: ["answers"]
    })
  }
})

type QuestionFormValues = z.infer<typeof questionSchema>

interface QuestionClientProps {
  quizId: string
}

export default function QuestionClient({ quizId }: QuestionClientProps) {
  const [questions, setQuestions] = React.useState<any[]>([])
  const [loading, setLoading] = React.useState(true)
  const [total, setTotal] = React.useState(0)
  
  // Filters
  const [page, setPage] = React.useState(1)
  const [limit, setLimit] = React.useState(10)
  const [search, setSearch] = React.useState("")
  const [typeFilter, setTypeFilter] = React.useState("")
  const [difficultyFilter, setDifficultyFilter] = React.useState("")

  // Dialogs
  const [isFormOpen, setIsFormOpen] = React.useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false)
  const [selectedQuestion, setSelectedQuestion] = React.useState<any | null>(null)
  
  const form = useForm<QuestionFormValues>({
    resolver: zodResolver(questionSchema) as any,
    defaultValues: {
      statement: "",
      explanation: "",
      difficulty: null,
      yearReference: "",
      type: "QCS",
      order: 0,
      answers: [
        { text: "", isCorrect: false, order: 1 },
        { text: "", isCorrect: false, order: 2 }
      ]
    }
  })

  const { fields: answerFields, append: appendAnswer, remove: removeAnswer } = useFieldArray({
    control: form.control,
    name: "answers"
  })

  const questionType = form.watch("type")

  React.useEffect(() => {
    if (questionType === "TRUE_FALSE" && !selectedQuestion) {
      form.setValue("answers", [
        { text: "Vrai", isCorrect: true, order: 1 },
        { text: "Faux", isCorrect: false, order: 2 }
      ])
    }
  }, [questionType, form, selectedQuestion])

  const handleAnswerCorrectChange = (index: number, checked: boolean) => {
    if (checked && (questionType === "QCS" || questionType === "TRUE_FALSE")) {
      // Uncheck all other answers
      const currentAnswers = form.getValues("answers")
      const updatedAnswers = currentAnswers.map((a, i) => ({
        ...a,
        isCorrect: i === index
      }))
      form.setValue("answers", updatedAnswers)
    } else {
      form.setValue(`answers.${index}.isCorrect`, checked)
    }
  }

  // Data Fetching
  const fetchQuestions = React.useCallback(async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        search,
        type: typeFilter,
        difficulty: difficultyFilter
      })
      const res = await axios.get(`/api/admin/quizzes/${quizId}/questions?${params.toString()}`)
      setQuestions(res.data.questions)
      setTotal(res.data.total)
    } catch (error) {
      toast.error("Erreur lors de la récupération des questions")
    } finally {
      setLoading(false)
    }
  }, [quizId, page, limit, search, typeFilter, difficultyFilter])

  React.useEffect(() => {
    fetchQuestions()
  }, [fetchQuestions])

  // Form Handlers
  const handleAdd = () => {
    setSelectedQuestion(null)
    form.reset({
      statement: "",
      explanation: "",
      difficulty: null,
      yearReference: "",
      type: "QCS",
      order: 0,
      answers: [
        { text: "", isCorrect: false, order: 1 },
        { text: "", isCorrect: false, order: 2 }
      ]
    })
    setIsFormOpen(true)
  }

  const handleEdit = (question: any) => {
    setSelectedQuestion(question)
    form.reset({
      statement: question.statement,
      explanation: question.explanation || "",
      difficulty: question.difficulty,
      yearReference: question.yearReference || "",
      type: question.type,
      order: question.order,
      answers: question.answers.map((a: any) => ({
        id: a.id,
        text: a.text,
        isCorrect: a.isCorrect,
        order: a.order
      }))
    })
    setIsFormOpen(true)
  }

  const onSubmit = async (data: QuestionFormValues) => {
    try {
      // Clean up order strings to numbers
      if (typeof data.order === 'string' && data.order) data.order = parseInt(data.order)
      
      if (selectedQuestion) {
        await axios.patch(`/api/admin/questions/${selectedQuestion.id}`, data)
        toast.success("Question modifiée avec succès")
      } else {
        await axios.post(`/api/admin/quizzes/${quizId}/questions`, data)
        toast.success("Question créée avec succès")
      }
      setIsFormOpen(false)
      fetchQuestions()
    } catch (error: any) {
      toast.error(error.response?.data?.error || error.response?.data?.details?.[0]?.message || "Erreur lors de la sauvegarde")
    }
  }

  // Actions
  const handleDuplicate = async (id: string) => {
    try {
      await axios.post(`/api/admin/questions/${id}/duplicate`)
      toast.success("Question dupliquée avec succès")
      fetchQuestions()
    } catch (error) {
      toast.error("Erreur lors de la duplication")
    }
  }

  const handleDelete = async () => {
    if (!selectedQuestion) return
    try {
      await axios.delete(`/api/admin/questions/${selectedQuestion.id}`)
      toast.success("Question supprimée avec succès")
      setIsDeleteDialogOpen(false)
      fetchQuestions()
    } catch (error) {
      toast.error("Erreur lors de la suppression")
    }
  }

  const getDifficultyBadge = (difficulty: string) => {
    switch (difficulty) {
      case "EASY": return <Badge variant="secondary" className="bg-emerald-50 text-emerald-600">Facile</Badge>
      case "MEDIUM": return <Badge variant="secondary" className="bg-orange-50 text-orange-600">Moyen</Badge>
      case "HARD": return <Badge variant="secondary" className="bg-red-50 text-red-600">Difficile</Badge>
      default: return null
    }
  }

  return (
    <div className="space-y-6">
      {/* Filters & Actions */}
      <div className="flex flex-col xl:flex-row gap-4 justify-between bg-white p-6 rounded-[24px] border border-[#E5EAF3] shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#082B66]/30" />
            <Input 
              placeholder="Rechercher une question..." 
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="pl-10 h-12 rounded-xl border-[#E5EAF3] bg-[#F8FBFF] focus-visible:ring-[#1368E8]/20 font-bold text-[#082B66] placeholder:text-[#082B66]/30"
            />
          </div>
          
          <Select value={typeFilter} onValueChange={(v) => { setTypeFilter(v === "all" ? "" : (v || "")); setPage(1); }}>
            <SelectTrigger className="h-12 rounded-xl border-[#E5EAF3] bg-[#F8FBFF] font-bold text-[#082B66]">
              <SelectValue placeholder="Type de question">
                {typeFilter === "QCM" ? "QCM" : typeFilter === "QCS" ? "QCS" : typeFilter === "TRUE_FALSE" ? "Vrai/Faux" : "Tous les types"}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les types</SelectItem>
              <SelectItem value="QCM">QCM</SelectItem>
              <SelectItem value="QCS">QCS</SelectItem>
              <SelectItem value="TRUE_FALSE">Vrai/Faux</SelectItem>
            </SelectContent>
          </Select>

          <Select value={difficultyFilter} onValueChange={(v) => { setDifficultyFilter(v === "all" ? "" : (v || "")); setPage(1); }}>
            <SelectTrigger className="h-12 rounded-xl border-[#E5EAF3] bg-[#F8FBFF] font-bold text-[#082B66]">
              <SelectValue placeholder="Difficulté">
                {difficultyFilter === "EASY" ? "Facile" : difficultyFilter === "MEDIUM" ? "Moyen" : difficultyFilter === "HARD" ? "Difficile" : "Toutes difficultés"}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes difficultés</SelectItem>
              <SelectItem value="EASY">Facile</SelectItem>
              <SelectItem value="MEDIUM">Moyen</SelectItem>
              <SelectItem value="HARD">Difficile</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button 
          onClick={handleAdd}
          className="h-12 px-6 rounded-xl bg-[#1368E8] hover:bg-[#082B66] text-white font-black uppercase tracking-widest text-xs shadow-xl shadow-[#1368E8]/20 transition-all shrink-0"
        >
          <Plus className="w-4 h-4 mr-2" />
          Ajouter une question
        </Button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-[24px] border border-[#E5EAF3] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-[#F8FBFF]/50 border-b border-[#E5EAF3] hover:bg-[#F8FBFF]/50">
                <TableHead className="font-black uppercase text-[10px] tracking-widest text-[#082B66]/40 h-14 pl-6 w-[40%]">Question</TableHead>
                <TableHead className="font-black uppercase text-[10px] tracking-widest text-[#082B66]/40 h-14">Type</TableHead>
                <TableHead className="font-black uppercase text-[10px] tracking-widest text-[#082B66]/40 h-14">Difficulté</TableHead>
                <TableHead className="font-black uppercase text-[10px] tracking-widest text-[#082B66]/40 h-14">Réponses</TableHead>
                <TableHead className="font-black uppercase text-[10px] tracking-widest text-[#082B66]/40 h-14 text-right pr-6">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-32 text-center">
                    <Loader2 className="w-6 h-6 animate-spin text-[#1368E8] mx-auto" />
                  </TableCell>
                </TableRow>
              ) : questions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-32 text-center font-bold text-[#082B66]/40">
                    Aucune question trouvée
                  </TableCell>
                </TableRow>
              ) : (
                questions.map((question) => (
                  <TableRow key={question.id} className="border-b border-[#E5EAF3] hover:bg-[#F8FBFF]">
                    <TableCell className="pl-6">
                      <div className="font-black text-sm text-[#082B66] line-clamp-2">{question.statement}</div>
                      {question.yearReference && (
                        <div className="text-[10px] font-bold text-[#082B66]/40 uppercase tracking-widest mt-1">
                          Ref: {question.yearReference}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="border-[#1368E8]/20 text-[#1368E8] bg-[#1368E8]/5">
                        {question.type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {getDifficultyBadge(question.difficulty)}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="bg-[#F3F7FF] text-[#082B66]">
                        {question.answers?.length || 0}
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
                          <DropdownMenuItem onClick={() => handleEdit(question)} className="rounded-xl focus:bg-[#F8FBFF] cursor-pointer">
                            <Edit className="w-4 h-4 mr-2" /> Modifier
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDuplicate(question.id)} className="rounded-xl focus:bg-[#F8FBFF] cursor-pointer">
                            <Copy className="w-4 h-4 mr-2" /> Dupliquer
                          </DropdownMenuItem>
                          <DropdownMenuSeparator className="bg-[#E5EAF3]" />
                          <DropdownMenuItem onClick={() => { setSelectedQuestion(question); setIsDeleteDialogOpen(true); }} className="text-red-600 rounded-xl focus:bg-red-50 cursor-pointer">
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
            Affichage de {(page - 1) * limit + 1} à {Math.min(page * limit, total)} sur {total} questions
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
        <DialogContent className="sm:max-w-[700px] p-0 border-none rounded-[32px] shadow-2xl">
          <DialogHeader className="p-8 pb-4">
            <DialogTitle className="text-2xl font-black text-[#082B66]">
              {selectedQuestion ? "Modifier la question" : "Ajouter une question"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={form.handleSubmit(onSubmit as any)}>
            <div className="px-8 pb-8 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
              
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-[#082B66]/60 ml-1">Énoncé de la question</Label>
                <Textarea placeholder="Quelle est la capitale..." {...form.register("statement")} className="min-h-[100px] rounded-xl border-[#E5EAF3] bg-[#F8FBFF]" />
                {form.formState.errors.statement && <p className="text-[10px] text-red-500 font-bold">{form.formState.errors.statement.message}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-[#082B66]/60 ml-1">Type de question</Label>
                  <Select onValueChange={(val) => form.setValue("type", val as "QCM" | "QCS" | "TRUE_FALSE")} value={form.watch("type")}>
                    <SelectTrigger className="h-12 rounded-xl border-[#E5EAF3] bg-[#F8FBFF]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="QCS">QCS (Une réponse)</SelectItem>
                      <SelectItem value="QCM">QCM (Choix multiple)</SelectItem>
                      <SelectItem value="TRUE_FALSE">Vrai/Faux</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-[#082B66]/60 ml-1">Difficulté (Optionnel)</Label>
                  <Select onValueChange={(val) => form.setValue("difficulty", val === "none" ? null : val as any)} value={form.watch("difficulty") || "none"}>
                    <SelectTrigger className="h-12 rounded-xl border-[#E5EAF3] bg-[#F8FBFF]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Non définie</SelectItem>
                      <SelectItem value="EASY">Facile</SelectItem>
                      <SelectItem value="MEDIUM">Moyen</SelectItem>
                      <SelectItem value="HARD">Difficile</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-[#082B66]/60 ml-1">Référence / Année (Optionnel)</Label>
                  <Input placeholder="ex: N°11 (2022 UE01)" {...form.register("yearReference")} className="h-12 rounded-xl border-[#E5EAF3] bg-[#F8FBFF]" />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-[#082B66]/60 ml-1">Ordre (Optionnel)</Label>
                  <Input type="number" {...form.register("order", { valueAsNumber: true })} className="h-12 rounded-xl border-[#E5EAF3] bg-[#F8FBFF]" />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-[#082B66]/60 ml-1">Explication détaillée (Optionnel)</Label>
                <Textarea placeholder="Explication de la bonne réponse..." {...form.register("explanation")} className="rounded-xl border-[#E5EAF3] bg-[#F8FBFF]" />
              </div>

              {/* Answers Section */}
              <div className="space-y-4 pt-4 border-t border-[#E5EAF3]">
                <div className="flex items-center justify-between">
                  <Label className="text-lg font-black text-[#082B66]">Réponses</Label>
                  {questionType !== "TRUE_FALSE" && (
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm"
                      onClick={() => appendAnswer({ text: "", isCorrect: false, order: answerFields.length + 1 })}
                      className="h-8 rounded-lg border-[#E5EAF3] text-[#1368E8] font-bold text-[10px] uppercase tracking-widest hover:bg-[#F8FBFF]"
                    >
                      <PlusCircle className="w-3 h-3 mr-1" />
                      Ajouter une réponse
                    </Button>
                  )}
                </div>
                
                {form.formState.errors.answers?.root && (
                  <p className="text-[10px] text-red-500 font-bold p-3 bg-red-50 rounded-xl border border-red-100">
                    {form.formState.errors.answers.root.message}
                  </p>
                )}

                <div className="space-y-3">
                  {answerFields.map((field, index) => (
                    <div key={field.id} className={`flex items-start gap-3 p-3 rounded-xl border transition-all ${form.watch(`answers.${index}.isCorrect`) ? 'bg-emerald-50/50 border-emerald-200' : 'bg-white border-[#E5EAF3]'}`}>
                      <div className="flex-1 space-y-2">
                        <Input 
                          placeholder={`Réponse ${index + 1}`} 
                          {...form.register(`answers.${index}.text`)} 
                          className="h-10 rounded-lg border-[#E5EAF3] bg-[#F8FBFF]"
                          readOnly={questionType === "TRUE_FALSE"}
                        />
                        {form.formState.errors.answers?.[index]?.text && (
                          <p className="text-[10px] text-red-500 font-bold">{form.formState.errors.answers[index]?.text?.message}</p>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-3 h-10 px-3 bg-[#F8FBFF] rounded-lg border border-[#E5EAF3] shrink-0">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-[#082B66]/60 cursor-pointer">
                          Correcte
                        </Label>
                        <Switch 
                          checked={form.watch(`answers.${index}.isCorrect`)}
                          onCheckedChange={(checked) => handleAnswerCorrectChange(index, checked)}
                        />
                      </div>
                      
                      {questionType !== "TRUE_FALSE" && answerFields.length > 2 && (
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="icon"
                          onClick={() => removeAnswer(index)}
                          className="h-10 w-10 shrink-0 text-red-500 hover:bg-red-50 hover:text-red-600 rounded-lg"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

            </div>
            <DialogFooter className="p-8 pt-4 border-t border-[#E5EAF3] bg-[#F8FBFF]/50 rounded-b-[32px] gap-3">
              <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)} className="h-14 flex-1 rounded-2xl border-[#E5EAF3] text-[#082B66] font-black uppercase text-xs tracking-widest">
                Annuler
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting} className="h-14 flex-1 rounded-2xl bg-[#1368E8] hover:bg-[#082B66] text-white font-black uppercase text-xs tracking-widest">
                {form.formState.isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : selectedQuestion ? "Enregistrer les modifications" : "Enregistrer la question"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="rounded-[32px] border-[#E5EAF3] p-8">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl font-black text-[#082B66]">Supprimer la question ?</AlertDialogTitle>
            <AlertDialogDescription className="text-[#082B66]/60 font-medium">
              Êtes-vous sûr de vouloir supprimer cette question ? Cette action est irréversible.
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

    </div>
  )
}
