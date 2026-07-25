import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import {
  ShoppingCart, Heart, Search, Leaf, Star, Sprout,
  Pencil, Trash2, Save, X, AlertTriangle, Plus, Upload,
} from "lucide-react";
import { products as initialProducts, type Product } from "@/data/products";

const categories = ["All", "Indoor", "Low-light", "Succulent", "Flowering"] as const;
type Category = (typeof categories)[number];
type SortKey = "featured" | "price-asc" | "price-desc" | "rating";

const ProductPage = () => {
  const isAdmin = localStorage.getItem("role") === "admin";

  const [productList, setProductList] = useState<Product[]>(initialProducts);
  const [query, setQuery]             = useState<string>("");
  const [category, setCategory]       = useState<Category>("All");
  const [sort, setSort]               = useState<SortKey>("featured");
  const [wishlist, setWishlist]       = useState<Set<number>>(new Set());

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

  /* ── Wishlist ── */
  const toggleWishlist = (id: number) => {
    setWishlist((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  /* ── Add handler ── */
  const handleAddProduct = () => {
    const trimName = addName.trim();
    const price = Number(addPrice);
    if (!trimName) return toast.error("Product name is required");
    if (isNaN(price) || price <= 0) return toast.error("Please enter a valid price");

    const defaultImg = "https://images.unsplash.com/photo-1463936575829-25148e1db1b8?w=600";
    const imgUrl = addImage.trim() || defaultImg;

    const newId = productList.length > 0 ? Math.max(...productList.map(p => p.id)) + 1 : 1;
    const newProduct: Product = {
      id: newId,
      name: trimName,
      price,
      category: addCategory,
      rating: 5.0,
      reviews: 0,
      badge: "New",
      image: imgUrl,
      features: ["Easy care", "Air-purifying"]
    };

    setProductList((prev) => [newProduct, ...prev]);
    setShowAddModal(false);
    setAddName("");
    setAddPrice("");
    setAddCategory("Indoor");
    setAddImage("");
    toast.success(`"${trimName}" added successfully!`);
  };

  /* ── Edit handlers ── */
  const startEdit = (p: Product) => {
    setEditingId(p.id);
    setEditName(p.name);
    setEditPrice(String(p.price));
    setEditCategory(p.category);
    setEditImage(p.image);
    setDeleteId(null);
  };

  const cancelEdit = () => setEditingId(null);

  const saveEdit = (id: number) => {
    const trimName  = editName.trim();
    const price     = Number(editPrice);
    if (!trimName)         return toast.error("Name cannot be empty");
    if (isNaN(price) || price <= 0) return toast.error("Enter a valid price");

    setProductList((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, name: trimName, price, category: editCategory, image: editImage.trim() } : p
      )
    );
    setEditingId(null);
    toast.success("Product updated!");
  };

  /* ── Delete handlers ── */
  const confirmDelete = (id: number) => {
    setDeleteId(id);
    setEditingId(null);
  };

  const handleDelete = (id: number) => {
    setProductList((prev) => prev.filter((p) => p.id !== id));
    setDeleteId(null);
    toast.success("Product deleted.");
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
    <div className="min-h-screen bg-zinc-950 px-4 py-12">
      <div className="max-w-6xl mx-auto">

        {/* ── Header ── */}
        <div className="mb-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                <Sprout className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/10 mb-1">
                  Full catalog
                </Badge>
                <h1 className="text-3xl md:text-4xl font-bold text-white">
                  Shop all plants
                </h1>
              </div>
            </div>
            {isAdmin && (
              <Button
                onClick={() => setShowAddModal(true)}
                className="bg-emerald-500 hover:bg-emerald-600 text-zinc-950 font-bold rounded-xl flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
              >
                <Plus className="w-4 h-4" /> Add Product
              </Button>
            )}
          </div>
          <p className="text-zinc-400">
            {filtered.length} plant{filtered.length !== 1 ? "s" : ""} available
          </p>

          <Separator className="bg-zinc-800" />

          {/* Filters */}
          <div className="flex flex-col lg:flex-row lg:items-center gap-4">
            <Tabs value={category} onValueChange={(v) => setCategory(v as Category)} className="w-full lg:w-auto">
              <TabsList className="bg-zinc-900 border border-zinc-800 flex-wrap h-auto">
                {categories.map((c) => (
                  <TabsTrigger
                    key={c}
                    value={c}
                    className="data-[state=active]:bg-emerald-500 data-[state=active]:text-zinc-950 text-zinc-300"
                  >
                    {c}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>

            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search plants"
                className="pl-9 bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-500 focus-visible:ring-emerald-500"
              />
            </div>

            <Select value={sort} onValueChange={(v) => setSort(v as SortKey)}>
              <SelectTrigger className="w-full lg:w-44 bg-zinc-900 border-zinc-800 text-zinc-200">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent className="bg-zinc-900 border-zinc-800 text-zinc-200">
                <SelectItem value="featured">Featured</SelectItem>
                <SelectItem value="price-asc">Price: low to high</SelectItem>
                <SelectItem value="price-desc">Price: high to low</SelectItem>
                <SelectItem value="rating">Highest rated</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* ── Product Grid ── */}
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-zinc-400">No plants match your search.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((product) => (
              <Card
                key={product.id}
                className="bg-zinc-900/60 border-zinc-800 overflow-hidden group hover:border-zinc-700 transition-colors flex flex-col"
              >
                {/* Image */}
                <div className="relative h-56 overflow-hidden shrink-0">
                  <Link to={`/product/${product.id}`}>
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </Link>
                  <button
                    onClick={() => toggleWishlist(product.id)}
                    aria-label="Toggle wishlist"
                    className="absolute top-3 right-3 p-2 rounded-full bg-zinc-950/70 backdrop-blur border border-zinc-800 text-zinc-300 hover:text-red-400 transition-colors z-10"
                  >
                    <Heart
                      className={`w-4 h-4 ${wishlist.has(product.id) ? "fill-red-400 text-red-400" : ""}`}
                    />
                  </button>
                  {product.badge && (
                    <Badge className="absolute top-3 left-3 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/10">
                      {product.badge}
                    </Badge>
                  )}
                </div>

                {/* Body */}
                <div className="px-3.5 pb-3.5 pt-2 space-y-2.5 flex flex-col flex-1">

                  {/* ── EDIT FORM ── */}
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
                          <h3 className="text-white font-semibold leading-tight flex-1">
                            <Link to={`/product/${product.id}`} className="hover:text-emerald-400 transition-colors">
                              {product.name}
                            </Link>
                          </h3>
                          <span className="text-sm font-bold text-emerald-400 shrink-0">Rs.{product.price}</span>
                        </div>
                        <div className="flex items-center gap-1.5 mt-0.5 text-xs text-zinc-400">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          <span>{product.rating}</span>
                          <span>({product.reviews})</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1">
                        {product.features.slice(0, 2).map((f, i) => (
                          <span
                            key={i}
                            className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-zinc-800/80 border border-zinc-800 text-zinc-300"
                          >
                            <Leaf className="w-2.5 h-2.5 text-emerald-400" />
                            {f}
                          </span>
                        ))}
                      </div>

                      {!isAdmin && (
                        <>
                          <Separator className="bg-zinc-800" />
                          <div className="flex items-center justify-end pt-0.5">
                            <Button
                              size="sm"
                              className="bg-emerald-500 hover:bg-emerald-600 text-zinc-950 font-semibold rounded-lg flex items-center gap-1.5 cursor-pointer h-8 text-xs w-full justify-center"
                            >
                              <ShoppingCart className="w-3.5 h-3.5" />
                              Add to Cart
                            </Button>
                          </div>
                        </>
                      )}

                      {/* ── Admin Edit / Delete buttons ── */}
                      {isAdmin && (
                        <div className="flex gap-2 pt-0.5">
                          <button
                            onClick={() => startEdit(product)}
                            className="flex-1 flex items-center justify-center gap-1.5 h-7 text-xs font-medium rounded-lg bg-zinc-800/70 hover:bg-zinc-700/70 text-zinc-300 hover:text-white border border-zinc-700/50 transition-all cursor-pointer"
                          >
                            <Pencil className="w-3 h-3 text-emerald-400" />
                            Edit
                          </button>
                          <button
                            onClick={() => confirmDelete(product.id)}
                            className="flex-1 flex items-center justify-center gap-1.5 h-7 text-xs font-medium rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 border border-red-500/20 transition-all cursor-pointer"
                          >
                            <Trash2 className="w-3 h-3" />
                            Delete
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-[300px] bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl p-4 space-y-3 relative text-white">
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-emerald-500/20 via-emerald-400 to-green-500/20 rounded-t-xl" />
            <div className="flex items-center justify-between">
              <h2 className="text-white font-bold text-sm flex items-center gap-1.5">
                <Plus className="w-3.5 h-3.5 text-emerald-400" /> Add Product
              </h2>
              <button onClick={() => setShowAddModal(false)} className="text-zinc-500 hover:text-white cursor-pointer border-0 bg-transparent">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-2">
              <div className="space-y-0.5">
                <label className="text-[9px] uppercase tracking-wider text-zinc-400 font-semibold block">Product Name</label>
                <input
                  value={addName}
                  onChange={e => setAddName(e.target.value)}
                  placeholder="e.g. Monstera"
                  className="w-full h-8 px-2 text-xs bg-zinc-850 border border-zinc-700 rounded-lg text-white placeholder:text-zinc-500 focus:outline-none focus:border-emerald-500/60"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] uppercase tracking-wider text-zinc-400 font-semibold block">Image Upload</label>
                <div className="relative border border-dashed border-zinc-700 rounded-lg hover:border-emerald-500/50 transition-colors p-2 bg-zinc-850/50 flex flex-col items-center justify-center cursor-pointer group">
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
                    <div className="relative w-full h-20 rounded-md overflow-hidden flex items-center justify-center">
                      <img src={addImage} alt="Preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          setAddImage("");
                        }}
                        className="absolute top-1 right-1 p-1 rounded-full bg-black/75 hover:bg-black text-zinc-400 hover:text-white border-0 cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center py-2 space-y-1 text-center select-none pointer-events-none">
                      <Upload className="w-5 h-5 text-zinc-500 group-hover:text-emerald-400 transition-colors" />
                      <span className="text-[10px] text-zinc-400 font-medium">Click to select photo</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-0.5">
                  <label className="text-[9px] uppercase tracking-wider text-zinc-400 font-semibold block">Price (Rs.)</label>
                  <input
                    type="number"
                    value={addPrice}
                    onChange={e => setAddPrice(e.target.value)}
                    placeholder="499"
                    className="w-full h-8 px-2 text-xs bg-zinc-850 border border-zinc-700 rounded-lg text-white placeholder:text-zinc-500 focus:outline-none focus:border-emerald-500/60"
                  />
                </div>
                <div className="space-y-0.5">
                  <label className="text-[9px] uppercase tracking-wider text-zinc-400 font-semibold block">Category</label>
                  <select
                    value={addCategory}
                    onChange={e => setAddCategory(e.target.value)}
                    className="w-full h-8 px-2 text-xs bg-zinc-850 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-emerald-500/60"
                  >
                    {["Indoor", "Low-light", "Succulent", "Flowering"].map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
            </div>
            <div className="flex gap-2 pt-1">
              <button
                onClick={handleAddProduct}
                className="flex-1 h-8 bg-emerald-500 hover:bg-emerald-400 text-black font-semibold rounded-lg text-xs flex items-center justify-center gap-1.5 cursor-pointer border-0"
              >
                <Save className="w-3 h-3" /> Save Product
              </button>
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 h-8 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg text-xs cursor-pointer border-0"
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