'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const stored = localStorage.getItem('user')
    if (!stored) router.push('/login')
    else setUser(JSON.parse(stored))
  }, [router])

  if (!user) return null

  return (
    <div className="max-w-lg mx-auto mt-20 bg-slate-800/50 p-8 rounded-xl border border-slate-700">
      <h2 className="text-2xl font-semibold mb-4">Perfil</h2>
      <p><strong>Nome:</strong> {user.name}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <button
        onClick={() => router.push('/')}
        className="mt-6 bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg transition"
      >
        Voltar
      </button>
    </div>
  )
}
