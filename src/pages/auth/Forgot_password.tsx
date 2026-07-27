import { useState, type FormEvent } from "react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/forms/button"
import { Input } from "@/components/ui/forms/input"
import { Label } from "@/components/ui/forms/label"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/display/card"
import { Sprout, ArrowLeft, Mail, CheckCircle2 } from "lucide-react"

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const Forgot_password = () => {
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    setError("")

    if (!email) {
      setError("Please enter your email")
      return
    }
    if (!EMAIL_REGEX.test(email)) {
      setError("Please enter a valid email address")
      return
    }

    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      setSubmitted(true)
    }, 1200)
  }

  return (
    <div className="relative flex items-center justify-center min-h-[80vh] px-6 overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] rounded-full bg-emerald-500/10 blur-[80px] pointer-events-none -z-10 animate-pulse duration-[6000ms]" />
      <div className="absolute top-1/3 left-1/4 w-[250px] h-[250px] rounded-full bg-green-500/5 blur-[100px] pointer-events-none -z-10" />

      <Card className="enter-fade-up card-hover w-full max-w-md border-border/40 bg-card/45 backdrop-blur-xl shadow-2xl shadow-emerald-950/20 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-emerald-500/20 via-emerald-400 to-green-500/20" />

        <CardHeader className="space-y-2 text-center pt-8">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mb-2">
            <Sprout className="size-6 fill-emerald-400/10" />
          </div>
          <CardTitle className="text-3xl font-extrabold tracking-tight text-foreground">
            Forgot Password?
          </CardTitle>
          <CardDescription className="text-muted-foreground/80 text-sm">
            {submitted
              ? "Check your inbox for a reset link"
              : "Enter your email and we'll send you a reset link"}
          </CardDescription>
        </CardHeader>

        {!submitted ? (
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4 px-6 pb-6">
              {error && (
                <div className="p-3 text-xs font-medium text-destructive bg-destructive/10 border border-destructive/20 rounded-xl">
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
                    className="border-glow pl-10 h-10 border-border/60 bg-input/20 focus-visible:border-emerald-500/50 focus-visible:ring-emerald-500/20 rounded-xl"
                    disabled={isLoading}
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="btn-hover w-full mt-2 bg-emerald-500 hover:bg-emerald-400 text-black font-semibold h-11 rounded-xl shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/25"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="size-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                ) : (
                  "Send Reset Link"
                )}
              </Button>
            </CardContent>
          </form>
        ) : (
          <CardContent className="text-center py-4 px-6 enter-scale">
            <div className="w-14 h-14 mx-auto rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-3">
              <CheckCircle2 className="size-6 text-emerald-400" />
            </div>
            <p className="text-sm text-muted-foreground">
              We sent a reset link to{" "}
              <span className="text-foreground font-medium">{email}</span>
            </p>
          </CardContent>
        )}

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