import { useState, useMemo, useEffect } from "react";
import { Badge } from "@/components/ui/display/badge";
import { toast } from "sonner";
import {
  ShoppingCart, User, Calendar, Trash2,
  CheckCircle, Clock, Truck, XCircle, Package, IndianRupee, Loader2, Copy, Check
} from "lucide-react";
import { api, type Order } from "@/services/api";

const statusConfig = {
  Pending: { icon: Clock, color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20" },
  Shipped: { icon: Truck, color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20" },
  Delivered: { icon: CheckCircle, color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
  Cancelled: { icon: XCircle, color: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/20" },
};

const Orders = () => {
  const isAdmin = localStorage.getItem("role") === "admin";
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [timeFilter, setTimeFilter] = useState<string>("All Time");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [orderToDelete, setOrderToDelete] = useState<string | null>(null);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const data = await api.getOrders();
      setOrders(data);
    } catch (err: unknown) {
      console.error("Failed to load orders:", err);
      toast.error("Could not fetch orders from backend");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleStatusChange = async (id: string, newStatus: Order["status"]) => {
    try {
      await api.updateOrderStatus(id, newStatus);
      setOrders((prev) =>
        prev.map((order) => (order.id === id ? { ...order, status: newStatus } : order))
      );
      toast.success(`Order ${id} updated to ${newStatus}`);
    } catch (err: unknown) {
      console.error("Failed to update status:", err);
      toast.error(`Failed to update status for order ${id}`);
    }
  };

  const confirmDeleteOrder = async () => {
    if (orderToDelete) {
      try {
        if ("deleteOrder" in api) {
          await (api as any).deleteOrder(orderToDelete);
        }
      } catch (err: unknown) {
        console.error("Failed to delete order from API:", err);
      }
      setOrders((prev) => prev.filter((order) => order.id !== orderToDelete));
      toast.success(`Order ${orderToDelete} deleted`);
      setOrderToDelete(null);
    }
  };

  const handleCopyId = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(id);
      setCopiedId(id);
      toast.success("Order ID copied to clipboard!");
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      toast.error("Failed to copy order ID");
    }
  };

  const filteredOrders = useMemo(() => {
    const now = new Date();
    return orders.filter((order) => {
      const orderDate = new Date(order.date);
      switch (timeFilter) {
        case "Last 30 Days": {
          const d = new Date(now);
          d.setDate(now.getDate() - 30);
          return orderDate >= d;
        }
        case "Last 90 Days": {
          const d = new Date(now);
          d.setDate(now.getDate() - 90);
          return orderDate >= d;
        }
        case "This Year":
          return orderDate.getFullYear() === now.getFullYear();
        default:
          return true;
      }
    });
  }, [orders, timeFilter]);

  // Exclude cancelled orders from revenue
  const totalRevenue = filteredOrders
    .filter((o) => o.status !== "Cancelled")
    .reduce((sum, o) => sum + o.total, 0);

  const pendingCount = filteredOrders.filter((o) => o.status === "Pending").length;
  const deliveredCount = filteredOrders.filter((o) => o.status === "Delivered").length;

  const stats = [
    { label: "Total Orders", value: filteredOrders.length, icon: Package, color: "text-emerald-400" },
    { label: "Revenue", value: `₹${totalRevenue.toLocaleString()}`, icon: IndianRupee, color: "text-emerald-400" },
    { label: "Pending", value: pendingCount, icon: Clock, color: "text-amber-400" },
    { label: "Delivered", value: deliveredCount, icon: CheckCircle, color: "text-emerald-400" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <ShoppingCart className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Manage Orders</h1>
            <p className="text-sm text-zinc-400">Track and manage all customer orders</p>
          </div>
        </div>

        {/* Time Filter */}
        <div className="flex gap-1 bg-zinc-900/60 p-1 rounded-2xl border border-zinc-800/80 overflow-x-auto max-w-full">
          {["All Time", "Last 30 Days", "Last 90 Days", "This Year"].map((filter) => (
            <button
              key={filter}
              onClick={() => setTimeFilter(filter)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer shrink-0 ${
                timeFilter === filter
                  ? "bg-emerald-500 text-zinc-950 font-bold shadow-md"
                  : "text-zinc-400 hover:text-white hover:bg-zinc-800/60"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-zinc-900/40 border border-zinc-800/60 rounded-2xl p-4 flex items-center gap-3.5 backdrop-blur-md">
              <div className="p-2.5 rounded-xl bg-zinc-950/60 border border-zinc-800/80 shrink-0">
                <Icon className={`w-4 h-4 ${stat.color}`} />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 truncate">{stat.label}</p>
                <p className="text-base sm:text-lg font-bold text-white truncate mt-0.5">{stat.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Orders Container */}
      <div className="bg-zinc-900/40 border border-zinc-800/60 rounded-2xl overflow-hidden backdrop-blur-xl shadow-xl">
        {/* Table Header (Desktop Only) */}
        <div className="hidden md:grid grid-cols-12 gap-3 px-6 py-3.5 border-b border-zinc-800/60 text-[11px] font-bold uppercase tracking-wider text-zinc-400 bg-zinc-950/40">
          <div className="col-span-2">Order ID</div>
          <div className="col-span-3">Customer</div>
          <div className="col-span-2">Items</div>
          <div className="col-span-1">Date</div>
          <div className="col-span-1 text-right">Total</div>
          <div className="col-span-1 text-center">Status</div>
          {isAdmin && <div className="col-span-2 text-right">Actions</div>}
        </div>

        {/* Order Rows */}
        {loading ? (
          <div className="text-center py-16 flex flex-col items-center justify-center">
            <Loader2 className="w-8 h-8 text-emerald-400 animate-spin mb-3" />
            <p className="text-sm text-zinc-400 font-medium">Loading orders from database...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-16">
            <Package className="w-10 h-10 text-zinc-600 mx-auto mb-3" />
            <p className="text-sm text-zinc-400 font-medium">No orders found</p>
            <p className="text-xs text-zinc-500 mt-1">Try adjusting your time filter</p>
          </div>
        ) : (
          filteredOrders.map((order, index) => {
            const config = statusConfig[order.status as keyof typeof statusConfig] || statusConfig["Pending"];
            const StatusIcon = config.icon;
            const isCopied = copiedId === order.id;

            return (
              <div key={order.id} className={index < filteredOrders.length - 1 ? "border-b border-zinc-800/40" : ""}>
                {/* Desktop View */}
                <div className="hidden md:grid grid-cols-12 gap-3 px-6 py-4 items-center hover:bg-zinc-800/20 transition-colors">
                  
                  {/* Order ID with Copy Action */}
                  <div className="col-span-2 flex items-center gap-1.5 min-w-0">
                    <button
                      onClick={(e) => handleCopyId(e, order.id)}
                      className="group flex items-center gap-1.5 font-mono text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 px-2.5 py-1 rounded-lg border border-emerald-500/20 transition-all cursor-pointer truncate max-w-full"
                      title="Click to copy Order ID"
                      aria-label={`Copy order ID ${order.id}`}
                    >
                      <span className="truncate">{order.id}</span>
                      {isCopied ? (
                        <Check className="w-3 h-3 text-emerald-400 shrink-0" />
                      ) : (
                        <Copy className="w-3 h-3 text-emerald-400/60 group-hover:text-emerald-400 shrink-0" />
                      )}
                    </button>
                  </div>

                  {/* Customer */}
                  <div className="col-span-3 flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-zinc-800/80 border border-zinc-700/50 flex items-center justify-center shrink-0 text-zinc-300">
                      <User className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-white truncate">{order.customerName}</p>
                      <p className="text-[11px] text-zinc-400 truncate">{order.customerEmail}</p>
                    </div>
                  </div>

                  {/* Items */}
                  <div className="col-span-2 min-w-0">
                    {order.items.slice(0, 2).map((item) => (
                      <div key={item.id} className="flex items-center justify-between text-xs text-zinc-300 truncate">
                        <span className="truncate">{item.name}</span>
                        <span className="text-zinc-500 text-[11px] font-mono shrink-0 ml-1">×{item.quantity}</span>
                      </div>
                    ))}
                    {order.items.length > 2 && (
                      <p className="text-[10px] text-zinc-500 mt-0.5">+{order.items.length - 2} more item(s)</p>
                    )}
                  </div>

                  {/* Date */}
                  <div className="col-span-1 flex items-center gap-1.5 text-zinc-400 text-xs">
                    <Calendar className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                    <span>{order.date.slice(5)}</span>
                  </div>

                  {/* Total */}
                  <div className="col-span-1 text-right">
                    <span className="text-xs font-bold text-emerald-400 font-mono">₹{order.total.toLocaleString()}</span>
                  </div>

                  {/* Status Badge */}
                  <div className="col-span-1 flex justify-center">
                    <Badge className={`${config.bg} ${config.color} ${config.border} flex items-center gap-1 text-[10px] py-0.5 px-2.5 rounded-full font-semibold`}>
                      <StatusIcon className="w-3 h-3" />
                      {order.status}
                    </Badge>
                  </div>

                  {/* Admin Actions */}
                  {isAdmin && (
                    <div className="col-span-2 flex items-center justify-end gap-2">
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value as Order["status"])}
                        className="h-8 text-xs bg-zinc-950 border border-zinc-700/60 rounded-lg text-zinc-200 px-2 focus:outline-none focus:border-emerald-500/50 cursor-pointer"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                      <button
                        onClick={() => setOrderToDelete(order.id)}
                        className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors cursor-pointer border border-red-500/20"
                        title="Delete order"
                        aria-label={`Delete order ${order.id}`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Mobile View Card */}
                <div className="md:hidden p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <button
                      onClick={(e) => handleCopyId(e, order.id)}
                      className="font-mono text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20 flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>{order.id}</span>
                      {isCopied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3 opacity-60" />}
                    </button>
                    <Badge className={`${config.bg} ${config.color} ${config.border} flex items-center gap-1 text-[10px] py-0.5 px-2.5 rounded-full font-semibold`}>
                      <StatusIcon className="w-3 h-3" />
                      {order.status}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1">
                    <div>
                      <p className="font-bold text-white">{order.customerName}</p>
                      <p className="text-zinc-400 text-[11px]">{order.customerEmail}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-emerald-400 font-mono text-sm">₹{order.total.toLocaleString()}</p>
                      <p className="text-zinc-500 text-[10px]">{order.date}</p>
                    </div>
                  </div>

                  {/* Items List */}
                  <div className="bg-zinc-950/60 p-2.5 rounded-xl border border-zinc-800/80 space-y-1">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex justify-between text-xs text-zinc-300">
                        <span>{item.name}</span>
                        <span className="text-zinc-500 font-mono">×{item.quantity}</span>
                      </div>
                    ))}
                  </div>

                  {/* Mobile Actions */}
                  {isAdmin && (
                    <div className="flex items-center gap-2 pt-1">
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value as Order["status"])}
                        className="flex-1 h-8 text-xs bg-zinc-950 border border-zinc-700/60 rounded-lg text-zinc-200 px-2 focus:outline-none focus:border-emerald-500/50 cursor-pointer"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                      <button
                        onClick={() => setOrderToDelete(order.id)}
                        aria-label={`Delete order ${order.id}`}
                        className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors cursor-pointer border border-red-500/20"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {orderToDelete && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 max-w-sm w-full space-y-4 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="text-lg font-bold text-white">Delete Order?</h3>
              <p className="text-xs text-zinc-400">
                Are you sure you want to delete order <span className="font-semibold text-white">{orderToDelete}</span>? This action cannot be undone.
              </p>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setOrderToDelete(null)}
                className="flex-1 py-2.5 px-4 rounded-xl text-xs font-semibold bg-zinc-800 hover:bg-zinc-700 text-white transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteOrder}
                className="flex-1 py-2.5 px-4 rounded-xl text-xs font-semibold bg-red-500 hover:bg-red-600 text-white transition-colors cursor-pointer shadow-lg shadow-red-500/20"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
