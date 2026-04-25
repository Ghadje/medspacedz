"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

const navLinks = [
  { name: "Fonctionnalités", href: "#features" },
  { name: "Spécifications", href: "#specs" },
  { name: "Que proposons-nous ?", href: "#offers" },
  { name: "Abonnements", href: "#pricing" },
  { name: "Démonstration", href: "#demo" },
  { name: "FAQ", href: "#faq" },
]

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 py-4",
        scrolled ? "bg-white/80 backdrop-blur-md border-b border-[#E5EAF3] shadow-sm py-3" : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-10 h-10 bg-[#1368E8] rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-[#1368E8]/20">
            M
          </div>
          <span className="font-bold text-xl tracking-tight hidden md:block text-[#082B66]">
            MedSpace <span className="text-[#FDB022]">OG</span>
          </span>
        </Link>

        <div className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-sm font-semibold text-[#082B66] hover:text-[#1368E8] transition-colors"
            >
              {link.name}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <Link href="/login">
            <Button variant="ghost" className="hidden sm:inline-flex text-[#082B66] font-semibold hover:text-[#1368E8]">
              Connexion
            </Button>
          </Link>
          <Link href="/signup">
            <Button className="bg-[#1368E8] hover:bg-[#1368E8]/90 text-white rounded-xl px-6 shadow-lg shadow-[#1368E8]/20 transition-all active:scale-95">
              S'inscrire
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  )
}
