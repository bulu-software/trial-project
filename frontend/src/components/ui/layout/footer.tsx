import { Link, useLocation } from "react-router-dom"
import { Leaf } from "lucide-react"

const Footer = () => {
  // Track current location path
  const location = useLocation()
  // Check if we are on a product details or catalog page to conditionally hide footer navigation links
  const isProductPage = location.pathname.startsWith("/product")

  return (
    <footer className="border-t border-border/40 bg-card/10 backdrop-blur-sm mt-auto py-6 px-6 w-full">
      <div className="max-w-5xl mx-auto w-full flex flex-col gap-5">
        
        {/* Row 1: Logo Left, Nav Links Right */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 w-full">
          <div className="flex items-center gap-2 text-white group cursor-pointer">
            <Leaf className="size-5 text-emerald-400 fill-emerald-400/10 group-hover:rotate-12 transition-transform duration-300" />
            <span className="text-lg font-bold tracking-tight bg-gradient-to-r from-emerald-400 to-green-500 bg-clip-text text-transparent">
              PlantShop
            </span>
          </div>

          {!isProductPage && (
            <nav className="flex items-center gap-6">
              <Link
                to="/about"
                className="text-muted-foreground text-sm hover:text-emerald-400 transition-colors duration-300 relative py-1 after:absolute after:bottom-0 after:left-0 after:h-[1.5px] after:w-0 after:bg-emerald-400 hover:after:w-full after:transition-all after:duration-300"
              >
                About
              </Link>
              <Link
                to="/contact"
                className="text-muted-foreground text-sm hover:text-emerald-400 transition-colors duration-300 relative py-1 after:absolute after:bottom-0 after:left-0 after:h-[1.5px] after:w-0 after:bg-emerald-400 hover:after:w-full after:transition-all after:duration-300"
              >
                Contact
              </Link>
            </nav>
          )}
        </div>

        {/* Divider with gradient */}
        <div className="w-full h-[1px] bg-gradient-to-r from-emerald-500/5 via-border/40 to-emerald-500/5" />

        {/* Row 2: Copyright Left, Socials Right */}
        <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-3 w-full text-xs text-muted-foreground/75 text-center sm:text-left">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-4 gap-y-1">
            <span>© {new Date().getFullYear()} PlantShop Inc.</span>
            <span className="hidden sm:inline text-muted-foreground/20">•</span>
            <Link to="/privacy-policy" className="hover:text-emerald-400 transition-colors duration-200">
              Privacy Policy
            </Link>
            <span className="hidden sm:inline text-muted-foreground/20">•</span>
            <Link to="/terms-of-service" className="hover:text-emerald-400 transition-colors duration-200">
              Terms of Service
            </Link>
          </div>

          {/* Social Icons */}
          <div className="flex items-center gap-5">
            <a
              href="#instagram"
              className="hover:text-emerald-400 hover:scale-110 active:scale-95 transition-all duration-300"
              aria-label="Instagram"
            >
              <svg className="size-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
            </a>
            <a
              href="#facebook"
              className="hover:text-emerald-400 hover:scale-110 active:scale-95 transition-all duration-300"
              aria-label="Facebook"
            >
              <svg className="size-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
              </svg>
            </a>
            <a
              href="#twitter"
              className="hover:text-emerald-400 hover:scale-110 active:scale-95 transition-all duration-300"
              aria-label="Twitter"
            >
              <svg className="size-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
              </svg>
            </a>
          </div>
        </div>

      </div>
    </footer>
  )
}

export default Footer
