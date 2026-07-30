import { useState } from "react"
import { Card } from "@/components/ui/display/card"
import { Badge } from "@/components/ui/display/badge"
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
    <div className="max-w-4xl mx-auto w-full py-6 px-4">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl font-bold flex items-center gap-2 text-foreground">
          <Leaf className="w-5 h-5 text-emerald-500" />
          Plant Care Guide
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Quick care instructions by plant category
        </p>
      </div>

      <Tabs value={active} onValueChange={setActive} className="w-full">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          
          {/* Left Side: Navigation Sidebar/Panel */}
          <div className="md:col-span-4 bg-muted/30 p-2 rounded-xl border border-border/40">
            <TabsList className="flex flex-col gap-1 bg-transparent p-0 h-auto w-full">
              {categories.map((cat) => {
                const CatIcon = guides[cat].icon
                return (
                  <TabsTrigger
                    key={cat}
                    value={cat}
                    className="flex items-center justify-start gap-3 w-full h-10 px-3 rounded-lg text-sm font-medium transition-all data-[state=active]:bg-background data-[state=active]:text-emerald-600 data-[state=active]:shadow-sm border border-transparent data-[state=active]:border-border/60"
                  >
                    <CatIcon className="w-4 h-4 shrink-0" />
                    <span>{cat}</span>
                  </TabsTrigger>
                )
              })}
            </TabsList>
          </div>

          {/* Right Side: Care Content Display */}
          <div className="md:col-span-8 w-full">
            {categories.map((cat) => {
              const currentGuide = guides[cat]
              const CurrentIcon = currentGuide.icon

              return (
                <TabsContent key={cat} value={cat} className="mt-0 focus-visible:outline-none">
                  <Card className="p-5 sm:p-6 shadow-md border-border/60 bg-card">
                    {/* Card Title Header */}
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div className="flex items-center gap-2.5">
                        <div className="p-2 bg-emerald-50 dark:bg-emerald-950/40 rounded-lg">
                          <CurrentIcon className="w-5 h-5 text-emerald-500" />
                        </div>
                        <div>
                          <h2 className="text-lg font-semibold text-foreground leading-tight">{cat} Plants</h2>
                          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">{currentGuide.tagline}</p>
                        </div>
                      </div>
                      <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border-none text-xs px-2.5 py-1 font-medium whitespace-nowrap">
                        Care Profile
                      </Badge>
                    </div>

                    {/* Metrics Grid - Grid layout fixed to prevent clipping */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-5">
                      {currentGuide.care.map(({ icon: Icon, label, value }) => (
                        <div
                          key={label}
                          className="flex items-center gap-3 rounded-xl border border-border/80 bg-muted/20 p-3 shadow-2xs"
                        >
                          <div className="p-2 rounded-lg bg-background border border-border/40 shadow-2xs">
                            <Icon className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                          </div>
                          <div className="flex flex-col min-w-0 grid-1">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/90 leading-none mb-1">{label}</span>
                            <span className="text-sm font-medium text-foreground truncate">{value}</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Bulleted Pro-Tips */}
                    <div className="border-t border-border/60 pt-4 mt-2">
                      <p className="text-xs uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-bold mb-3">
                        Pro Tips
                      </p>
                      <ul className="space-y-2.5">
                        {currentGuide.tips.map((tip, i) => (
                          <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground leading-relaxed">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0" />
                            <span className="flex-1">{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </Card>
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