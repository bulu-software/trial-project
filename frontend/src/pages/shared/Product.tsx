import { useState, useMemo, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/forms/button";
import { Badge } from "@/components/ui/display/badge";
import { Card } from "@/components/ui/display/card";
import { Input } from "@/components/ui/forms/input";
import { Label } from "@/components/ui/forms/label";
import { Separator } from "@/components/ui/display/separator";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/display/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/forms/select";
import { toast } from "sonner";
import {
  ShoppingCart, Heart, Search, Leaf, Star, Sprout,
  Pencil, Trash2, Save, X, AlertTriangle, Plus, Upload,
} from "lucide-react";
import { products as initialProducts, type Product } from "@/data/products";
import { useCart } from "@/pages/context/CartContext";
import { useWishlist } from "@/pages/context/WishlistContext";
import { api } from "@/services/api";
import { formatPrice } from "@/lib/utils";

const categories = ["All", "Indoor", "Low-light", "Succulent", "Flowering"] as const;
type Category = (typeof categories)[number];
type SortKey = "featured" | "price-asc" | "price-desc" | "rating";

const ProductPage = () => {
  const isAdmin = localStorage.getItem("role") === "admin";
  const { addItem } = useCart();
  const { toggleItem, isWishlisted } = useWishlist();
  const navigate = useNavigate();

  const [productList, setProductList] = useState<Product[]>(initialProducts);
  const [query, setQuery]             = useState<string>("");
  const [category, setCategory]       = useState<Category>("All");
  const [sort, setSort]               = useState<SortKey>("featured");

  // Edit state
  const [editingId, setEditingId]     = useState<number | null>(null);
  const [editName, setEditName]       = useState("");
  const [editPrice, setEditPrice]     = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [editImage, setEditImage]     = useState("");

  // Add state
  const [showAddModal, setShowAddModal] = useState(false);
  const [addName, setAddName]           = useState("");
  const [addPrice, setAddPrice]         = useState("");
  const [addCategory, setAddCategory]   = useState("Indoor");
  const [addImage, setAddImage]         = useState("");

  // Delete confirm state
  const [deleteId, setDeleteId]       = useState<number | null>(null);

  // Fetch products from backend API on mount
  useEffect(() => {
    async function loadProducts() {
      try {
        const data = await api.getProducts();
        if (Array.isArray(data) && data.length > 0) {
          setProductList(data);
        }
      } catch {
        // Fallback to local products if backend is starting
      }
    }
    loadProducts();
  }, []);

  /* ── Auth check ── */
  const isLoggedIn = () => !!localStorage.getItem("username");

  /* ── Add to Cart ── */
  const handleAddToCart = (product: Product) => {
    if (!isLoggedIn()) {
      toast.error("Please login first to add items to cart");
      navigate("/login");
      return;
    }
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
    });
    toast.success(`${product.name} added to cart`);
  };

  /* ── Wishlist toggle ── */
  const handleToggleWishlist = (product: Product) => {
    if (!isLoggedIn()) {
      toast.error("Please login first to add items to wishlist");
      navigate("/login");
      return;
    }
    const wasWishlisted = isWishlisted(product.id);
    toggleItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
    });
    toast.success(wasWishlisted ? "Removed from wishlist" : "Added to wishlist");
  };

  /* ── Add handler (Admin only) ── */
  const handleAddProduct = async () => {
    const trimName = addName.trim();
    const price = Number(addPrice);
    if (!trimName) return toast.error("Product name is required");
    if (isNaN(price) || price <= 0) return toast.error("Please enter a valid price");

    const defaultImg = "https://images.unsplash.com/photo-1463936575829-25148e1db1b8?w=600";
    const imgUrl = addImage.trim() || defaultImg;

    try {
      const created = await api.createProduct({
        name: trimName,
        price,
        category: addCategory,
        image: imgUrl,
        rating: 5.0,
        reviews: 0,
        badge: "New",
        features: ["Easy care", "Air-purifying"],
      });

      setProductList((prev) => [created as unknown as Product, ...prev]);
      setShowAddModal(false);
      setAddName("");
      setAddPrice("");
      setAddCategory("Indoor");
      setAddImage("");
      toast.success(`"${trimName}" added successfully!`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to add product";
      toast.error("Error", { description: msg });
    }
  };

  /* ── Edit handlers (Admin only) ── */
  const startEdit = (p: Product) => {
    setEditingId(p.id);
    setEditName(p.name);
    setEditPrice(String(p.price));
    setEditCategory(p.category);
    setEditImage(p.image);
    setDeleteId(null);
  };

  const cancelEdit = () => setEditingId(null);

  const saveEdit = async (id: number) => {
    const trimName  = editName.trim();
    const price     = Number(editPrice);
    if (!trimName)         return toast.error("Name cannot be empty");
    if (isNaN(price) || price <= 0) return toast.error("Enter a valid price");

    try {
      const updated = await api.updateProduct(id, {
        name: trimName,
        price,
        category: editCategory,
        image: editImage.trim() || undefined,
      });

      setProductList((prev) =>
        prev.map((p) =>
          p.id === id ? { ...p, ...(updated as unknown as Product) } : p
        )
      );
      setEditingId(null);
      toast.success("Product updated!");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to update product";
      toast.error("Error", { description: msg });
    }
  };

  /* ── Delete handlers (Admin only) ── */
  const confirmDelete = (id: number) => {
    setDeleteId(id);
    setEditingId(null);
  };

  const handleDelete = async (id: number) => {
    try {
      await api.deleteProduct(id);
      setProductList((prev) => prev.filter((p) => p.id !== id));
      setDeleteId(null);
      toast.success("Product deleted.");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to delete product";
      toast.error("Error", { description: msg });
    }
  };

  /* ── Filter + Sort ── */
  const filtered: Product[] = useMemo(() => {
    let list = productList.filter((p) => {
      const matchesQuery    = p.name.toLowerCase().includes(query.toLowerCase());
      const matchesCategory = category === "All" || p.category === category;
      return matchesQuery && matchesCategory;
    });

    switch (sort) {
      case "price-asc":  list = [...list].sort((a, b) => a.price - b.price); break;
      case "price-desc": list = [...list].sort((a, b) => b.price - a.price); break;
      case "rating":     list = [...list].sort((a, b) => b.rating - a.rating); break;
    }
    return list;
  }, [query, category, sort, productList]);

  return (
    <div className="min-h-screen bg-zinc-950 px-3 sm:px-6 py-6 md:py-10 relative overflow-hidden text-white isolate">
      {/* Ambient glowing backdrops */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-emerald-500/5 blur-[140px] pointer-events-none -z-10 rounded-full" />
      <div className="absolute bottom-20 right-10 w-[300px] h-[300px] bg-emerald-600/5 blur-[100px] pointer-events-none -z-10 rounded-full" />

      <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8">

        {/* ── Header ── */}
        <div className="bg-zinc-900/30 p-5 sm:p-7 rounded-2xl border border-zinc-800/60 backdrop-blur-xl shadow-xl relative overflow-hidden space-y-5">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-emerald-500/20 via-emerald-400 to-green-500/20" />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 border border-emerald-500/20 text-emerald-400 shrink-0 shadow-inner">
                <Sprout className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/10 text-[11px] px-2.5 py-0.5 font-medium rounded-full">
                    Curated Nursery
                  </Badge>
                  <span className="text-xs text-zinc-500 font-medium">
                    {filtered.length} plant{filtered.length !== 1 ? "s" : ""} available
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white tracking-tight mt-1">
                  Explore Plant Collection
                </h1>
                <p className="text-xs sm:text-sm text-zinc-400 mt-0.5">
                  Hand-nurtured indoor & outdoor botanical plants delivered safely to your home
                </p>
              </div>
            </div>

            {isAdmin && (
              <Button
                onClick={() => setShowAddModal(true)}
                className="bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-semibold rounded-xl h-10 px-4 flex items-center gap-1.5 self-start sm:self-auto cursor-pointer shadow-md text-xs"
              >
                <Plus className="w-4 h-4" /> Add Product
              </Button>
            )}
          </div>

          <Separator className="bg-zinc-800/60" />

          {/* Filters & Search Row */}
          <div className="flex flex-col lg:flex-row lg:items-center gap-3 sm:gap-4">
            {/* Category Tabs */}
            <Tabs value={category} onValueChange={(v) => setCategory(v as Category)} className="w-full lg:w-auto">
              <TabsList className="bg-zinc-950/60 border border-zinc-800/80 flex-wrap h-auto p-1 max-w-full rounded-xl">
                {categories.map((c) => (
                  <TabsTrigger
                    key={c}
                    value={c}
                    className="data-[state=active]:bg-emerald-500 data-[state=active]:text-zinc-950 text-zinc-300 text-xs sm:text-sm font-medium px-3 py-1.5 rounded-lg transition-all"
                  >
                    {c}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>

            {/* Search Input */}
            <div className="flex-1 relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                aria-label="Search plants"
                placeholder="Search plants by name..."
                className="pl-10 bg-zinc-950/60 border-zinc-800 text-white placeholder:text-zinc-500 focus-visible:ring-emerald-500/20 focus-visible:border-emerald-500/50 h-10 text-xs sm:text-sm rounded-xl"
              />
              {query && (
                <button
                  onClick={() => setQuery("")}
                  aria-label="Clear search"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white text-xs cursor-pointer"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Sort Dropdown */}
            <Select value={sort} onValueChange={(v) => setSort(v as SortKey)}>
              <SelectTrigger className="w-full lg:w-48 bg-zinc-950/60 border-zinc-800 text-zinc-200 h-10 text-xs sm:text-sm rounded-xl" aria-label="Sort products">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent className="bg-zinc-900 border-zinc-800 text-zinc-200">
                <SelectItem value="featured">Featured</SelectItem>
                <SelectItem value="price-asc">Price: Low to High</SelectItem>
                <SelectItem value="price-desc">Price: High to Low</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* ── Product Grid ── */}
        {filtered.length === 0 ? (
          <div className="text-center py-20 bg-zinc-900/20 border border-zinc-800/50 rounded-3xl p-8">
            <Leaf className="w-10 h-10 text-zinc-600 mx-auto mb-3" />
            {productList.length === 0 ? (
              <>
                <p className="text-base font-semibold text-zinc-300">No plants available in catalog.</p>
                <p className="text-xs text-zinc-500 mt-1">Please check back later or add new plants.</p>
              </>
            ) : (
              <>
                <p className="text-base font-semibold text-zinc-300">No plants match your search.</p>
                <p className="text-xs text-zinc-500 mt-1">Try clearing filters or search terms.</p>
              </>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {filtered.map((product) => (
              <Card
                key={product.id}
                className="bg-zinc-900/40 border-zinc-800/70 hover:border-zinc-700/90 rounded-2xl p-3.5 backdrop-blur-xl shadow-lg hover:shadow-xl hover:shadow-emerald-500/5 transition-all duration-300 flex flex-col justify-between relative overflow-hidden group"
              >
                {/* Product Image Box */}
                <div className="relative w-full h-60 rounded-xl overflow-hidden bg-zinc-950/60 border border-zinc-800/80 mb-3.5">
                  <Link to={`/product/${product.id}`} className="block w-full h-full">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </Link>

                  {/* Wishlist Heart Button */}
                  <button
                    onClick={() => handleToggleWishlist(product)}
                    aria-label="Toggle wishlist"
                    aria-pressed={isWishlisted(product.id)}
                    className="absolute top-2.5 right-2.5 p-2 rounded-full bg-zinc-950/80 hover:bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-red-400 backdrop-blur-md transition-all cursor-pointer shadow-md z-10"
                  >
                    <Heart
                      className={`w-4 h-4 ${isWishlisted(product.id) ? "fill-red-400 text-red-400" : ""}`}
                    />
                  </button>

                  {product.badge && (
                    <Badge className="absolute top-2.5 left-2.5 bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20 text-[10px] font-semibold px-2.5 py-0.5 rounded-full backdrop-blur-md">
                      {product.badge}
                    </Badge>
                  )}
                </div>

                {/* Body Content */}
                <div className="space-y-3 flex flex-col flex-1">

                  {/* ── EDIT FORM (Admin only) ── */}
                  {isAdmin && editingId === product.id ? (
                    <div className="space-y-2.5">
                      <div className="space-y-1">
                        <Label className="text-[10px] uppercase tracking-wider text-zinc-400 font-semibold">Name</Label>
                        <Input
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="h-8 text-xs bg-zinc-950/60 border-zinc-700 focus-visible:border-emerald-500/50 text-white rounded-lg"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-[10px] uppercase tracking-wider text-zinc-400 font-semibold">Image File</Label>
                        <div className="relative border border-dashed border-zinc-700 rounded-lg hover:border-emerald-500/50 transition-colors p-1.5 bg-zinc-950/40 flex flex-col items-center justify-center cursor-pointer group">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onloadend = () => setEditImage(reader.result as string);
                                reader.readAsDataURL(file);
                              }
                            }}
                            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                          />
                          {editImage ? (
                            <div className="relative w-full h-14 rounded-md overflow-hidden flex items-center justify-center">
                              <img src={editImage} alt="Preview" className="w-full h-full object-cover" />
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  e.preventDefault();
                                  setEditImage("");
                                }}
                                className="absolute top-0.5 right-0.5 p-0.5 rounded-full bg-black/75 hover:bg-black text-zinc-400 hover:text-white border-0 cursor-pointer"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center py-1.5 text-center select-none pointer-events-none">
                              <Upload className="w-4 h-4 text-zinc-500 group-hover:text-emerald-400 transition-colors" />
                              <span className="text-[9px] text-zinc-400">Click to change photo</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                          <Label className="text-[10px] uppercase tracking-wider text-zinc-400 font-semibold">Price</Label>
                          <Input
                            type="number"
                            value={editPrice}
                            onChange={(e) => setEditPrice(e.target.value)}
                            className="h-8 text-xs bg-zinc-950/60 border-zinc-700 focus-visible:border-emerald-500/50 text-white rounded-lg"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-[10px] uppercase tracking-wider text-zinc-400 font-semibold">Category</Label>
                          <select
                            value={editCategory}
                            onChange={(e) => setEditCategory(e.target.value)}
                            className="w-full h-8 text-xs bg-zinc-950/60 border border-zinc-700 text-white rounded-lg px-2 focus:outline-none focus:border-emerald-500/50"
                          >
                            {["Indoor", "Low-light", "Succulent", "Flowering"].map((c) => (
                              <option key={c} value={c}>{c}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div className="flex gap-2 pt-0.5">
                        <Button
                          size="sm"
                          onClick={() => saveEdit(product.id)}
                          className="flex-1 h-7 bg-emerald-500 hover:bg-emerald-400 text-black font-semibold rounded-lg text-xs flex items-center gap-1 cursor-pointer"
                        >
                          <Save className="w-3 h-3" /> Save
                        </Button>
                        <Button
                          size="sm"
                          onClick={cancelEdit}
                          variant="ghost"
                          className="flex-1 h-7 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg text-xs flex items-center gap-1 cursor-pointer"
                        >
                          <X className="w-3 h-3" /> Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    /* ── VIEW MODE ── */
                    <>
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="text-base font-semibold text-white leading-snug flex-1">
                            <Link to={`/product/${product.id}`} className="hover:text-emerald-400 transition-colors">
                              {product.name}
                            </Link>
                          </h3>
                          <span className="text-base font-bold text-emerald-400 shrink-0 font-mono">
                            {formatPrice(product.price)}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 mt-1 text-xs text-zinc-400">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          <span className="font-semibold text-zinc-200">{product.rating}</span>
                          <span>•</span>
                          <span className="text-zinc-500">({product.reviews} reviews)</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1.5">
                        {product.features.slice(0, 2).map((f) => (
                          <span
                            key={f}
                            className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-zinc-950/60 border border-zinc-800/80 text-zinc-400"
                          >
                            <Leaf className="w-2.5 h-2.5 text-emerald-400" />
                            {f}
                          </span>
                        ))}
                      </div>

                      <div className="pt-2 mt-auto border-t border-zinc-800/60 flex items-center gap-2">
                        <Link to={`/product/${product.id}`} className="flex-1">
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full h-9 border-zinc-800 hover:border-zinc-700 bg-zinc-950/40 text-zinc-300 hover:text-white rounded-xl text-xs font-medium"
                          >
                            Details
                          </Button>
                        </Link>

                        {!isAdmin && (
                          <Button
                            onClick={() => handleAddToCart(product)}
                            size="sm"
                            className="flex-1 h-9 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-semibold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md cursor-pointer transition-all"
                          >
                            <ShoppingCart className="w-3.5 h-3.5" />
                            Add to Cart
                          </Button>
                        )}
                      </div>

                      {/* Admin action strip */}
                      {isAdmin && (
                        <div className="flex items-center gap-2 pt-1">
                          <button
                            onClick={() => startEdit(product)}
                            className="flex-1 text-[11px] py-1 bg-zinc-800/60 hover:bg-zinc-800 text-zinc-300 hover:text-white rounded-lg flex items-center justify-center gap-1 border border-zinc-800 transition-colors cursor-pointer"
                          >
                            <Pencil className="w-3 h-3 text-emerald-400" /> Edit
                          </button>
                          <button
                            onClick={() => confirmDelete(product.id)}
                            className="flex-1 text-[11px] py-1 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg flex items-center justify-center gap-1 border border-red-500/20 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3 h-3" /> Delete
                          </button>
                        </div>
                      )}
                    </>
                  )}

                  {/* ── DELETE CONFIRMATION ── */}
                  {isAdmin && deleteId === product.id && editingId !== product.id && (
                    <div className="mt-1 p-2 rounded-lg bg-red-950/30 border border-red-500/30 space-y-2 animate-fade-in">
                      <div className="flex items-start gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" />
                        <p className="text-[11px] text-red-300 font-medium">
                          Delete <span className="font-bold">{product.name}</span>?
                        </p>
                      </div>
                      <div className="flex gap-1.5">
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="flex-1 h-6 text-[10px] font-semibold rounded-md bg-red-500 hover:bg-red-400 text-white transition-colors cursor-pointer border-0"
                        >
                          Delete
                        </button>
                        <button
                          onClick={() => setDeleteId(null)}
                          className="flex-1 h-6 text-[10px] font-semibold rounded-md bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors cursor-pointer border-0"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* ── ADD PRODUCT MODAL OVERLAY ── */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm animate-fade-in p-4">
          <div className="w-full max-w-[460px] bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl p-6 sm:p-7 space-y-5 relative text-white">
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-emerald-500/20 via-emerald-400 to-green-500/20 rounded-t-2xl" />
            <div className="flex items-center justify-between">
              <h2 className="text-white font-bold text-base sm:text-lg flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <Plus className="w-4 h-4" />
                </div>
                Add New Plant
              </h2>
              <button
                onClick={() => setShowAddModal(false)}
                aria-label="Close modal"
                className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer border-0 bg-transparent"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3.5">
              <div className="space-y-1.5">
                <label className="text-[11px] uppercase tracking-wider text-zinc-400 font-semibold block">Product Name</label>
                <input
                  value={addName}
                  onChange={e => setAddName(e.target.value)}
                  placeholder="e.g. Monstera Deliciosa"
                  className="w-full h-10 px-3 text-sm bg-zinc-950/60 border border-zinc-700 focus-visible:border-emerald-500/60 rounded-xl text-white placeholder:text-zinc-500 focus:outline-none focus:border-emerald-500/60"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] uppercase tracking-wider text-zinc-400 font-semibold block">Image Upload</label>
                <div className="relative border border-dashed border-zinc-700 hover:border-emerald-500/50 rounded-xl transition-colors p-3 bg-zinc-950/40 flex flex-col items-center justify-center cursor-pointer group">
                  <input
                    type="file"
                    accept="image/*"
                    id="modal-image-upload"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => setAddImage(reader.result as string);
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                  {addImage ? (
                    <div className="relative w-full h-28 rounded-lg overflow-hidden flex items-center justify-center">
                      <img src={addImage} alt="Preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          setAddImage("");
                        }}
                        aria-label="Remove image"
                        className="absolute top-1.5 right-1.5 p-1 rounded-full bg-black/80 hover:bg-black text-zinc-300 hover:text-white border-0 cursor-pointer shadow-md"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center py-3 space-y-1.5 text-center select-none pointer-events-none">
                      <div className="p-2 rounded-xl bg-zinc-800/80 text-zinc-400 group-hover:text-emerald-400 group-hover:bg-emerald-500/10 transition-colors">
                        <Upload className="w-5 h-5" />
                      </div>
                      <span className="text-xs text-zinc-400 font-medium">Click to upload photo</span>
                      <span className="text-[10px] text-zinc-500">PNG, JPG, WebP up to 5MB</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[11px] uppercase tracking-wider text-zinc-400 font-semibold block">Price (₹)</label>
                  <input
                    type="number"
                    value={addPrice}
                    onChange={e => setAddPrice(e.target.value)}
                    placeholder="499"
                    className="w-full h-10 px-3 text-sm bg-zinc-950/60 border border-zinc-700 rounded-xl text-white placeholder:text-zinc-500 focus:outline-none focus:border-emerald-500/60"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] uppercase tracking-wider text-zinc-400 font-semibold block">Category</label>
                  <select
                    value={addCategory}
                    onChange={e => setAddCategory(e.target.value)}
                    className="w-full h-10 px-3 text-sm bg-zinc-950/60 border border-zinc-700 rounded-xl text-white focus:outline-none focus:border-emerald-500/60 cursor-pointer"
                  >
                    {["Indoor", "Low-light", "Succulent", "Flowering"].map(c => (
                      <option key={c} value={c} className="bg-zinc-900 text-white">{c}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="flex gap-2.5 pt-2">
              <button
                onClick={handleAddProduct}
                className="flex-1 h-10 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold rounded-xl text-xs sm:text-sm flex items-center justify-center gap-1.5 cursor-pointer border-0 shadow-lg shadow-emerald-500/10 transition-all"
              >
                <Save className="w-4 h-4" /> Save Plant
              </button>
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 h-10 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white font-medium rounded-xl text-xs sm:text-sm cursor-pointer border-0 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductPage;