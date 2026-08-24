import { Component, type ErrorInfo, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/forms/button'
import { Card, CardContent } from '@/components/ui/display/card'
import { Badge } from '@/components/ui/display/badge'
import {
  AlertTriangle,
  FileQuestion,
  ShieldAlert,
  RotateCcw,
  Home,
  LogIn
} from 'lucide-react'

export function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-zinc-950 text-white px-4 relative overflow-hidden isolate">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-emerald-500/5 blur-[120px] pointer-events-none -z-10 rounded-full" />
      
      <Card className="max-w-md w-full bg-zinc-900/40 border-zinc-800/80 backdrop-blur-xl rounded-3xl shadow-2xl p-6 sm:p-8 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-emerald-500/20 via-emerald-400 to-green-500/20" />
        
        <CardContent className="p-0 space-y-6 flex flex-col items-center">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shadow-inner">
            <FileQuestion className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs px-2.5 py-0.5 font-semibold rounded-full">
              404 • Page Not Found
            </Badge>
            <h1 className="text-2xl font-bold text-white tracking-tight">Lost in PlantShop?</h1>
            <p className="text-sm text-zinc-400 leading-relaxed max-w-sm mx-auto">
              The page you're looking for doesn't exist or may have been moved to another spot in PlantShop.
            </p>
          </div>

          <Link to="/" className="w-full">
            <Button className="w-full h-10 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer text-xs">
              <Home className="w-4 h-4" />
              Return to PlantShop
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}

export function ServerError() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-zinc-950 text-white px-4 relative overflow-hidden isolate">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-red-500/5 blur-[120px] pointer-events-none -z-10 rounded-full" />
      
      <Card className="max-w-md w-full bg-zinc-900/40 border-zinc-800/80 backdrop-blur-xl rounded-3xl shadow-2xl p-6 sm:p-8 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-red-500/20 via-red-400 to-rose-500/20" />
        
        <CardContent className="p-0 space-y-6 flex flex-col items-center">
          <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center shadow-inner">
            <AlertTriangle className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <Badge className="bg-red-500/10 text-red-400 border border-red-500/20 text-xs px-2.5 py-0.5 font-semibold rounded-full">
              500 • Server Error
            </Badge>
            <h1 className="text-2xl font-bold text-white tracking-tight">Something Went Wrong</h1>
            <p className="text-sm text-zinc-400 leading-relaxed max-w-sm mx-auto">
              Our system encountered an unexpected issue while communicating with the server.
            </p>
          </div>

          <Button
            onClick={() => window.location.reload()}
            className="w-full h-10 bg-red-500 hover:bg-red-400 text-white font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer text-xs"
          >
            <RotateCcw className="w-4 h-4" />
            Reload Page
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

export function Unauthorized() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-zinc-950 text-white px-4 relative overflow-hidden isolate">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-amber-500/5 blur-[120px] pointer-events-none -z-10 rounded-full" />
      
      <Card className="max-w-md w-full bg-zinc-900/40 border-zinc-800/80 backdrop-blur-xl rounded-3xl shadow-2xl p-6 sm:p-8 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-amber-500/20 via-amber-400 to-yellow-500/20" />
        
        <CardContent className="p-0 space-y-6 flex flex-col items-center">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shadow-inner">
            <ShieldAlert className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <Badge className="bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs px-2.5 py-0.5 font-semibold rounded-full">
              401 • Unauthorized
            </Badge>
            <h1 className="text-2xl font-bold text-white tracking-tight">Access Restricted</h1>
            <p className="text-sm text-zinc-400 leading-relaxed max-w-sm mx-auto">
              You need to sign in with an authorized account to access this page or resource.
            </p>
          </div>

          <Link to="/login" className="w-full">
            <Button className="w-full h-10 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer text-xs">
              <LogIn className="w-4 h-4" />
              Sign In to Continue
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}

interface ErrorBoundaryProps {
  children: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[80vh] flex items-center justify-center bg-zinc-950 text-white px-4 relative overflow-hidden isolate">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-red-500/5 blur-[120px] pointer-events-none -z-10 rounded-full" />
          
          <Card className="max-w-md w-full bg-zinc-900/40 border-zinc-800/80 backdrop-blur-xl rounded-3xl shadow-2xl p-6 sm:p-8 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-red-500/20 via-red-400 to-rose-500/20" />
            
            <CardContent className="p-0 space-y-6 flex flex-col items-center">
              <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center shadow-inner">
                <AlertTriangle className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <Badge className="bg-red-500/10 text-red-400 border border-red-500/20 text-xs px-2.5 py-0.5 font-semibold rounded-full">
                  Application Error
                </Badge>
                <h1 className="text-2xl font-bold text-white tracking-tight">Something Went Wrong</h1>
                <p className="text-sm text-zinc-400 leading-relaxed max-w-sm mx-auto">
                  An unexpected error occurred while rendering this page.
                </p>
              </div>

              <Button
                onClick={() => window.location.reload()}
                className="w-full h-10 bg-red-500 hover:bg-red-400 text-white font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer text-xs"
              >
                <RotateCcw className="w-4 h-4" />
                Reload Application
              </Button>
            </CardContent>
          </Card>
        </div>
      )
    }
    return this.props.children
  }
}