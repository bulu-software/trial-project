import { useState, useEffect } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import { products, type Product } from "@/data/products"
import { Button } from "@/components/ui/forms/button"
import { Badge } from "@/components/ui/display/badge"
import { Separator } from "@/components/ui/display/separator"
import { 
  ArrowLeft, 
  ShoppingCart, 
  Heart, 
  Star, 
  Minus, 
  Plus, 
  Check, 
  ShieldCheck, 
  Truck,
  Leaf
} from "lucide-react"
import { toast } from "sonner"
import { useRecentlyViewed } from "@/pages/context/RecentlyViewedContext"
import { formatPrice } from "@/lib/utils"

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const isAdmin = localStorage.getItem("role") === "admin"
  const [product, setProduct] = useState<Product | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [isWishlisted, setIsWishlisted] = useState(false)

  const { addToRecentlyViewed } = useRecentlyViewed()

  useEffect(() => {
    if (id) {
      const found = products.find((p) => p.id === Number(id))
      if (found) {
        setProduct(found)
      }
    }
  }, [id])

  // Track this product as recently viewed once it loads
  useEffect(() => {
    if (product) {
      addToRecentlyViewed({
        id: String(product.id),
        name: product.name,
        image: product.image,
        price: product.price,
      })
    }
  }, [product])

  if (!product) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-white bg-zinc-950 px-4">
        <p className="text-zinc-400 mb-4">Product not found.</p>
        <Link to="/product">
          <Button className="bg-emerald-500 hover:bg-emerald-600 text-zinc-950 font-bold rounded-xl flex items-center gap-1.5">
            <ArrowLeft className="w-4 h-4" />
            Back to Shop
          </Button>
        </Link>
      </div>
    )
  }

  const handleDecrease = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1)
    }
  }

  const handleIncrease = () => {
    if (quantity < 10) {
      setQuantity((prev) => prev + 1)
    }
  }

  const handleAddToCart = () => {
    toast.success(`${product.name} added to cart`, {
      description: `Quantity: ${quantity} item(s). Total: ${formatPrice(product.price * quantity)}`
    })
  }

  const toggleWishlist = () => {
    setIsWishlisted((prev) => !prev)
    toast.success(isWishlisted ? "Removed from wishlist" : "Added to wishlist", {
      description: `${product.name} has been updated in your profile.`
    })
  }

  return (
    <div className="min-h-[80vh] bg-zinc-950 text-white py-4 sm:py-8 px-2 sm:px-4 relative overflow-hidden isolate">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] rounded-full bg-emerald-500/5 blur-[100px] pointer-events-none -z-10 animate-pulse duration-[8000ms]" />

      <div className="max-w-5xl mx-auto space-y-4 sm:space-y-6">
        
        {/* Back Button */}
        <div>
          <button
            onClick={() => navigate("/product")}
            className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-emerald-400 transition-colors duration-200 cursor-pointer font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Shop
          </button>
        </div>

        {/* Detail Panel */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 md:gap-12 bg-zinc-900/40 p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl border border-zinc-800 backdrop-blur-md">
          
          {/* Left Column: Image */}
          <div className="relative w-full h-[260px] sm:h-[340px] md:h-[400px] rounded-xl sm:rounded-2xl overflow-hidden border border-zinc-800 group shadow-2xl">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            {product.badge && (
              <Badge className="absolute top-3 sm:top-4 left-3 sm:left-4 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/10 text-xs px-2.5 sm:px-3 py-1 font-semibold rounded-full">
                {product.badge}
              </Badge>
            )}
            <button
              onClick={toggleWishlist}
              aria-label="Toggle wishlist"
              aria-pressed={isWishlisted}
              className="absolute top-3 sm:top-4 right-3 sm:right-4 p-2 sm:p-2.5 rounded-full bg-zinc-950/80 backdrop-blur border border-zinc-800 text-zinc-300 hover:text-red-400 transition-all duration-200 cursor-pointer"
            >
              <Heart className={`w-4 h-4 ${isWishlisted ? "fill-red-400 text-red-400" : ""}`} />
            </button>
          </div>

          {/* Right Column: Details Info */}
          <div className="flex flex-col justify-between space-y-5 sm:space-y-6">
            <div className="space-y-3 sm:space-y-4">
              <div className="space-y-2">
                <Badge variant="outline" className="border-emerald-500/30 text-emerald-400 text-[10px] uppercase tracking-wider font-semibold rounded-md bg-emerald-500/5">
                  {product.category}
                </Badge>
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white leading-tight">
                  {product.name}
                </h1>
                <div className="flex items-center gap-2 text-xs text-zinc-400 mt-1">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span className="font-semibold text-white">{product.rating}</span>
                  </div>
                  <span>•</span>
                  <span>({product.reviews} reviews)</span>
                </div>
              </div>

              <div className="text-xl sm:text-2xl font-black text-white pt-1">
                {formatPrice(product.price)}
              </div>

              <Separator className="bg-zinc-800" />

              <div className="space-y-2.5 sm:space-y-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Key Features</p>
                <div className="grid grid-cols-1 gap-2">
                  {product.features.map((feature) => (
                    <div key={feature} className="flex items-center gap-2 text-xs text-zinc-300">
                      <div className="p-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shrink-0">
                        <Check className="w-3 h-3" />
                      </div>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-4 pt-3 sm:pt-4 border-t border-zinc-800">
              {/* Quantity controls */}
              {!isAdmin && (
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Quantity</span>
                  <div className="flex items-center gap-3 bg-zinc-950/60 border border-zinc-800 rounded-xl px-2 py-1">
                    <button
                      onClick={handleDecrease}
                      disabled={quantity <= 1}
                      className="p-1 text-zinc-400 hover:text-white disabled:opacity-30 disabled:hover:text-zinc-400 cursor-pointer"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-sm font-bold text-white w-6 text-center select-none">{quantity}</span>
                    <button
                      onClick={handleIncrease}
                      disabled={quantity >= 10}
                      className="p-1 text-zinc-400 hover:text-white disabled:opacity-30 disabled:hover:text-zinc-400 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              {!isAdmin && (
                <div className="flex gap-3">
                  <Button
                    onClick={handleAddToCart}
                    className="w-full bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold h-11 rounded-xl shadow-lg hover:shadow-emerald-500/20 hover:scale-[1.01] active:scale-[0.99] transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    Add to Cart
                  </Button>
                </div>
              )}

              {/* Delivery / Guarantee */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 pt-1">
                <div className="flex items-center gap-2 text-[10px] text-zinc-500">
                  <Truck className="w-4 h-4 text-zinc-600 shrink-0" />
                  <span>Free shipping above ₹999</span>
                </div>
                <div className="flex items-center gap-2 text-[10px] text-zinc-500">
                  <ShieldCheck className="w-4 h-4 text-zinc-600 shrink-0" />
                  <span>100% Healthy Plant Guarantee</span>
                </div>
              </div>

              {/* Plant Care Guide Link */}
              <Link
                to="/plantguide"
                className="flex items-center justify-center gap-2 text-xs font-semibold text-emerald-400 hover:text-emerald-300 border border-emerald-500/20 hover:border-emerald-500/40 bg-emerald-500/5 hover:bg-emerald-500/10 rounded-xl h-10 transition-all duration-200"
              >
                <Leaf className="w-3.5 h-3.5" />
                View Plant Care Guide
              </Link>
            </div>

          </div>

        </div>

      </div>
    </div>
  )
}

export default ProductDetail