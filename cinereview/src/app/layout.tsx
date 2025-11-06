'use client'

import "./globals.css"
import { ReactNode, createContext, useContext, useState, useEffect } from "react"
import UserMenu from "@/components/UserMenu"
import Link from "next/link"
import { MessageCircle } from "lucide-react"

interface User {
  id: string
  name: string
  email: string
}

interface AuthContextType {
  user: User | null
  setUser: (user: User | null) => void
  refreshUser: () => void
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => {},
  refreshUser: () => {},
})

export const useAuth = () => useContext(AuthContext)

export default function RootLayout({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  const refreshUser = () => {
    const stored = localStorage.getItem('user')
    if (stored) {
      setUser(JSON.parse(stored))
    } else {
      setUser(null)
    }
  }

  useEffect(() => {
    refreshUser()
  }, [])

  return (
    <html lang="pt-BR">
      <head>
        <title>CineReview</title>
        <meta name="description" content="Avaliações de filmes com integração TMDB" />
      </head>
      <body className="bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white min-h-screen">
        <AuthContext.Provider value={{ user, setUser, refreshUser }}>
          <header className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/60 backdrop-blur-md">
            <div className="flex items-center gap-6">
              <Link href="/">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent select-none cursor-pointer hover:scale-105 transition-transform">
                  CineReview
                </h1>
              </Link>
              
              <Link
                href="/community"
                className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700 hover:border-slate-600 rounded-lg transition-all"
              >
                <MessageCircle className="w-5 h-5 text-purple-400" />
                <span className="text-slate-300 font-medium hidden sm:inline">Comunidade</span>
              </Link>
            </div>

            <UserMenu />
          </header>

          <main className="p-4 md:p-6">{children}</main>
        </AuthContext.Provider>
      </body>
    </html>
  )
}