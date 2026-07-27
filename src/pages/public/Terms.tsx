import { Badge } from "@/components/ui/display/badge";
import { Separator } from "@/components/ui/display/separator";
import { FileText, ShieldAlert, Scale, HelpCircle } from "lucide-react";

const Terms = () => {
  const sections = [
    {
      icon: FileText,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20",
      title: "1. Acceptance of Terms",
      text: "By accessing and purchasing from PlantShop, you agree to comply with and be bound by these Terms of Service. Please review them carefully before making any purchases."
    },
    {
      icon: ShieldAlert,
      color: "text-amber-400",
      bg: "bg-amber-500/10",
      border: "border-amber-500/20",
      title: "2. Ordering & Shipping",
      text: "All plant orders are subject to availability. Plants are live goods; appearances vary. We pack securely, but are not liable for transit delays caused by third-party carriers."
    },
    {
      icon: Scale,
      color: "text-blue-400",
      bg: "bg-blue-500/10",
      border: "border-blue-500/20",
      title: "3. Returns & Refunds",
      text: "Returns are not accepted due to perishability. If plants arrive damaged or dead, contact customer support within 24 hours with photos for a replacement or store credit."
    },
    {
      icon: HelpCircle,
      color: "text-purple-400",
      bg: "bg-purple-500/10",
      border: "border-purple-500/20",
      title: "4. Customer Care Policy",
      text: "You are responsible for providing proper water, lighting, and humidity. PlantShop is not liable for plant health decline after 48 hours post-delivery."
    }
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-5 text-zinc-100 py-2">
      
      {/* Header section */}
      <div className="flex items-center gap-2.5">
        <div className="p-2 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/5 border border-emerald-500/20 shadow-lg shadow-emerald-950/20">
          <Scale className="w-5 h-5 text-emerald-400" />
        </div>
        <div>
          <Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/10 mb-0.5 text-[9px] py-0 px-2 tracking-wider uppercase font-bold">
            Legal Agreements
          </Badge>
          <h1 className="text-xl font-bold text-white tracking-tight">Terms of Service</h1>
        </div>
      </div>

      <Separator className="bg-zinc-800/80" />

      {/* Grid of micro-cards for eye-friendly layout */}
      <div className="grid grid-cols-1 gap-3">
        {sections.map((sec, idx) => {
          const IconComponent = sec.icon;
          return (
            <div 
              key={idx} 
              className="group p-3.5 bg-zinc-900/40 hover:bg-zinc-900/60 border border-zinc-800/80 hover:border-zinc-700/60 rounded-xl transition-all duration-300 flex items-start gap-3.5 relative overflow-hidden"
            >
              {/* Highlight bar */}
              <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className={`p-2 rounded-lg ${sec.bg} ${sec.border} ${sec.color} shrink-0 mt-0.5 transition-transform group-hover:scale-105 duration-300`}>
                <IconComponent className="w-4 h-4" />
              </div>
              
              <div className="space-y-1">
                <h2 className="text-sm font-bold text-white tracking-tight group-hover:text-emerald-400 transition-colors">
                  {sec.title}
                </h2>
                <p className="text-[11px] text-zinc-400 leading-normal font-medium">
                  {sec.text}
                </p>
              </div>
            </div>
          );
        })}
      </div>
      
      <p className="text-center text-[9px] text-zinc-500 uppercase tracking-widest pt-2">Last updated: July 2026</p>
    </div>
  );
};

export default Terms;
