import { useState, type FormEvent } from "react"
import { Link, useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { Input } from "@/components/ui/forms/input"
import { Label } from "@/components/ui/forms/label"
import { Button } from "@/components/ui/forms/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/display/card"
import { Mail, Lock, Eye, EyeOff, Leaf, ArrowRight } from "lucide-react"

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const Login = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const navigate = useNavigate()

  const validate = (): string | null => {
    if (!email || !password) return "Please fill in all fields"
    if (!EMAIL_REGEX.test(email)) return "Please enter a valid email address"
    if (password.length < 8 || password.length > 16) return "Password must be 8-16 characters"
    return null
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    setError("")

    const validationError = validate()
    if (validationError) {
      setError(validationError)
      return
    }

    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)

      // Determine role based on email
      const isAdmin = email.toLowerCase() === "admin@plantshop.com"
      const role = isAdmin ? "admin" : "user"

      // Save username to localStorage
      const storedName = localStorage.getItem("username")
      if (!storedName) {
        const extractedName = email.split("@")[0]
        const formattedName = extractedName.charAt(0).toUpperCase() + extractedName.slice(1)
        localStorage.setItem("username", formattedName)
      }

      // Always update role on login
      localStorage.setItem("role", role)

      toast.success("Login successful", {
        description: isAdmin
          ? "Welcome back, Admin! Redirecting to dashboard..."
          : "Redirecting you to the dashboard...",
      })
      navigate("/dashboard")
    }, 1500)
  }

  return (
    <div className="relative flex items-center justify-center min-h-[80vh] px-6 overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] rounded-full bg-emerald-500/10 blur-[80px] pointer-events-none -z-10 animate-pulse duration-[6000ms]" />
      <div className="absolute top-1/3 left-1/4 w-[250px] h-[250px] rounded-full bg-green-500/5 blur-[100px] pointer-events-none -z-10" />

      <Card className="w-full max-w-md border-border/40 bg-card/45 backdrop-blur-xl shadow-2xl shadow-emerald-950/20 hover:border-emerald-500/20 transition-all duration-500 relative overflow-hidden group">
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-emerald-500/20 via-emerald-400 to-green-500/20" />

        <CardHeader className="space-y-2 text-center pt-8">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mb-2 transition-transform duration-300 group-hover:scale-110">
            <Leaf className="size-6 fill-emerald-400/10" />
          </div>
          <CardTitle className="text-3xl font-extrabold tracking-tight text-white">Welcome Back</CardTitle>
          <CardDescription className="text-muted-foreground/80 text-sm">
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4 px-6 pb-6">
            {error && (
              <div className="p-3 text-xs font-medium text-destructive bg-destructive/10 border border-destructive/20 rounded-xl animate-shake">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground size-4" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-10 border-border/60 bg-input/20 focus-visible:border-emerald-500/50 focus-visible:ring-emerald-500/20 transition-all rounded-xl"
                  disabled={isLoading}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Password
                </Label>
                <Link to="/forgot-password" className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors font-medium">
                  Forgot?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground size-4" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 h-10 border-border/60 bg-input/20 focus-visible:border-emerald-500/50 focus-visible:ring-emerald-500/20 transition-all rounded-xl"
                  disabled={isLoading}
                  minLength={8}
                  maxLength={16}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  disabled={isLoading}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  aria-pressed={showPassword}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-emerald-400 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
              <p className="text-xs text-muted-foreground/60">Must be 8-16 characters</p>
            </div>

            <Button
              type="submit"
              className="w-full mt-4 bg-emerald-500 hover:bg-emerald-400 text-black font-semibold h-11 rounded-xl shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/25 transition-all duration-300 hover:scale-[1.01] active:scale-[0.99] cursor-pointer flex items-center justify-center gap-2 group/button"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="size-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  Log In
                  <ArrowRight className="size-4 transition-transform duration-300 group-hover/button:translate-x-1" />
                </>
              )}
            </Button>
          </CardContent>
        </form>

        <CardFooter className="flex justify-center border-t border-border/20 py-4 bg-black/10">
          <p className="text-sm text-muted-foreground">
            New to PlantShop?{" "}
            <Link to="/register" className="text-emerald-400 hover:text-emerald-300 font-semibold transition-colors">
              Create an account
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}

export default Login