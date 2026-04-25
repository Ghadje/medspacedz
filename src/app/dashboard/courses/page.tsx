"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { 
  FileText, 
  ExternalLink, 
  Video, 
  Layers, 
  Search,
  BookOpen,
  User,
  Filter
} from "lucide-react"
import { useState } from "react"

const modules = [
  { id: "m1", title: "Anatomie", count: 12 },
  { id: "m2", title: "Embryologie", count: 8 },
  { id: "m3", title: "Physiologie", count: 15 },
  { id: "m4", title: "Pharmacologie", count: 20 },
  { id: "m5", title: "Cardio-Respiratoire", count: 10 },
]

const courses = [
  { 
    id: "c1", 
    title: "Introduction d'Embryologie", 
    professor: "Pr. Benyoucef", 
    module: "Embryologie",
    driveUrl: "https://drive.google.com/...",
    thumbnail: "https://images.unsplash.com/photo-1579154235602-3c2c2aa5d72e?q=80&w=2070&auto=format&fit=crop"
  },
  { 
    id: "c2", 
    title: "Cycle Cellulaire : Mitose & Méiose", 
    professor: "Pr. Mansouri", 
    module: "Embryologie",
    driveUrl: "https://drive.google.com/...",
    thumbnail: "https://images.unsplash.com/photo-1530026405186-ed1f139313f8?q=80&w=2070&auto=format&fit=crop"
  },
  { 
    id: "c3", 
    title: "Ovogenèse & Ovulation et Ovocyte", 
    professor: "Pr. Mansouri", 
    module: "Embryologie",
    driveUrl: "https://drive.google.com/...",
    thumbnail: "https://images.unsplash.com/photo-1559757175-5700dde675bc?q=80&w=2070&auto=format&fit=crop"
  },
]

