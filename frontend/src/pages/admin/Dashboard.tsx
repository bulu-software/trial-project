import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/display/card"
import { Button } from "@/components/ui/forms/button"
import { Separator } from "@/components/ui/display/separator"
import { LayoutDashboard, Sprout, ShoppingCart, Users, TrendingUp, Settings, ArrowRight } from "lucide-react"

const Dashboard = () => {
  const [username, setUsername] = useState("Admin")

  useEffect(() => {
    const stored = localStorage.getItem("username")
    if (stored) {
      setUsername(stored)
    }
  }, [])

  const stats = [
    { name: "All Plants", value: "18", description: "6 added this week", icon: Sprout, color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" },
    { name: "Total Sales", value: "Rs. 14,850", description: "Up this month", icon: TrendingUp, color: "text-blue-400 bg-blue-500/10 border-blue-500/20" },
    { name: "New Orders", value: "7", description: "3 waiting to ship", icon: ShoppingCart, color: "text-amber-400 bg-amber-500/10 border-amber-500/20" },
    { name: "Total Users", value: "142", description: "12 new signups", icon: Users, color: "text-purple-400 bg-purple-500/10 border-purple-500/20" }
  ]

  return (
    <div className="min-h-[80vh] bg-zinc-950 text-white py-4 sm:py-6 px-2 sm:px-4">
      <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8">
        
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-zinc-900/40 p-4 sm:p-6 rounded-2xl border border-zinc-800 backdrop-blur-md relative overflow-hidden">
          <div className="absolute top-0 left-0 w-60 h-60 bg-emerald-500/5 rounded-full blur-[80px] pointer-events-none -z-10" />
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2.5">
              <LayoutDashboard className="w-6 h-6 sm:w-8 sm:h-8 text-emerald-400 shrink-0" />
              <span>Welcome back, {username}!</span>
            </h1>
            <p className="text-zinc-400 text-xs sm:text-sm">
              Here is your plant store admin dashboard.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full sm:w-auto">
            <Link to="/profile" className="flex-1 sm:flex-initial">
              <Button size="sm" className="w-full bg-zinc-800 hover:bg-zinc-700 text-zinc-100 rounded-xl flex items-center justify-center gap-1.5 border border-zinc-700 text-xs">
                <Settings className="w-4 h-4" />
                Profile Settings
              </Button>
            </Link>
            <Link to="/product" className="flex-1 sm:flex-initial">
              <Button size="sm" className="w-full bg-emerald-500 hover:bg-emerald-600 text-zinc-950 font-bold rounded-xl flex items-center justify-center gap-1.5 text-xs">
                View Shop
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <Card key={i} className="bg-zinc-900/60 border-zinc-800 hover:border-zinc-700 transition-all duration-300 relative overflow-hidden group">
              <CardContent className="p-5 flex items-center justify-between">
                <div className="space-y-1.5">
                  <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">{stat.name}</p>
                  <p className="text-2xl font-extrabold text-white">{stat.value}</p>
                  <p className="text-[10px] text-zinc-500">{stat.description}</p>
                </div>
                <div className={`p-3 rounded-xl border flex items-center justify-center ${stat.color}`}>
                  <stat.icon className="w-5 h-5" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Activities / Recent Orders */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 bg-zinc-900/40 border-zinc-800">
            <CardHeader className="p-5 pb-3">
              <CardTitle className="text-lg font-bold text-white">Recent Updates</CardTitle>
              <CardDescription className="text-zinc-500 text-xs">Latest changes made to the store</CardDescription>
            </CardHeader>
            <CardContent className="p-5 pt-0 space-y-4">
              <Separator className="bg-zinc-800" />
              <div className="space-y-3">
                {[
                  { action: "Stock updated", detail: "Monstera stock updated to 15", time: "2 hours ago" },
                  { action: "New product added", detail: "Added a new succulent set to the shop", time: "Yesterday" },
                  { action: "Settings updated", detail: "Store rules and banner links updated", time: "3 days ago" }
                ].map((act, i) => (
                  <div key={i} className="flex justify-between items-center py-2 px-3 rounded-lg bg-zinc-950/20 border border-zinc-800/50">
                    <div className="space-y-0.5">
                      <p className="text-xs font-bold text-zinc-200">{act.action}</p>
                      <p className="text-[11px] text-zinc-400">{act.detail}</p>
                    </div>
                    <span className="text-[10px] text-zinc-500 font-medium">{act.time}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900/40 border-zinc-800">
            <CardHeader className="p-5 pb-3">
              <CardTitle className="text-lg font-bold text-white">Quick Links</CardTitle>
              <CardDescription className="text-zinc-500 text-xs">Go to other pages quickly</CardDescription>
            </CardHeader>
            <CardContent className="p-5 pt-0 space-y-4">
              <Separator className="bg-zinc-800" />
              <div className="flex flex-col gap-2">
                <Link to="/product">
                  <Button variant="ghost" className="w-full justify-start text-xs text-zinc-300 hover:text-white hover:bg-zinc-800/60 rounded-lg">
                    Manage Plants
                  </Button>
                </Link>
                <Link to="/profile">
                  <Button variant="ghost" className="w-full justify-start text-xs text-zinc-300 hover:text-white hover:bg-zinc-800/60 rounded-lg">
                    My Profile
                  </Button>
                </Link>
                <Link to="/change-password">
                  <Button variant="ghost" className="w-full justify-start text-xs text-zinc-300 hover:text-white hover:bg-zinc-800/60 rounded-lg">
                    Change Password
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  )
}

export default Dashboard