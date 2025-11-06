'use client'

import { useState, useEffect } from 'react'
import { 
  TrendingUp, 
  MessageCircle, 
  ThumbsUp, 
  ThumbsDown,
  Film,
  Plus,
  Clock,
  Star,
  Search,
  Filter,
  X
} from 'lucide-react'
import Link from 'next/link'

interface Post {
  id: string
  userId: string
  userName: string
  title: string
  content: string
  movieId?: number
  movieTitle?: string
  moviePoster?: string
  upvotes: number
  downvotes: number
  commentCount: number
  createdAt: string
  userVote?: 'up' | 'down' | null
}

interface Comment {
  id: string
  postId: string
  userId: string
  userName: string
  content: string
  upvotes: number
  downvotes: number
  createdAt: string
  userVote?: 'up' | 'down' | null
  replies?: Comment[]
}

type SortOption = 'hot' | 'new' | 'top'

export default function CommunityPage() {
  const [user, setUser] = useState<any>(null)
  const [posts, setPosts] = useState<Post[]>([])
  const [selectedPost, setSelectedPost] = useState<Post | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState<SortOption>('hot')
  const [searchQuery, setSearchQuery] = useState('')
  const [showNewPostModal, setShowNewPostModal] = useState(false)
  const [newPost, setNewPost] = useState({ title: '', content: '', movieId: '' })

  useEffect(() => {
    const stored = localStorage.getItem('user')
    if (stored) {
      setUser(JSON.parse(stored))
    }
    loadPosts()
  }, [])

  const loadPosts = () => {
    const stored = localStorage.getItem('communityPosts')
    if (stored) {
      setPosts(JSON.parse(stored))
    }
    setLoading(false)
  }

  const savePosts = (updatedPosts: Post[]) => {
    setPosts(updatedPosts)
    localStorage.setItem('communityPosts', JSON.stringify(updatedPosts))
  }

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !newPost.title.trim() || !newPost.content.trim()) return

    const post: Post = {
      id: Date.now().toString(),
      userId: user.id,
      userName: user.name,
      title: newPost.title.trim(),
      content: newPost.content.trim(),
      movieId: newPost.movieId ? Number(newPost.movieId) : undefined,
      upvotes: 0,
      downvotes: 0,
      commentCount: 0,
      createdAt: new Date().toISOString(),
    }

    savePosts([post, ...posts])
    setNewPost({ title: '', content: '', movieId: '' })
    setShowNewPostModal(false)
  }

  const handleVote = (postId: string, voteType: 'up' | 'down') => {
    if (!user) return

    const updatedPosts = posts.map(post => {
      if (post.id !== postId) return post

      const currentVote = post.userVote
      let { upvotes, downvotes } = post

      if (currentVote === 'up') upvotes--
      if (currentVote === 'down') downvotes--

      if (currentVote === voteType) {
        return { ...post, upvotes, downvotes, userVote: null }
      } else {
        if (voteType === 'up') upvotes++
        if (voteType === 'down') downvotes++
        return { ...post, upvotes, downvotes, userVote: voteType }
      }
    })

    savePosts(updatedPosts)
  }

  const getScore = (post: Post) => post.upvotes - post.downvotes

  const sortedPosts = [...posts]
    .filter(post => 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.movieTitle?.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'new') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      }
      if (sortBy === 'top') {
        return getScore(b) - getScore(a)
      }
      const scoreA = getScore(a) + (Date.now() - new Date(a.createdAt).getTime()) / 100000
      const scoreB = getScore(b) + (Date.now() - new Date(b.createdAt).getTime()) / 100000
      return scoreB - scoreA
    })

  const getTimeSince = (date: string) => {
    const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000)
    if (seconds < 60) return `${seconds}s`
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m`
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`
    return `${Math.floor(seconds / 86400)}d`
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-600/20 rounded-lg">
              <MessageCircle className="w-8 h-8 text-orange-400" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white">Comunidade</h1>
              <p className="text-slate-400">Discussões sobre filmes</p>
            </div>
          </div>

          {user && (
            <button
              onClick={() => setShowNewPostModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-500 rounded-lg font-semibold transition-colors"
            >
              <Plus className="w-5 h-5" />
              Criar Post
            </button>
          )}
        </div>

        {/* Search & Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar discussões..."
              className="w-full pl-10 pr-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setSortBy('hot')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                sortBy === 'hot'
                  ? 'bg-orange-600 text-white'
                  : 'bg-slate-800/50 text-slate-300 hover:bg-slate-700/50'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              Em Alta
            </button>
            <button
              onClick={() => setSortBy('new')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                sortBy === 'new'
                  ? 'bg-orange-600 text-white'
                  : 'bg-slate-800/50 text-slate-300 hover:bg-slate-700/50'
              }`}
            >
              <Clock className="w-4 h-4" />
              Novos
            </button>
            <button
              onClick={() => setSortBy('top')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                sortBy === 'top'
                  ? 'bg-orange-600 text-white'
                  : 'bg-slate-800/50 text-slate-300 hover:bg-slate-700/50'
              }`}
            >
              <Star className="w-4 h-4" />
              Top
            </button>
          </div>
        </div>
      </div>

      {/* Posts List */}
      <div className="space-y-3">
        {!user && (
          <div className="bg-slate-800/40 border border-slate-700 rounded-xl p-6 text-center mb-4">
            <p className="text-slate-400 mb-4">
              Faça login para criar posts e participar das discussões
            </p>
            <Link
              href="/login"
              className="inline-block px-6 py-2 bg-orange-600 hover:bg-orange-500 rounded-lg font-semibold transition-colors"
            >
              Fazer login
            </Link>
          </div>
        )}

        {sortedPosts.length === 0 ? (
          <div className="bg-slate-800/40 border border-slate-700 rounded-xl p-12 text-center">
            <MessageCircle className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-400 mb-2">
              Nenhuma discussão ainda
            </h3>
            <p className="text-slate-500">
              Seja o primeiro a criar um post!
            </p>
          </div>
        ) : (
          sortedPosts.map((post) => (
            <div
              key={post.id}
              className="bg-slate-800/40 border border-slate-700 rounded-xl hover:border-slate-600 transition-all overflow-hidden"
            >
              <div className="flex">
                {/* Vote Section */}
                <div className="flex flex-col items-center gap-1 p-4 bg-slate-900/50 border-r border-slate-700">
                  <button
                    onClick={() => handleVote(post.id, 'up')}
                    disabled={!user}
                    className={`p-1 rounded hover:bg-slate-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                      post.userVote === 'up' ? 'text-orange-500' : 'text-slate-400'
                    }`}
                  >
                    <ThumbsUp className="w-5 h-5" />
                  </button>
                  
                  <span className={`font-bold ${
                    getScore(post) > 0 ? 'text-orange-500' : 
                    getScore(post) < 0 ? 'text-blue-500' : 
                    'text-slate-400'
                  }`}>
                    {getScore(post)}
                  </span>
                  
                  <button
                    onClick={() => handleVote(post.id, 'down')}
                    disabled={!user}
                    className={`p-1 rounded hover:bg-slate-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                      post.userVote === 'down' ? 'text-blue-500' : 'text-slate-400'
                    }`}
                  >
                    <ThumbsDown className="w-5 h-5" />
                  </button>
                </div>

                {/* Post Content */}
                <div className="flex-1 p-4">
                  <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
                    <span className="font-semibold text-slate-300">
                      {post.userName}
                    </span>
                    <span>•</span>
                    <span>{getTimeSince(post.createdAt)} atrás</span>
                    {post.movieTitle && (
                      <>
                        <span>•</span>
                        <Link 
                          href={`/movies/${post.movieId}`}
                          className="flex items-center gap-1 text-orange-400 hover:text-orange-300"
                        >
                          <Film className="w-3 h-3" />
                          {post.movieTitle}
                        </Link>
                      </>
                    )}
                  </div>

                  <h3 className="text-lg font-semibold text-white mb-2 hover:text-orange-400 cursor-pointer transition-colors">
                    {post.title}
                  </h3>

                  <p className="text-slate-300 mb-3 line-clamp-3">
                    {post.content}
                  </p>

                  <div className="flex items-center gap-4 text-sm text-slate-400">
                    <button className="flex items-center gap-1 hover:text-orange-400 transition-colors">
                      <MessageCircle className="w-4 h-4" />
                      {post.commentCount} comentários
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal Criar Post */}
      {showNewPostModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl max-w-2xl w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Criar Nova Discussão</h2>
              <button
                onClick={() => setShowNewPostModal(false)}
                className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePost} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Título
                </label>
                <input
                  type="text"
                  value={newPost.title}
                  onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                  placeholder="Dê um título chamativo para sua discussão"
                  required
                  maxLength={200}
                  className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Conteúdo
                </label>
                <textarea
                  value={newPost.content}
                  onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                  placeholder="Compartilhe seus pensamentos..."
                  required
                  rows={6}
                  maxLength={2000}
                  className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                />
                <p className="text-xs text-slate-500 mt-2">
                  {newPost.content.length}/2000 caracteres
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  ID do Filme (opcional)
                </label>
                <input
                  type="number"
                  value={newPost.movieId}
                  onChange={(e) => setNewPost({ ...newPost, movieId: e.target.value })}
                  placeholder="Ex: 550 para Clube da Luta"
                  className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <p className="text-xs text-slate-500 mt-2">
                  Vincule sua discussão a um filme específico
                </p>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowNewPostModal(false)}
                  className="flex-1 px-6 py-3 bg-slate-700 hover:bg-slate-600 rounded-lg font-semibold transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-orange-600 hover:bg-orange-500 rounded-lg font-semibold transition-colors"
                >
                  Publicar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}