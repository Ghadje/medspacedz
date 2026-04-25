"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        toast.error("Identifiants invalides")
      } else {
        toast.success("Connexion réussie !")
        router.push("/dashboard")
      }
    } catch (error) {
      toast.error("Une erreur est survenue")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FBFF] px-4 relative overflow-hidden">
      {/* Decorative Background Shapes */}
      <div className="absolute top-0 left-0 w-full h-full opacity-30 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#1368E8]/10 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#FDB022]/10 rounded-full blur-[100px]"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
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
            <CardTitle className="text-3xl font-black text-[#082B66]">Bon retour !</CardTitle>
            <CardDescription className="text-[#082B66]/60 font-medium text-base">
              Connectez-vous pour continuer votre apprentissage.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8 pt-0">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="email" className="text-xs font-black text-[#082B66] uppercase tracking-widest ml-1">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="nom@exemple.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-14 bg-[#F3F7FF] border-none rounded-2xl font-bold text-[#082B66] placeholder:text-[#082B66]/30 focus-visible:ring-2 focus-visible:ring-[#1368E8]/20 transition-all px-6"
                />
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between ml-1">
                  <Label htmlFor="password" className="text-xs font-black text-[#082B66] uppercase tracking-widest">Mot de passe</Label>
                  <Link href="#" className="text-xs font-black text-[#1368E8] uppercase hover:underline">
                    Oublié ?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-14 bg-[#F3F7FF] border-none rounded-2xl font-bold text-[#082B66] placeholder:text-[#082B66]/30 focus-visible:ring-2 focus-visible:ring-[#1368E8]/20 transition-all px-6"
                />
              </div>
              <div className="flex items-center space-x-3 ml-1">
                <Checkbox id="remember" className="rounded-md border-[#E5EAF3] data-[state=checked]:bg-[#1368E8] data-[state=checked]:border-[#1368E8]" />
                <label
                  htmlFor="remember"
                  className="text-sm font-bold text-[#082B66]/60 leading-none cursor-pointer"
                >
                  Se souvenir de moi
                </label>
              </div>
              <Button type="submit" className="w-full h-14 rounded-2xl bg-[#1368E8] hover:bg-[#1368E8]/90 text-white font-black text-sm uppercase tracking-widest shadow-xl shadow-[#1368E8]/20 transition-all active:scale-95" disabled={loading}>
                {loading ? "Connexion..." : "Se connecter"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-6 pb-8">
            <div className="h-px w-full bg-[#E5EAF3]"></div>
            <div className="text-center text-sm font-bold text-[#082B66]/60">
              Vous n'avez pas de compte ?{" "}
              <Link href="/signup" className="text-[#1368E8] font-black hover:underline uppercase text-xs tracking-widest ml-1">
                S'inscrire
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
