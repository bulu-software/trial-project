import { useState, useEffect } from "react"
import { Routes, Route, useLocation, useNavigate, Link } from "react-router-dom"

import Home from "@/pages/public/Home"
import About from "@/pages/public/About"
import Contact from "@/pages/public/Contact"
import Login from "@/pages/auth/Login"
import Register from "@/pages/auth/Registration"
import Footer from "@/components/ui/layout/footer"
import ProductPage from "@/pages/shared/Product"
import Forgot_password from "@/pages/auth/Forgot_password"
import Reset_password from "@/pages/auth/Reset_password"
import { Toaster } from "@/components/ui/feedback/sonner"
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
  LayoutDashboard as LayoutDashboardIcon,
  ClipboardList as ClipboardListIcon,
  History as HistoryIcon,
  Tag as TagIcon,
  Menu as MenuIcon,
  X as XIcon
} from "lucide-react"
import Profile from "@/pages/auth/Profile"
import { api } from "@/services/api"
import Change_password from "@/pages/auth/Change_password"
import Dashboard from "@/pages/admin/Dashboard"
import ProductDetail from "@/pages/customer/product/Product_detail"
import Orders from "@/pages/admin/Orders"
import Terms from "@/pages/public/Terms"
import PrivacyPolicy from "@/pages/public/Privacy_policy"
import { CartProvider, useCart } from "@/pages/context/CartContext"
import { WishlistProvider, useWishlist } from "@/pages/context/WishlistContext"
import { RecentlyViewedProvider } from "@/pages/context/RecentlyViewedContext"
import Cart from "@/pages/customer/cart/Cart"
import Wishlist from "@/pages/customer/whishlist/Wishlist"
import Recently_View from "@/pages/customer/recently-view/Recently_View"
import { Badge } from "@/components/ui/display/badge"
import CustomersPage from "@/pages/admin/Customers"
import Checkout from "@/pages/customer/order/Checkout"
import OrderSuccess from "@/pages/customer/order/OrderSuccess"
import MyOrders from "@/pages/customer/order/MyOrders"
import OrderDetails from "@/pages/customer/order/OrderDetails"
import Coupon_management from "@/pages/admin/coupon/Coupon_management"
import { NotFound, ServerError, Unauthorized, ErrorBoundary } from "@/pages/errors/Errors"
import Product_plant_guide from "./pages/customer/product/Product_plant_guide"

const publicLinks = [
  { name: "Home", path: "/", icon: HomeIcon },
  { name: "Products", path: "/product", icon: LeafIcon },
  { name: "About", path: "/about", icon: InfoIcon },
  { name: "Contact", path: "/contact", icon: MailIcon },
  { name: "Login", path: "/login", icon: LogInIcon }
]

const productLinks = [
  { name: "Products", path: "/product", icon: LeafIcon },
  { name: "Cart", path: "/cart", icon: CartIcon },
  { name: "Wishlist", path: "/wishlist", icon: HeartIcon },
  { name: "My Orders", path: "/my-orders", icon: ClipboardListIcon },
  { name: "Recently Viewed", path: "/recently-viewed", icon: HistoryIcon }
]

const adminLinks = [
  { name: "Dashboard", path: "/dashboard", icon: LayoutDashboardIcon },
  { name: "Products", path: "/admin/products", icon: LeafIcon },
  { name: "Orders", path: "/admin/orders", icon: CartIcon },
  { name: "Customers", path: "/admin/customers", icon: UserIcon },
  { name: "Coupons", path: "/admin/coupon", icon: TagIcon },
]

