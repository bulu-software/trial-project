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
      "https://images.unsplash.com/photo-1730166610657-634aece868de?q=80&w=1037&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    badge: "New Arrival",
    title: "Fresh Monstera Deliciosa",
    subtitle: "Starting at Rs.99/-",
    cta: "Shop Now",
    href: "/shop/monstera",
  },
  {
    image:
      "https://media.istockphoto.com/id/2245627190/photo/succulents-in-pots-on-wooden-shelf-against-rustic-wall.webp?a=1&b=1&s=612x612&w=0&k=20&c=hGJU4xTAo37z61ypJ6H9j_Scccgh3ZUvY_VYTSn4Cak=",
    badge: "Best Seller",
    title: "Fiddle Leaf Fig",
    subtitle: "Statement plants for your home",
    cta: "Explore",
    href: "/shop/fiddle-leaf-fig",
  },
];