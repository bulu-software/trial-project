import { Link } from "react-router-dom"
import { Button } from "@/components/ui/forms/button"
import { Card, CardContent } from "@/components/ui/display/card"
import { Badge } from "@/components/ui/display/badge"
import { Separator } from "@/components/ui/display/separator"
import {
  Leaf,
  Sprout,
  HeartHandshake,
  ShieldCheck,
  Truck,
  ArrowRight,
  Sparkles,
  TreeDeciduous
} from "lucide-react"

const About = () => {
  const values = [
    {
      icon: Sprout,
      title: "Hand-Nurtured Plants",
      description: "Every single plant is carefully raised by botanical specialists in controlled nursery environments."
    },
    {
      icon: ShieldCheck,
      title: "100% Health Guarantee",
      description: "Arrives fresh, vibrant, and pest-free at your doorstep, backed by our 48-hour healthy transit guarantee."
    },
    {
      icon: Truck,
      title: "Safe Botanical Packaging",
      description: "Custom breathable, damage-proof packaging designed specifically to protect living foliage in transit."
    },
    {
      icon: HeartHandshake,
      title: "Lifetime Plant Care Advice",
      description: "Free plant doctor guidance and care tips to help your green companions thrive all year round."
    }
  ]

  return (
    <div className="min-h-[85vh] bg-zinc-950 text-white py-8 sm:py-12 px-4 sm:px-6 relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[550px] h-[350px] bg-emerald-500/5 blur-[140px] pointer-events-none -z-10 rounded-full" />
      <div className="absolute bottom-10 right-10 w-[300px] h-[300px] bg-green-500/5 blur-[120px] pointer-events-none -z-10 rounded-full" />

      <div className="max-w-4xl mx-auto space-y-10 sm:space-y-12">
        
        {/* ── Hero Header ── */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/10 px-3 py-1 text-xs font-semibold rounded-full">
            <Sparkles className="w-3.5 h-3.5 mr-1 text-emerald-400" />
            Our Story & Mission
          </Badge>
          
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white leading-tight">
            Bringing Nature Closer to Every Living Space
          </h1>
          
          <p className="text-sm sm:text-base text-zinc-400 leading-relaxed">
            PlantShop started with a simple vision — everyone deserves a little more living green in their home and workspace. We deliver healthy, low-maintenance botanicals with the care instructions you need to help them thrive.
          </p>
        </div>

        {/* ── Story Showcase Card ── */}
        <Card className="bg-zinc-900/40 border-zinc-800/70 backdrop-blur-xl rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-emerald-500/20 via-emerald-400 to-green-500/20" />
          
          <CardContent className="p-0 space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                <TreeDeciduous className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white tracking-tight">From Our Nursery to Your Doorstep</h2>
                <p className="text-xs text-zinc-400">Sustainably cultivated botanicals for urban lifestyles</p>
              </div>
            </div>

            <p className="text-sm text-zinc-300 leading-relaxed">
              We partner directly with sustainable nursery growers to ensure every plant is well-rooted, acclimated to indoor conditions, and potted in eco-friendly, nutrient-rich soil. From beginner-friendly snake plants to rare indoor statement pieces, we are here to support your green journey.
            </p>

            <Separator className="bg-zinc-800/60" />

            {/* Core Values Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {values.map((v, i) => {
                const IconComp = v.icon
                return (
                  <div
                    key={i}
                    className="p-4 rounded-2xl bg-zinc-950/60 border border-zinc-800/70 hover:border-zinc-700/80 transition-all flex items-start gap-3.5 group"
                  >
                    <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shrink-0 group-hover:scale-105 transition-transform">
                      <IconComp className="w-4 h-4" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-sm font-semibold text-white group-hover:text-emerald-400 transition-colors">
                        {v.title}
                      </h3>
                      <p className="text-xs text-zinc-400 leading-relaxed">
                        {v.description}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* CTA row */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-zinc-800/60">
              <div className="flex items-center gap-2 text-xs text-zinc-400">
                <Leaf className="w-4 h-4 text-emerald-400" />
                <span>Ready to start your botanical sanctuary?</span>
              </div>
              <Link to="/product">
                <Button className="bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold rounded-xl h-10 px-5 flex items-center gap-2 shadow-lg hover:shadow-emerald-500/20 transition-all cursor-pointer text-xs">
                  Browse Catalog
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  )
}

export default About