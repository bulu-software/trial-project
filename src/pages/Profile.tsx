import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import {
  User, Mail, Shield, CheckCircle, Calendar,
  Pencil, Trash2, X, Save, AlertTriangle,
} from "lucide-react"

const Profile = () => {
  const navigate = useNavigate()

  const [username, setUsername] = useState("User")
  const [email, setEmail]       = useState("")
  const [role, setRole]         = useState("user")

  // Edit mode state
  const [editing, setEditing]         = useState(false)
  const [editName, setEditName]       = useState("")
  const [editEmail, setEditEmail]     = useState("")

  // Delete confirmation state
  const [confirmDelete, setConfirmDelete] = useState(false)

  useEffect(() => {
    const storedName  = localStorage.getItem("username") ?? "User"
    const storedEmail = localStorage.getItem("email")    ?? `${storedName.toLowerCase()}@plantshop.com`
    const storedRole  = localStorage.getItem("role")     ?? "user"

    setUsername(storedName)
    setEmail(storedEmail)
    setRole(storedRole)
  }, [])

  /* ── Edit handlers ── */
  const startEdit = () => {
    setEditName(username)
    setEditEmail(email)
    setEditing(true)
  }

  const cancelEdit = () => setEditing(false)

  const saveEdit = () => {
    const trimName  = editName.trim()
    const trimEmail = editEmail.trim()

    if (!trimName)                         return toast.error("Username cannot be empty")
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimEmail))
                                           return toast.error("Please enter a valid email")

    localStorage.setItem("username", trimName)
    localStorage.setItem("email",    trimEmail)
    setUsername(trimName)
    setEmail(trimEmail)
    setEditing(false)
    toast.success("Profile updated successfully!")
  }

  /* ── Delete handler ── */
  const handleDelete = () => {
    localStorage.removeItem("username")
    localStorage.removeItem("email")
    localStorage.removeItem("role")
    toast.success("Account deleted. Redirecting...")
    setTimeout(() => navigate("/login"), 1200)
  }

  const roleBadgeStyle =
    role === "admin"
      ? "bg-amber-500/15 text-amber-400 border-amber-500/25"
      : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"

  return (
    <div className="relative flex items-center justify-center py-8 px-4 overflow-hidden bg-zinc-950 text-white">
      {/* Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full bg-emerald-500/10 blur-[90px] pointer-events-none -z-10" />

      <Card className="w-full max-w-md border-zinc-800 bg-zinc-900/60 backdrop-blur-xl shadow-2xl relative overflow-hidden">
        {/* Top accent */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-emerald-500/20 via-emerald-400 to-green-500/20" />

        {/* ── Header ── */}
        <CardHeader className="space-y-3 text-center pt-6 pb-2">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 shadow-inner">
            <span className="text-2xl font-extrabold tracking-wider uppercase">
              {username.slice(0, 2)}
            </span>
          </div>
          <div>
            <CardTitle className="text-2xl font-extrabold tracking-tight text-white">{username}</CardTitle>
            <CardDescription className="text-zinc-400 text-xs mt-0.5">
              Manage your account settings
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="px-5 pb-6 space-y-4">
          <Separator className="bg-zinc-800" />

          {/* ── VIEW MODE ── */}
          {!editing ? (
            <div className="space-y-2.5">

              {/* Username */}
              <div className="flex items-center justify-between py-2 px-3 rounded-lg bg-zinc-950/40 border border-zinc-800/80">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-medium text-zinc-400">Username</span>
                </div>
                <span className="text-xs font-semibold text-white">{username}</span>
              </div>

              {/* Email */}
              <div className="flex items-center justify-between py-2 px-3 rounded-lg bg-zinc-950/40 border border-zinc-800/80">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-medium text-zinc-400">Email</span>
                </div>
                <span className="text-xs font-semibold text-white truncate max-w-[200px]">{email}</span>
              </div>

              {/* Role */}
              <div className="flex items-center justify-between py-2 px-3 rounded-lg bg-zinc-950/40 border border-zinc-800/80">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-medium text-zinc-400">Role</span>
                </div>
                <Badge className={`border text-[10px] px-2 py-0.5 capitalize ${roleBadgeStyle}`}>
                  {role}
                </Badge>
              </div>

              {/* Status */}
              <div className="flex items-center justify-between py-2 px-3 rounded-lg bg-zinc-950/40 border border-zinc-800/80">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-medium text-zinc-400">Status</span>
                </div>
                <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  Active
                </div>
              </div>

              {/* Joined */}
              <div className="flex items-center justify-between py-2 px-3 rounded-lg bg-zinc-950/40 border border-zinc-800/80">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-medium text-zinc-400">Joined</span>
                </div>
                <span className="text-xs font-semibold text-white">July 2026</span>
              </div>

              {/* Action buttons */}
              <div className="flex gap-2 pt-1">
                <Button
                  onClick={startEdit}
                  className="flex-1 h-9 bg-emerald-500 hover:bg-emerald-400 text-black font-semibold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Pencil className="w-3.5 h-3.5" />
                  Edit Profile
                </Button>
                <Button
                  onClick={() => setConfirmDelete(true)}
                  className="flex-1 h-9 bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 border border-red-500/20 hover:border-red-500/40 font-semibold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer"
                  variant="ghost"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Delete Account
                </Button>
              </div>
            </div>
          ) : (

            /* ── EDIT MODE ── */
            <div className="space-y-3">
              <div className="space-y-1.5">
                <Label htmlFor="edit-username" className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  Username
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                  <Input
                    id="edit-username"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="pl-9 h-10 bg-zinc-950/60 border-zinc-700 focus-visible:border-emerald-500/50 focus-visible:ring-emerald-500/20 rounded-xl text-sm"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="edit-email" className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                  <Input
                    id="edit-email"
                    type="email"
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    className="pl-9 h-10 bg-zinc-950/60 border-zinc-700 focus-visible:border-emerald-500/50 focus-visible:ring-emerald-500/20 rounded-xl text-sm"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-1">
                <Button
                  onClick={saveEdit}
                  className="flex-1 h-9 bg-emerald-500 hover:bg-emerald-400 text-black font-semibold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  Save Changes
                </Button>
                <Button
                  onClick={cancelEdit}
                  variant="ghost"
                  className="flex-1 h-9 bg-zinc-800/60 hover:bg-zinc-700/60 text-zinc-300 hover:text-white rounded-xl text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {/* ── DELETE CONFIRMATION DIALOG ── */}
          {confirmDelete && (
            <div className="mt-2 p-4 rounded-xl bg-red-950/30 border border-red-500/30 space-y-3 animate-fade-in">
              <div className="flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-bold text-red-300">Delete your account?</p>
                  <p className="text-xs text-red-400/70 mt-0.5">
                    This action cannot be undone. All your data will be permanently removed.
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={handleDelete}
                  className="flex-1 h-8 bg-red-500 hover:bg-red-400 text-white font-semibold rounded-lg text-xs cursor-pointer"
                >
                  Yes, Delete
                </Button>
                <Button
                  onClick={() => setConfirmDelete(false)}
                  variant="ghost"
                  className="flex-1 h-8 bg-zinc-800/60 hover:bg-zinc-700/60 text-zinc-300 rounded-lg text-xs cursor-pointer"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default Profile
