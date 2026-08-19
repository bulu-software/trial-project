import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { Input } from "@/components/ui/forms/input"
import { Label } from "@/components/ui/forms/label"
import { Button } from "@/components/ui/forms/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/display/card"
import { User, Mail, Lock, Leaf, ArrowRight, Eye, EyeOff, Phone, MapPin } from "lucide-react"
import { api } from "@/services/api"

const Register = () => {
  // Fields matching the "users" table: name, email, password, role, phone, address
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [phone, setPhone] = useState("")
  const [address, setAddress] = useState("")
  const [role, setRole] = useState("customer") // ENUM('admin','customer'), defaults to customer

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!name || !email || !password || !confirmPassword) {
      setError("Please fill in all required fields")
      return
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    if (password.length < 8 || password.length > 16) {
      setError("Password must be 8-16 characters")
      return
    }

    const cleanPhone = phone.trim()
    if (cleanPhone && cleanPhone.length !== 10) {
      setError("Phone number must be exactly 10 digits")
      return
    }

    setIsLoading(true)

    try {
      const response = await api.register({
        name,
        email,
        password,
        role,
        phone: cleanPhone || undefined,
        address: address.trim() || undefined,
      })

      localStorage.setItem("token", response.access_token)
      localStorage.setItem("username", response.user.name)
      localStorage.setItem("role", response.user.role)
      localStorage.setItem("currentUserEmail", response.user.email)
      localStorage.setItem("email", response.user.email)

      toast.success("Account created successfully", {
        description: `Welcome, ${response.user.name}!`,
      })

      if (response.user.role === "admin") {
        navigate("/dashboard")
      } else {
        navigate("/product")
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Registration failed. Please check if backend is running."
      setError(msg)
      toast.error("Registration Error", { description: msg })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="relative flex items-center justify-center min-h-[85vh] py-8 px-6 overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] rounded-full bg-emerald-500/10 blur-[80px] pointer-events-none -z-10 animate-pulse duration-[6000ms]" />
      <div className="absolute bottom-1/4 right-1/4 w-[250px] h-[250px] rounded-full bg-green-500/5 blur-[100px] pointer-events-none -z-10" />

      <Card className="w-full max-w-lg border-border/40 bg-card/45 backdrop-blur-xl shadow-2xl shadow-emerald-950/20 hover:border-emerald-500/20 transition-all duration-500 relative overflow-hidden group">
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-emerald-500/20 via-emerald-400 to-green-500/20" />

        <CardHeader className="space-y-2 text-center pt-8">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mb-2 transition-transform duration-300 group-hover:scale-110">
            <Leaf className="size-6 fill-emerald-400/10" />
          </div>
          <CardTitle className="text-3xl font-extrabold tracking-tight text-white">Create Account</CardTitle>
          <CardDescription className="text-muted-foreground/80 text-sm">
            Join PlantShop and grow your green space today
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4 px-6 pb-6">
            {error && (
              <div className="p-3 text-xs font-medium text-destructive bg-destructive/10 border border-destructive/20 rounded-xl animate-shake">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Full Name *
                </Label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground size-4" />
                  <Input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-10 h-10 border-border/60 bg-input/20 focus-visible:border-emerald-500/50 focus-visible:ring-emerald-500/20 transition-all rounded-xl"
                    disabled={isLoading}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Email Address *
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
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="password" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Password *
                </Label>
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
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-emerald-400 transition-colors cursor-pointer disabled:opacity-50"
                  >
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Confirm Password *
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground size-4" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-10 pr-10 h-10 border-border/60 bg-input/20 focus-visible:border-emerald-500/50 focus-visible:ring-emerald-500/20 transition-all rounded-xl"
                    disabled={isLoading}
                    minLength={8}
                    maxLength={16}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    disabled={isLoading}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-emerald-400 transition-colors cursor-pointer disabled:opacity-50"
                  >
                    {showConfirmPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
              </div>

              <p className="text-xs text-muted-foreground/60 col-span-1 sm:col-span-2">
                Must be 8-16 characters
              </p>
            </div>

            {/* Additional Fields: Phone & Address */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="phone" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Phone Number
                  </Label>
                  <span className="text-[10px] text-zinc-500 font-mono">
                    {phone.length}/10 digits
                  </span>
                </div>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground size-4" />
                  <Input
                    id="phone"
                    type="tel"
                    inputMode="numeric"
                    maxLength={10}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                    className="pl-10 h-10 border-border/60 bg-input/20 focus-visible:border-emerald-500/50 focus-visible:ring-emerald-500/20 transition-all rounded-xl"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="role" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Account Type
                </Label>
                <select
                  id="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  disabled={isLoading}
                  className="w-full h-10 px-3 rounded-xl border border-border/60 bg-input/20 text-sm focus-visible:border-emerald-500/50 focus-visible:ring-emerald-500/20 transition-all"
                >
                  <option value="customer">Customer</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Delivery Address
              </Label>
              <div className="relative">
                <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground size-4" />
                <Input
                  id="address"
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="pl-10 h-10 border-border/60 bg-input/20 focus-visible:border-emerald-500/50 focus-visible:ring-emerald-500/20 transition-all rounded-xl"
                  disabled={isLoading}
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full mt-4 bg-emerald-500 hover:bg-emerald-400 text-black font-semibold h-11 rounded-xl shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/25 transition-all duration-300 hover:scale-[1.01] active:scale-[0.99] cursor-pointer flex items-center justify-center gap-2"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="size-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  Register
                  <ArrowRight className="size-4 transition-transform duration-300 group-hover/button:translate-x-1" />
                </>
              )}
            </Button>
          </CardContent>
        </form>

        <CardFooter className="flex justify-center border-t border-border/20 py-4 bg-black/10">
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="text-emerald-400 hover:text-emerald-300 font-semibold transition-colors">
              Log in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}

export default Register