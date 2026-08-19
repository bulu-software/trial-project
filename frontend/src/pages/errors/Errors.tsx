import { Component, type ErrorInfo, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/forms/button'
import { Card, CardContent } from '@/components/ui/display/card'

export function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4">
      <Card className="max-w-md w-full bg-slate-800/60 border-slate-700">
        <CardContent className="flex flex-col items-center text-center py-10 px-6">
          <h1 className="text-6xl font-bold text-indigo-400 mb-4">404</h1>
          <p className="text-lg text-slate-300 mb-6">The page you're looking for doesn't exist.</p>
          <Button asChild>
            <Link to="/">Go back home</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

export function ServerError() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4">
      <Card className="max-w-md w-full bg-slate-800/60 border-slate-700">
        <CardContent className="flex flex-col items-center text-center py-10 px-6">
          <h1 className="text-6xl font-bold text-red-400 mb-4">500</h1>
          <p className="text-lg text-slate-300 mb-6">Something went wrong on our end. Please try again later.</p>
          <Button onClick={() => window.location.reload()}>Reload page</Button>
        </CardContent>
      </Card>
    </div>
  )
}

export function Unauthorized() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4">
      <Card className="max-w-md w-full bg-slate-800/60 border-slate-700">
        <CardContent className="flex flex-col items-center text-center py-10 px-6">
          <h1 className="text-6xl font-bold text-amber-400 mb-4">401</h1>
          <p className="text-lg text-slate-300 mb-6">You need to log in to view this page.</p>
          <Button asChild>
            <Link to="/login">Go to login</Link>
          </Button>
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
        <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4">
          <Card className="max-w-md w-full bg-slate-800/60 border-slate-700">
            <CardContent className="flex flex-col items-center text-center py-10 px-6">
              <h1 className="text-3xl font-bold text-red-400 mb-4">Something went wrong</h1>
              <p className="text-slate-300 mb-6">An unexpected error occurred. Try reloading the page.</p>
              <Button onClick={() => window.location.reload()}>Reload page</Button>
            </CardContent>
          </Card>
        </div>
      )
    }
    return this.props.children
  }
}