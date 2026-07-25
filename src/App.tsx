import { useState, useEffect } from "react"
import { Routes, Route, useLocation, useNavigate, Link } from "react-router-dom"

import Home from "@/pages/Home"
import About from "@/pages/about"
import Contact from "@/pages/contact"
import Login from "@/pages/login"
import Register from "@/pages/registration"
import Footer from "@/components/ui/footer"
import ProductPage from "./pages/Product"
import Forgot_password from "./pages/Forgot_password"
import { Toaster } from "@/components/ui/sonner"
import { 
  Home as HomeIcon, 
  LogIn as LogInIcon, 
  Info as InfoIcon, 
  Mail as MailIcon, 
  Leaf as LeafIcon, 
  ShoppingCart as CartIcon, 
  Heart as HeartIcon, 
  LogOut as LogOutIcon,
  User as UserIcon,
  ChevronDown as ChevronDownIcon,
  Key as KeyIcon,
  LayoutDashboard as LayoutDashboardIcon
} from "lucide-react"
import Profile from "./pages/Profile"
import Change_password from "./pages/Change_password"
import Dashboard from "./pages/Dashboard"
import ProductDetail from "./pages/Product_detail"
import Orders from "./pages/Orders"
import Terms from "./pages/Terms"
import PrivacyPolicy from "./pages/Privacy_policy"


const publicLinks = [
  { name: "Home", path: "/", icon: HomeIcon },
  { name: "Login", path: "/login", icon: LogInIcon },
  { name: "About", path: "/about", icon: InfoIcon },
  { name: "Contact", path: "/contact", icon: MailIcon }
]

const productLinks = [
  { name: "Dashboard", path: "/dashboard", icon: LayoutDashboardIcon },
  { name: "Product", path: "/product", icon: LeafIcon },
  { name: "Cart", path: "/product", icon: CartIcon },
  { name: "Wishlist", path: "/product", icon: HeartIcon }
]

const adminLinks = [
  { name: "Dashboard", path: "/dashboard", icon: LayoutDashboardIcon },
  { name: "Products", path: "/product", icon: LeafIcon },
  { name: "Orders", path: "/admin/orders", icon: CartIcon },
  { name: "Customers", path: "/admin/customers", icon: UserIcon },
]

const App = () => {
  // Track current URL path and allow header navigation redirecting
  const location = useLocation()
  const navigate = useNavigate()

  // Track the logged-in username
  const [username, setUsername] = useState<string | null>(() => localStorage.getItem("username"))
  // Track the user's role
  const [role, setRole] = useState<string | null>(() => localStorage.getItem("role"))
  
  // Track dropdown visibility
  const [dropdownOpen, setDropdownOpen] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem("username")
    setUsername(stored)
    setRole(localStorage.getItem("role"))
  }, [location.pathname])

  // Close dropdown if user clicks outside of the profile menu
  useEffect(() => {
    if (!dropdownOpen) return

    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (!target.closest("#profile-dropdown-container")) {
        setDropdownOpen(false)
      }
    }

    document.addEventListener("mousedown", handleOutsideClick)
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick)
    }
  }, [dropdownOpen])

  // Handle logging out the user and routing them back to the login page
  const handleLogout = () => {
    localStorage.removeItem("username")
    localStorage.removeItem("role")
    setUsername(null)
    setRole(null)
    navigate("/login")
  }

  // Filter links based on auth + role
  const navLinks = !username
    ? publicLinks
    : role === "admin"
    ? adminLinks
    : productLinks

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <header className="border-b border-border py-4 px-6 flex items-center justify-between sticky top-0 bg-background/80 backdrop-blur-md z-50">
        <Link to="/" className="flex items-center gap-2 text-white group cursor-pointer decoration-none">
          <LeafIcon className="w-5 h-5 text-emerald-400 fill-emerald-400/10 group-hover:rotate-12 transition-transform duration-300" />
          <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-emerald-400 to-green-500 bg-clip-text text-transparent">
            PlantShop
          </span>
        </Link>
        <nav className="flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.path + link.name}
              to={link.path}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-white hover:bg-zinc-800 transition-all duration-200"
            >
              <link.icon className="w-4 h-4 text-emerald-400" />
              <span>{link.name}</span>
            </Link>
          ))}
          {username && (
            <div id="profile-dropdown-container" className="relative">
              <button
                onClick={() => setDropdownOpen((prev) => !prev)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500/20 active:scale-[0.98] transition-all duration-200 cursor-pointer select-none"
              >
                <UserIcon className="w-4 h-4 text-emerald-400" />
                <span>{username}</span>
                <ChevronDownIcon className={`w-3.5 h-3.5 text-emerald-400 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-xl bg-zinc-950/95 border border-zinc-800 text-zinc-100 shadow-2xl z-50 py-1.5 backdrop-blur-xl animate-fade-in">
                  {/* User header section */}
                  <div className="px-4 py-2 border-b border-zinc-800/80">
                    <p className="text-xs text-zinc-500 font-semibold uppercase tracking-wider">User Account</p>
                    <p className="text-sm font-bold text-white truncate mt-0.5">{username}</p>
                    {role === "admin" && (
                      <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-amber-500/15 text-amber-400 border border-amber-500/25">
                        <LayoutDashboardIcon className="w-2.5 h-2.5" />
                        Admin
                      </span>
                    )}
                  </div>
                  
                  {/* Menu items */}
                  <div className="p-1 space-y-0.5">
                    <Link
                      to="/profile"
                      onClick={() => setDropdownOpen(false)}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-zinc-300 hover:text-white hover:bg-zinc-800/60 transition-all duration-150 text-left cursor-pointer border-0 bg-transparent decoration-none"
                    >
                      <UserIcon className="w-4 h-4 text-emerald-400" />
                      <span>Profile</span>
                    </Link>

                    <Link
                      to="/change-password"
                      onClick={() => setDropdownOpen(false)}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-zinc-300 hover:text-white hover:bg-zinc-800/60 transition-all duration-150 text-left cursor-pointer border-0 bg-transparent decoration-none"
                    >
                      <KeyIcon className="w-4 h-4 text-amber-400" />
                      <span>Change Password</span>
                    </Link>

                    <div className="h-[1px] bg-zinc-800/80 my-1 mx-1" />

                    <button
                      onClick={() => {
                        setDropdownOpen(false)
                        handleLogout()
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-150 text-left cursor-pointer border-0 bg-transparent"
                    >
                      <LogOutIcon className="w-4 h-4 text-red-400" />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </nav>
      </header>
      
      <main className="flex-1 max-w-6xl w-full mx-auto p-6 flex flex-col justify-center">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/product" element={<ProductPage />} />
          <Route path="/Product" element={<ProductPage />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/forgot-password" element={<Forgot_password/>} />
          <Route path="/profile" element={<Profile/>} />
          <Route path="/change-password" element={<Change_password/>} />
          <Route path="/dashboard" element={<Dashboard/>} />
          <Route path="/admin/orders" element={<Orders />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-service" element={<Terms />} />
        </Routes>
      </main>

      <Footer />
      {/* Renders global sonner toast notifications at the screen level */}
      <Toaster />
    </div>
  )
}

export default App