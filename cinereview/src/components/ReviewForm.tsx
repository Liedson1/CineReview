'use client'

import { useState } from 'react'
import StarRating from './StarRating'
import { MessageSquare, Send, Loader2, AlertCircle, CheckCircle } from 'lucide-react'

interface ReviewFormProps {
  movieId: number
  existingReview?: {
    id: string
    rating: number
    comment?: string
  }
  onSuccess?: () => void
}

export default function ReviewForm({
  movieId,
  existingReview,
  onSuccess,
}: ReviewFormProps) {
  const [rating, setRating] = useState(existingReview?.rating || 0)
  const [comment, setComment] = useState(existingReview?.comment || '')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (rating === 0) {
      setError('Por favor, selecione uma avaliação')
      return
    }

    setLoading(true)
    setError('')
    setSuccess(false)

    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          movieId,
          rating,
          comment: comment.trim() || null,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Erro ao salvar avaliação')
        return
      }

      setSuccess(true)
      
      if (onSuccess) {
        setTimeout(() => {
          onSuccess()
        }, 1000)
      }
    } catch (err) {
      console.error('Erro ao salvar review:', err)
      setError('Erro ao conectar com o servidor')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
          <p className="text-red-400 text-sm break-words">{error}</p>
        </div>
      )}

      {success && (
        <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg flex items-start gap-3">
          <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-green-400 text-sm font-semibold">
              {existingReview ? 'Avaliação atualizada!' : 'Avaliação enviada!'}
            </p>
            <p className="text-green-400/80 text-xs mt-1">
              Obrigado por compartilhar sua opinião
            </p>
          </div>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-3">
          Sua avaliação
        </label>
        <StarRating
          rating={rating}
          onRatingChange={setRating}
          size="lg"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            Comentário (opcional)
          </div>
        </label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="O que você achou do filme? (opcional)"
          rows={4}
          maxLength={500}
          className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
        />
        <div className="flex justify-between items-center mt-2">
          <p className="text-xs text-slate-500">
            Máximo 500 caracteres
          </p>
          <p className="text-xs text-slate-400">
            {comment.length}/500
          </p>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading || success || rating === 0}
        className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 disabled:from-slate-700 disabled:to-slate-700 text-white font-semibold rounded-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Salvando...
          </>
        ) : success ? (
          <>
            <CheckCircle className="w-5 h-5" />
            Salvo!
          </>
        ) : (
          <>
            <Send className="w-5 h-5" />
            {existingReview ? 'Atualizar avaliação' : 'Enviar avaliação'}
          </>
        )}
      </button>
    </form>
  )
}