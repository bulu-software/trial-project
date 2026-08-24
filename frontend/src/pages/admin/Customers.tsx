import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/display/badge";
import { Card } from "@/components/ui/display/card";
import { Separator } from "@/components/ui/display/separator";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/display/tabs";
import { toast } from "sonner";
import { Users, Mail, Phone, CalendarDays, PackageCheck, RefreshCw, AlertCircle } from "lucide-react";
import { api } from "@/services/api";

const timeFilters = ["All Time", "Last 30 Days", "Last 90 Days", "This Year"] as const;
type TimeFilter = (typeof timeFilters)[number];

interface Customer {
  id: number;
  name: string;
  email: string;
  role: string;
  phone?: string;
  address?: string;
  joined?: string;
  orders?: number;
}

const CustomersPage = () => {
  const navigate = useNavigate();
  const isAdmin = localStorage.getItem("role") === "admin";

  const [customerList, setCustomerList] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("All Time");

  useEffect(() => {
    if (!isAdmin) {
      toast.error("Admins only");
      navigate("/");
    }
  }, [isAdmin, navigate]);

  const fetchCustomers = async () => {
    setIsLoading(true);
    setError("");
    try {
      const data = await api.getCustomers();
      setCustomerList(data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to load customers from server.";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchCustomers();
    }
  }, [isAdmin]);

  const filtered = useMemo(() => {
    if (timeFilter === "All Time") return customerList;

    const now = new Date();
    const cutoff = new Date();

    if (timeFilter === "Last 30 Days") cutoff.setDate(now.getDate() - 30);
    else if (timeFilter === "Last 90 Days") cutoff.setDate(now.getDate() - 90);
    else if (timeFilter === "This Year") cutoff.setMonth(0, 1);

    return customerList.filter((c) => {
      if (!c.joined) return true;
      return new Date(c.joined) >= cutoff;
    });
  }, [customerList, timeFilter]);

  const initials = (name: string) =>
    name
      .split(" ")
      .filter(Boolean)
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "CU";

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-zinc-950 px-2 sm:px-4 py-4 sm:py-6">
      <div className="max-w-6xl mx-auto">

        {/* ── Header ── */}
        <div className="mb-4 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 border border-emerald-500/20 shrink-0">
                <Users className="w-4 h-4 text-emerald-400" />
              </div>
              <div>
                <Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/10 mb-0.5 text-xs px-2 py-0.5">
                  Admin Panel
                </Badge>
                <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-tight flex items-center gap-2">
                  <span>Customers</span>
                  {customerList.length > 0 && (
                    <span className="text-xs bg-zinc-800 text-zinc-300 font-semibold px-2 py-0.5 rounded-full border border-zinc-700">
                      {customerList.length} total
                    </span>
                  )}
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-2 max-w-full overflow-x-auto">
              <button
                onClick={fetchCustomers}
                disabled={isLoading}
                title="Reload Customers from Backend API"
                className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 transition-all cursor-pointer shrink-0"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin text-emerald-400" : ""}`} />
              </button>

              <Tabs value={timeFilter} onValueChange={(v) => setTimeFilter(v as TimeFilter)} className="max-w-full">
                <TabsList className="bg-zinc-900 border border-zinc-800 h-auto p-1 overflow-x-auto flex-nowrap">
                  {timeFilters.map((t) => (
                    <TabsTrigger
                      key={t}
                      value={t}
                      className="data-[state=active]:bg-emerald-500 data-[state=active]:text-zinc-950 text-zinc-300 text-xs sm:text-sm font-medium px-2.5 sm:px-3 py-1.5 cursor-pointer whitespace-nowrap"
                    >
                      {t}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>
          </div>

          <Separator className="bg-zinc-800" />
        </div>

        {/* Error Banner */}
        {error && (
          <div className="mb-4 p-3 text-xs font-medium text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
            <button
              onClick={fetchCustomers}
              className="text-xs underline text-red-300 hover:text-white cursor-pointer ml-4"
            >
              Retry
            </button>
          </div>
        )}

        {/* Loading Spinner */}
        {isLoading ? (
          <div className="text-center py-16 space-y-3">
            <div className="w-8 h-8 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs text-zinc-400 font-medium">Fetching customers from FastAPI server...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12 space-y-2">
            <div className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto">
              <Users className="w-4 h-4 text-zinc-600" />
            </div>
            <p className="text-sm text-zinc-400">No customers found for this period.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map((c) => (
              <Card
                key={c.id}
                className="bg-zinc-900/60 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900/80 transition-all duration-200 p-3 flex flex-col sm:flex-row sm:items-center gap-3 group"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="w-9 h-9 shrink-0 rounded-full bg-gradient-to-br from-emerald-500/25 to-emerald-500/5 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold text-sm">
                    {initials(c.name)}
                  </div>

                  <div className="min-w-0 space-y-0.5">
                    <div className="flex items-center gap-2">
                      <h3 className="text-base text-white font-semibold truncate leading-tight">{c.name}</h3>
                      {c.role === "admin" && (
                        <span className="text-[10px] uppercase tracking-wider font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-1.5 py-0.2 rounded">
                          Admin
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-x-3.5 gap-y-1 text-sm text-zinc-400">
                      <span className="flex items-center gap-1.5 truncate">
                        <Mail className="w-3.5 h-3.5 text-zinc-600 shrink-0" />
                        {c.email}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-zinc-600 shrink-0" />
                        {c.phone || "N/A"}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <CalendarDays className="w-3.5 h-3.5 text-zinc-600 shrink-0" />
                        {c.joined}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 pl-12 sm:pl-0 sm:border-l sm:border-zinc-800 sm:pl-3.5">
                  <div className="p-1.5 rounded-md bg-zinc-800/60">
                    <PackageCheck className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-base font-bold text-white leading-none">{c.orders}</p>
                    <p className="text-[10px] text-zinc-500 uppercase tracking-wider mt-0.5 font-medium">
                      order{c.orders !== 1 ? "s" : ""}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomersPage;