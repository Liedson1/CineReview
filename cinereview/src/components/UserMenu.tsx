'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { User, LogOut, Settings, UserCircle } from 'lucide-react'

export default function UserMenu() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem('user')
    if (stored) {
      setUser(JSON.parse(stored))
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('user')
    setUser(null)
    router.refresh()
    router.push('/')
  }

  if (!user) {
    return (
      <div className="flex items-center gap-4">
        <Link
          href="/login"
          className="text-slate-300 hover:text-white transition-colors font-medium"
        >
          Entrar
        </Link>
        <Link
          href="/register"
          className="px-3 py-1.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white rounded-lg font-medium transition-all"
        >
          Cadastrar
        </Link>
      </div>
    )
  }

  return (
    <div className="relative">
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-800 transition-colors"
      >
        <UserCircle className="w-7 h-7 text-blue-400" />
        <span className="text-slate-200 font-medium hidden sm:inline">
          {user.name.split(' ')[0]}
        </span>
      </button>

      {menuOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-slate-800 border border-slate-700 rounded-xl shadow-lg overflow-hidden animate-fadeIn z-50">
          <Link
            href="/profile"
            onClick={() => setMenuOpen(false)}
            className="flex items-center gap-2 px-4 py-3 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
          >
            <Settings className="w-4 h-4" />
            Editar Perfil
          </Link>
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-2 px-4 py-3 text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors text-left"
          >
            <LogOut className="w-4 h-4" />
            Sair
          </button>
        </div>
      )}
    </div>
  )
}