export default function CoursesPage() {
  const [activeModule, setActiveModule] = useState("Embryologie")

  const ModuleList = () => (
    <div className="flex flex-col h-full">
      <CardHeader className="p-6 border-b border-[#E5EAF3]">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#082B66]/30 group-focus-within:text-[#1368E8] transition-colors" />
          <Input placeholder="Rechercher un module" className="pl-10 h-11 bg-[#F3F7FF] border-none rounded-xl font-bold text-[#082B66] text-sm" />
        </div>
      </CardHeader>
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-2">
          {modules.map((module) => (
            <button
              key={module.id}
              onClick={() => setActiveModule(module.title)}
              className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all text-left group ${
                activeModule === module.title 
                  ? "bg-[#1368E8] text-white shadow-lg shadow-[#1368E8]/20" 
                  : "hover:bg-[#F3F7FF] text-[#082B66]/60"
              }`}
            >
              <div className="flex items-center gap-3">
                <Layers className={`w-5 h-5 transition-colors ${activeModule === module.title ? "text-white" : "text-[#082B66]/30 group-hover:text-[#1368E8]"}`} />
                <span className="font-bold text-sm">{module.title}</span>
              </div>
              <Badge variant="secondary" className={`text-[10px] h-6 rounded-full font-black ${activeModule === module.title ? "bg-white/20 text-white border-none" : "bg-[#F3F7FF] text-[#082B66]/40"}`}>{module.count}</Badge>
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
              <h2 className="text-3xl font-black text-[#082B66]">{activeModule}</h2>
              <p className="text-[#082B66]/60 font-bold text-sm uppercase tracking-widest mt-1">8 cours disponibles</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
            <Button variant="outline" className="rounded-2xl border-[#E5EAF3] text-[#082B66] font-black text-xs uppercase tracking-widest whitespace-nowrap px-6 h-12 hover:bg-[#F3F7FF] transition-all">Dernier ajouté</Button>
            <Button variant="outline" className="rounded-2xl border-[#E5EAF3] text-[#082B66] font-black text-xs uppercase tracking-widest whitespace-nowrap px-6 h-12 hover:bg-[#F3F7FF] transition-all">Ordre alphabétique</Button>
          </div>
        </div>

        <Tabs defaultValue="supports" className="flex-1 flex flex-col overflow-hidden">
          <TabsList className="bg-[#F3F7FF] p-1.5 rounded-2xl w-fit flex-wrap">
            <TabsTrigger value="supports" className="rounded-xl px-6 py-2.5 font-black text-xs uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:text-[#1368E8] data-[state=active]:shadow-sm transition-all gap-2">
              <FileText className="w-4 h-4" /> Support
            </TabsTrigger>
            <TabsTrigger value="reorg" className="rounded-xl px-6 py-2.5 font-black text-xs uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:text-[#1368E8] data-[state=active]:shadow-sm transition-all gap-2">
              <Layers className="w-4 h-4" /> Réorg
            </TabsTrigger>
            <TabsTrigger value="video" className="rounded-xl px-6 py-2.5 font-black text-xs uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:text-[#1368E8] data-[state=active]:shadow-sm transition-all gap-2">
              <Video className="w-4 h-4" /> Vidéo
            </TabsTrigger>
          </TabsList>

          <TabsContent value="supports" className="flex-1 overflow-hidden mt-8">
            <ScrollArea className="h-full pr-0 md:pr-4">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8 pb-10">
                {courses.map((course) => (
                  <Card key={course.id} className="overflow-hidden border-[#E5EAF3] bg-white rounded-[32px] group hover:border-[#1368E8]/30 transition-all shadow-sm hover:shadow-xl duration-300">
                    <div className="aspect-[16/10] relative overflow-hidden">
                      <img
                        src={course.thumbnail}
                        alt={course.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-[#082B66]/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <Button className="rounded-2xl bg-[#1368E8] hover:bg-[#1368E8]/90 text-white font-black text-xs uppercase tracking-widest px-8 h-12 shadow-xl shadow-[#1368E8]/40">
                          <BookOpen className="w-4 h-4 mr-2" /> Ouvrir
                        </Button>
                      </div>
                      <Badge className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-[#082B66] border-none font-black text-[10px] uppercase tracking-widest px-3 py-1.5 rounded-full">
                        {course.module}
                      </Badge>
                    </div>
                    <CardHeader className="p-6">
                      <CardTitle className="text-xl font-black text-[#082B66] leading-tight line-clamp-2 min-h-[3.5rem]">{course.title}</CardTitle>
                      <CardDescription className="flex items-center gap-2 mt-4 text-[#082B66]/40 font-bold uppercase text-[10px] tracking-widest">
                        <User className="w-4 h-4 text-[#1368E8]" /> {course.professor}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-6 pt-0">
                      <div className="flex items-center justify-between border-t border-[#E5EAF3] pt-6 mt-2">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center text-red-500 font-black text-[10px]">PDF</div>
                          <span className="text-[10px] font-black text-[#082B66]/30 uppercase tracking-widest">2.4 MB</span>
                        </div>
                        <Button variant="ghost" size="sm" className="h-10 rounded-xl px-4 text-[#1368E8] font-black text-[10px] uppercase tracking-widest gap-2 hover:bg-[#1368E8]/5 transition-all" asChild>
                          <a href={course.driveUrl} target="_blank">
                            <ExternalLink className="w-4 h-4" /> Drive
                          </a>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="reorg" className="flex-1 mt-8">
            <div className="flex flex-col items-center justify-center h-full text-[#082B66]/30 gap-6 bg-[#F8FBFF] rounded-[32px] border-2 border-dashed border-[#E5EAF3] p-10 text-center">
              <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center shadow-sm">
                <Layers className="w-10 h-10 opacity-20" />
              </div>
              <div>
                <h3 className="text-xl font-black text-[#082B66] mb-2">Pas de réorganisation</h3>
                <p className="font-bold text-sm max-w-xs mx-auto">Aucune réorganisation n'est disponible pour ce module pour le moment.</p>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="video" className="flex-1 mt-8">
            <div className="flex flex-col items-center justify-center h-full text-[#082B66]/30 gap-6 bg-[#F8FBFF] rounded-[32px] border-2 border-dashed border-[#E5EAF3] p-10 text-center">
              <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center shadow-sm">
                <Video className="w-10 h-10 opacity-20" />
              </div>
              <div>
                <h3 className="text-xl font-black text-[#082B66] mb-2">Pas de vidéo</h3>
                <p className="font-bold text-sm max-w-xs mx-auto">Aucune vidéo n'est disponible pour ce module pour le moment.</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
