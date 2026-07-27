import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/display/badge";
import { Card } from "@/components/ui/display/card";
import { Separator } from "@/components/ui/display/separator";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/display/tabs";
import { customers } from "@/data/customers";
import { toast } from "sonner";
import { Users, Mail, Phone, CalendarDays, PackageCheck } from "lucide-react";

const timeFilters = ["All Time", "Last 30 Days", "Last 90 Days", "This Year"] as const;
type TimeFilter = (typeof timeFilters)[number];

const CustomersPage = () => {
  const navigate = useNavigate();
  const isAdmin = localStorage.getItem("role") === "admin";

  useEffect(() => {
    if (!isAdmin) {
      toast.error("Admins only");
      navigate("/");
    }
  }, [isAdmin, navigate]);

  const [timeFilter, setTimeFilter] = useState<TimeFilter>("All Time");

  const filtered = useMemo(() => {
    if (timeFilter === "All Time") return customers;

    const now = new Date();
    const cutoff = new Date();

    if (timeFilter === "Last 30 Days") cutoff.setDate(now.getDate() - 30);
    else if (timeFilter === "Last 90 Days") cutoff.setDate(now.getDate() - 90);
    else if (timeFilter === "This Year") cutoff.setMonth(0, 1);

    return customers.filter((c) => new Date(c.joined) >= cutoff);
  }, [timeFilter]);

  const initials = (name: string) =>
    name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-zinc-950 px-4 py-6">
      <div className="max-w-6xl mx-auto">

        {/* ── Header ── */}
        <div className="mb-4 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 border border-emerald-500/20">
                <Users className="w-4 h-4 text-emerald-400" />
              </div>
              <div>
                <Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/10 mb-0.5 text-xs px-2 py-0.5">
                  Admin
                </Badge>
                <h1 className="text-2xl font-bold text-white tracking-tight leading-tight">
                  Customers
                </h1>
              </div>
            </div>

            <Tabs value={timeFilter} onValueChange={(v) => setTimeFilter(v as TimeFilter)}>
              <TabsList className="bg-zinc-900 border border-zinc-800 h-auto p-1">
                {timeFilters.map((t) => (
                  <TabsTrigger
                    key={t}
                    value={t}
                    className="data-[state=active]:bg-emerald-500 data-[state=active]:text-zinc-950 text-zinc-300 text-sm font-medium px-3 py-1.5"
                  >
                    {t}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>

          <Separator className="bg-zinc-800" />
        </div>

        {/* ── List ── */}
        {filtered.length === 0 ? (
          <div className="text-center py-12 space-y-2">
            <div className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto">
              <Users className="w-4 h-4 text-zinc-600" />
            </div>
            <p className="text-sm text-zinc-400">No customers joined in this period.</p>
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
                    <h3 className="text-base text-white font-semibold truncate leading-tight">{c.name}</h3>
                    <div className="flex flex-wrap items-center gap-x-3.5 gap-y-1 text-sm text-zinc-400">
                      <span className="flex items-center gap-1.5 truncate">
                        <Mail className="w-3.5 h-3.5 text-zinc-600 shrink-0" />
                        {c.email}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-zinc-600 shrink-0" />
                        {c.phone}
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