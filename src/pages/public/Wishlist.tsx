import { Link } from "react-router-dom";
import { useWishlist } from "@/pages/context/WishlistContext";
import { useCart } from "@/pages/context/CartContext";
import { Card } from "@/components/ui/display/card";
import { Button } from "@/components/ui/forms/button";
import { Badge } from "@/components/ui/display/badge";
import { Separator } from "@/components/ui/display/separator";
import { ShoppingCart, Trash2, Heart, Sprout } from "lucide-react";
import { toast } from "sonner";

const Wishlist = () => {
  const { items, removeItem, clearWishlist } = useWishlist();
  const { addItem: addToCart } = useCart();

  const handleAddToCart = (item: { id: number; name: string; price: number; image: string }) => {
    addToCart({ id: item.id, name: item.name, price: item.price, image: item.image });
    toast.success(`${item.name} added to cart`);
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
    <div className="min-h-screen bg-zinc-950 px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
            <Sprout className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/10 mb-1">
              Saved for later
            </Badge>
            <h1 className="text-3xl font-bold text-white">Your Wishlist</h1>
          </div>
        </div>
        <p className="text-zinc-400 mb-6">
          {items.length} plant{items.length !== 1 ? "s" : ""} saved
        </p>

        <Separator className="bg-zinc-800 mb-6" />

        <div className="flex flex-col gap-4">
          {items.map((item) => (
            <Card
              key={item.id}
              className="bg-zinc-900/60 border-zinc-800 flex items-center gap-4 p-4 hover:border-zinc-700 transition-colors"
            >
              <Link to={`/product/${item.id}`}>
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded-lg"
                />
              </Link>

              <div className="flex-1 min-w-0">
                <Link to={`/product/${item.id}`}>
                  <h3 className="font-semibold text-white hover:text-emerald-400 transition-colors truncate">
                    {item.name}
                  </h3>
                </Link>
                <p className="text-sm text-emerald-400 font-bold mt-0.5">Rs. {item.price}</p>
              </div>

              <Button
                size="sm"
                onClick={() => handleAddToCart(item)}
                className="bg-emerald-500 hover:bg-emerald-600 text-zinc-950 font-semibold rounded-lg flex items-center gap-1.5 cursor-pointer h-8 text-xs"
              >
                <ShoppingCart className="w-3.5 h-3.5" />
                Add to Cart
              </Button>

              <button
                onClick={() => removeItem(item.id)}
                aria-label="Remove from wishlist"
                className="p-2 rounded-lg text-zinc-400 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </Card>
          ))}
        </div>

        <div className="flex justify-end mt-6">
          <Button
            variant="outline"
            onClick={clearWishlist}
            className="border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white rounded-xl"
          >
            Clear Wishlist
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Wishlist;