import { useState, type FormEvent } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/display/card"
import { Label } from "@/components/ui/forms/label"
import { Input } from "@/components/ui/forms/input"
import { Button } from "@/components/ui/forms/button"
import { Key, Eye, EyeOff, Lock, Check } from "lucide-react"
import { api } from "@/services/api"

const Change_password = () => {
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPasswordCurrent, setShowPasswordCurrent] = useState(false)
  const [showPasswordNew, setShowPasswordNew] = useState(false)
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const navigate = useNavigate()

  const validate = (): string | null => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      return "Please fill in all fields"
    }
    if (newPassword.length < 8 || newPassword.length > 16) {
      return "Password must be 8-16 characters"
    }
    if (newPassword === currentPassword) {
      return "Cannot be the same as current password"
    }
    if (newPassword !== confirmPassword) {
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

    const token = localStorage.getItem("token")
    if (!token) {
      setError("You must be logged in to change your password")
      toast.error("Not Authenticated", { description: "Please log in first." })
      navigate("/login")
      return
    }

    setIsLoading(true)

    try {
      await api.changePassword({
        current_password: currentPassword,
        new_password: newPassword,
      }, token || undefined)

      toast.success("Password Changed Successfully", {
        description: "Your security credentials have been updated.",
      })
      navigate("/product")
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to change password"
      setError(msg)
      toast.error("Error", { description: msg })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="relative flex items-center justify-center py-8 px-4 overflow-hidden bg-zinc-950 text-white">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] h-[280px] rounded-full bg-emerald-500/10 blur-[80px] pointer-events-none -z-10" />

      <Card className="w-full max-w-sm border-zinc-800 bg-zinc-900/60 backdrop-blur-xl shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-emerald-500/20 via-emerald-400 to-green-500/20" />

        <CardHeader className="space-y-2 text-center pt-6 pb-2">
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <Key className="size-5 text-emerald-400" />
          </div>
          <CardTitle className="text-2xl font-extrabold tracking-tight text-white">Change Password</CardTitle>
          <CardDescription className="text-zinc-400 text-xs">
            Update your account password securely
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-3.5 px-5 pb-6">
            {error && (
              <div className="p-2.5 text-[11px] font-medium text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg">
                {error}
              </div>
            )}

            <div className="space-y-1.5">
              <Label className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
                Current Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 size-3.5" />
                <Input
                  type={showPasswordCurrent ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="pl-9 pr-9 h-9 border-zinc-800 bg-zinc-950/40 text-xs text-white focus-visible:border-emerald-500/50 focus-visible:ring-emerald-500/20 rounded-lg"
                  disabled={isLoading}
                  minLength={8}
                  maxLength={16}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPasswordCurrent((prev) => !prev)}
                  disabled={isLoading}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  {showPasswordCurrent ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
                New Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 size-3.5" />
                <Input
                  type={showPasswordNew ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="pl-9 pr-9 h-9 border-zinc-800 bg-zinc-950/40 text-xs text-white focus-visible:border-emerald-500/50 focus-visible:ring-emerald-500/20 rounded-lg"
                  disabled={isLoading}
                  minLength={8}
                  maxLength={16}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPasswordNew((prev) => !prev)}
                  disabled={isLoading}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  {showPasswordNew ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
                </button>
              </div>
              <p className="text-[9px] text-zinc-500 leading-none">Must be 8-16 characters</p>
            </div>

            <div className="space-y-1.5">
              <Label className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
                Confirm New Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 size-3.5" />
                <Input
                  type={showPasswordConfirm ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pl-9 pr-9 h-9 border-zinc-800 bg-zinc-950/40 text-xs text-white focus-visible:border-emerald-500/50 focus-visible:ring-emerald-500/20 rounded-lg"
                  disabled={isLoading}
                  minLength={8}
                  maxLength={16}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPasswordConfirm((prev) => !prev)}
                  disabled={isLoading}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  {showPasswordConfirm ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full mt-3 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 text-xs font-bold h-9 rounded-lg shadow-lg hover:shadow-emerald-500/25 transition-all duration-300 hover:scale-[1.01] active:scale-[0.99] cursor-pointer flex items-center justify-center gap-1.5"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="size-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Check className="size-3.5" />
                  Update Password
                </>
              )}
            </Button>
          </CardContent>
        </form>
      </Card>
    </div>
  )
}

export default Change_password