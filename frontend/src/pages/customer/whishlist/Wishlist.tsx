import { useState } from "react";
import { Link } from "react-router-dom";
import { useWishlist } from "@/pages/context/WishlistContext";
import { useCart } from "@/pages/context/CartContext";
import { Card } from "@/components/ui/display/card";
import { Button } from "@/components/ui/forms/button";
import { Badge } from "@/components/ui/display/badge";
import { Separator } from "@/components/ui/display/separator";
import { ShoppingCart, Trash2, Heart, Sprout, Check } from "lucide-react";
import { toast } from "sonner";

const Wishlist = () => {
  const { items, removeItem, clearWishlist } = useWishlist();
  const { addItem: addToCart } = useCart();

  const [addedId, setAddedId] = useState<number | null>(null);
  const [confirmClearOpen, setConfirmClearOpen] = useState(false);

  const handleAddToCart = (item: { id: number; name: string; price: number; image: string }) => {
    addToCart({ id: item.id, name: item.name, price: item.price, image: item.image });
    toast.success(`${item.name} added to cart`);
    setAddedId(item.id);

    // Briefly show "Added ✓" before removing it from the wishlist
    setTimeout(() => {
      removeItem(item.id);
      setAddedId(null);
    }, 600);
  };

  const handleClearWishlist = () => {
    clearWishlist();
    setConfirmClearOpen(false);
    toast.success("Wishlist cleared");
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-zinc-950 px-4 py-12">
        <div className="max-w-3xl mx-auto flex flex-col items-center justify-center py-20 text-center">
          <div className="p-4 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-4">
            <Heart className="w-8 h-8 text-emerald-400" />
          </div>
          <p className="text-lg text-zinc-300 mb-2 font-semibold">Your wishlist is empty.</p>
          <p className="text-sm text-zinc-500 mb-6">Save plants you love and come back to them anytime.</p>
          <Link to="/product">
            <Button className="bg-emerald-500 hover:bg-emerald-600 text-zinc-950 font-bold rounded-xl">
              Browse Plants
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 px-2 sm:px-4 py-6 sm:py-10">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 shrink-0">
            <Sprout className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/10 mb-1">
              Saved for later
            </Badge>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">Your Wishlist</h1>
          </div>
        </div>
        <p className="text-xs sm:text-sm text-zinc-400 mb-4 sm:mb-6">
          {items.length} plant{items.length !== 1 ? "s" : ""} saved
        </p>

        <Separator className="bg-zinc-800 mb-4 sm:mb-6" />

        <div className="flex flex-col gap-3 sm:gap-4">
          {items.map((item) => (
            <Card
              key={item.id}
              className="bg-zinc-900/60 border-zinc-800 p-3 sm:p-4 hover:border-zinc-700 transition-colors"
            >
              <div className="flex items-center gap-3 sm:gap-4">
                <Link to={`/product/${item.id}`} className="shrink-0">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg"
                  />
                </Link>

                <div className="flex-1 min-w-0">
                  <Link to={`/product/${item.id}`}>
                    <h3 className="font-semibold text-white hover:text-emerald-400 transition-colors text-sm sm:text-base truncate">
                      {item.name}
                    </h3>
                  </Link>
                  <p className="text-xs sm:text-sm text-emerald-400 font-bold mt-0.5">Rs. {item.price}</p>
                </div>

                <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                  <Button
                    size="sm"
                    onClick={() => handleAddToCart(item)}
                    disabled={addedId === item.id}
                    className="bg-emerald-500 hover:bg-emerald-600 text-zinc-950 font-semibold rounded-lg flex items-center gap-1.5 cursor-pointer h-8 text-xs disabled:opacity-100 px-2.5 sm:px-3"
                  >
                    {addedId === item.id ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span className="hidden xs:inline">Added</span>
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Add to Cart</span>
                      </>
                    )}
                  </Button>

                  <button
                    onClick={() => removeItem(item.id)}
                    aria-label="Remove from wishlist"
                    className="p-2 rounded-lg text-zinc-400 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="flex justify-end mt-6">
          {confirmClearOpen ? (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs sm:text-sm text-zinc-400">Clear all items?</span>
              <Button
                size="sm"
                onClick={handleClearWishlist}
                className="bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg text-xs"
              >
                Yes, clear
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setConfirmClearOpen(false)}
                className="border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white rounded-lg text-xs"
              >
                Cancel
              </Button>
            </div>
          ) : (
            <Button
              variant="outline"
              onClick={() => setConfirmClearOpen(true)}
              className="border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white rounded-xl text-xs sm:text-sm"
            >
              Clear Wishlist
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Wishlist;