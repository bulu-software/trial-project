import * as React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/display/carousel";
import { Button } from "@/components/ui/forms/button";
import { heroSlides } from "@/data/hero";
import { Sparkles, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function Hero() {
  // Embla Carousel instance state and active slide tracking
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);

  // Hook into Embla API events to keep slide indicators synced
  React.useEffect(() => {
    if (!api) return;

    // Set total slides count and current active index
    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());

    // Listen to slide select changes
    const onSelect = () => setCurrent(api.selectedScrollSnap());
    api.on("select", onSelect);

    // cleanup: unsubscribe on unmount / api change to prevent memory leaks
    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  if (!heroSlides || heroSlides.length === 0) return null;

  return (
    <div className="relative w-full group">
      <Carousel setApi={setApi} opts={{ loop: true }} className="w-full">
        <CarouselContent>
          {heroSlides.map((slide, i) => {
            // Split title by words and highlight the last two words with a brand gradient
            const words = slide.title.split(" ");
            const highlightFrom = Math.max(words.length - 2, 0);

            return (
              <CarouselItem key={i}>
                <div className="relative overflow-hidden rounded-3xl border border-border/80 bg-gradient-to-br from-zinc-900/95 via-zinc-950 to-zinc-900/95 p-8 md:p-12 lg:p-16 min-h-[460px] md:min-h-[500px] flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12">
                  <div className="absolute top-0 left-0 w-80 h-80 bg-plant-green/10 rounded-full blur-[100px] pointer-events-none" />
                  <div className="absolute bottom-0 right-0 w-80 h-80 bg-plant-accent/5 rounded-full blur-[100px] pointer-events-none" />

                  <div className="flex-1 space-y-6 z-10 text-left w-full md:w-auto">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-plant-green/10 border border-plant-green/20 text-plant-accent text-xs font-semibold uppercase tracking-wider">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{slide.badge}</span>
                    </div>

                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.1] font-sans">
                      {words.map((word, index) => {
                        const isHighlighted = index >= highlightFrom;
                        return (
                          <span
                            key={index}
                            className={
                              isHighlighted
                                ? "bg-gradient-to-r from-plant-accent to-plant-green bg-clip-text text-transparent"
                                : "text-white"
                            }
                          >
                            {word}{" "}
                          </span>
                        );
                      })}
                    </h1>

                    <p className="text-zinc-400 text-base md:text-lg max-w-md font-normal leading-relaxed">
                      {slide.subtitle}
                    </p>

                    <div className="pt-2 flex flex-col sm:flex-row gap-4">
                      <a href={slide.href} className="inline-block">
                        <Button className="bg-plant-green hover:bg-plant-green/90 text-zinc-950 font-bold px-8 py-6 text-base rounded-xl shadow-lg shadow-plant-green/20 hover:shadow-plant-green/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 group/btn flex items-center gap-2">
                          <span>{slide.cta}</span>
                          <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                        </Button>
                      </a>
                    </div>
                  </div>

                  <div className="flex-1 w-full h-[280px] md:h-[380px] relative rounded-2xl overflow-hidden group/image border border-plant-green/10 shadow-2xl">
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/40 via-transparent to-transparent z-10 pointer-events-none" />
                    <img
                      src={slide.image}
                      alt={slide.title}
                      className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover/image:scale-105"
                    />
                  </div>
                </div>
              </CarouselItem>
            );
          })}
        </CarouselContent>

        <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-zinc-900/80 border-zinc-800 text-white hover:bg-zinc-800 hover:text-plant-accent hidden md:flex" />
        <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-zinc-900/80 border-zinc-800 text-white hover:bg-zinc-800 hover:text-plant-accent hidden md:flex" />
      </Carousel>

      {count > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {Array.from({ length: count }).map((_, i) => (
            <button
              key={i}
              onClick={() => api?.scrollTo(i)}
              className={cn(
                "h-2 rounded-full transition-all duration-300 cursor-pointer",
                current === i
                  ? "w-6 bg-plant-green"
                  : "w-2 bg-zinc-600 hover:bg-zinc-500"
              )}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}