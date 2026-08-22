import { useState, useEffect, useRef, type FormEvent } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/forms/button"
import { Input } from "@/components/ui/forms/input"
import { Label } from "@/components/ui/forms/label"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/display/card"
import { ArrowLeft, Mail, CheckCircle2, ShieldCheck, Key, Eye, EyeOff, Lock, RefreshCw } from "lucide-react"
import { api } from "@/services/api"
import { toast } from "sonner"

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

type Step = 1 | 2 | 3 | "success"

const Forgot_password = () => {
  const navigate = useNavigate()
  const [step, setStep] = useState<Step>(1)
  
  // Form values
  const [email, setEmail] = useState("")
  const [otp, setOtp] = useState(["", "", "", "", "", ""])
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  
  // UI states
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [resendCooldown, setResendCooldown] = useState(0)

  const otpInputsRef = useRef<(HTMLInputElement | null)[]>([])

  // Cooldown timer for OTP resend
  useEffect(() => {
    if (resendCooldown <= 0) return
    const timer = setInterval(() => {
      setResendCooldown((prev) => prev - 1)
    }, 1000)
    return () => clearInterval(timer)
  }, [resendCooldown])

  // STEP 1: Send OTP
  const handleSendOtp = async (e: FormEvent) => {
    e.preventDefault()
    setError("")

    if (!email) {
      setError("Please enter your registered email address")
      return
    }
    if (!EMAIL_REGEX.test(email)) {
      setError("Please enter a valid email address")
      return
    }

    setIsLoading(true)

    try {
      const res = await api.sendOtp({ email })
      console.log("%c[Send OTP Response]", "color: #10b981; font-weight: bold;", res)
      toast.success("OTP Sent!", { description: `Verification code sent to ${email}` })
      setStep(2)
      setResendCooldown(30)
    } catch (err: unknown) {
      console.error("%c[Send OTP Error]", "color: #ef4444; font-weight: bold;", err)
      const msg = err instanceof Error ? err.message : "Failed to send OTP code"
      setError(msg)
    } finally {
      setIsLoading(false)
    }
  }

  // STEP 2: OTP Input change handlers
  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return
    const newOtp = [...otp]
    newOtp[index] = value.slice(-1)
    setOtp(newOtp)
    setError("")

    // Auto-advance to next input
    if (value && index < 5) {
      otpInputsRef.current[index + 1]?.focus()
    }
  }

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpInputsRef.current[index - 1]?.focus()
    }
  }

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6)
    if (!pasted) return
    const digits = pasted.split("")
    const newOtp = ["", "", "", "", "", ""]
    digits.forEach((d, i) => {
      if (i < 6) newOtp[i] = d
    })
    setOtp(newOtp)
    if (digits.length >= 6) {
      otpInputsRef.current[5]?.focus()
    } else {
      otpInputsRef.current[digits.length]?.focus()
    }
  }

  const handleVerifyOtp = async (e: FormEvent) => {
    e.preventDefault()
    setError("")

    const fullOtp = otp.join("")
    if (fullOtp.length !== 6) {
      setError("Please enter the complete 6-digit OTP code")
      return
    }

    setIsLoading(true)

    try {
      const res = await api.verifyOtp({ email, otp: fullOtp })
      console.log("%c[Verify OTP Response]", "color: #10b981; font-weight: bold;", res)
      toast.success("OTP Verified!", { description: "Please enter your new password." })
      setStep(3)
    } catch (err: unknown) {
      console.error("%c[Verify OTP Error]", "color: #ef4444; font-weight: bold;", err)
      const msg = err instanceof Error ? err.message : "Invalid or expired OTP code"
      setError(msg)
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendOtp = async () => {
    if (resendCooldown > 0) return
    setError("")
    setIsLoading(true)
    try {
      await api.sendOtp({ email })
      toast.success("New OTP Sent!", { description: `Sent to ${email}` })
      setResendCooldown(30)
      setOtp(["", "", "", "", "", ""])
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to resend OTP"
      setError(msg)
    } finally {
      setIsLoading(false)
    }
  }

  // STEP 3: Reset Password
  const handleResetPassword = async (e: FormEvent) => {
    e.preventDefault()
    setError("")

    if (!newPassword || !confirmPassword) {
      setError("Please fill in both password fields")
      return
    }
    if (newPassword.length < 8 || newPassword.length > 32) {
      setError("Password must be between 8 and 32 characters long")
      return
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    setIsLoading(true)

    try {
      const fullOtp = otp.join("")
      const res = await api.resetPasswordOtp({
        email,
        otp: fullOtp,
        new_password: newPassword,
      })
      console.log("%c[Reset Password Response]", "color: #10b981; font-weight: bold;", res)
      toast.success("Password Reset Successful", { description: "You can now log in with your new password." })
      setStep("success")
    } catch (err: unknown) {
      console.error("%c[Reset Password Error]", "color: #ef4444; font-weight: bold;", err)
      const msg = err instanceof Error ? err.message : "Failed to reset password"
      setError(msg)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="relative flex items-center justify-center min-h-[80vh] px-4 py-8 overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[380px] h-[380px] rounded-full bg-emerald-500/10 blur-[90px] pointer-events-none -z-10 animate-pulse duration-[6000ms]" />

      <Card className="enter-fade-up card-hover w-full max-w-md border-border/40 bg-card/45 backdrop-blur-xl shadow-2xl shadow-emerald-950/20 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-emerald-500/20 via-emerald-400 to-green-500/20" />

        {/* Header */}
        <CardHeader className="space-y-3 text-center pt-8 pb-4">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            {step === 1 && <Mail className="size-6 text-emerald-400" />}
            {step === 2 && <ShieldCheck className="size-6 text-emerald-400" />}
            {step === 3 && <Key className="size-6 text-emerald-400" />}
            {step === "success" && <CheckCircle2 className="size-6 text-emerald-400" />}
          </div>

          <CardTitle className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            {step === 1 && "Forgot Password?"}
            {step === 2 && "Enter OTP Code"}
            {step === 3 && "Set New Password"}
            {step === "success" && "Password Reset!"}
          </CardTitle>

          <CardDescription className="text-muted-foreground/80 text-xs sm:text-sm px-2">
            {step === 1 && "Enter your email address to receive a 6-digit verification code"}
            {step === 2 && `Enter the 6-digit code sent to ${email}`}
            {step === 3 && "Create a new strong password for your account"}
            {step === "success" && "Your password has been updated. You can now log in."}
          </CardDescription>

          {/* 3-Step Indicator Bar */}
          {step !== "success" && (
            <div className="flex items-center justify-center gap-2 pt-2 px-6">
              <div className={`flex-1 h-1.5 rounded-full transition-all duration-300 ${step >= 1 ? "bg-emerald-500 shadow-sm shadow-emerald-500/50" : "bg-zinc-800"}`} />
              <div className={`flex-1 h-1.5 rounded-full transition-all duration-300 ${step >= 2 ? "bg-emerald-500 shadow-sm shadow-emerald-500/50" : "bg-zinc-800"}`} />
              <div className={`flex-1 h-1.5 rounded-full transition-all duration-300 ${step >= 3 ? "bg-emerald-500 shadow-sm shadow-emerald-500/50" : "bg-zinc-800"}`} />
            </div>
          )}
        </CardHeader>

        {/* Global Error Banner */}
        {error && (
          <div className="mx-6 mb-4 p-3 text-xs font-medium text-destructive bg-destructive/10 border border-destructive/20 rounded-xl flex items-start gap-2">
            <span className="leading-relaxed">{error}</span>
          </div>
        )}

        {/* STEP 1: Enter Email */}
        {step === 1 && (
          <form onSubmit={handleSendOtp}>
            <CardContent className="space-y-4 px-6 pb-6">
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
                    placeholder="name@example.com"
                    className="border-glow pl-10 h-10 border-border/60 bg-input/20 focus-visible:border-emerald-500/50 focus-visible:ring-emerald-500/20 rounded-xl"
                    disabled={isLoading}
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="btn-hover w-full mt-2 bg-emerald-500 hover:bg-emerald-400 text-black font-bold h-11 rounded-xl shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/25 cursor-pointer"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="size-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                ) : (
                  "Send Verification Code"
                )}
              </Button>
            </CardContent>
          </form>
        )}

        {/* STEP 2: Enter OTP Code */}
        {step === 2 && (
          <form onSubmit={handleVerifyOtp}>
            <CardContent className="space-y-5 px-6 pb-6">
              <div className="space-y-2 text-center">
                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  6-Digit OTP Verification Code
                </Label>

                {/* 6 Individual Digit Inputs */}
                <div className="flex justify-center gap-2 pt-2" onPaste={handleOtpPaste}>
                  {otp.map((digit, idx) => (
                    <input
                      key={idx}
                      ref={(el) => { otpInputsRef.current[idx] = el; }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(idx, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                      disabled={isLoading}
                      className="w-10 h-12 text-center text-lg font-bold bg-zinc-900/90 border border-zinc-700/80 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none transition-all text-white"
                    />
                  ))}
                </div>
              </div>

              <Button
                type="submit"
                className="btn-hover w-full bg-emerald-500 hover:bg-emerald-400 text-black font-bold h-11 rounded-xl shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/25 cursor-pointer"
                disabled={isLoading || otp.join("").length < 6}
              >
                {isLoading ? (
                  <div className="size-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                ) : (
                  "Verify OTP Code"
                )}
              </Button>

              <div className="flex items-center justify-between text-xs pt-1 border-t border-border/20">
                <button
                  type="button"
                  onClick={() => {
                    setStep(1)
                    setError("")
                  }}
                  className="text-muted-foreground hover:text-white transition-colors cursor-pointer"
                >
                  Change Email
                </button>

                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={resendCooldown > 0 || isLoading}
                  className="text-emerald-400 hover:text-emerald-300 disabled:text-zinc-600 transition-colors font-medium flex items-center gap-1 cursor-pointer"
                >
                  <RefreshCw className={`size-3 ${isLoading ? "animate-spin" : ""}`} />
                  {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend OTP"}
                </button>
              </div>
            </CardContent>
          </form>
        )}

        {/* STEP 3: Set New Password */}
        {step === 3 && (
          <form onSubmit={handleResetPassword}>
            <CardContent className="space-y-4 px-6 pb-6">
              <div className="space-y-2">
                <Label htmlFor="newPassword" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  New Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground size-4" />
                  <Input
                    id="newPassword"
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className="border-glow pl-10 pr-10 h-10 border-border/60 bg-input/20 focus-visible:border-emerald-500/50 focus-visible:ring-emerald-500/20 rounded-xl"
                    disabled={isLoading}
                    minLength={8}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword((prev) => !prev)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                  >
                    {showNewPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
                <p className="text-[11px] text-muted-foreground">Must be 8 to 32 characters</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Confirm New Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground size-4" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="border-glow pl-10 pr-10 h-10 border-border/60 bg-input/20 focus-visible:border-emerald-500/50 focus-visible:ring-emerald-500/20 rounded-xl"
                    disabled={isLoading}
                    minLength={8}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                  >
                    {showConfirmPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="btn-hover w-full mt-2 bg-emerald-500 hover:bg-emerald-400 text-black font-bold h-11 rounded-xl shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/25 cursor-pointer"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="size-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                ) : (
                  "Reset Password"
                )}
              </Button>
            </CardContent>
          </form>
        )}

        {/* SUCCESS VIEW */}
        {step === "success" && (
          <CardContent className="text-center py-6 px-6 enter-scale space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-3">
              <CheckCircle2 className="size-8 text-emerald-400" />
            </div>
            <p className="text-sm text-muted-foreground">
              Your password has been changed successfully. You can now log into your account with your new credentials.
            </p>
            <Button
              onClick={() => navigate("/login")}
              className="btn-hover w-full bg-emerald-500 hover:bg-emerald-400 text-black font-bold h-11 rounded-xl shadow-md cursor-pointer"
            >
              Proceed to Login
            </Button>
          </CardContent>
        )}

        {/* Footer */}
        <CardFooter className="flex justify-center border-t border-border/20 py-4 bg-black/10">
          <Link to="/login" className="text-sm text-muted-foreground hover:text-white transition-colors font-medium flex items-center gap-2">
            <ArrowLeft className="size-4" />
            Back to Login
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}

export default Forgot_password