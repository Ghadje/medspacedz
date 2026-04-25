import type { Metadata } from "next";
import { Inter, Geist } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/auth-provider";
import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "MedSpace OG | Apprenez la médecine plus intelligemment",
  description: "Accédez à vos cours, supports, QCM, examens et corrections instantanées dans une seule plateforme.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning className={cn("light font-sans", geist.variable)}>
      <body className={`${inter.variable} font-inter antialiased`}>
        <AuthProvider>
          {children}
          <Toaster position="top-center" />
        </AuthProvider>
      </body>
    </html>
  );
}
