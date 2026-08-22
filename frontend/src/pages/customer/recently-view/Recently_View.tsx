import { Link } from "react-router-dom";
import { useRecentlyViewed } from "../../context/RecentlyViewedContext";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import { Card } from "@/components/ui/display/card";
import { Button } from "@/components/ui/forms/button";
import { Badge } from "@/components/ui/display/badge";
import {
  History,
  Trash2,
  ShoppingCart,
  Heart,
  ArrowRight,
  Leaf,
  Sparkles,
  Eye,
  Check,
  Star,
  ShieldCheck,
  Truck,
  MessageSquareHeart,
  Flower2
} from "lucide-react";
import { useState, useMemo } from "react";
import { toast } from "sonner";
import { products as catalogProducts, type Product } from "@/data/products";

const Recently_View = () => {
  const { recentlyViewed, clearRecentlyViewed } = useRecentlyViewed();
  const { addItem } = useCart();
  const { toggleItem, isWishlisted } = useWishlist();
  const [addedId, setAddedId] = useState<string | number | null>(null);

  const handleAddToCart = (e: React.MouseEvent, product: { id: string | number; name: string; price: number; image?: string }) => {
    e.preventDefault();
    e.stopPropagation();

    addItem({
      id: Number(product.id),
      name: product.name,
      price: product.price,
      image: product.image || "",
    });

    setAddedId(product.id);
    toast.success(`${product.name} added to cart!`);
    setTimeout(() => setAddedId(null), 1500);
  };

  const handleToggleWishlist = (e: React.MouseEvent, product: { id: string | number; name: string; price: number; image?: string }) => {
    e.preventDefault();
    e.stopPropagation();

    toggleItem({
      id: Number(product.id),
      name: product.name,
      price: product.price,
      image: product.image || "",
    });

    const isAdded = !isWishlisted(Number(product.id));
    if (isAdded) {
      toast.success(`${product.name} added to wishlist!`);
    } else {
      toast.info(`${product.name} removed from wishlist`);
    }
  };

  // Recommended plants that haven't been recently viewed
  const recommendedPlants: Product[] = useMemo(() => {
    const viewedIds = new Set(recentlyViewed.map((p) => String(p.id)));
    const notViewed = catalogProducts.filter((p) => !viewedIds.has(String(p.id)));
    return notViewed.slice(0, 4);
  }, [recentlyViewed]);

  if (recentlyViewed.length === 0) {
    return (
      <div className="min-h-[85vh] flex flex-col justify-center items-center py-12 px-4 relative overflow-hidden bg-zinc-950 text-white">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/5 blur-[140px] pointer-events-none -z-10 rounded-full" />

        <div className="max-w-4xl mx-auto w-full space-y-10">
          <Card className="w-full max-w-md mx-auto p-8 bg-zinc-900/30 border-zinc-800/60 backdrop-blur-xl text-center rounded-3xl shadow-2xl space-y-6">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 border border-emerald-500/20 flex items-center justify-center mx-auto shadow-inner text-emerald-400">
              <History className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-bold tracking-tight text-white">No Recently Viewed Plants</h2>
              <p className="text-sm text-zinc-400 leading-relaxed">
                You haven't inspected any plants yet. Browse our lush plant catalog to find the perfect greens for your space!
              </p>
            </div>

            <Link to="/product" className="block">
              <Button className="w-full h-11 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold rounded-xl shadow-lg hover:shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer">
                <Leaf className="w-4 h-4" />
                Explore Plants
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </Card>

          {/* Popular recommendations on empty state */}
          <div className="space-y-4 pt-4">
            <div className="flex items-center gap-2 text-zinc-400">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-300">Popular Plants To Explore</h3>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {catalogProducts.slice(0, 4).map((plant) => (
                <Link
                  key={plant.id}
                  to={`/product/${plant.id}`}
                  className="group bg-zinc-900/30 border border-zinc-800/60 hover:border-zinc-700/80 rounded-2xl p-3 backdrop-blur-xl transition-all block"
                >
                  <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-zinc-950/60 mb-2.5">
                    <img src={plant.image} alt={plant.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  </div>
                  <h4 className="text-sm font-semibold text-white group-hover:text-emerald-400 transition-colors truncate">{plant.name}</h4>
                  <p className="text-xs font-bold text-emerald-400 mt-0.5">₹{plant.price.toLocaleString()}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[85vh] bg-zinc-950 text-white py-6 sm:py-10 px-3 sm:px-6 relative overflow-hidden">
      {/* Ambient glowing backdrops */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-emerald-500/5 blur-[140px] pointer-events-none -z-10 rounded-full" />
      <div className="absolute bottom-20 right-10 w-[300px] h-[300px] bg-emerald-600/5 blur-[100px] pointer-events-none -z-10 rounded-full" />

      <div className="max-w-6xl mx-auto space-y-8 sm:space-y-10">
        
        {/* ── Page Header Banner ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-zinc-900/30 p-5 sm:p-6 rounded-2xl border border-zinc-800/60 backdrop-blur-xl shadow-xl relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-emerald-500/20 via-emerald-400 to-green-500/20" />
          
          <div className="flex items-center gap-3.5">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shrink-0 shadow-inner">
              <Eye className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/10 text-[11px] px-2.5 py-0.5 font-medium rounded-full">
                  Browsing History
                </Badge>
                <span className="text-xs text-zinc-400 font-medium">
                  {recentlyViewed.length} plant{recentlyViewed.length !== 1 ? "s" : ""} explored
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mt-1">Recently Viewed Plants</h1>
              <p className="text-xs sm:text-sm text-zinc-400 mt-0.5">
                Quickly jump back to the botanical specimens you checked out
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 self-start sm:self-auto">
            <Button
              onClick={clearRecentlyViewed}
              variant="outline"
              size="sm"
              className="border-zinc-800 hover:border-red-500/30 bg-zinc-900/60 hover:bg-red-500/10 text-zinc-400 hover:text-red-400 rounded-xl h-9 px-3.5 flex items-center gap-1.5 text-xs transition-all cursor-pointer font-medium"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Clear History
            </Button>
            <Link to="/product">
              <Button
                size="sm"
                className="bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-semibold rounded-xl h-9 px-4 flex items-center gap-1.5 text-xs shadow-md cursor-pointer"
              >
                <Leaf className="w-3.5 h-3.5" />
                Shop Catalog
              </Button>
            </Link>
          </div>
        </div>

        {/* ── Recently Viewed Plants Grid ── */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
              <History className="w-4 h-4 text-emerald-400" />
              Your Recent Explorations ({recentlyViewed.length})
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {recentlyViewed.map((product) => {
              const isFav = isWishlisted(Number(product.id));
              const isJustAdded = addedId === product.id;

              return (
                <div
                  key={product.id}
                  className="group bg-zinc-900/40 border border-zinc-800/70 hover:border-zinc-700/90 rounded-2xl p-3.5 backdrop-blur-xl shadow-lg hover:shadow-xl hover:shadow-emerald-500/5 transition-all duration-300 flex flex-col justify-between relative overflow-hidden"
                >
                  {/* Top Image Container */}
                  <div className="relative w-full h-56 rounded-xl overflow-hidden bg-zinc-950/60 border border-zinc-800/80 mb-3">
                    <Link to={`/product/${product.id}`} className="block w-full h-full">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </Link>

                    {/* Wishlist Floating Button */}
                    <button
                      onClick={(e) => handleToggleWishlist(e, product)}
                      className="absolute top-2.5 right-2.5 p-2 rounded-full bg-zinc-950/80 hover:bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-red-400 backdrop-blur-md transition-all cursor-pointer shadow-md z-10"
                      title={isFav ? "Remove from wishlist" : "Add to wishlist"}
                    >
                      <Heart className={`w-3.5 h-3.5 ${isFav ? "fill-red-400 text-red-400" : ""}`} />
                    </button>

                    <Badge className="absolute bottom-2.5 left-2.5 bg-zinc-950/80 text-emerald-400 border border-zinc-800 text-[10px] px-2.5 py-0.5 font-medium rounded-md backdrop-blur-md">
                      <Sparkles className="w-2.5 h-2.5 mr-1 text-emerald-400" />
                      Viewed
                    </Badge>
                  </div>

                  {/* Details info */}
                  <div className="space-y-1 mb-3 flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <Link to={`/product/${product.id}`} className="flex-1 min-w-0">
                        <h3 className="text-base font-semibold text-white group-hover:text-emerald-400 transition-colors truncate">
                          {product.name}
                        </h3>
                      </Link>
                      <span className="text-base font-bold text-emerald-400 shrink-0 font-mono">
                        ₹{product.price.toLocaleString()}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-zinc-400">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span className="font-semibold text-zinc-200">4.8</span>
                      <span>•</span>
                      <span className="text-emerald-400/80 font-medium">In Stock</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 pt-2 border-t border-zinc-800/60">
                    <Link to={`/product/${product.id}`} className="flex-1">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full h-9 border-zinc-800 hover:border-zinc-700 bg-zinc-950/40 text-zinc-300 hover:text-white rounded-xl text-xs font-medium"
                      >
                        Details
                      </Button>
                    </Link>

                    <Button
                      onClick={(e) => handleAddToCart(e, product)}
                      size="sm"
                      disabled={isJustAdded}
                      className="flex-1 h-9 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-semibold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md cursor-pointer transition-all shrink-0"
                    >
                      {isJustAdded ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Added</span>
                        </>
                      ) : (
                        <>
                          <ShoppingCart className="w-3.5 h-3.5" />
                          <span>Add to Cart</span>
                        </>
                      )}
                    </Button>
                  </div>

                </div>
              );
            })}
          </div>
        </div>

        {/* ── Recommended For You Section ── */}
        {recommendedPlants.length > 0 && (
          <div className="space-y-4 pt-4 border-t border-zinc-800/60">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                  <Flower2 className="w-5 h-5 text-emerald-400" />
                  Recommended For Your Space
                </h2>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Popular air-purifying and low-maintenance plants curated by our botanists
                </p>
              </div>

              <Link
                to="/product"
                className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1 hover:underline transition-colors"
              >
                View all plants
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5">
              {recommendedPlants.map((plant) => (
                <div
                  key={plant.id}
                  className="group bg-zinc-900/30 border border-zinc-800/60 hover:border-zinc-700/80 rounded-2xl p-3.5 backdrop-blur-xl transition-all flex flex-col justify-between"
                >
                  <div className="relative w-full h-48 rounded-xl overflow-hidden bg-zinc-950/60 mb-3">
                    <Link to={`/product/${plant.id}`} className="block w-full h-full">
                      <img src={plant.image} alt={plant.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    </Link>
                    {plant.badge && (
                      <Badge className="absolute top-2.5 left-2.5 bg-zinc-950/80 text-emerald-400 border border-zinc-800 text-[10px] px-2 py-0.5 font-medium rounded-md backdrop-blur-md">
                        {plant.badge}
                      </Badge>
                    )}
                  </div>

                  <div className="space-y-1 mb-2.5">
                    <Link to={`/product/${plant.id}`}>
                      <h4 className="text-sm font-semibold text-white group-hover:text-emerald-400 transition-colors truncate">{plant.name}</h4>
                    </Link>
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-bold text-emerald-400 font-mono">₹{plant.price.toLocaleString()}</p>
                      <div className="flex items-center gap-1 text-[11px] text-zinc-400">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        <span>{plant.rating}</span>
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={(e) => handleAddToCart(e, plant)}
                    size="sm"
                    className="w-full h-8 bg-zinc-800 hover:bg-emerald-500 hover:text-zinc-950 text-zinc-200 font-medium rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  >
                    <ShoppingCart className="w-3.5 h-3.5" />
                    Add to Cart
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Brand Trust Badges ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 pt-4">
          <div className="bg-zinc-900/30 border border-zinc-800/60 rounded-2xl p-4 flex items-center gap-3 backdrop-blur-md">
            <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">100% Healthy</p>
              <p className="text-[10px] text-zinc-400">Guaranteed freshness</p>
            </div>
          </div>

          <div className="bg-zinc-900/30 border border-zinc-800/60 rounded-2xl p-4 flex items-center gap-3 backdrop-blur-md">
            <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shrink-0">
              <Truck className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">Safe Express Shipping</p>
              <p className="text-[10px] text-zinc-400">Damage-proof packaging</p>
            </div>
          </div>

          <div className="bg-zinc-900/30 border border-zinc-800/60 rounded-2xl p-4 flex items-center gap-3 backdrop-blur-md">
            <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shrink-0">
              <MessageSquareHeart className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">Plant Doctor Support</p>
              <p className="text-[10px] text-zinc-400">Free care guidance</p>
            </div>
          </div>

          <div className="bg-zinc-900/30 border border-zinc-800/60 rounded-2xl p-4 flex items-center gap-3 backdrop-blur-md">
            <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shrink-0">
              <Leaf className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">Eco-Friendly Pots</p>
              <p className="text-[10px] text-zinc-400">Sustainable materials</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Recently_View;