const AppContent = () => {
  const location = useLocation()
  const navigate = useNavigate()

  const [username, setUsername] = useState<string | null>(() => localStorage.getItem("username"))
  const [role, setRole] = useState<string | null>(() => localStorage.getItem("role"))
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const { totalCount } = useCart()
  const { totalCount: wishlistCount } = useWishlist()

  useEffect(() => {
    const stored = localStorage.getItem("username")
    setUsername(stored)
    setRole(localStorage.getItem("role"))
    setMobileMenuOpen(false)
  }, [location.pathname])

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

  const handleLogout = async () => {
    try {
      await api.logout()
    } catch {
      // ignore
    }
    localStorage.removeItem("username")
    localStorage.removeItem("role")
    localStorage.removeItem("token")
    localStorage.removeItem("currentUserEmail")
    localStorage.removeItem("email")
    setUsername(null)
    setRole(null)
    setMobileMenuOpen(false)
    navigate("/login")
  }

  const navLinks = !username
    ? publicLinks
    : role === "admin"
    ? adminLinks
    : productLinks

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Top Header */}
      <header className="border-b border-border py-3.5 px-4 sm:px-6 flex items-center justify-between sticky top-0 bg-background/90 backdrop-blur-md z-50">
        <Link to="/" className="flex items-center gap-2 text-white group cursor-pointer decoration-none">
          <LeafIcon className="w-5 h-5 text-emerald-400 fill-emerald-400/10 group-hover:rotate-12 transition-transform duration-300" />
          <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-emerald-400 to-green-500 bg-clip-text text-transparent">
            PlantShop
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.path + link.name}
              to={link.path}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                location.pathname === link.path
                  ? "text-emerald-400 bg-emerald-500/10 font-semibold"
                  : "text-muted-foreground hover:text-white hover:bg-zinc-800"
              }`}
            >
              <span className="relative inline-flex">
                <link.icon className="w-4 h-4 text-emerald-400" />
                {link.name === "Cart" && totalCount > 0 && (
                  <Badge className="absolute -top-2 -right-2 bg-emerald-500 text-zinc-950 text-[9px] h-3.5 min-w-3.5 px-1 flex items-center justify-center rounded-full font-bold leading-none hover:bg-emerald-500">
                    {totalCount}
                  </Badge>
                )}
                {link.name === "Wishlist" && wishlistCount > 0 && (
                  <Badge className="absolute -top-2 -right-2 bg-emerald-500 text-zinc-950 text-[9px] h-3.5 min-w-3.5 px-1 flex items-center justify-center rounded-full font-bold leading-none hover:bg-emerald-500">
                    {wishlistCount}
                  </Badge>
                )}
              </span>
              <span>{link.name}</span>
            </Link>
          ))}
          
          {username && (
            <div id="profile-dropdown-container" className="relative ml-1">
              <button
                onClick={() => setDropdownOpen((prev) => !prev)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500/20 active:scale-[0.98] transition-all duration-200 cursor-pointer select-none"
              >
                <UserIcon className="w-4 h-4 text-emerald-400" />
                <span className="max-w-[120px] truncate">{username}</span>
                <ChevronDownIcon className={`w-3.5 h-3.5 text-emerald-400 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-100 shadow-2xl z-50 py-1.5 backdrop-blur-xl">
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

        {/* Mobile Quick Action Buttons & Menu Toggle */}
        <div className="flex md:hidden items-center gap-2">
          {username && role !== "admin" && (
            <>
              <Link
                to="/wishlist"
                className="relative p-2 rounded-lg text-zinc-300 hover:text-emerald-400 hover:bg-zinc-800/60 transition-colors"
                aria-label="Wishlist"
              >
                <HeartIcon className="w-5 h-5 text-emerald-400" />
                {wishlistCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 bg-emerald-500 text-zinc-950 text-[9px] h-4 min-w-4 px-1 flex items-center justify-center rounded-full font-bold leading-none">
                    {wishlistCount}
                  </Badge>
                )}
              </Link>
              <Link
                to="/cart"
                className="relative p-2 rounded-lg text-zinc-300 hover:text-emerald-400 hover:bg-zinc-800/60 transition-colors"
                aria-label="Cart"
              >
                <CartIcon className="w-5 h-5 text-emerald-400" />
                {totalCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 bg-emerald-500 text-zinc-950 text-[9px] h-4 min-w-4 px-1 flex items-center justify-center rounded-full font-bold leading-none">
                    {totalCount}
                  </Badge>
                )}
              </Link>
            </>
          )}

          <button
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="p-2 rounded-lg text-zinc-200 hover:text-white bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-colors cursor-pointer"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <XIcon className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer / Overlay Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden flex flex-col pt-16 bg-black/70 backdrop-blur-md animate-fade-in">
          <div 
            className="w-full bg-zinc-950 border-b border-zinc-800 shadow-2xl p-5 space-y-4 max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {username && (
              <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-900 border border-zinc-800">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-9 h-9 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                    <UserIcon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-white truncate">{username}</p>
                    <p className="text-[11px] text-zinc-400 capitalize">{role || "Customer"}</p>
                  </div>
                </div>
                {role === "admin" && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-500/15 text-amber-400 border border-amber-500/25">
                    Admin
                  </span>
                )}
              </div>
            )}

            <div className="space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path + link.name}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    location.pathname === link.path
                      ? "text-emerald-400 bg-emerald-500/10 font-semibold"
                      : "text-zinc-300 hover:text-white hover:bg-zinc-900"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <link.icon className="w-4 h-4 text-emerald-400" />
                    <span>{link.name}</span>
                  </div>
                  {link.name === "Cart" && totalCount > 0 && (
                    <Badge className="bg-emerald-500 text-zinc-950 font-bold px-2 py-0.5 text-xs">
                      {totalCount}
                    </Badge>
                  )}
                  {link.name === "Wishlist" && wishlistCount > 0 && (
                    <Badge className="bg-emerald-500 text-zinc-950 font-bold px-2 py-0.5 text-xs">
                      {wishlistCount}
                    </Badge>
                  )}
                </Link>
              ))}
            </div>

            {username && (
              <>
                <div className="h-[1px] bg-zinc-800/80 my-2" />
                <div className="space-y-1">
                  <Link
                    to="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm text-zinc-300 hover:text-white hover:bg-zinc-900"
                  >
                    <UserIcon className="w-4 h-4 text-emerald-400" />
                    <span>My Profile</span>
                  </Link>

                  <Link
                    to="/change-password"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm text-zinc-300 hover:text-white hover:bg-zinc-900"
                  >
                    <KeyIcon className="w-4 h-4 text-amber-400" />
                    <span>Change Password</span>
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 cursor-pointer text-left"
                  >
                    <LogOutIcon className="w-4 h-4 text-red-400" />
                    <span>Logout</span>
                  </button>
                </div>
              </>
            )}
          </div>
          <div className="flex-1" onClick={() => setMobileMenuOpen(false)} />
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-3 sm:p-4 md:p-6 flex flex-col justify-center">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/product" element={<ProductPage />} />
          <Route path="/plantguide" element={<Product_plant_guide/>} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/recently-viewed" element={<Recently_View />} />
          <Route path="/forgot-password" element={<Forgot_password/>} />
          <Route path="/reset-password" element={<Reset_password/>} />
          <Route path="/profile" element={<Profile/>} />
          <Route path="/change-password" element={<Change_password/>} />
          <Route path="/dashboard" element={<Dashboard/>} />
          <Route path="/admin/products" element={<ProductPage />} />
          <Route path="/admin/orders" element={<Orders />} />
          <Route path="/admin/coupon" element={<Coupon_management />} />
          <Route path="/checkout" element={<Checkout/>} />
          <Route path="/order-success" element={<OrderSuccess/>} />
          <Route path="/my-orders/:id" element={<OrderDetails/>} />
          <Route path="/admin/customers" element={<CustomersPage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-service" element={<Terms />} />
          <Route path="/my-orders" element={<MyOrders/>} />
          <Route path="/error/500" element={<ServerError />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <Footer />
      <Toaster />
    </div>
  )
}

const App = () => {
  return (
    <ErrorBoundary>
      <CartProvider>
        <WishlistProvider>
          <RecentlyViewedProvider>
            <AppContent />
          </RecentlyViewedProvider>
        </WishlistProvider>
      </CartProvider>
    </ErrorBoundary>
  )
}

export default App