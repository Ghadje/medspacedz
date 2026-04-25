"use client"

import * as React from "react"
import { 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Eye, 
  Pencil, 
  Copy, 
  Trash2, 
  ChevronLeft, 
  ChevronRight,
  ArrowUpDown,
  BookOpen,
  CheckCircle2,
  Clock
} from "lucide-react"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
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
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import axios from "axios"
import { toast } from "sonner"
import { format } from "date-fns"
import { fr } from "date-fns/locale"

const moduleFormSchema = z.object({
  title: z.string().min(1, "Le titre est requis"),
  description: z.string().optional().nullable().or(z.literal("")),
  specialtyId: z.string().min(1, "La spécialité est requise"),
  studyYearId: z.string().min(1, "L'année d'étude est requise"),
  order: z.number().int(),
  isPublished: z.boolean(),
})

type ModuleFormValues = z.infer<typeof moduleFormSchema>

export function ModulesClient() {
  const [data, setData] = React.useState<any[]>([])
  const [total, setTotal] = React.useState(0)
  const [loading, setLoading] = React.useState(true)
  const [page, setPage] = React.useState(1)
  const [limit, setLimit] = React.useState(10)
  const [search, setSearch] = React.useState("")
  const [specialtyFilter, setSpecialtyFilter] = React.useState("all")
  const [yearFilter, setYearFilter] = React.useState("all")
  const [statusFilter, setStatusFilter] = React.useState("all")
  const [sortBy, setSortBy] = React.useState("createdAt")
  const [sortOrder, setSortOrder] = React.useState<"asc" | "desc">("desc")

  const [specialties, setSpecialties] = React.useState<any[]>([])
  const [years, setYears] = React.useState<any[]>([])
  const [allYears, setAllYears] = React.useState<any[]>([])

  const [isCreateOpen, setIsCreateOpen] = React.useState(false)
  const [isEditOpen, setIsEditOpen] = React.useState(false)
  const [isViewOpen, setIsViewOpen] = React.useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = React.useState(false)
  const [selectedModule, setSelectedModule] = React.useState<any>(null)

  const form = useForm<ModuleFormValues>({
    resolver: zodResolver(moduleFormSchema),
    defaultValues: {
      title: "",
      description: "",
      specialtyId: "",
      studyYearId: "",
      order: 0,
      isPublished: false,
    },
  })

  const fetchData = React.useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        search,
        page: page.toString(),
        limit: limit.toString(),
        sortBy,
        sortOrder,
      })
      if (specialtyFilter !== "all") params.append("specialtyId", specialtyFilter)
      if (yearFilter !== "all") params.append("studyYearId", yearFilter)
      if (statusFilter !== "all") params.append("status", statusFilter)

      const response = await axios.get(`/api/admin/modules?${params.toString()}`)
      setData(response.data.data)
      setTotal(response.data.total)
    } catch (error) {
      toast.error("Erreur lors du chargement des modules")
    } finally {
      setLoading(false)
    }
  }, [search, page, limit, specialtyFilter, yearFilter, statusFilter, sortBy, sortOrder])

  const fetchFilters = async () => {
    try {
      const [specRes, yearRes] = await Promise.all([
        axios.get("/api/data/specialties"),
        axios.get("/api/data/study-years"),
      ])
      setSpecialties(specRes.data)
      setAllYears(yearRes.data)
    } catch (error) {
      console.error("Error fetching filters", error)
    }
  }

  React.useEffect(() => {
    fetchFilters()
  }, [])

  React.useEffect(() => {
    fetchData()
  }, [fetchData])

  const handleCreate = async (values: ModuleFormValues) => {
    try {
      await axios.post("/api/admin/modules", values)
      toast.success("Module créé avec succès")
      setIsCreateOpen(false)
      form.reset()
      fetchData()
    } catch (error) {
      toast.error("Erreur lors de la création")
    }
  }

  const handleEdit = async (values: ModuleFormValues) => {
    try {
      await axios.patch(`/api/admin/modules/${selectedModule.id}`, values)
      toast.success("Module mis à jour")
      setIsEditOpen(false)
      fetchData()
    } catch (error) {
      toast.error("Erreur lors de la mise à jour")
    }
  }

  const handleDelete = async () => {
    try {
      await axios.delete(`/api/admin/modules/${selectedModule.id}`)
      toast.success("Module supprimé")
      setIsDeleteOpen(false)
      fetchData()
    } catch (error) {
      toast.error("Erreur lors de la suppression")
    }
  }

  const handleDuplicate = async (id: string) => {
    try {
      await axios.post(`/api/admin/modules/${id}/duplicate`)
      toast.success("Module dupliqué")
      fetchData()
    } catch (error) {
      toast.error("Erreur lors de la duplication")
    }
  }

  const handleTogglePublish = async (id: string, currentStatus: boolean) => {
    try {
      await axios.patch(`/api/admin/modules/${id}/publish`, { isPublished: !currentStatus })
      toast.success(currentStatus ? "Module dépublié" : "Module publié")
      fetchData()
    } catch (error) {
      toast.error("Erreur lors du changement de statut")
    }
  }

  const toggleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortBy(field)
      setSortOrder("desc")
    }
  }

  const filteredYears = allYears.filter(y => y.specialtyId === (form.watch("specialtyId") || specialtyFilter))

  const totalPages = Math.ceil(total / limit)
  const startIndex = (page - 1) * limit + 1
  const endIndex = Math.min(page * limit, total)

  return (
    <div className="flex flex-col gap-8 p-4 md:p-8 max-w-[1600px] mx-auto w-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-[#082B66]">Gestion des modules</h1>
          <p className="text-[#082B66]/60 font-bold text-sm mt-1 uppercase tracking-widest">
            Créez, modifiez et organisez les modules par spécialité et année.
          </p>
        </div>
        <Button 
          onClick={() => {
            form.reset({
              title: "",
              description: "",
              specialtyId: "",
              studyYearId: "",
              order: 0,
              isPublished: false,
            })
            setIsCreateOpen(true)
          }}
          className="bg-[#1368E8] hover:bg-[#1368E8]/90 text-white rounded-2xl h-12 px-6 font-black uppercase text-xs tracking-widest shadow-xl shadow-[#1368E8]/20 gap-2"
        >
          <Plus className="w-4 h-4" /> Ajouter un module
        </Button>
      </div>

      <div className="bg-white rounded-[32px] border border-[#E5EAF3] shadow-sm overflow-hidden flex flex-col">
        {/* Filters Header */}
        <div className="p-6 border-b border-[#E5EAF3] bg-[#F8FBFF]/50 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#082B66]/30 group-focus-within:text-[#1368E8] transition-colors" />
            <Input 
              placeholder="Rechercher un module..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-11 h-12 bg-white border-[#E5EAF3] rounded-2xl font-bold text-[#082B66] text-sm focus:ring-2 focus:ring-[#1368E8]/10 transition-all"
            />
          </div>
          <div className="flex flex-wrap gap-4">
            <Select value={specialtyFilter} onValueChange={(val) => setSpecialtyFilter(val || "all")}>
              <SelectTrigger className="w-[180px] h-12 rounded-2xl border-[#E5EAF3] bg-white font-bold text-[#082B66] text-xs uppercase tracking-widest">
                <SelectValue placeholder="Spécialité" />
              </SelectTrigger>
              <SelectContent className="rounded-2xl border-[#E5EAF3]">
                <SelectItem value="all">Toutes spécialités</SelectItem>
                {specialties.map(s => (
                  <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={yearFilter} onValueChange={(val) => setYearFilter(val || "all")}>
              <SelectTrigger className="w-[180px] h-12 rounded-2xl border-[#E5EAF3] bg-white font-bold text-[#082B66] text-xs uppercase tracking-widest">
                <SelectValue placeholder="Année" />
              </SelectTrigger>
              <SelectContent className="rounded-2xl border-[#E5EAF3]">
                <SelectItem value="all">Toutes les années</SelectItem>
                {allYears.filter(y => specialtyFilter === "all" || y.specialtyId === specialtyFilter).map(y => (
                  <SelectItem key={y.id} value={y.id}>{y.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={(val) => setStatusFilter(val || "all")}>
              <SelectTrigger className="w-[140px] h-12 rounded-2xl border-[#E5EAF3] bg-white font-bold text-[#082B66] text-xs uppercase tracking-widest">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent className="rounded-2xl border-[#E5EAF3]">
                <SelectItem value="all">Tous</SelectItem>
                <SelectItem value="published">Publiés</SelectItem>
                <SelectItem value="draft">Brouillons</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-[#F8FBFF]">
              <TableRow className="border-b border-[#E5EAF3] hover:bg-transparent">
                <TableHead className="w-[300px] h-16 cursor-pointer group" onClick={() => toggleSort("title")}>
                  <div className="flex items-center gap-2 font-black text-[10px] uppercase tracking-widest text-[#082B66]/40">
                    Nom du module <ArrowUpDown className="w-3 h-3 transition-colors group-hover:text-[#1368E8]" />
                  </div>
                </TableHead>
                <TableHead className="cursor-pointer group" onClick={() => toggleSort("specialtyId")}>
                  <div className="flex items-center gap-2 font-black text-[10px] uppercase tracking-widest text-[#082B66]/40">
                    Spécialité <ArrowUpDown className="w-3 h-3 transition-colors group-hover:text-[#1368E8]" />
                  </div>
                </TableHead>
                <TableHead className="cursor-pointer group" onClick={() => toggleSort("studyYearId")}>
                  <div className="flex items-center gap-2 font-black text-[10px] uppercase tracking-widest text-[#082B66]/40">
                    Année <ArrowUpDown className="w-3 h-3 transition-colors group-hover:text-[#1368E8]" />
                  </div>
                </TableHead>
                <TableHead className="text-center font-black text-[10px] uppercase tracking-widest text-[#082B66]/40">Cours</TableHead>
                <TableHead className="text-center font-black text-[10px] uppercase tracking-widest text-[#082B66]/40">Quiz</TableHead>
                <TableHead className="font-black text-[10px] uppercase tracking-widest text-[#082B66]/40 text-center">Statut</TableHead>
                <TableHead className="cursor-pointer group" onClick={() => toggleSort("createdAt")}>
                  <div className="flex items-center gap-2 font-black text-[10px] uppercase tracking-widest text-[#082B66]/40">
                    Créé le <ArrowUpDown className="w-3 h-3 transition-colors group-hover:text-[#1368E8]" />
                  </div>
                </TableHead>
                <TableHead className="text-right font-black text-[10px] uppercase tracking-widest text-[#082B66]/40 pr-8">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i} className="border-b border-[#E5EAF3]/50">
                    <TableCell colSpan={8} className="h-16"><div className="w-full h-8 bg-[#F3F7FF] rounded animate-pulse" /></TableCell>
                  </TableRow>
                ))
              ) : data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="h-64 text-center">
                    <div className="flex flex-col items-center justify-center gap-2 text-[#082B66]/20">
                      <BookOpen className="w-12 h-12 opacity-10" />
                      <p className="font-black uppercase text-xs tracking-widest">Aucun module trouvé</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                data.map((module) => (
                  <TableRow key={module.id} className="border-b border-[#E5EAF3]/50 hover:bg-[#F8FBFF] transition-colors group">
                    <TableCell className="py-4">
                      <div className="flex flex-col gap-0.5">
                        <span className="font-black text-[#082B66] text-sm group-hover:text-[#1368E8] transition-colors">{module.title}</span>
                        {module.description && <span className="text-[10px] font-bold text-[#082B66]/40 truncate max-w-[250px]">{module.description}</span>}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="bg-[#F3F7FF] text-[#082B66]/60 border-none font-bold text-[9px] uppercase tracking-widest">
                        {module.specialty?.name}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-xs font-black text-[#082B66]/60">{module.studyYear?.name}</span>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge className="bg-blue-50 text-[#1368E8] hover:bg-blue-100 border-none font-black text-[10px]">
                        {module._count?.courses || 0}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge className="bg-orange-50 text-orange-600 hover:bg-orange-100 border-none font-black text-[10px]">
                        {module._count?.quizzes || 0}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge 
                        className={module.isPublished 
                          ? "bg-green-50 text-green-600 border-green-100" 
                          : "bg-slate-50 text-slate-400 border-slate-100"
                        }
                        variant="outline"
                      >
                        {module.isPublished ? "Publié" : "Brouillon"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-[10px] font-bold text-[#082B66]/40 uppercase tracking-widest">
                      {format(new Date(module.createdAt), "dd MMM yyyy", { locale: fr })}
                    </TableCell>
                    <TableCell className="text-right pr-4">
                      <div className="flex items-center justify-end gap-1">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 rounded-lg text-[#082B66]/30 hover:text-[#1368E8] hover:bg-[#1368E8]/5 transition-all"
                          onClick={() => {
                            setSelectedModule(module)
                            setIsViewOpen(true)
                          }}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-[#082B66]/30 hover:text-[#1368E8] hover:bg-[#1368E8]/5">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="rounded-2xl border-[#E5EAF3] w-48 p-2">
                            <DropdownMenuLabel className="font-black text-[10px] uppercase tracking-widest text-[#082B66]/30 px-3 py-2">Actions</DropdownMenuLabel>
                            <DropdownMenuItem 
                              className="rounded-xl font-bold text-xs gap-3 px-3 py-2.5 cursor-pointer hover:bg-[#F3F7FF]"
                              onClick={() => {
                                setSelectedModule(module)
                                form.reset({
                                  title: module.title,
                                  description: module.description || "",
                                  specialtyId: module.specialtyId,
                                  studyYearId: module.studyYearId,
                                  order: module.order,
                                  isPublished: module.isPublished,
                                })
                                setIsEditOpen(true)
                              }}
                            >
                              <Pencil className="w-4 h-4 text-[#1368E8]" /> Modifier
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="rounded-xl font-bold text-xs gap-3 px-3 py-2.5 cursor-pointer hover:bg-[#F3F7FF]"
                              onClick={() => handleDuplicate(module.id)}
                            >
                              <Copy className="w-4 h-4 text-[#082B66]/40" /> Dupliquer
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="rounded-xl font-bold text-xs gap-3 px-3 py-2.5 cursor-pointer hover:bg-[#F3F7FF]"
                              onClick={() => handleTogglePublish(module.id, module.isPublished)}
                            >
                              <CheckCircle2 className={`w-4 h-4 ${module.isPublished ? "text-slate-400" : "text-green-500"}`} /> 
                              {module.isPublished ? "Dépublier" : "Publier"}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="my-2 bg-[#E5EAF3]" />
                            <DropdownMenuItem 
                              className="rounded-xl font-bold text-xs gap-3 px-3 py-2.5 cursor-pointer text-red-500 hover:bg-red-50 focus:bg-red-50 focus:text-red-500"
                              onClick={() => {
                                setSelectedModule(module)
                                setIsDeleteOpen(true)
                              }}
                            >
                              <Trash2 className="w-4 h-4" /> Supprimer
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination Footer */}
        <div className="p-6 border-t border-[#E5EAF3] bg-[#F8FBFF]/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[10px] font-black uppercase tracking-widest text-[#082B66]/40">
            Affichage de <span className="text-[#082B66]">{startIndex}</span> à <span className="text-[#082B66]">{endIndex}</span> sur <span className="text-[#082B66]">{total}</span> modules
          </p>
          <div className="flex items-center gap-2">
            <Select value={limit.toString()} onValueChange={(v) => v && setLimit(parseInt(v))}>
              <SelectTrigger className="w-20 h-10 rounded-xl border-[#E5EAF3] bg-white font-black text-[10px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex items-center gap-1">
              <Button 
                variant="outline" 
                size="icon" 
                className="h-10 w-10 rounded-xl border-[#E5EAF3] bg-white hover:bg-[#F3F7FF] transition-all disabled:opacity-30"
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <Button
                  key={p}
                  variant={page === p ? "default" : "outline"}
                  className={`h-10 w-10 rounded-xl font-black text-[10px] ${
                    page === p 
                      ? "bg-[#1368E8] text-white shadow-lg shadow-[#1368E8]/20 border-none" 
                      : "border-[#E5EAF3] bg-white text-[#082B66]/40 hover:bg-[#F3F7FF]"
                  }`}
                  onClick={() => setPage(p)}
                >
                  {p}
                </Button>
              ))}
              <Button 
                variant="outline" 
                size="icon" 
                className="h-10 w-10 rounded-xl border-[#E5EAF3] bg-white hover:bg-[#F3F7FF] transition-all disabled:opacity-30"
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* View Modal */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="rounded-[32px] border-none p-0 overflow-hidden shadow-2xl max-w-md">
          <div className="bg-[#F8FBFF] p-8 border-b border-[#E5EAF3]">
            <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center shadow-sm mb-6">
              <BookOpen className="w-8 h-8 text-[#1368E8]" />
            </div>
            <DialogTitle className="text-2xl font-black text-[#082B66]">{selectedModule?.title}</DialogTitle>
            <DialogDescription className="text-[#082B66]/60 font-bold mt-2">Détails complets du module</DialogDescription>
          </div>
          <div className="p-8 space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-1">
                <span className="text-[10px] font-black text-[#082B66]/30 uppercase tracking-[0.2em]">Spécialité</span>
                <p className="font-black text-[#082B66] text-sm">{selectedModule?.specialty?.name}</p>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-black text-[#082B66]/30 uppercase tracking-[0.2em]">Année</span>
                <p className="font-black text-[#082B66] text-sm">{selectedModule?.studyYear?.name}</p>
              </div>
            </div>
            {selectedModule?.description && (
              <div className="space-y-1">
                <span className="text-[10px] font-black text-[#082B66]/30 uppercase tracking-[0.2em]">Description</span>
                <p className="text-sm font-bold text-[#082B66]/60 leading-relaxed">{selectedModule.description}</p>
              </div>
            )}
            <div className="flex items-center gap-4 py-4 border-y border-[#E5EAF3]">
              <div className="flex-1 text-center">
                <div className="text-2xl font-black text-[#1368E8]">{selectedModule?._count?.courses}</div>
                <div className="text-[9px] font-black text-[#082B66]/30 uppercase tracking-widest mt-1">Cours</div>
              </div>
              <div className="w-px h-8 bg-[#E5EAF3]" />
              <div className="flex-1 text-center">
                <div className="text-2xl font-black text-orange-500">{selectedModule?._count?.quizzes}</div>
                <div className="text-[9px] font-black text-[#082B66]/30 uppercase tracking-widest mt-1">Quiz</div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-[10px] font-black text-[#082B66]/30 uppercase tracking-[0.2em]">Créé le</span>
                <p className="font-bold text-xs text-[#082B66]/60">
                  {selectedModule && format(new Date(selectedModule.createdAt), "dd MMMM yyyy", { locale: fr })}
                </p>
              </div>
              <Badge 
                className={selectedModule?.isPublished 
                  ? "bg-green-50 text-green-600 border-green-100" 
                  : "bg-slate-50 text-slate-400 border-slate-100"
                }
                variant="outline"
              >
                {selectedModule?.isPublished ? "Publié" : "Brouillon"}
              </Badge>
            </div>
          </div>
          <DialogFooter className="p-8 bg-[#F8FBFF]/50 border-t border-[#E5EAF3] flex gap-4">
            <Button variant="ghost" className="rounded-2xl h-12 flex-1 font-black uppercase text-[10px] tracking-widest border border-[#E5EAF3] bg-white hover:bg-[#F3F7FF] transition-all" onClick={() => setIsViewOpen(false)}>Fermer</Button>
            <Button 
              className="rounded-2xl h-12 flex-1 font-black uppercase text-[10px] tracking-widest bg-[#1368E8] text-white hover:bg-[#1368E8]/90 shadow-lg shadow-[#1368E8]/20"
              onClick={() => {
                setIsViewOpen(false)
                form.reset({
                  title: selectedModule.title,
                  description: selectedModule.description || "",
                  specialtyId: selectedModule.specialtyId,
                  studyYearId: selectedModule.studyYearId,
                  order: selectedModule.order,
                  isPublished: selectedModule.isPublished,
                })
                setIsEditOpen(true)
              }}
            >
              Modifier
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create / Edit Modal */}
      <Dialog 
        open={isCreateOpen || isEditOpen} 
        onOpenChange={(open) => {
          if (!open) {
            setIsCreateOpen(false)
            setIsEditOpen(false)
          }
        }}
      >
        <DialogContent className="rounded-[32px] border-none p-0 overflow-hidden shadow-2xl max-w-3xl">
          <form onSubmit={form.handleSubmit(isEditOpen ? handleEdit : handleCreate)}>
            <div className="bg-[#F8FBFF] p-8 border-b border-[#E5EAF3]">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-sm mb-6 ${isEditOpen ? "bg-orange-50 text-orange-500" : "bg-blue-50 text-[#1368E8]"}`}>
                {isEditOpen ? <Pencil className="w-8 h-8" /> : <Plus className="w-8 h-8" />}
              </div>
              <DialogTitle className="text-2xl font-black text-[#082B66]">
                {isEditOpen ? "Modifier le module" : "Ajouter un module"}
              </DialogTitle>
              <DialogDescription className="text-[#082B66]/60 font-bold mt-2">
                Configurez les informations fondamentales du module.
              </DialogDescription>
            </div>
            
            <div className="p-8 space-y-6 max-h-[80vh] overflow-y-auto scrollbar-hide">
              <div className="space-y-2">
                <Label className="text-[10px] font-black text-[#082B66]/40 uppercase tracking-widest px-1">Nom du module</Label>
                <Input 
                  {...form.register("title")}
                  placeholder="Ex: Embryologie" 
                  className="h-12 rounded-2xl border-[#E5EAF3] bg-white focus:bg-[#F8FBFF] font-bold text-[#082B66] text-sm transition-all"
                />
                {form.formState.errors.title && <p className="text-[10px] font-bold text-red-500 px-1">{form.formState.errors.title.message}</p>}
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-black text-[#082B66]/40 uppercase tracking-widest px-1">Description</Label>
                <Textarea 
                  {...form.register("description")}
                  placeholder="Brève description du contenu..." 
                  className="rounded-2xl border-[#E5EAF3] bg-white focus:bg-[#F8FBFF] font-bold text-[#082B66] text-sm min-h-[150px] transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black text-[#082B66]/40 uppercase tracking-widest px-1">Spécialité</Label>
                  <Select 
                    value={form.watch("specialtyId")} 
                    onValueChange={(val) => {
                      form.setValue("specialtyId", val || "")
                      form.setValue("studyYearId", "")
                    }}
                  >
                    <SelectTrigger className="w-full h-12 rounded-2xl border-[#E5EAF3] bg-white font-bold text-[#082B66] text-xs">
                      <SelectValue placeholder="Sélectionner">
                        {specialties.find(s => s.id === form.watch("specialtyId"))?.name}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl border-[#E5EAF3]">
                      {specialties.map(s => (
                        <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {form.formState.errors.specialtyId && <p className="text-[10px] font-bold text-red-500 px-1">{form.formState.errors.specialtyId.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label className="text-[10px] font-black text-[#082B66]/40 uppercase tracking-widest px-1">Année d'étude</Label>
                  <Select 
                    value={form.watch("studyYearId")} 
                    onValueChange={(val) => form.setValue("studyYearId", val || "")}
                    disabled={!form.watch("specialtyId")}
                  >
                    <SelectTrigger className="w-full h-12 rounded-2xl border-[#E5EAF3] bg-white font-bold text-[#082B66] text-xs">
                      <SelectValue placeholder={form.watch("specialtyId") ? "Sélectionner" : "Choisir spécialité d'abord"}>
                        {allYears.find(y => y.id === form.watch("studyYearId"))?.name}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl border-[#E5EAF3]">
                      {filteredYears.map(y => (
                        <SelectItem key={y.id} value={y.id}>{y.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {form.formState.errors.studyYearId && <p className="text-[10px] font-bold text-red-500 px-1">{form.formState.errors.studyYearId.message}</p>}
                </div>
              </div>

              <div className="flex items-center justify-between p-4 rounded-2xl bg-[#F8FBFF] border border-[#E5EAF3]">
                <div className="space-y-0.5">
                  <Label className="text-xs font-black text-[#082B66]">Module publié</Label>
                  <p className="text-[10px] font-bold text-[#082B66]/40">Rendre visible par tous les étudiants</p>
                </div>
                <Switch 
                  checked={form.watch("isPublished")} 
                  onCheckedChange={(val) => form.setValue("isPublished", val)}
                  className="data-[state=checked]:bg-green-500"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-black text-[#082B66]/40 uppercase tracking-widest px-1">Ordre d'affichage</Label>
                <Input 
                  type="number"
                  {...form.register("order", { valueAsNumber: true })}
                  className="h-12 rounded-2xl border-[#E5EAF3] bg-white focus:bg-[#F8FBFF] font-bold text-[#082B66] text-sm transition-all"
                />
              </div>
            </div>

            <DialogFooter className="p-8 bg-[#F8FBFF]/50 border-t border-[#E5EAF3] flex gap-4">
              <Button type="button" variant="ghost" className="rounded-2xl h-12 flex-1 font-black uppercase text-[10px] tracking-widest border border-[#E5EAF3] bg-white hover:bg-[#F3F7FF] transition-all" onClick={() => { setIsCreateOpen(false); setIsEditOpen(false); }}>Annuler</Button>
              <Button 
                type="submit"
                className="rounded-2xl h-12 flex-1 font-black uppercase text-[10px] tracking-widest bg-[#1368E8] text-white hover:bg-[#1368E8]/90 shadow-lg shadow-[#1368E8]/20"
              >
                {isEditOpen ? "Enregistrer" : "Créer le module"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent className="rounded-[32px] border-none p-0 overflow-hidden shadow-2xl">
          <div className="bg-red-50 p-8 border-b border-red-100 flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-sm mb-6 text-red-500">
              <Trash2 className="w-8 h-8" />
            </div>
            <AlertDialogTitle className="text-2xl font-black text-red-900">Supprimer le module ?</AlertDialogTitle>
            <AlertDialogDescription className="text-red-700/60 font-bold mt-2 max-w-sm">
              Cette action est irréversible. Toutes les données associées à ce module seront définitivement supprimées.
            </AlertDialogDescription>
          </div>
          {selectedModule && (selectedModule._count?.courses > 0 || selectedModule._count?.quizzes > 0) && (
            <div className="p-6 bg-orange-50 border-b border-orange-100 text-orange-700">
              <div className="flex gap-3">
                <Clock className="w-5 h-5 shrink-0" />
                <div className="space-y-1">
                  <p className="font-black text-xs uppercase tracking-widest">Attention Contenu Actif</p>
                  <p className="text-xs font-bold leading-relaxed">
                    Ce module contient <span className="font-black">{selectedModule._count.courses} cours</span> et <span className="font-black">{selectedModule._count.quizzes} quiz</span>. 
                    La suppression peut affecter gravement l'expérience des étudiants.
                  </p>
                </div>
              </div>
            </div>
          )}
          <AlertDialogFooter className="p-8 bg-white flex gap-4">
            <AlertDialogCancel className="rounded-2xl h-12 flex-1 font-black uppercase text-[10px] tracking-widest border border-[#E5EAF3] bg-white hover:bg-[#F3F7FF] transition-all m-0">Annuler</AlertDialogCancel>
            <AlertDialogAction 
              className="rounded-2xl h-12 flex-1 font-black uppercase text-[10px] tracking-widest bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-500/20"
              onClick={handleDelete}
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
