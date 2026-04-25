"use client"

import * as React from "react"
import { 
  FileText, 
  ExternalLink, 
  Video, 
  Layers, 
  Search,
  BookOpen,
  User,
  Filter,
  Clock,
  ChevronRight
} from "lucide-react"
import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import axios from "axios"
import { toast } from "sonner"

export default function StudentCoursesPage() {
  const [modules, setModules] = React.useState<any[]>([])
  const [activeModule, setActiveModule] = React.useState<string | null>(null)
  const [supports, setSupports] = React.useState<any[]>([])
  const [loading, setLoading] = React.useState(true)
  const [search, setSearch] = React.useState("")

  const fetchModules = React.useCallback(async () => {
    try {
      const response = await axios.get("/api/data/modules")
      setModules(response.data)
      if (response.data.length > 0 && !activeModule) {
        setActiveModule(response.data[0].id)
      }
    } catch (error) {
      console.error("Error fetching modules", error)
    }
  }, [activeModule])

  const fetchSupports = React.useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (activeModule) params.append("moduleId", activeModule)
      if (search) params.append("search", search)
      
      const response = await axios.get(`/api/course-supports?${params.toString()}`)
      setSupports(response.data)
    } catch (error) {
      toast.error("Erreur lors du chargement des supports")
    } finally {
      setLoading(false)
    }
  }, [activeModule, search])

  React.useEffect(() => {
    fetchModules()
  }, [fetchModules])

  React.useEffect(() => {
    if (activeModule) fetchSupports()
  }, [activeModule, fetchSupports])

  const currentModule = modules.find(m => m.id === activeModule)

  const ModuleList = () => (
    <div className="flex flex-col h-full bg-white">
      <CardHeader className="p-6 border-b border-[#E5EAF3]">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#082B66]/30 group-focus-within:text-[#1368E8] transition-colors" />
          <Input 
            placeholder="Rechercher un module" 
            className="pl-10 h-11 bg-[#F3F7FF] border-none rounded-xl font-bold text-[#082B66] text-sm focus:ring-2 focus:ring-[#1368E8]/20 transition-all" 
          />
        </div>
      </CardHeader>
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-2">
          {modules.map((module) => (
            <button
              key={module.id}
              onClick={() => setActiveModule(module.id)}
              className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all text-left group ${
                activeModule === module.id 
                  ? "bg-[#1368E8] text-white shadow-lg shadow-[#1368E8]/20" 
                  : "hover:bg-[#F3F7FF] text-[#082B66]/60"
              }`}
            >
              <div className="flex items-center gap-3">
                <Layers className={`w-5 h-5 transition-colors ${activeModule === module.id ? "text-white" : "text-[#082B66]/30 group-hover:text-[#1368E8]"}`} />
                <span className="font-bold text-sm">{module.title}</span>
              </div>
              <ChevronRight className={`w-4 h-4 transition-transform ${activeModule === module.id ? "rotate-90 text-white" : "text-[#082B66]/20 group-hover:translate-x-1"}`} />
            </button>
          ))}
        </div>
      </ScrollArea>
    </div>
  )

  return (
    <div className="flex flex-col lg:flex-row h-full lg:h-[calc(100vh-160px)] gap-8">
      {/* Desktop Sidebar */}
      <Card className="hidden lg:flex w-80 flex-col border-[#E5EAF3] bg-white rounded-[32px] overflow-hidden shadow-sm">
        <ModuleList />
      </Card>

      <div className="flex-1 flex flex-col gap-8 overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            {/* Mobile Module Trigger */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden h-12 w-12 rounded-2xl bg-white border border-[#E5EAF3] text-[#082B66] shadow-sm hover:bg-[#F3F7FF] transition-all">
                  <Filter className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-[300px] border-none shadow-2xl">
                <ModuleList />
              </SheetContent>
            </Sheet>
            
            <div>
              <h2 className="text-3xl font-black text-[#082B66]">{currentModule?.title || "Sélectionnez un module"}</h2>
              <p className="text-[#082B66]/60 font-bold text-xs uppercase tracking-widest mt-1">
                {supports.length} support{supports.length > 1 ? 's' : ''} disponible{supports.length > 1 ? 's' : ''}
              </p>
            </div>
          </div>
          
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#082B66]/30" />
            <Input 
              placeholder="Rechercher un support..." 
              className="pl-10 h-12 rounded-2xl border-[#E5EAF3] bg-white focus:bg-[#F8FBFF] transition-all"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <Tabs defaultValue="supports" className="flex-1 flex flex-col overflow-hidden">
          <TabsList className="bg-[#F3F7FF] p-1.5 rounded-2xl w-fit">
            <TabsTrigger value="supports" className="rounded-xl px-6 py-2.5 font-black text-[10px] uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:text-[#1368E8] data-[state=active]:shadow-sm transition-all gap-2">
              <FileText className="w-4 h-4" /> Supports de cours
            </TabsTrigger>
          </TabsList>

          <TabsContent value="supports" className="flex-1 overflow-hidden mt-8">
            <ScrollArea className="h-full pr-0 md:pr-4">
              <div className="grid grid-cols-1 gap-4 pb-10">
                {loading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="h-24 w-full bg-[#F3F7FF] rounded-2xl animate-pulse" />
                  ))
                ) : supports.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 text-[#082B66]/30">
                    <BookOpen className="w-12 h-12 mb-4 opacity-20" />
                    <p className="font-bold uppercase text-xs tracking-widest">Aucun support trouvé</p>
                  </div>
                ) : (
                  supports.map((support) => (
                    <div 
                      key={support.id} 
                      className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 p-4 sm:p-6 rounded-[24px] bg-white border border-[#E5EAF3] hover:border-[#1368E8]/30 hover:shadow-lg transition-all group"
                    >
                      <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-[#F3F7FF] flex items-center justify-center font-black text-[#1368E8] border border-[#E5EAF3] text-lg sm:text-xl shadow-sm group-hover:bg-[#1368E8] group-hover:text-white transition-all shrink-0">
                        {support.fileType === "PDF" ? "PDF" : support.fileType === "VIDEO" ? "MP4" : "DOC"}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="text-base sm:text-lg font-black text-[#082B66] group-hover:text-[#1368E8] transition-colors mb-1 truncate">
                          {support.title}
                        </div>
                        <div className="flex flex-wrap items-center gap-2 sm:gap-4">
                          <span className="flex items-center gap-1.5 text-[10px] font-bold text-[#082B66]/40 uppercase tracking-widest">
                            <User className="w-3 h-3 text-[#1368E8]" /> {support.professorName || "Inconnu"}
                          </span>
                          <span className="w-1.5 h-1.5 rounded-full bg-[#E5EAF3]"></span>
                          <Badge variant="outline" className="text-[9px] font-black uppercase tracking-widest border-[#E5EAF3] bg-[#F8FBFF]">
                            {support.module?.title}
                          </Badge>
                          {support.fileSize && (
                            <>
                              <span className="w-1.5 h-1.5 rounded-full bg-[#E5EAF3]"></span>
                              <span className="text-[10px] font-black text-[#12B76A] uppercase tracking-widest">{support.fileSize}</span>
                            </>
                          )}
                        </div>
                      </div>

                      <Button 
                        size="lg" 
                        asChild
                        className="w-full sm:w-auto rounded-xl h-12 sm:h-14 px-8 font-black text-xs uppercase tracking-widest bg-[#F3F7FF] text-[#082B66] hover:bg-[#1368E8] hover:text-white transition-all shadow-sm active:scale-95"
                      >
                        <a href={support.googleDriveUrl} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="w-4 h-4 mr-2" /> Ouvrir le support
                        </a>
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
