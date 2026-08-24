import { useState, useEffect, type FormEvent } from "react"
import { useSearchParams, useNavigate, Link } from "react-router-dom"
import { toast } from "sonner"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/display/card"
import { Label } from "@/components/ui/forms/label"
import { Input } from "@/components/ui/forms/input"
import { Button } from "@/components/ui/forms/button"
import { KeyRound, Eye, EyeOff, Lock, CheckCircle2, AlertCircle, ArrowLeft, ShieldCheck } from "lucide-react"
import { api } from "@/services/api"

const Reset_password = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const token = searchParams.get("token") || ""

  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [isSuccess, setIsSuccess] = useState(false)

  useEffect(() => {
    if (!token) {
      setError("Reset token is missing from the link. Please request a new password reset link.")
    }
  }, [token])

  const validate = (): string | null => {
    if (!token) {
      return "Invalid or missing reset token. Please request a new reset email."
    }
    if (!password || !confirmPassword) {
      return "Please fill in all fields"
    }
    if (password.length < 8 || password.length > 32) {
      return "Password must be between 8 and 32 characters"
    }
    if (password !== confirmPassword) {
      return "Passwords do not match"
    }
    return null
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError("")

    const validationError = validate()
    if (validationError) {
      setError(validationError)
      return
    }

    setIsLoading(true)

    try {
      const res = await api.resetPassword({
        token,
        new_password: password,
      })

      setIsSuccess(true)
      toast.success("Password Reset Successful", {
        description: res.message || "You can now log in with your new password.",
      })
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to reset password. The link might have expired."
      setError(msg)
      toast.error("Password Reset Failed", {
        description: msg,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="relative flex items-center justify-center min-h-[80vh] px-4 overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] rounded-full bg-emerald-500/10 blur-[80px] pointer-events-none -z-10 animate-pulse duration-[6000ms]" />
      <div className="absolute top-1/3 left-1/4 w-[250px] h-[250px] rounded-full bg-green-500/5 blur-[100px] pointer-events-none -z-10" />

      <Card className="enter-fade-up card-hover w-full max-w-md border-border/40 bg-card/45 backdrop-blur-xl shadow-2xl shadow-emerald-950/20 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-emerald-500/20 via-emerald-400 to-green-500/20" />

        <CardHeader className="space-y-2 text-center pt-8">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mb-2">
            <KeyRound className="size-6 text-emerald-400" />
          </div>
          <CardTitle className="text-3xl font-extrabold tracking-tight text-foreground">
            {isSuccess ? "Password Reset Done!" : "Set New Password"}
          </CardTitle>
          <CardDescription className="text-muted-foreground/80 text-sm">
            {isSuccess
              ? "Your password has been successfully updated"
              : "Choose a strong and secure password for your account"}
          </CardDescription>
        </CardHeader>

        {!isSuccess ? (
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4 px-6 pb-6">
              {error && (
                <div className="p-3 text-xs font-medium text-destructive bg-destructive/10 border border-destructive/20 rounded-xl flex items-start gap-2">
                  <AlertCircle className="size-4 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <div className="space-y-2">
                <Label
                  htmlFor="new-password"
                  className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                >
                  New Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground size-4" />
                  <Input
                    id="new-password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="border-glow pl-10 pr-10 h-10 border-border/60 bg-input/20 focus-visible:border-emerald-500/50 focus-visible:ring-emerald-500/20 rounded-xl"
                    disabled={isLoading || !token}
                    minLength={8}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
                <p className="text-[11px] text-muted-foreground">Minimum 8 characters</p>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="confirm-password"
                  className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                >
                  Confirm New Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground size-4" />
                  <Input
                    id="confirm-password"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="border-glow pl-10 pr-10 h-10 border-border/60 bg-input/20 focus-visible:border-emerald-500/50 focus-visible:ring-emerald-500/20 rounded-xl"
                    disabled={isLoading || !token}
                    minLength={8}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                  >
                    {showConfirmPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="btn-hover w-full mt-2 bg-emerald-500 hover:bg-emerald-400 text-black font-semibold h-11 rounded-xl shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/25 flex items-center justify-center gap-2 cursor-pointer"
                disabled={isLoading || !token}
              >
                {isLoading ? (
                  <div className="size-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <ShieldCheck className="size-4" />
                    Reset Password
                  </>
                )}
              </Button>
            </CardContent>
          </form>
        ) : (
          <CardContent className="text-center py-6 px-6 enter-scale space-y-4">
            <div className="w-14 h-14 mx-auto rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-3">
              <CheckCircle2 className="size-7 text-emerald-400" />
            </div>
            <p className="text-sm text-muted-foreground">
              Your password has been successfully updated. You can now log into your PlantShop account.
            </p>
            <Button
              onClick={() => navigate("/login")}
              className="btn-hover w-full bg-emerald-500 hover:bg-emerald-400 text-black font-semibold h-10 rounded-xl shadow-md"
            >
              Proceed to Login
            </Button>
          </CardContent>
        )}

        <CardFooter className="flex justify-center border-t border-border/20 py-4 bg-black/10">
          <Link
            to="/login"
            className="text-sm text-muted-foreground hover:text-white transition-colors font-medium flex items-center gap-2"
          >
            <ArrowLeft className="size-4" />
            Back to Login
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}

export default Reset_password
