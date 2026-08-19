import { useState } from "react"
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/display/tabs"
import {
  Droplets,
  Sun,
  Wind,
  Thermometer,
  Leaf,
  Sprout,
  Flower2,
  TreeDeciduous,
  CheckCircle2
} from "lucide-react"

const guides = {
  Indoor: {
    icon: TreeDeciduous,
    tagline: "Easygoing greenery for any room",
    care: [
      { icon: Droplets, label: "Water", value: "7–10 days" },
      { icon: Sun, label: "Light", value: "Bright, indirect" },
      { icon: Thermometer, label: "Temp", value: "18–27°C" },
      { icon: Wind, label: "Humidity", value: "Average" },
    ],
    tips: [
      "Let the top 2–3 cm of soil dry out between waterings.",
      "Wipe leaves occasionally to keep them dust-free.",
      "Rotate the pot every couple of weeks for even growth.",
    ],
  },
  "Low-light": {
    icon: Leaf,
    tagline: "Thrives even in dim corners",
    care: [
      { icon: Droplets, label: "Water", value: "10–14 days" },
      { icon: Sun, label: "Light", value: "Low–medium" },
      { icon: Thermometer, label: "Temp", value: "16–26°C" },
      { icon: Wind, label: "Humidity", value: "Tolerates dry" },
    ],
    tips: [
      "Avoid direct sunlight — it can scorch the leaves.",
      "Water less in winter when growth slows down.",
      "Great for bedrooms, hallways, and offices.",
    ],
  },
  Succulent: {
    icon: Sprout,
    tagline: "Low-maintenance and drought-tolerant",
    care: [
      { icon: Droplets, label: "Water", value: "14–21 days" },
      { icon: Sun, label: "Light", value: "Bright–direct" },
      { icon: Thermometer, label: "Temp", value: "18–30°C" },
      { icon: Wind, label: "Humidity", value: "Low" },
    ],
    tips: [
      "Use well-draining, sandy soil to prevent root rot.",
      "Water deeply, then let the soil dry out completely.",
      "Place near a sunny windowsill for best color.",
    ],
  },
  Flowering: {
    icon: Flower2,
    tagline: "Bright blooms that need a little extra care",
    care: [
      { icon: Droplets, label: "Water", value: "3–5 days" },
      { icon: Sun, label: "Light", value: "4–6 hrs direct" },
      { icon: Thermometer, label: "Temp", value: "18–28°C" },
      { icon: Wind, label: "Humidity", value: "Moderate–high" },
    ],
    tips: [
      "Deadhead spent flowers to encourage new blooms.",
      "Feed with a balanced fertilizer every 2–4 weeks.",
      "Avoid letting the soil dry out completely.",
    ],
  },
}

const categories = Object.keys(guides)

const ProductPlantGuide = () => {
  const [active, setActive] = useState(categories[0])

  return (
    <div className="w-full py-8 px-4 max-w-4xl mx-auto">
      {/* Page Title */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-1">
          <Leaf className="w-6 h-6 text-[#10b981]" />
          <h1 className="text-2xl font-bold text-white tracking-tight">Plant Care Guide</h1>
        </div>
        <p className="text-sm text-zinc-400 ml-9">Quick care instructions by plant category</p>
      </div>

      <Tabs value={active} onValueChange={setActive} className="w-full">
        <div className="flex flex-col md:flex-row gap-6 items-stretch">

          {/* Vertical Menu Tabs */}
          <TabsList className="flex md:flex-col gap-0 bg-transparent p-0 h-auto w-auto shrink-0 items-end md:items-stretch self-end md:self-auto">
            {categories.map((cat) => {
              const isActive = active === cat
              return (
                <TabsTrigger
                  key={cat}
                  value={cat}
                  className={`
                    relative px-6 py-3 md:py-4 text-[14px] font-semibold transition-all duration-300 outline-none z-10
                    ${isActive
                      ? 'text-black'
                      : 'text-zinc-400 hover:text-white'}
                  `}
                >
                  {isActive && (
                    <div className="absolute inset-0 bg-[#10b981] rounded-full shadow-lg shadow-emerald-500/20 -z-10" />
                  )}
                  {cat}
                </TabsTrigger>
              )
            })}
          </TabsList>

          {/* Content Area */}
          <div className="flex-1">
        {categories.map((cat) => {
          const currentGuide = guides[cat as keyof typeof guides]
          const CurrentIcon = currentGuide.icon

          return (
            <TabsContent key={cat} value={cat} className="mt-0 focus-visible:outline-none w-full">
              <div className="bg-[#121212] border border-zinc-800/60 rounded-[24px] p-6 sm:p-8 w-full shadow-lg">

                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-[#064e3b]/40 rounded-[16px]">
                      <CurrentIcon className="w-7 h-7 text-[#10b981]" strokeWidth={1.5} />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white tracking-tight leading-tight">{cat} Plants</h2>
                      <p className="text-[#10b981] text-[13px] font-medium mt-0.5">{currentGuide.tagline}</p>
                    </div>
                  </div>
                  <span className="inline-flex items-center justify-center px-3.5 py-1 border border-[#064e3b] text-[#10b981] text-[10px] font-bold uppercase tracking-[0.15em] rounded-full bg-[#064e3b]/10 shrink-0">
                    Care Profile
                  </span>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-2 gap-3 mb-8">
                  {currentGuide.care.map(({ icon: Icon, label, value }) => (
                    <div
                      key={label}
                      className="flex items-center gap-4 rounded-[16px] bg-[#18181b] p-4 border border-zinc-800/30 hover:border-zinc-700/50 transition-colors"
                    >
                      <div className="p-2 rounded-[10px] bg-zinc-800/60">
                        <Icon className="w-4 h-4 text-[#10b981]" strokeWidth={2} />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-400 mb-0.5">{label}</span>
                        <span className="text-[13px] font-bold text-white">{value}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pro Tips Divider */}
                <div className="flex items-center mb-6">
                  <div className="flex-grow border-t border-zinc-800"></div>
                  <span className="mx-4 text-[#10b981] text-[10px] font-bold tracking-[0.2em] uppercase">
                    Pro Tips
                  </span>
                  <div className="flex-grow border-t border-zinc-800"></div>
                </div>

                {/* Pro Tips List */}
                <ul className="space-y-3">
                  {currentGuide.tips.map((tip, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle2 className="w-4.5 h-4.5 text-[#10b981] shrink-0 mt-[2px]" strokeWidth={2} />
                      <span className="text-[13.5px] text-zinc-300 leading-relaxed font-medium">{tip}</span>
                    </li>
                  ))}
                </ul>

              </div>
            </TabsContent>
          )
        })}
          </div>

        </div>
      </Tabs>
    </div>
  )
}

export default ProductPlantGuide