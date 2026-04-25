"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { signup } from "./actions"

export default function SignupPage() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    specialty: "",
    faculty: "",
    studyYear: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (formData.password !== formData.confirmPassword) {
      toast.error("Les mots de passe ne correspondent pas")
      return
    }

    setLoading(true)

    try {
      const result = await signup({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        specialtyId: formData.specialty,
      })

      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success("Compte créé avec succès ! Connectez-vous maintenant.")
        router.push("/login")
      }
    } catch (error) {
      toast.error("Une erreur est survenue")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen py-20 flex items-center justify-center bg-[#F8FBFF] px-4 relative overflow-hidden">
      {/* Decorative Background Shapes */}
      <div className="absolute top-0 left-0 w-full h-full opacity-30 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#1368E8]/10 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#FDB022]/10 rounded-full blur-[100px]"></div>
      </div>

      <div className="w-full max-w-2xl relative z-10">
        <Link href="/" className="flex items-center justify-center gap-3 mb-12 group transition-transform hover:scale-105">
          <div className="w-12 h-12 bg-[#1368E8] rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-xl shadow-[#1368E8]/20">
            M
          </div>
          <span className="font-black text-3xl tracking-tight text-[#082B66]">
            MedSpace <span className="text-[#FDB022]">AI</span>
          </span>
        </Link>
        
        <Card className="bg-white border-[#E5EAF3] shadow-2xl rounded-[32px] overflow-hidden p-4">
          <CardHeader className="space-y-4 text-center pt-8">
            <CardTitle className="text-3xl font-black text-[#082B66]">Créer un compte</CardTitle>
            <CardDescription className="text-[#082B66]/60 font-medium text-base max-w-sm mx-auto">
              Rejoignez des milliers d'étudiants en médecine en Algérie sur MedSpace AI.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8 pt-0">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label htmlFor="name" className="text-xs font-black text-[#082B66] uppercase tracking-widest ml-1">Nom complet</Label>
                  <Input
                    id="name"
                    placeholder="Ahmed Benali"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="h-14 bg-[#F3F7FF] border-none rounded-2xl font-bold text-[#082B66] placeholder:text-[#082B66]/30 focus-visible:ring-2 focus-visible:ring-[#1368E8]/20 transition-all px-6"
                  />
                </div>
                <div className="space-y-3">
                  <Label htmlFor="email" className="text-xs font-black text-[#082B66] uppercase tracking-widest ml-1">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="ahmed@exemple.com"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="h-14 bg-[#F3F7FF] border-none rounded-2xl font-bold text-[#082B66] placeholder:text-[#082B66]/30 focus-visible:ring-2 focus-visible:ring-[#1368E8]/20 transition-all px-6"
                  />
                </div>
                <div className="space-y-3">
                  <Label htmlFor="password" className="text-xs font-black text-[#082B66] uppercase tracking-widest ml-1">Mot de passe</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    className="h-14 bg-[#F3F7FF] border-none rounded-2xl font-bold text-[#082B66] placeholder:text-[#082B66]/30 focus-visible:ring-2 focus-visible:ring-[#1368E8]/20 transition-all px-6"
                  />
                </div>
                <div className="space-y-3">
                  <Label htmlFor="confirmPassword" className="text-xs font-black text-[#082B66] uppercase tracking-widest ml-1">Confirmer</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    required
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                    className="h-14 bg-[#F3F7FF] border-none rounded-2xl font-bold text-[#082B66] placeholder:text-[#082B66]/30 focus-visible:ring-2 focus-visible:ring-[#1368E8]/20 transition-all px-6"
                  />
                </div>
                <div className="space-y-3">
                  <Label htmlFor="phone" className="text-xs font-black text-[#082B66] uppercase tracking-widest ml-1">Téléphone</Label>
                  <Input
                    id="phone"
                    placeholder="0555 12 34 56"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="h-14 bg-[#F3F7FF] border-none rounded-2xl font-bold text-[#082B66] placeholder:text-[#082B66]/30 focus-visible:ring-2 focus-visible:ring-[#1368E8]/20 transition-all px-6"
                  />
                </div>
                <div className="space-y-3">
                  <Label className="text-xs font-black text-[#082B66] uppercase tracking-widest ml-1">Spécialité</Label>
                  <Select onValueChange={(v) => setFormData({...formData, specialty: v as string})}>
                    <SelectTrigger className="h-14 bg-[#F3F7FF] border-none rounded-2xl font-bold text-[#082B66] focus:ring-2 focus:ring-[#1368E8]/20 px-6">
                      <SelectValue placeholder="Sélectionner" />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl border-[#E5EAF3]">
                      <SelectItem value="medecine" className="font-bold">Médecine</SelectItem>
                      <SelectItem value="dentaire" className="font-bold">Médecine Dentaire</SelectItem>
                      <SelectItem value="pharmacie" className="font-bold">Pharmacie</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-3">
                  <Label htmlFor="faculty" className="text-xs font-black text-[#082B66] uppercase tracking-widest ml-1">Faculté</Label>
                  <Input
                    id="faculty"
                    placeholder="Alger, Oran, etc."
                    value={formData.faculty}
                    onChange={(e) => setFormData({...formData, faculty: e.target.value})}
                    className="h-14 bg-[#F3F7FF] border-none rounded-2xl font-bold text-[#082B66] placeholder:text-[#082B66]/30 focus-visible:ring-2 focus-visible:ring-[#1368E8]/20 transition-all px-6"
                  />
                </div>
                <div className="space-y-3">
                  <Label className="text-xs font-black text-[#082B66] uppercase tracking-widest ml-1">Année d'étude</Label>
                  <Select onValueChange={(v) => setFormData({...formData, studyYear: v as string})}>
                    <SelectTrigger className="h-14 bg-[#F3F7FF] border-none rounded-2xl font-bold text-[#082B66] focus:ring-2 focus:ring-[#1368E8]/20 px-6">
                      <SelectValue placeholder="Sélectionner" />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl border-[#E5EAF3]">
                      <SelectItem value="1" className="font-bold">1ère année</SelectItem>
                      <SelectItem value="2" className="font-bold">2ème année</SelectItem>
                      <SelectItem value="3" className="font-bold">3ème année</SelectItem>
                      <SelectItem value="4" className="font-bold">4ème année</SelectItem>
                      <SelectItem value="5" className="font-bold">5ème année</SelectItem>
                      <SelectItem value="6" className="font-bold">6ème année</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 ml-1">
                <Checkbox id="terms" required className="rounded-md border-[#E5EAF3] data-[state=checked]:bg-[#1368E8] data-[state=checked]:border-[#1368E8]" />
                <label
                  htmlFor="terms"
                  className="text-sm font-bold text-[#082B66]/60 leading-none cursor-pointer"
                >
                  J'accepte les <Link href="#" className="text-[#1368E8] hover:underline font-black">conditions d'utilisation</Link>
                </label>
              </div>
              
              <Button type="submit" className="w-full h-16 rounded-2xl bg-[#1368E8] hover:bg-[#1368E8]/90 text-white font-black text-sm uppercase tracking-widest shadow-xl shadow-[#1368E8]/20 transition-all active:scale-95" disabled={loading}>
                {loading ? "Inscription en cours..." : "Créer mon compte"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-6 pb-8">
            <div className="h-px w-full bg-[#E5EAF3]"></div>
            <div className="text-center text-sm font-bold text-[#082B66]/60">
              Vous avez déjà un compte ?{" "}
              <Link href="/login" className="text-[#1368E8] font-black hover:underline uppercase text-xs tracking-widest ml-1">
                Se connecter
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
