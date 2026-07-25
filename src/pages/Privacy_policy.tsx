import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Eye, ShieldCheck, Lock, Globe } from "lucide-react";

const PrivacyPolicy = () => {
  const sections = [
    {
      icon: Eye,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20",
      title: "1. Information We Collect",
      text: "We collect information you provide directly to us when registering an account, placing an order, or contacting customer support. This includes your name, email address, billing address, and phone number."
    },
    {
      icon: Lock,
      color: "text-amber-400",
      bg: "bg-amber-500/10",
      border: "border-amber-500/20",
      title: "2. How We Secure Your Data",
      text: "We prioritize your privacy and secure all user login credentials. We do not sell or lease your personal information to third parties. We use secure hashing protocols to protect credentials stored locally."
    },
    {
      icon: Globe,
      color: "text-blue-400",
      bg: "bg-blue-500/10",
      border: "border-blue-500/20",
      title: "3. Cookies & Tracking",
      text: "Our store utilizes local storage and cookies to maintain authenticated user sessions, save items in your shopping cart, and personalize your experience. You can disable cookies in your browser settings."
    }
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-5 text-zinc-100 py-2">
      
      {/* Header section */}
      <div className="flex items-center gap-2.5">
        <div className="p-2 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/5 border border-emerald-500/20 shadow-lg shadow-emerald-950/20">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
        </div>
        <div>
          <Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/10 mb-0.5 text-[9px] py-0 px-2 tracking-wider uppercase font-bold">
            Data Protection
          </Badge>
          <h1 className="text-xl font-bold text-white tracking-tight">Privacy Policy</h1>
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

export default PrivacyPolicy;
