"use client"

import * as React from "react"
import { 
  Plus, 
  Search, 
  Filter, 
  ExternalLink, 
  Edit, 
  Trash, 
  Eye, 
  Copy, 
  MoreHorizontal, 
  FileText, 
  CheckCircle, 
  XCircle,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown
} from "lucide-react"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import axios from "axios"
import { toast } from "sonner"
import { format } from "date-fns"
import { fr } from "date-fns/locale"

const formSchema = z.object({
  title: z.string().min(1, "Le titre est requis"),
  description: z.string().optional(),
  specialtyId: z.string().min(1, "La spécialité est requise"),
  studyYearId: z.string().min(1, "L'année d'étude est requise"),
  moduleId: z.string().min(1, "Le module est requis"),
  professorName: z.string().optional(),
  googleDriveUrl: z.string().url("URL Google Drive invalide"),
  order: z.any().transform((val) => parseInt(val, 10) || 0),
  isPublished: z.boolean().default(false),
})

type FormValues = z.infer<typeof formSchema>

export default function CourseSupportClient() {
  const [data, setData] = React.useState<any[]>([])
  const [loading, setLoading] = React.useState(true)
  const [total, setTotal] = React.useState(0)
  const [page, setPage] = React.useState(1)
  const [limit, setLimit] = React.useState(10)
  const [search, setSearch] = React.useState("")
  const [specialtyId, setSpecialtyId] = React.useState("all")
  const [studyYearId, setStudyYearId] = React.useState("all")
  const [moduleId, setModuleId] = React.useState("all")
  const [status, setStatus] = React.useState("all")
  const [sortBy, setSortBy] = React.useState("createdAt")
  const [sortOrder, setSortOrder] = React.useState("desc")

  // Options for selects
  const [specialties, setSpecialties] = React.useState<any[]>([])
  const [studyYears, setStudyYears] = React.useState<any[]>([])
  const [modules, setModules] = React.useState<any[]>([])

  // Modal states
  const [isFormOpen, setIsFormOpen] = React.useState(false)
  const [isViewOpen, setIsViewOpen] = React.useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = React.useState(false)
  const [selectedItem, setSelectedItem] = React.useState<any>(null)
  const [isEditing, setIsEditing] = React.useState(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      specialtyId: "",
      studyYearId: "",
      moduleId: "",
      professorName: "",
      googleDriveUrl: "",
      fileType: "PDF",
      fileSize: "",
      order: 0,
      isPublished: false,
    },
  })

  const fetchData = React.useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        search,
        sortBy,
        sortOrder,
      })
      if (specialtyId !== "all") params.append("specialtyId", specialtyId)
      if (studyYearId !== "all") params.append("studyYearId", studyYearId)
      if (moduleId !== "all") params.append("moduleId", moduleId)
      if (status !== "all") params.append("status", status)

      const response = await axios.get(`/api/admin/course-supports?${params.toString()}`)
      setData(response.data.data)
      setTotal(response.data.pagination.total)
    } catch (error) {
      toast.error("Erreur lors du chargement des supports")
    } finally {
      setLoading(false)
    }
  }, [page, limit, search, specialtyId, studyYearId, moduleId, status, sortBy, sortOrder])

  const fetchOptions = React.useCallback(async () => {
    try {
      const [specRes, yearRes, modRes] = await Promise.all([
        axios.get("/api/data/specialties"),
        axios.get("/api/data/study-years"),
        axios.get("/api/data/modules"),
      ])
      setSpecialties(specRes.data)
      setStudyYears(yearRes.data)
      setModules(modRes.data)
    } catch (error) {
      console.error("Error fetching options", error)
    }
  }, [])

  React.useEffect(() => {
    fetchData()
  }, [fetchData])

  React.useEffect(() => {
    fetchOptions()
  }, [fetchOptions])

  const onSubmit = async (values: FormValues) => {
    try {
      if (isEditing) {
        await axios.patch(`/api/admin/course-supports/${selectedItem.id}`, values)
        toast.success("Support mis à jour avec succès")
      } else {
        await axios.post("/api/admin/course-supports", values)
        toast.success("Support ajouté avec succès")
      }
      setIsFormOpen(false)
      fetchData()
    } catch (error) {
      toast.error("Une erreur est survenue")
    }
  }

  const handleDelete = async () => {
    try {
      await axios.delete(`/api/admin/course-supports/${selectedItem.id}`)
      toast.success("Support supprimé avec succès")
      setIsDeleteOpen(false)
      fetchData()
    } catch (error) {
      toast.error("Erreur lors de la suppression")
    }
  }

  const handleDuplicate = async (id: string) => {
    try {
      await axios.post(`/api/admin/course-supports/${id}/duplicate`)
      toast.success("Support dupliqué avec succès")
      fetchData()
    } catch (error) {
      toast.error("Erreur lors de la duplication")
    }
  }

  const handleTogglePublish = async (id: string, currentStatus: boolean) => {
    try {
      await axios.patch(`/api/admin/course-supports/${id}/publish`, { isPublished: !currentStatus })
      toast.success(currentStatus ? "Support dépublié" : "Support publié")
      fetchData()
    } catch (error) {
      toast.error("Erreur lors de la modification du statut")
    }
  }

  const openEdit = (item: any) => {
    setSelectedItem(item)
    setIsEditing(true)
    form.reset({
      title: item.title,
      description: item.description || "",
      specialtyId: item.specialtyId,
      studyYearId: item.studyYearId,
      moduleId: item.moduleId,
      professorName: item.professorName || "",
      googleDriveUrl: item.googleDriveUrl,
      order: item.order,
      isPublished: item.isPublished,
    })
    setIsFormOpen(true)
  }

  const openAdd = () => {
    setSelectedItem(null)
    setIsEditing(false)
    form.reset({
      title: "",
      description: "",
      specialtyId: "",
      studyYearId: "",
      moduleId: "",
      professorName: "",
      googleDriveUrl: "",
      order: 0,
      isPublished: false,
    })
    setIsFormOpen(true)
  }

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortBy(column)
      setSortOrder("asc")
    }
  }

  return (
    <div className="space-y-6">
      {/* Filters & Search */}
      <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center bg-white p-6 rounded-[24px] border border-[#E5EAF3] shadow-sm">
        <div className="flex flex-1 flex-col sm:flex-row gap-4 w-full">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#082B66]/40" />
            <Input 
              placeholder="Rechercher un support..." 
              className="pl-10 h-12 rounded-xl border-[#E5EAF3] bg-[#F8FBFF] focus:bg-white transition-all"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 sm:flex gap-2">
            <Select value={specialtyId} onValueChange={setSpecialtyId}>
              <SelectTrigger className="h-12 sm:w-[160px] rounded-xl border-[#E5EAF3] bg-[#F8FBFF]">
                <SelectValue placeholder="Spécialité" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes spécialités</SelectItem>
                {specialties.map((s) => (
                  <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="h-12 sm:w-[140px] rounded-xl border-[#E5EAF3] bg-[#F8FBFF]">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous statuts</SelectItem>
                <SelectItem value="published">Publié</SelectItem>
                <SelectItem value="draft">Brouillon</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <Button onClick={openAdd} className="w-full lg:w-auto h-12 px-8 rounded-xl bg-[#1368E8] hover:bg-[#082B66] text-white font-black uppercase text-xs tracking-widest transition-all">
          <Plus className="w-4 h-4 mr-2" /> Ajouter un support
        </Button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-[32px] border border-[#E5EAF3] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-[#F8FBFF]">
              <TableRow className="hover:bg-transparent border-[#E5EAF3]">
                <TableHead className="font-black text-[#082B66] uppercase text-[10px] tracking-widest py-6 px-6">
                  <button onClick={() => handleSort("title")} className="flex items-center gap-1 hover:text-[#1368E8] transition-colors">
                    Titre <ArrowUpDown className="w-3 h-3" />
                  </button>
                </TableHead>
                <TableHead className="font-black text-[#082B66] uppercase text-[10px] tracking-widest">Spécialité</TableHead>
                <TableHead className="font-black text-[#082B66] uppercase text-[10px] tracking-widest">Année</TableHead>
                <TableHead className="font-black text-[#082B66] uppercase text-[10px] tracking-widest">
                  <button onClick={() => handleSort("moduleId")} className="flex items-center gap-1 hover:text-[#1368E8] transition-colors">
                    Module <ArrowUpDown className="w-3 h-3" />
                  </button>
                </TableHead>
                <TableHead className="font-black text-[#082B66] uppercase text-[10px] tracking-widest">Professeur</TableHead>

                <TableHead className="font-black text-[#082B66] uppercase text-[10px] tracking-widest">
                  <button onClick={() => handleSort("isPublished")} className="flex items-center gap-1 hover:text-[#1368E8] transition-colors">
                    Statut <ArrowUpDown className="w-3 h-3" />
                  </button>
                </TableHead>
                <TableHead className="font-black text-[#082B66] uppercase text-[10px] tracking-widest">Drive</TableHead>
                <TableHead className="font-black text-[#082B66] uppercase text-[10px] tracking-widest">
                  <button onClick={() => handleSort("createdAt")} className="flex items-center gap-1 hover:text-[#1368E8] transition-colors">
                    Créé le <ArrowUpDown className="w-3 h-3" />
                  </button>
                </TableHead>
                <TableHead className="text-right pr-6">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={9} className="h-64 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-8 h-8 border-4 border-[#1368E8] border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-sm font-bold text-[#082B66]/40 uppercase tracking-widest">Chargement...</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="h-64 text-center">
                    <span className="text-sm font-bold text-[#082B66]/40 uppercase tracking-widest">Aucun support trouvé</span>
                  </TableCell>
                </TableRow>
              ) : (
                data.map((item) => (
                  <TableRow key={item.id} className="hover:bg-[#F8FBFF]/50 border-[#E5EAF3] group transition-colors">
                    <TableCell className="py-4 px-6">
                      <div className="font-black text-[#082B66] group-hover:text-[#1368E8] transition-colors">{item.title}</div>
                      <div className="text-[10px] text-[#082B66]/40 font-bold uppercase tracking-tighter truncate max-w-[200px]">
                        {item.description || "Pas de description"}
                      </div>
                    </TableCell>
                    <TableCell className="text-xs font-bold text-[#082B66]/60">{item.specialty?.name}</TableCell>
                    <TableCell className="text-xs font-bold text-[#082B66]/60">{item.studyYear?.name}</TableCell>
                    <TableCell className="text-xs font-black text-[#082B66]">{item.module?.title}</TableCell>
                    <TableCell className="text-xs font-bold text-[#082B66]/60">{item.professorName || "-"}</TableCell>

                    <TableCell>
                      <Badge className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 ${item.isPublished ? 'bg-[#12B76A]/10 text-[#12B76A] hover:bg-[#12B76A]/20' : 'bg-[#667085]/10 text-[#667085] hover:bg-[#667085]/20'}`}>
                        {item.isPublished ? "Publié" : "Brouillon"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" asChild className="h-8 w-8 rounded-lg bg-[#F3F7FF] text-[#1368E8] hover:bg-[#1368E8] hover:text-white transition-all">
                        <a href={item.googleDriveUrl} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </Button>
                    </TableCell>
                    <TableCell className="text-[10px] font-bold text-[#082B66]/40 uppercase">
                      {format(new Date(item.createdAt), "dd MMM yyyy", { locale: fr })}
                    </TableCell>
                    <TableCell className="text-right pr-6">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-[#F3F7FF] text-[#082B66]">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48 rounded-xl border-[#E5EAF3] p-2">
                          <DropdownMenuItem onClick={() => { setSelectedItem(item); setIsViewOpen(true); }} className="rounded-lg font-bold text-xs uppercase tracking-widest p-2.5 cursor-pointer">
                            <Eye className="w-4 h-4 mr-2 text-[#082B66]/40" /> Voir
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => openEdit(item)} className="rounded-lg font-bold text-xs uppercase tracking-widest p-2.5 cursor-pointer">
                            <Edit className="w-4 h-4 mr-2 text-[#082B66]/40" /> Modifier
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDuplicate(item.id)} className="rounded-lg font-bold text-xs uppercase tracking-widest p-2.5 cursor-pointer">
                            <Copy className="w-4 h-4 mr-2 text-[#082B66]/40" /> Dupliquer
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleTogglePublish(item.id, item.isPublished)} className="rounded-lg font-bold text-xs uppercase tracking-widest p-2.5 cursor-pointer">
                            {item.isPublished ? (
                              <><XCircle className="w-4 h-4 mr-2 text-orange-400" /> Dépublier</>
                            ) : (
                              <><CheckCircle className="w-4 h-4 mr-2 text-green-500" /> Publier</>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator className="bg-[#E5EAF3] my-1" />
                          <DropdownMenuItem onClick={() => { setSelectedItem(item); setIsDeleteOpen(true); }} className="rounded-lg font-bold text-xs uppercase tracking-widest p-2.5 cursor-pointer text-destructive focus:text-destructive">
                            <Trash className="w-4 h-4 mr-2" /> Supprimer
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
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 border-t border-[#E5EAF3] bg-[#F8FBFF]/30">
          <div className="text-[10px] font-black text-[#082B66]/40 uppercase tracking-widest">
            Affichage de {data.length > 0 ? (page - 1) * limit + 1 : 0} à {Math.min(page * limit, total)} sur {total} supports
          </div>
          <div className="flex items-center gap-2">
            <Select value={limit.toString()} onValueChange={(v) => { setLimit(parseInt(v)); setPage(1); }}>
              <SelectTrigger className="h-10 w-[70px] rounded-lg border-[#E5EAF3] bg-white text-xs font-bold">
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
                className="h-10 w-10 rounded-lg border-[#E5EAF3] bg-white text-[#082B66] disabled:opacity-30"
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <div className="flex items-center gap-1 mx-2">
                {Array.from({ length: Math.ceil(total / limit) }, (_, i) => i + 1)
                  .filter(p => p === 1 || p === Math.ceil(total / limit) || Math.abs(p - page) <= 1)
                  .map((p, i, arr) => (
                    <React.Fragment key={p}>
                      {i > 0 && arr[i-1] !== p - 1 && <span className="text-[#082B66]/20">...</span>}
                      <Button
                        variant={page === p ? "default" : "ghost"}
                        className={`h-10 w-10 rounded-lg text-xs font-black ${page === p ? 'bg-[#1368E8] text-white shadow-lg shadow-[#1368E8]/20' : 'text-[#082B66] hover:bg-[#F3F7FF]'}`}
                        onClick={() => setPage(p)}
                      >
                        {p}
                      </Button>
                    </React.Fragment>
                  ))}
              </div>
              <Button 
                variant="outline" 
                size="icon" 
                className="h-10 w-10 rounded-lg border-[#E5EAF3] bg-white text-[#082B66] disabled:opacity-30"
                onClick={() => setPage(page + 1)}
                disabled={page >= Math.ceil(total / limit)}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Add / Edit Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto p-0 border-none rounded-[32px] shadow-2xl">
          <DialogHeader className="p-8 pb-0">
            <DialogTitle className="text-2xl font-black text-[#082B66]">
              {isEditing ? "Modifier le support" : "Ajouter un support de cours"}
            </DialogTitle>
            <DialogDescription className="text-[#082B66]/60 font-medium">
              Remplissez les informations ci-dessous pour {isEditing ? "mettre à jour" : "créer"} le support.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={form.handleSubmit(onSubmit)} className="p-8 pt-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2 col-span-full">
                <Label className="text-[10px] font-black uppercase tracking-widest text-[#082B66]/60 ml-1">Titre</Label>
                <Input placeholder="Introduction d'Embryologie" {...form.register("title")} className="h-12 rounded-xl border-[#E5EAF3] bg-[#F8FBFF]" />
                {form.formState.errors.title && <p className="text-[10px] text-destructive font-bold uppercase ml-1">{form.formState.errors.title.message}</p>}
              </div>

              <div className="space-y-2 col-span-full">
                <Label className="text-[10px] font-black uppercase tracking-widest text-[#082B66]/60 ml-1">Description</Label>
                <Textarea placeholder="Description détaillée du support..." {...form.register("description")} className="rounded-xl border-[#E5EAF3] bg-[#F8FBFF]" />
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-[#082B66]/60 ml-1">Spécialité</Label>
                <Select onValueChange={(val) => form.setValue("specialtyId", val)} value={form.watch("specialtyId")}>
                  <SelectTrigger className="h-12 rounded-xl border-[#E5EAF3] bg-[#F8FBFF] w-full text-left flex justify-between items-center px-4 whitespace-nowrap overflow-hidden text-ellipsis">
                    <SelectValue placeholder="Choisir...">
                      {specialties.find(s => s.id === form.watch("specialtyId"))?.name}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {specialties.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-[#082B66]/60 ml-1">Année d'étude</Label>
                <Select onValueChange={(val) => form.setValue("studyYearId", val)} value={form.watch("studyYearId")}>
                  <SelectTrigger className="h-12 rounded-xl border-[#E5EAF3] bg-[#F8FBFF] w-full text-left flex justify-between items-center px-4 whitespace-nowrap overflow-hidden text-ellipsis">
                    <SelectValue placeholder="Choisir...">
                      {studyYears.find(y => y.id === form.watch("studyYearId"))?.name}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {studyYears.filter(y => y.specialtyId === form.watch("specialtyId")).map(y => <SelectItem key={y.id} value={y.id}>{y.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-[#082B66]/60 ml-1">Module</Label>
                <Select onValueChange={(val) => form.setValue("moduleId", val)} value={form.watch("moduleId")}>
                  <SelectTrigger className="h-12 rounded-xl border-[#E5EAF3] bg-[#F8FBFF] w-full text-left flex justify-between items-center px-4 whitespace-nowrap overflow-hidden text-ellipsis">
                    <SelectValue placeholder="Choisir...">
                      {modules.find(m => m.id === form.watch("moduleId"))?.title}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {modules.filter(m => m.studyYearId === form.watch("studyYearId")).map(m => <SelectItem key={m.id} value={m.id}>{m.title}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-[#082B66]/60 ml-1">Professeur</Label>
                <Input placeholder="Pr. Mansouri" {...form.register("professorName")} className="h-12 rounded-xl border-[#E5EAF3] bg-[#F8FBFF]" />
              </div>

              <div className="space-y-2 col-span-full">
                <Label className="text-[10px] font-black uppercase tracking-widest text-[#082B66]/60 ml-1">URL Google Drive</Label>
                <Input placeholder="https://drive.google.com/..." {...form.register("googleDriveUrl")} className="h-12 rounded-xl border-[#E5EAF3] bg-[#F8FBFF]" />
                {form.formState.errors.googleDriveUrl && <p className="text-[10px] text-destructive font-bold uppercase ml-1">{form.formState.errors.googleDriveUrl.message}</p>}
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-[#082B66]/60 ml-1">Ordre</Label>
                <Input type="number" {...form.register("order")} className="h-12 rounded-xl border-[#E5EAF3] bg-[#F8FBFF]" />
              </div>

              <div className="flex items-center justify-between p-4 bg-[#F8FBFF] rounded-xl border border-[#E5EAF3]">
                <div className="space-y-0.5">
                  <Label className="text-sm font-black text-[#082B66]">Publier</Label>
                  <p className="text-[10px] font-bold text-[#082B66]/40 uppercase tracking-widest">Rendre visible aux étudiants</p>
                </div>
                <Switch 
                  checked={form.watch("isPublished")} 
                  onCheckedChange={(checked) => form.setValue("isPublished", checked)} 
                />
              </div>
            </div>

            <DialogFooter className="p-0 border-none bg-transparent gap-3">
              <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)} className="h-14 flex-1 rounded-2xl border-[#E5EAF3] text-[#082B66] font-black uppercase text-xs tracking-widest hover:bg-[#F3F7FF]">
                Annuler
              </Button>
              <Button type="submit" className="h-14 flex-1 rounded-2xl bg-[#1368E8] hover:bg-[#082B66] text-white font-black uppercase text-xs tracking-widest shadow-xl shadow-[#1368E8]/20 transition-all active:scale-95">
                Sauvegarder
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="sm:max-w-[500px] p-0 border-none rounded-[32px] shadow-2xl">
          <DialogHeader className="p-8 pb-4">
            <DialogTitle className="text-2xl font-black text-[#082B66]">Détails du support</DialogTitle>
          </DialogHeader>
          <div className="p-8 pt-0 space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <Label className="text-[10px] font-black uppercase tracking-widest text-[#082B66]/40">Titre</Label>
                <div className="text-sm font-black text-[#082B66] mt-1">{selectedItem?.title}</div>
              </div>
              <div>
                <Label className="text-[10px] font-black uppercase tracking-widest text-[#082B66]/40">Module</Label>
                <div className="text-sm font-black text-[#082B66] mt-1">{selectedItem?.module?.title}</div>
              </div>
              <div>
                <Label className="text-[10px] font-black uppercase tracking-widest text-[#082B66]/40">Spécialité</Label>
                <div className="text-sm font-bold text-[#082B66]/60 mt-1">{selectedItem?.specialty?.name}</div>
              </div>
              <div>
                <Label className="text-[10px] font-black uppercase tracking-widest text-[#082B66]/40">Année</Label>
                <div className="text-sm font-bold text-[#082B66]/60 mt-1">{selectedItem?.studyYear?.name}</div>
              </div>
              <div>
                <Label className="text-[10px] font-black uppercase tracking-widest text-[#082B66]/40">Professeur</Label>
                <div className="text-sm font-bold text-[#082B66]/60 mt-1">{selectedItem?.professorName || "Non spécifié"}</div>
              </div>
              <div>
                <Label className="text-[10px] font-black uppercase tracking-widest text-[#082B66]/40">Statut</Label>
                <div className="mt-1">
                  <Badge className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 ${selectedItem?.isPublished ? 'bg-[#12B76A]/10 text-[#12B76A]' : 'bg-[#667085]/10 text-[#667085]'}`}>
                    {selectedItem?.isPublished ? "Publié" : "Brouillon"}
                  </Badge>
                </div>
              </div>
            </div>
            <div className="p-4 bg-[#F8FBFF] rounded-2xl border border-[#E5EAF3]">
              <Label className="text-[10px] font-black uppercase tracking-widest text-[#082B66]/40">Lien Google Drive</Label>
              <div className="flex items-center justify-between mt-2">
                <div className="text-xs font-bold text-[#1368E8] truncate max-w-[300px]">{selectedItem?.googleDriveUrl}</div>
                <Button variant="ghost" size="sm" asChild className="h-8 w-8 rounded-lg bg-white shadow-sm text-[#1368E8]">
                  <a href={selectedItem?.googleDriveUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </Button>
              </div>
            </div>
            <div className="flex gap-4 text-[10px] font-bold text-[#082B66]/40 uppercase">
              <span>Créé le: {selectedItem && format(new Date(selectedItem.createdAt), "dd/MM/yyyy HH:mm")}</span>
              <span>•</span>
              <span>Mis à jour: {selectedItem && format(new Date(selectedItem.updatedAt), "dd/MM/yyyy HH:mm")}</span>
            </div>
            <DialogFooter className="p-0 border-none bg-transparent gap-3">
              <Button onClick={() => setIsViewOpen(false)} variant="outline" className="h-12 flex-1 rounded-xl font-black uppercase text-xs tracking-widest">
                Fermer
              </Button>
              <Button onClick={() => openEdit(selectedItem)} className="h-12 flex-1 rounded-xl bg-[#1368E8] text-white font-black uppercase text-xs tracking-widest">
                Modifier
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent className="rounded-[32px] p-8">
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
            <AlertDialogDescription>
              Voulez-vous vraiment supprimer ce support de cours ? Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-8 gap-3">
            <AlertDialogCancel className="h-12 flex-1 rounded-xl font-black uppercase text-xs tracking-widest">Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="h-12 flex-1 rounded-xl bg-destructive text-white font-black uppercase text-xs tracking-widest hover:bg-destructive/90 shadow-xl shadow-destructive/20">
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
