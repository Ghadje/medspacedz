import Link from "next/link"
import { Mail, MapPin, Phone } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-[#F8FBFF] border-t border-[#E5EAF3] pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-16">
          <div className="space-y-8">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-12 h-12 bg-[#1368E8] rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-xl shadow-[#1368E8]/20">
                M
              </div>
              <span className="font-black text-2xl tracking-tight text-[#082B66]">
                MedSpace <span className="text-[#FDB022]">AI</span>
              </span>
            </Link>
            <p className="text-[#082B66]/60 leading-relaxed font-medium">
              La plateforme d'apprentissage médical numéro 1 en Algérie. Conçue pour l'excellence académique des futurs médecins.
            </p>
            <div className="flex items-center gap-4">
              <SocialLink href="#" icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>} />
              <SocialLink href="#" icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>} />
              <SocialLink href="#" icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>} />
            </div>
          </div>

          <div>
            <h4 className="font-black text-[#082B66] text-lg mb-8 uppercase tracking-widest">Plateforme</h4>
            <ul className="space-y-4">
              <FooterLink href="#features">Fonctionnalités</FooterLink>
              <FooterLink href="#offers">Que proposons-nous ?</FooterLink>
              <FooterLink href="#pricing">Abonnements</FooterLink>
              <FooterLink href="#demo">Démonstration</FooterLink>
            </ul>
          </div>

          <div>
            <h4 className="font-black text-[#082B66] text-lg mb-8 uppercase tracking-widest">Légal</h4>
            <ul className="space-y-4">
              <FooterLink href="#">Conditions d'utilisation</FooterLink>
              <FooterLink href="#">Politique de confidentialité</FooterLink>
              <FooterLink href="#">Mentions légales</FooterLink>
              <FooterLink href="#">Cookies</FooterLink>
            </ul>
          </div>

          <div>
            <h4 className="font-black text-[#082B66] text-lg mb-8 uppercase tracking-widest">Contact</h4>
            <ul className="space-y-6">
              <li className="flex items-start gap-4 group cursor-pointer">
                <div className="w-10 h-10 rounded-xl bg-[#1368E8]/10 flex items-center justify-center shrink-0 group-hover:bg-[#1368E8] group-hover:text-white transition-all">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-black text-[#082B66]/40 uppercase">Email</div>
                  <div className="text-[#082B66] font-bold">contact@medspace.dz</div>
                </div>
              </li>
              <li className="flex items-start gap-4 group cursor-pointer">
                <div className="w-10 h-10 rounded-xl bg-[#12B76A]/10 flex items-center justify-center shrink-0 group-hover:bg-[#12B76A] group-hover:text-white transition-all">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-black text-[#082B66]/40 uppercase">Téléphone</div>
                  <div className="text-[#082B66] font-bold">+213 555 00 11 22</div>
                </div>
              </li>
              <li className="flex items-start gap-4 group cursor-pointer">
                <div className="w-10 h-10 rounded-xl bg-[#FDB022]/10 flex items-center justify-center shrink-0 group-hover:bg-[#FDB022] group-hover:text-white transition-all">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-black text-[#082B66]/40 uppercase">Siège</div>
                  <div className="text-[#082B66] font-bold">Alger, Algérie</div>
                </div>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="pt-12 border-t border-[#E5EAF3] flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-[#082B66]/40 font-bold text-sm italic">
            © {new Date().getFullYear()} MedSpace AI. Tous droits réservés.
          </p>
          <Link 
            href="https://linktr.ee/ghadje" 
            target="_blank"
            className="text-[#082B66]/40 hover:text-[#1368E8] font-bold text-sm transition-colors"
          >
            Designed and developed by <span className="text-[#1368E8]">Oussama Ghedjati</span>
          </Link>
        </div>
      </div>
    </footer>
  )
}

function SocialLink({ href, icon }: { href: string, icon: React.ReactNode }) {
  return (
    <Link href={href} className="w-12 h-12 rounded-2xl bg-white border border-[#E5EAF3] flex items-center justify-center text-[#082B66] hover:bg-[#1368E8] hover:text-white hover:border-[#1368E8] hover:-translate-y-1 shadow-sm transition-all">
      {icon}
    </Link>
  )
}

function FooterLink({ href, children }: { href: string, children: React.ReactNode }) {
  return (
    <li>
      <Link href={href} className="text-[#082B66]/60 hover:text-[#1368E8] font-bold transition-colors">
        {children}
      </Link>
    </li>
  )
}
