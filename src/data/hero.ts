export interface HeroSlide {
  image: string;
  badge: string;
  title: string;
  subtitle: string;
  cta: string;
  href: string;
}

export const heroSlides: HeroSlide[] = [
  {
    image:
      "https://images.unsplash.com/photo-1750341005643-e79d6ec30979?q=80&w=1200&auto=format&fit=crop",
    badge: "New Arrival",
    title: "Fresh Monstera Deliciosa",
    subtitle: "Starting at Rs.99/-",
    cta: "Shop Now",
    href: "/product",
  },
  {
    image:
      "https://images.unsplash.com/photo-1755355761632-b0478d4edbad?q=80&w=1200&auto=format&fit=crop",
    badge: "Best Seller",
    title: "Fiddle Leaf Fig",
    subtitle: "Statement plants for your home",
    cta: "Explore",
    href: "/product",
  },
];