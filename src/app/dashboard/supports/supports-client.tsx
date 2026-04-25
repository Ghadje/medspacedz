"use client"

import * as React from "react"
import { 
  Search, 
  Layers, 
  BookOpen, 
  FileText, 
  ExternalLink, 
  ChevronRight, 
  GraduationCap, 
  Stethoscope, 
  School,
  Filter,
  X,
  Loader2,
  FileIcon,
  Video,
  FileQuestion,
  ChevronDown
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger 
} from "@/components/ui/sheet"
import axios from "axios"
import { cn } from "@/lib/utils"

interface SupportsClientProps {
  user: any
}

export function SupportsClient({ user }: SupportsClientProps) {
  const [specialties, setSpecialties] = React.useState<any[]>([])
  const [studyYears, setStudyYears] = React.useState<any[]>([])
  const [modules, setModules] = React.useState<any[]>([])
  const [supports, setSupports] = React.useState<any[]>([])
  
  const [selectedSpecialty, setSelectedSpecialty] = React.useState<string>("")
  const [selectedYear, setSelectedYear] = React.useState<string>("")
  const [selectedModule, setSelectedModule] = React.useState<string>("")
  
  const [loadingFilters, setLoadingFilters] = React.useState(true)
  const [loadingSupports, setLoadingSupports] = React.useState(false)
  const [moduleSearch, setModuleSearch] = React.useState("")
  const [supportSearch, setSupportSearch] = React.useState("")

  // Fetch initial specialties
  React.useEffect(() => {
    const fetchInitial = async () => {
      try {
        setLoadingFilters(true)
        const res = await axios.get("/api/student/supports/filters")
        setSpecialties(res.data.specialties)
        setLoadingFilters(false)
      } catch (error) {
        console.error("Error fetching specialties", error)
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
      return
    }

    const fetchYears = async () => {
      try {
        const res = await axios.get(`/api/student/supports/filters?specialtyId=${selectedSpecialty}`)
        setStudyYears(res.data.studyYears)
        setModules([])
        setSelectedYear("")
        setSelectedModule("")
        setSupports([])
      } catch (error) {
        console.error("Error fetching years", error)
      }
    }
    fetchYears()
  }, [selectedSpecialty])

  // Fetch modules when year changes
  React.useEffect(() => {
    if (!selectedYear) {
      setModules([])
      return
    }

    const fetchModules = async () => {
      try {
        const res = await axios.get(`/api/student/supports/filters?specialtyId=${selectedSpecialty}&studyYearId=${selectedYear}`)
        setModules(res.data.modules)
        setSelectedModule("")
        setSupports([])
      } catch (error) {
        console.error("Error fetching modules", error)
      }
    }
    fetchModules()
  }, [selectedYear, selectedSpecialty])

  // Fetch supports when module changes
  React.useEffect(() => {
    if (!selectedModule) {
      setSupports([])
      return
    }

    const fetchSupports = async () => {
      try {
        setLoadingSupports(true)
        const res = await axios.get(`/api/student/supports?moduleId=${selectedModule}&search=${supportSearch}`)
        setSupports(res.data)
        setLoadingSupports(false)
      } catch (error) {
        console.error("Error fetching supports", error)
        setLoadingSupports(false)
      }
    }
    fetchSupports()
  }, [selectedModule, supportSearch])

  const filteredModules = modules.filter(m => 
    m.title.toLowerCase().includes(moduleSearch.toLowerCase())
  )

  const filteredSupports = supports.filter(s => 
    s.title.toLowerCase().includes(supportSearch.toLowerCase()) ||
    (s.professorName && s.professorName.toLowerCase().includes(supportSearch.toLowerCase()))
  )

  const specialtyName = specialties.find(s => s.id === selectedSpecialty)?.name || "Spécialité"
  const yearName = studyYears.find(y => y.id === selectedYear)?.name || "Année"
  const moduleName = modules.find(m => m.id === selectedModule)?.title || "Module"
  return (
    <div className="flex-1 flex flex-col lg:flex-row p-4 lg:p-8 gap-6 lg:gap-8 overflow-hidden bg-[#F8FBFF]">
      {/* Mobile Filter Trigger */}
      <div className="lg:hidden shrink-0">
        <Sheet>
          <SheetTrigger asChild>
            <Button className="w-full h-14 rounded-2xl bg-white border-[#E5EAF3] text-[#082B66] font-black uppercase text-xs tracking-widest shadow-sm hover:bg-[#F3F7FF] flex items-center justify-between px-6">
              <div className="flex items-center gap-3">
                <Filter className="w-4 h-4 text-[#1368E8]" />
                {selectedModule ? moduleName : "Filtrer les cours"}
              </div>
              <ChevronDown className="w-4 h-4 text-[#082B66]/40" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-full sm:w-[400px] border-none bg-[#F8FBFF]">
            <div className="h-full p-4 overflow-y-auto">
              <div className="border-[#E5EAF3] rounded-[24px] shadow-sm overflow-hidden flex flex-col h-full bg-white border">
                <div className="p-6 border-b border-[#E5EAF3] bg-[#F8FBFF]/50">
                  <h3 className="text-lg font-black text-[#082B66] flex items-center gap-2">
                    <Layers className="w-5 h-5 text-[#1368E8]" />
                    Choisir vos cours
                  </h3>
                </div>
                <div className="p-6 space-y-6 flex-1 overflow-hidden flex flex-col">
                  {/* Step 1: Specialty */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-[#082B66]/40 ml-1">
                      Étape 1: Spécialité
                    </label>
                    <Select value={selectedSpecialty} onValueChange={(val) => setSelectedSpecialty(val || "")}>
                      <SelectTrigger className="h-12 rounded-xl border-[#E5EAF3] bg-[#F8FBFF] focus:ring-[#1368E8]/20 font-bold text-[#082B66]">
                        <SelectValue placeholder="Sélectionner...">
                          {specialties.find(s => s.id === selectedSpecialty)?.name}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {specialties.map(s => (
                          <SelectItem key={s.id} value={s.id} className="font-bold text-[#082B66]">
                            {s.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Step 2: Year */}
                  <div className="space-y-2">
                    <label className={cn(
                      "text-[10px] font-black uppercase tracking-widest ml-1",
                      !selectedSpecialty ? "text-[#082B66]/20" : "text-[#082B66]/40"
                    )}>
                      Étape 2: Année d'étude
                    </label>
                    <Select 
                      value={selectedYear} 
                      onValueChange={(val) => setSelectedYear(val || "")}
                      disabled={!selectedSpecialty}
                    >
                      <SelectTrigger className="h-12 rounded-xl border-[#E5EAF3] bg-[#F8FBFF] focus:ring-[#1368E8]/20 font-bold text-[#082B66] disabled:opacity-50">
                        <SelectValue placeholder={!selectedSpecialty ? "---" : "Sélectionner..."}>
                          {studyYears.find(y => y.id === selectedYear)?.name}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {studyYears.map(y => (
                          <SelectItem key={y.id} value={y.id} className="font-bold text-[#082B66]">
                            {y.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Step 3: Module Search & List */}
                  <div className="space-y-4 flex-1 overflow-hidden flex flex-col">
                    <div className="space-y-2">
                      <label className={cn(
                        "text-[10px] font-black uppercase tracking-widest ml-1",
                        !selectedYear ? "text-[#082B66]/20" : "text-[#082B66]/40"
                      )}>
                        Étape 3: Module
                      </label>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#082B66]/30" />
                        <Input 
                          placeholder="Rechercher un module..." 
                          className="h-11 pl-10 rounded-xl border-[#E5EAF3] bg-[#F8FBFF] focus-visible:ring-[#1368E8]/20 font-bold text-[#082B66] placeholder:text-[#082B66]/30 disabled:opacity-50"
                          value={moduleSearch}
                          onChange={(e) => setModuleSearch(e.target.value)}
                          disabled={!selectedYear}
                        />
                      </div>
                    </div>

                    <div className="flex-1 overflow-hidden border border-[#E5EAF3] rounded-xl bg-[#F8FBFF]/30">
                      <ScrollArea className="h-full max-h-[420px]">
                        {!selectedYear ? (
                          <div className="p-8 text-center">
                            <BookOpen className="w-8 h-8 text-[#082B66]/10 mx-auto mb-2" />
                            <p className="text-[10px] font-black text-[#082B66]/20 uppercase tracking-widest">
                              En attente de l'année
                            </p>
                          </div>
                        ) : filteredModules.length === 0 ? (
                          <div className="p-8 text-center">
                            <p className="text-[10px] font-black text-[#082B66]/20 uppercase tracking-widest">
                              Aucun module trouvé
                            </p>
                          </div>
                        ) : (
                          <div className="p-2 space-y-1">
                            {filteredModules.map(module => (
                              <button
                                key={module.id}
                                onClick={() => setSelectedModule(module.id)}
                                className={cn(
                                  "w-full flex items-center justify-between p-3 rounded-lg transition-all text-left group",
                                  selectedModule === module.id 
                                    ? "bg-[#1368E8] text-white shadow-lg shadow-[#1368E8]/20" 
                                    : "hover:bg-[#1368E8]/5 text-[#082B66]"
                                )}
                              >
                                <div className="flex items-center gap-3 overflow-hidden">
                                  <div className={cn(
                                    "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
                                    selectedModule === module.id ? "bg-white/20" : "bg-white border border-[#E5EAF3]"
                                  )}>
                                    <BookOpen className={cn(
                                      "w-4 h-4",
                                      selectedModule === module.id ? "text-white" : "text-[#1368E8]"
                                    )} />
                                  </div>
                                  <div className="flex flex-col min-w-0">
                                    <span className="text-xs font-black truncate">{module.title}</span>
                                    <span className={cn(
                                      "text-[9px] font-bold uppercase tracking-wider",
                                      selectedModule === module.id ? "text-white/60" : "text-[#082B66]/40"
                                    )}>
                                      {module.supportCount} support{module.supportCount > 1 ? 's' : ''}
                                    </span>
                                  </div>
                                </div>
                                <ChevronRight className={cn(
                                  "w-4 h-4 shrink-0 transition-transform",
                                  selectedModule === module.id ? "text-white translate-x-1" : "text-[#082B66]/20 group-hover:translate-x-1"
                                )} />
                              </button>
                            ))}
                          </div>
                        )}
                      </ScrollArea>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Left Filter Panel */}
      <div className="hidden lg:block w-[320px] shrink-0 h-full overflow-hidden">
        <Card className="border-[#E5EAF3] rounded-[24px] shadow-sm overflow-hidden flex flex-col h-full bg-white">
          <CardHeader className="p-6 border-b border-[#E5EAF3] bg-[#F8FBFF]/50">
            <CardTitle className="text-lg font-black text-[#082B66] flex items-center gap-2">
              <Layers className="w-5 h-5 text-[#1368E8]" />
              Choisir vos cours
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6 flex-1 overflow-hidden flex flex-col">
            {/* Step 1: Specialty */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-[#082B66]/40 ml-1">
                Étape 1: Spécialité
              </label>
              <Select value={selectedSpecialty} onValueChange={(val) => setSelectedSpecialty(val || "")}>
                <SelectTrigger className="h-12 rounded-xl border-[#E5EAF3] bg-[#F8FBFF] focus:ring-[#1368E8]/20 font-bold text-[#082B66]">
                  <SelectValue placeholder="Sélectionner...">
                    {specialties.find(s => s.id === selectedSpecialty)?.name}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {specialties.map(s => (
                    <SelectItem key={s.id} value={s.id} className="font-bold text-[#082B66]">
                      {s.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Step 2: Year */}
            <div className="space-y-2">
              <label className={cn(
                "text-[10px] font-black uppercase tracking-widest ml-1",
                !selectedSpecialty ? "text-[#082B66]/20" : "text-[#082B66]/40"
              )}>
                Étape 2: Année d'étude
              </label>
              <Select 
                value={selectedYear} 
                onValueChange={(val) => setSelectedYear(val || "")}
                disabled={!selectedSpecialty}
              >
                <SelectTrigger className="h-12 rounded-xl border-[#E5EAF3] bg-[#F8FBFF] focus:ring-[#1368E8]/20 font-bold text-[#082B66] disabled:opacity-50">
                  <SelectValue placeholder={!selectedSpecialty ? "---" : "Sélectionner..."}>
                    {studyYears.find(y => y.id === selectedYear)?.name}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {studyYears.map(y => (
                    <SelectItem key={y.id} value={y.id} className="font-bold text-[#082B66]">
                      {y.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Step 3: Module Search & List */}
            <div className="space-y-4 flex-1 overflow-hidden flex flex-col">
              <div className="space-y-2">
                <label className={cn(
                  "text-[10px] font-black uppercase tracking-widest ml-1",
                  !selectedYear ? "text-[#082B66]/20" : "text-[#082B66]/40"
                )}>
                  Étape 3: Module
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#082B66]/30" />
                  <Input 
                    placeholder="Rechercher un module..." 
                    className="h-11 pl-10 rounded-xl border-[#E5EAF3] bg-[#F8FBFF] focus-visible:ring-[#1368E8]/20 font-bold text-[#082B66] placeholder:text-[#082B66]/30 disabled:opacity-50"
                    value={moduleSearch}
                    onChange={(e) => setModuleSearch(e.target.value)}
                    disabled={!selectedYear}
                  />
                </div>
              </div>

              <div className="flex-1 overflow-hidden border border-[#E5EAF3] rounded-xl bg-[#F8FBFF]/30">
                <ScrollArea className="h-full max-h-[420px]">
                  {!selectedYear ? (
                    <div className="p-8 text-center">
                      <BookOpen className="w-8 h-8 text-[#082B66]/10 mx-auto mb-2" />
                      <p className="text-[10px] font-black text-[#082B66]/20 uppercase tracking-widest">
                        En attente de l'année
                      </p>
                    </div>
                  ) : filteredModules.length === 0 ? (
                    <div className="p-8 text-center">
                      <p className="text-[10px] font-black text-[#082B66]/20 uppercase tracking-widest">
                        Aucun module trouvé
                      </p>
                    </div>
                  ) : (
                    <div className="p-2 space-y-1">
                      {filteredModules.map(module => (
                        <button
                          key={module.id}
                          onClick={() => setSelectedModule(module.id)}
                          className={cn(
                            "w-full flex items-center justify-between p-3 rounded-lg transition-all text-left group",
                            selectedModule === module.id 
                              ? "bg-[#1368E8] text-white shadow-lg shadow-[#1368E8]/20" 
                              : "hover:bg-[#1368E8]/5 text-[#082B66]"
                          )}
                        >
                          <div className="flex items-center gap-3 overflow-hidden">
                            <div className={cn(
                              "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
                              selectedModule === module.id ? "bg-white/20" : "bg-white border border-[#E5EAF3]"
                            )}>
                              <BookOpen className={cn(
                                "w-4 h-4",
                                selectedModule === module.id ? "text-white" : "text-[#1368E8]"
                              )} />
                            </div>
                            <div className="flex flex-col min-w-0">
                              <span className="text-xs font-black truncate">{module.title}</span>
                              <span className={cn(
                                "text-[9px] font-bold uppercase tracking-wider",
                                selectedModule === module.id ? "text-white/60" : "text-[#082B66]/40"
                              )}>
                                {module.supportCount} support{module.supportCount > 1 ? 's' : ''}
                              </span>
                            </div>
                          </div>
                          <ChevronRight className={cn(
                            "w-4 h-4 shrink-0 transition-transform",
                            selectedModule === module.id ? "text-white translate-x-1" : "text-[#082B66]/20 group-hover:translate-x-1"
                          )} />
                        </button>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 min-w-0 flex flex-col h-full overflow-hidden">
        {!selectedModule ? (
          <div className="flex-1 flex items-center justify-center p-8">
            <Card className="max-w-md w-full border-dashed border-2 border-[#E5EAF3] bg-transparent rounded-[32px] p-12 text-center">
              <div className="w-20 h-20 rounded-3xl bg-white border border-[#E5EAF3] flex items-center justify-center mx-auto mb-6 shadow-sm">
                {!selectedSpecialty ? (
                  <GraduationCap className="w-10 h-10 text-[#1368E8]/20" />
                ) : !selectedYear ? (
                  <School className="w-10 h-10 text-[#1368E8]/20" />
                ) : (
                  <BookOpen className="w-10 h-10 text-[#1368E8]/20" />
                )}
              </div>
              <h3 className="text-xl font-black text-[#082B66] mb-2">
                {!selectedSpecialty ? "Bienvenue !" : "Presque là..."}
              </h3>
              <p className="text-sm font-bold text-[#082B66]/40 mb-8 leading-relaxed">
                {!selectedSpecialty 
                  ? "Sélectionnez une spécialité pour commencer à explorer vos cours." 
                  : !selectedYear 
                    ? "Sélectionnez votre année d'étude pour voir les modules disponibles." 
                    : "Sélectionnez un module pour voir les supports de cours disponibles."}
              </p>
              {!selectedSpecialty && (
                <div className="flex flex-wrap justify-center gap-2">
                  {specialties.slice(0, 3).map(s => (
                    <Badge key={s.id} variant="outline" className="rounded-lg py-1.5 px-3 border-[#E5EAF3] text-[10px] font-black uppercase tracking-widest text-[#082B66]/40 bg-white">
                      {s.name}
                    </Badge>
                  ))}
                </div>
              )}
            </Card>
          </div>
        ) : (
          <div className="flex-1 flex flex-col h-full overflow-hidden">
            {/* Header Content */}
            <div className="shrink-0 mb-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 bg-white p-6 rounded-[24px] border border-[#E5EAF3] shadow-sm">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Badge className="bg-[#1368E8]/10 text-[#1368E8] text-[9px] font-black uppercase tracking-widest border-none px-2">
                      {specialtyName}
                    </Badge>
                    <Badge className="bg-orange-50 text-orange-500 text-[9px] font-black uppercase tracking-widest border-none px-2">
                      {yearName}
                    </Badge>
                  </div>
                  <h2 className="text-2xl font-black text-[#082B66] tracking-tight">{moduleName}</h2>
                  <p className="text-xs font-bold text-[#082B66]/40 uppercase tracking-widest mt-1">
                    {supports.length} support{supports.length > 1 ? 's' : ''} disponible{supports.length > 1 ? 's' : ''}
                  </p>
                </div>
                <div className="relative w-full sm:w-[300px]">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#082B66]/30" />
                  <Input 
                    placeholder="Rechercher un support..." 
                    className="h-11 pl-10 rounded-xl border-[#E5EAF3] bg-[#F8FBFF] focus-visible:ring-[#1368E8]/20 font-bold text-[#082B66] placeholder:text-[#082B66]/30"
                    value={supportSearch}
                    onChange={(e) => setSupportSearch(e.target.value)}
                  />
                </div>
              </div>

              <Tabs defaultValue="all" className="w-full">
                <TabsList className="bg-transparent h-auto p-0 gap-8 border-b border-[#E5EAF3] rounded-none w-full justify-start overflow-x-auto no-scrollbar">
                  <TabsTrigger 
                    value="all" 
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#1368E8] data-[state=active]:bg-transparent bg-transparent text-[#082B66]/40 data-[state=active]:text-[#082B66] font-black uppercase text-[10px] tracking-widest px-0 pb-4 transition-all"
                  >
                    Supports de cours
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            {/* Support List */}
            <ScrollArea className="flex-1 -mx-4 px-4 pb-24">
              <div className="space-y-3">
                {loadingSupports ? (
                  Array.from({ length: 4 }).map((_, i) => (
                    <Card key={i} className="border-[#E5EAF3] rounded-2xl p-4 overflow-hidden shadow-sm animate-pulse">
                      <div className="flex items-center gap-4">
                        <Skeleton className="w-12 h-12 rounded-xl bg-[#E5EAF3]" />
                        <div className="flex-1 space-y-2">
                          <Skeleton className="h-4 w-1/3 bg-[#E5EAF3]" />
                          <Skeleton className="h-3 w-1/4 bg-[#E5EAF3]" />
                        </div>
                        <Skeleton className="h-10 w-24 rounded-lg bg-[#E5EAF3]" />
                      </div>
                    </Card>
                  ))
                ) : filteredSupports.length === 0 ? (
                  <div className="py-20 text-center">
                    <div className="w-16 h-16 rounded-3xl bg-white border border-[#E5EAF3] flex items-center justify-center mx-auto mb-4">
                      <FileQuestion className="w-8 h-8 text-[#082B66]/10" />
                    </div>
                    <p className="text-xs font-black text-[#082B66]/20 uppercase tracking-widest">
                      Aucun support trouvé pour ce module
                    </p>
                  </div>
                ) : (
                  filteredSupports.map((support) => (
                    <Card key={support.id} className="border-[#E5EAF3] rounded-2xl p-4 overflow-hidden shadow-sm hover:border-[#1368E8]/30 transition-all bg-white group/card">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                        <div className="flex items-center gap-4 flex-1">
                          <div className="w-12 h-12 rounded-xl bg-[#F8FBFF] border border-[#E5EAF3] flex items-center justify-center shrink-0 group-hover/card:bg-[#1368E8] group-hover/card:border-[#1368E8] transition-colors">
                            <FileText className="w-6 h-6 text-[#1368E8] group-hover/card:text-white transition-colors" />
                          </div>
                          <div className="min-w-0">
                            <h4 className="text-sm font-black text-[#082B66] truncate group-hover/card:text-[#1368E8] transition-colors">
                              {support.title}
                            </h4>
                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1">
                              {support.professorName && (
                                <span className="text-[10px] font-bold text-[#082B66]/40 uppercase tracking-wider flex items-center gap-1">
                                  <Stethoscope className="w-3 h-3" />
                                  {support.professorName}
                                </span>
                              )}
                              <Badge variant="outline" className="border-[#E5EAF3] text-[8px] font-black uppercase tracking-widest text-[#082B66]/30 px-1.5 h-4">
                                {moduleName}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 ml-auto sm:ml-0">
                          <Button 
                            className="h-10 px-4 rounded-xl bg-[#1368E8] hover:bg-[#082B66] text-white font-black uppercase text-[10px] tracking-widest shadow-md shadow-[#1368E8]/10 transition-all"
                            asChild
                          >
                            <a href={support.googleDriveUrl} target="_blank" rel="noopener noreferrer">
                              Ouvrir le support
                              <ExternalLink className="w-3 h-3 ml-2" />
                            </a>
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))
                )}
              </div>
            </ScrollArea>
          </div>
        )}
      </div>
    </div>
  )
}
