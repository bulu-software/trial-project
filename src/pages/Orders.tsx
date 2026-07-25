import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  ShoppingCart, Search, User, Calendar, Trash2,
  CheckCircle, Clock, Truck, XCircle
} from "lucide-react";

interface OrderItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  date: string;
  items: OrderItem[];
  total: number;
  status: "Pending" | "Shipped" | "Delivered" | "Cancelled";
}

const initialOrders: Order[] = [
  {
    id: "ORD-9821",
    customerName: "Rahul Sharma",
    customerEmail: "rahul@gmail.com",
    date: "2026-07-24",
    items: [
      { id: 1, name: "Monstera Deliciosa", price: 899, quantity: 1 },
      { id: 2, name: "Snake Plant", price: 449, quantity: 2 }
    ],
    total: 1797,
    status: "Pending"
  },
  {
    id: "ORD-9822",
    customerName: "Priya Patel",
    customerEmail: "priya@yahoo.com",
    date: "2026-07-23",
    items: [
      { id: 3, name: "Fiddle Leaf Fig", price: 1299, quantity: 1 }
    ],
    total: 1299,
    status: "Shipped"
  },
  {
    id: "ORD-9823",
    customerName: "Amit Kumar",
    customerEmail: "amit.k@outlook.com",
    date: "2026-07-22",
    items: [
      { id: 4, name: "Golden Pothos", price: 349, quantity: 3 },
      { id: 5, name: "Echeveria Succulent Set", price: 599, quantity: 1 }
    ],
    total: 1646,
    status: "Delivered"
  },
  {
    id: "ORD-9824",
    customerName: "Sneha Reddy",
    customerEmail: "sneha.r@gmail.com",
    date: "2026-07-20",
    items: [
      { id: 6, name: "Peace Lily", price: 499, quantity: 1 }
    ],
    total: 499,
    status: "Cancelled"
  }
];

const Orders = () => {
  const isAdmin = localStorage.getItem("role") === "admin";
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");

  const handleStatusChange = (id: string, newStatus: Order["status"]) => {
    setOrders((prev) =>
      prev.map((order) => (order.id === id ? { ...order, status: newStatus } : order))
    );
    toast.success(`Order ${id} status updated to ${newStatus}`);
  };

  const handleDeleteOrder = (id: string) => {
    setOrders((prev) => prev.filter((order) => order.id !== id));
    toast.success(`Order ${id} deleted successfully`);
  };

  const getStatusBadge = (status: Order["status"]) => {
    switch (status) {
      case "Pending":
        return (
          <Badge className="bg-yellow-500/15 text-yellow-500 border-yellow-500/20 flex items-center gap-1 w-fit text-[10px] py-0.5 px-2">
            <Clock className="w-3 h-3" /> Pending
          </Badge>
        );
      case "Shipped":
        return (
          <Badge className="bg-blue-500/15 text-blue-400 border-blue-500/20 flex items-center gap-1 w-fit text-[10px] py-0.5 px-2">
            <Truck className="w-3 h-3" /> Shipped
          </Badge>
        );
      case "Delivered":
        return (
          <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 flex items-center gap-1 w-fit text-[10px] py-0.5 px-2">
            <CheckCircle className="w-3 h-3" /> Delivered
          </Badge>
        );
      case "Cancelled":
        return (
          <Badge className="bg-red-500/15 text-red-400 border-red-500/20 flex items-center gap-1 w-fit text-[10px] py-0.5 px-2">
            <XCircle className="w-3 h-3" /> Cancelled
          </Badge>
        );
    }
  };

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesSearch =
        order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customerEmail.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === "All" || order.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [orders, searchQuery, statusFilter]);

  return (
    <div className="space-y-4">
      {/* Header Title */}
      <div className="flex items-center gap-2">
        <div className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
          <ShoppingCart className="w-4 h-4 text-emerald-400" />
        </div>
        <div>
          <Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/10 mb-0.5 text-[9px] py-0 px-1.5">
            Store Logistics
          </Badge>
          <h1 className="text-xl md:text-2xl font-bold text-white">Manage Orders</h1>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 bg-zinc-900/40 p-2.5 rounded-xl border border-zinc-800">
        <div className="flex-1 relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by ID, customer..."
            className="pl-8 h-8 text-xs bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-500 focus-visible:ring-emerald-500 rounded-lg"
          />
        </div>
        <div className="flex gap-1 flex-wrap">
          {["All", "Pending", "Shipped", "Delivered", "Cancelled"].map((status) => (
            <Button
              key={status}
              variant={statusFilter === status ? "default" : "ghost"}
              onClick={() => setStatusFilter(status)}
              className={`text-[10px] h-7 px-2.5 rounded-lg ${
                statusFilter === status
                  ? "bg-emerald-500 text-zinc-950 font-bold hover:bg-emerald-400"
                  : "text-zinc-400 hover:text-white hover:bg-zinc-800"
              }`}
            >
              {status}
            </Button>
          ))}
        </div>
      </div>

      {/* Orders list */}
      {filteredOrders.length === 0 ? (
        <div className="text-center py-10 bg-zinc-900/20 rounded-xl border border-zinc-800/50">
          <p className="text-xs text-zinc-500">No orders found.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filteredOrders.map((order) => (
            <Card key={order.id} className="bg-zinc-900/40 border-zinc-800/80 hover:border-zinc-700 transition-all rounded-xl overflow-hidden">
              <CardContent className="p-3 flex flex-col md:flex-row md:items-center justify-between gap-4">
                
                {/* Customer & Order details */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 md:w-[260px] shrink-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-emerald-400 tracking-wide bg-emerald-500/5 border border-emerald-500/10 px-2 py-0.5 rounded-md">{order.id}</span>
                    <span className="md:hidden">{getStatusBadge(order.status)}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-zinc-300">
                    <User className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                    <div className="text-[11px] leading-tight">
                      <p className="font-bold text-white">{order.customerName}</p>
                      <p className="text-zinc-500 text-[10px]">{order.customerEmail}</p>
                    </div>
                  </div>
                </div>

                {/* Items list */}
                <div className="flex-1 min-w-[200px] border-t border-zinc-800/80 pt-2 md:pt-0 md:border-0">
                  <div className="space-y-0.5">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex justify-between items-center text-[11px] text-zinc-300">
                        <span>{item.name} <span className="text-zinc-500 text-[10px]">x{item.quantity}</span></span>
                        <span className="font-medium text-zinc-400">Rs.{item.price * item.quantity}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Status pills, Total & Action controls */}
                <div className="flex items-center justify-between md:justify-end gap-4 border-t border-zinc-800/80 pt-2 md:pt-0 md:border-0 min-w-[240px] shrink-0">
                  <div className="text-xs text-zinc-500 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-zinc-600" />
                    <span>{order.date}</span>
                  </div>

                  <div className="text-right">
                    <p className="text-[11px] font-extrabold text-white">Rs.{order.total}</p>
                  </div>
                  
                  <div className="hidden md:block">
                    {getStatusBadge(order.status)}
                  </div>
                  
                  {isAdmin && (
                    <div className="flex items-center gap-1.5">
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value as Order["status"])}
                        className="h-7 text-[10px] bg-zinc-950 border border-zinc-700 rounded-lg text-white px-1.5 focus:outline-none focus:border-emerald-500/50 cursor-pointer"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                      <button
                        onClick={() => handleDeleteOrder(order.id)}
                        className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition-colors cursor-pointer border-0"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
