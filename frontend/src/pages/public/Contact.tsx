import { useState } from "react"
import { Input } from "@/components/ui/forms/input"
import { Label } from "@/components/ui/forms/label"
import { Textarea } from "@/components/ui/forms/textarea"
import { Button } from "@/components/ui/forms/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/display/card"
import { User, Mail, MessageSquare, Leaf, ArrowRight } from "lucide-react"

const Contact = () => {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsSuccess(false)

    if (!name || !email || !message) {
      setError("Please fill in all fields")
      return
    }

    setIsLoading(true)

    try {
      const res = await fetch("https://formspree.io/f/mykrldka", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      })

      if (!res.ok) throw new Error("Failed to send")

      setIsSuccess(true)
      setName("")
      setEmail("")
      setMessage("")
    } catch (err) {
      setError("Something went wrong. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="relative flex items-center justify-center min-h-[80vh] px-6 overflow-hidden">
      {/* Decorative ambient glowing backdrops */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] rounded-full bg-emerald-500/10 blur-[80px] pointer-events-none -z-10 animate-pulse duration-[6000ms]" />
      <div className="absolute top-1/4 right-1/3 w-[250px] h-[250px] rounded-full bg-green-500/5 blur-[100px] pointer-events-none -z-10" />

      <Card className="w-full max-w-md border-border/40 bg-card/45 backdrop-blur-xl shadow-2xl shadow-emerald-950/20 hover:border-emerald-500/20 transition-all duration-500 relative overflow-hidden group">
        {/* Top accent line */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-emerald-500/20 via-emerald-400 to-green-500/20" />
        
        <CardHeader className="space-y-2 text-center pt-8">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mb-2 transition-transform duration-300 group-hover:scale-110">
            <Leaf className="size-6 fill-emerald-400/10" />
          </div>
          <CardTitle className="text-3xl font-extrabold tracking-tight text-white">Contact Us</CardTitle>
          <CardDescription className="text-muted-foreground/80 text-sm">
            Have questions or feedback? Drop us a message below
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-3 px-6 pb-6">
            {error && (
              <div className="p-3 text-xs font-medium text-destructive bg-destructive/10 border border-destructive/20 rounded-xl">
                {error}
              </div>
            )}

            {isSuccess && (
              <div className="p-3 text-xs font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                Thank you! Your message has been sent successfully.
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="name" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Full Name
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
              <Label htmlFor="message" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Message
              </Label>
              <div className="relative">
                <MessageSquare className="absolute left-3.5 top-3 text-muted-foreground size-4" />
                <Textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="pl-10 pt-2.5 min-h-[100px] border-border/60 bg-input/20 focus-visible:border-emerald-500/50 focus-visible:ring-emerald-500/20 transition-all rounded-xl"
                  disabled={isLoading}
                  required
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
                  Send Message
                  <ArrowRight className="size-4 transition-transform duration-300 group-hover/button:translate-x-1" />
                </>
              )}
            </Button>
          </CardContent>
        </form>
      </Card>
    </div>
  )
}

export default Contact