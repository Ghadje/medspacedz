"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  FileText, 
  ExternalLink, 
  Video, 
  Layers, 
  Search,
  BookOpen,
  User
} from "lucide-react"

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
  return (
    <div className="flex h-[calc(100vh-160px)] gap-8">
      <Card className="w-80 flex flex-col border-border/50">
        <CardHeader className="p-4 border-b border-border/50">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Rechercher un module" className="pl-9 h-9 text-sm" />
          </div>
        </CardHeader>
        <ScrollArea className="flex-1">
          <div className="p-2 space-y-1">
            {modules.map((module) => (
              <button
                key={module.id}
                className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-muted text-sm transition-colors text-left group"
              >
                <div className="flex items-center gap-3">
                  <Layers className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  <span className="font-medium">{module.title}</span>
                </div>
                <Badge variant="secondary" className="text-[10px] h-5">{module.count}</Badge>
              </button>
            ))}
          </div>
        </ScrollArea>
      </Card>

      <div className="flex-1 flex flex-col gap-6 overflow-hidden">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Embryologie</h2>
            <p className="text-muted-foreground text-sm">8 cours disponibles dans ce module</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="rounded-lg">Dernier ajouté</Button>
            <Button variant="outline" size="sm" className="rounded-lg">Ordre alphabétique</Button>
          </div>
        </div>

        <Tabs defaultValue="supports" className="flex-1 flex flex-col overflow-hidden">
          <TabsList className="bg-muted/50 p-1 rounded-xl w-fit">
            <TabsTrigger value="supports" className="rounded-lg gap-2">
              <FileText className="w-4 h-4" /> Support de cours
            </TabsTrigger>
            <TabsTrigger value="reorg" className="rounded-lg gap-2">
              <Layers className="w-4 h-4" /> Réorganisation
            </TabsTrigger>
            <TabsTrigger value="video" className="rounded-lg gap-2">
              <Video className="w-4 h-4" /> Vidéo
            </TabsTrigger>
          </TabsList>

          <TabsContent value="supports" className="flex-1 overflow-hidden mt-6">
            <ScrollArea className="h-full pr-4">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 pb-10">
                {courses.map((course) => (
                  <Card key={course.id} className="overflow-hidden border-border/50 group hover:border-primary/50 transition-all shadow-md hover:shadow-xl">
                    <div className="aspect-video relative overflow-hidden">
                      <img
                        src={course.thumbnail}
                        alt={course.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <Button size="sm" className="rounded-lg bg-primary hover:bg-primary/90">
                          <BookOpen className="w-4 h-4 mr-2" /> Ouvrir
                        </Button>
                      </div>
                    </div>
                    <CardHeader className="p-4">
                      <CardTitle className="text-lg line-clamp-1">{course.title}</CardTitle>
                      <CardDescription className="flex items-center gap-2 mt-1">
                        <User className="w-3 h-3" /> {course.professor}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">PDF</Badge>
                        <Button variant="ghost" size="sm" className="h-8 text-xs gap-1 hover:text-primary" asChild>
                          <a href={course.driveUrl} target="_blank">
                            <ExternalLink className="w-3 h-3" /> Drive
                          </a>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="reorg" className="flex-1 mt-6">
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground gap-4 bg-muted/20 rounded-2xl border border-dashed border-border">
              <Layers className="w-12 h-12 opacity-20" />
              <p>Aucune réorganisation disponible pour ce module.</p>
            </div>
          </TabsContent>
          
          <TabsContent value="video" className="flex-1 mt-6">
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground gap-4 bg-muted/20 rounded-2xl border border-dashed border-border">
              <Video className="w-12 h-12 opacity-20" />
              <p>Aucune vidéo disponible pour ce module.</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
