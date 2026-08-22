import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Leaf,
  ShoppingCart,
  Users,
  Tag,
  ShieldCheck,
  UserCircle,
  Plus,
  Pencil,
  Trash2,
  X,
  Save,
  LogIn,
  Mail,
  Info,
  Heart,
  ClipboardList,
} from "lucide-react";
import { toast } from "sonner";
import { useCart } from "@/pages/context/CartContext";

const Navbar = () => {
  const navigate = useNavigate();
  const username = localStorage.getItem("username");
  const role = localStorage.getItem("role");
  const isLoggedIn = !!username;
  const isAdmin = isLoggedIn && role === "admin";

  const { totalCount } = useCart();

  const [showAdd, setShowAdd] = useState(false);
  const [addName, setAddName] = useState("");
  const [addPrice, setAddPrice] = useState("");
  const [addCategory, setAddCategory] = useState("Indoor");

  const [showEdit, setShowEdit] = useState(false);
  const [editId, setEditId] = useState("");
  const [editName, setEditName] = useState("");
  const [editPrice, setEditPrice] = useState("");

  const [showDelete, setShowDelete] = useState(false);
  const [deleteId, setDeleteId] = useState("");

  // Menu items differ by auth state and role
  const menuItems = !isLoggedIn
    ? [
        { to: "/product", label: "Products", icon: Leaf },
        { to: "/login", label: "Login", icon: LogIn },
        { to: "/about", label: "About", icon: Info },
        { to: "/contact", label: "Contact", icon: Mail },
      ]
    : isAdmin
    ? [
        { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
        { to: "/product", label: "Products", icon: Leaf },
        { to: "/admin/orders", label: "Orders", icon: ShoppingCart },
        { to: "/admin/customers", label: "Customers", icon: Users },
        { to: "/admin/coupon", label: "Coupons", icon: Tag },
      ]
    : [
        { to: "/product", label: "Products", icon: Leaf },
        { to: "/cart", label: "Cart", icon: ShoppingCart },
        { to: "/wishlist", label: "Wishlist", icon: Heart },
        { to: "/my-orders", label: "My Orders", icon: ClipboardList },
      ];

  const handleAdd = () => {
    if (!addName.trim()) return toast.error("Name is required");
    const price = Number(addPrice);
    if (isNaN(price) || price <= 0) return toast.error("Enter a valid price");
    toast.success(`"${addName.trim()}" added successfully!`);
    setShowAdd(false);
    setAddName(""); setAddPrice(""); setAddCategory("Indoor");
    navigate("/product");
  };

  const handleEdit = () => {
    if (!editId.trim()) return toast.error("Product ID is required");
    if (!editName.trim()) return toast.error("Name is required");
    toast.success(`Product #${editId} updated!`);
    setShowEdit(false);
    setEditId(""); setEditName(""); setEditPrice("");
    navigate("/product");
  };

  const handleDelete = () => {
    if (!deleteId.trim()) return toast.error("Product ID is required");
    toast.success(`Product #${deleteId} deleted!`);
    setShowDelete(false);
    setDeleteId("");
    navigate("/product");
  };

  const inputCls = "w-full h-9 px-3 text-sm bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder:text-zinc-500 focus:outline-none focus:border-emerald-500/60";

  return (
    <>
      <div className="w-full bg-zinc-900/90 backdrop-blur border border-zinc-800/80 text-zinc-100 px-3 sm:px-6 py-3 flex items-center gap-3 sm:gap-6 rounded-2xl shadow-xl shadow-black/40 mb-6 sm:mb-8 flex-wrap">
        <span className="font-semibold text-emerald-400 tracking-wider text-xs uppercase bg-emerald-500/10 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg border border-emerald-500/20 mr-1 sm:mr-2 shrink-0">
          {isAdmin ? "Admin Menu" : "Menu"}
        </span>

        <div className="flex items-center gap-5 flex-wrap flex-1">
          {menuItems.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className="flex items-center gap-1.5 text-sm font-medium text-zinc-300 hover:text-emerald-400 transition-colors duration-200"
            >
              <span className="relative inline-flex">
                <Icon className="w-4 h-4 text-emerald-400" />
                {label === "Cart" && totalCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-emerald-500 text-zinc-950 text-[9px] font-bold h-3.5 min-w-3.5 px-1 rounded-full flex items-center justify-center leading-none">
                    {totalCount}
                  </span>
                )}
              </span>
              <span>{label}</span>
            </Link>
          ))}
        </div>

        {isAdmin && (
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => { setShowAdd(true); setShowEdit(false); setShowDelete(false); }}
              className="flex items-center gap-1.5 h-8 px-3 text-xs font-semibold rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              Add
            </button>
            <button
              onClick={() => { setShowEdit(true); setShowAdd(false); setShowDelete(false); }}
              className="flex items-center gap-1.5 h-8 px-3 text-xs font-semibold rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 transition-colors cursor-pointer"
            >
              <Pencil className="w-3.5 h-3.5 text-emerald-400" />
              Edit
            </button>
            <button
              onClick={() => { setShowDelete(true); setShowAdd(false); setShowEdit(false); }}
              className="flex items-center gap-1.5 h-8 px-3 text-xs font-semibold rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Delete
            </button>
          </div>
        )}

        {isLoggedIn && <div className="w-px h-6 bg-zinc-800 shrink-0" />}

        {isLoggedIn && (
          <div className="flex items-center gap-2.5 shrink-0">
            {role && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-amber-500/15 text-amber-400 border border-amber-500/25">
                <ShieldCheck className="w-3 h-3" />
                {role}
              </span>
            )}
            <div className="flex items-center gap-1.5 text-sm font-medium text-zinc-200">
              <UserCircle className="w-4 h-4 text-zinc-400" />
              <span>{username ?? "User"}</span>
            </div>
          </div>
        )}
      </div>

      {showAdd && isAdmin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl p-6 space-y-4 relative">
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-emerald-500/20 via-emerald-400 to-green-500/20 rounded-t-2xl" />
            <div className="flex items-center justify-between">
              <h2 className="text-white font-bold text-base flex items-center gap-2">
                <Plus className="w-4 h-4 text-emerald-400" /> Add Product
              </h2>
              <button onClick={() => setShowAdd(false)} className="text-zinc-500 hover:text-white cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-wider text-zinc-400 font-semibold">Product Name</label>
                <input value={addName} onChange={e => setAddName(e.target.value)} placeholder="e.g. Monstera Deliciosa" className={inputCls} />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-wider text-zinc-400 font-semibold">Price (Rs.)</label>
                  <input type="number" value={addPrice} onChange={e => setAddPrice(e.target.value)} placeholder="499" className={inputCls} />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-wider text-zinc-400 font-semibold">Category</label>
                  <select value={addCategory} onChange={e => setAddCategory(e.target.value)} className={inputCls}>
                    {["Indoor", "Low-light", "Succulent", "Flowering"].map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
            </div>
            <div className="flex gap-2 pt-1">
              <button onClick={handleAdd} className="flex-1 h-9 bg-emerald-500 hover:bg-emerald-400 text-black font-semibold rounded-lg text-sm flex items-center justify-center gap-1.5 cursor-pointer">
                <Save className="w-3.5 h-3.5" /> Save Product
              </button>
              <button onClick={() => setShowAdd(false)} className="flex-1 h-9 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg text-sm cursor-pointer">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {showEdit && isAdmin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl p-6 space-y-4 relative">
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-blue-500/20 via-blue-400 to-cyan-500/20 rounded-t-2xl" />
            <div className="flex items-center justify-between">
              <h2 className="text-white font-bold text-base flex items-center gap-2">
                <Pencil className="w-4 h-4 text-emerald-400" /> Edit Product
              </h2>
              <button onClick={() => setShowEdit(false)} className="text-zinc-500 hover:text-white cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-zinc-500">To edit a product directly on the card, go to the Products page and click the Edit button on any card.</p>
            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-wider text-zinc-400 font-semibold">Product ID</label>
                <input value={editId} onChange={e => setEditId(e.target.value)} placeholder="e.g. 1" className={inputCls} />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-wider text-zinc-400 font-semibold">New Name</label>
                <input value={editName} onChange={e => setEditName(e.target.value)} placeholder="Updated name" className={inputCls} />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-wider text-zinc-400 font-semibold">New Price (Rs.)</label>
                <input type="number" value={editPrice} onChange={e => setEditPrice(e.target.value)} placeholder="599" className={inputCls} />
              </div>
            </div>
            <div className="flex gap-2 pt-1">
              <button onClick={handleEdit} className="flex-1 h-9 bg-emerald-500 hover:bg-emerald-400 text-black font-semibold rounded-lg text-sm flex items-center justify-center gap-1.5 cursor-pointer">
                <Save className="w-3.5 h-3.5" /> Update
              </button>
              <button onClick={() => setShowEdit(false)} className="flex-1 h-9 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg text-sm cursor-pointer">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {showDelete && isAdmin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-zinc-900 border border-red-500/30 rounded-2xl shadow-2xl p-6 space-y-4 relative">
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-red-500/20 via-red-400 to-rose-500/20 rounded-t-2xl" />
            <div className="flex items-center justify-between">
              <h2 className="text-white font-bold text-base flex items-center gap-2">
                <Trash2 className="w-4 h-4 text-red-400" /> Delete Product
              </h2>
              <button onClick={() => setShowDelete(false)} className="text-zinc-500 hover:text-white cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-zinc-400">Enter the Product ID to delete. You can also delete directly from the product card on the Products page.</p>
            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-wider text-zinc-400 font-semibold">Product ID</label>
              <input value={deleteId} onChange={e => setDeleteId(e.target.value)} placeholder="e.g. 3" className={inputCls} />
            </div>
            <div className="flex gap-2 pt-1">
              <button onClick={handleDelete} className="flex-1 h-9 bg-red-500 hover:bg-red-400 text-white font-semibold rounded-lg text-sm cursor-pointer">
                Yes, Delete
              </button>
              <button onClick={() => setShowDelete(false)} className="flex-1 h-9 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg text-sm cursor-pointer">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;