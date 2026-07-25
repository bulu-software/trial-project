export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  rating: number;
  reviews: number;
  badge: string | null;
  image: string;
  features: string[];
}

export const products: Product[] = [
  {
    id: 1,
    name: "Monstera Deliciosa",
    category: "Indoor",
    price: 899,
    rating: 4.8,
    reviews: 312,
    badge: "Bestseller",
    image: "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=600",
    features: ["Air-purifying", "Pet-safe alternative", "Fast-growing"],
  },
  {
    id: 2,
    name: "Snake Plant",
    category: "Low-light",
    price: 449,
    rating: 4.9,
    reviews: 268,
    badge: "Easy care",
    image: "https://images.unsplash.com/photo-1593482892290-f54927ae1bb6?w=600",
    features: ["Drought-tolerant", "Air-purifying"],
  },
  {
    id: 3,
    name: "Fiddle Leaf Fig",
    category: "Indoor",
    price: 1299,
    rating: 4.6,
    reviews: 154,
    badge: "New",
    image: "https://images.unsplash.com/photo-1596547609652-9cf5d8d76921?w=600",
    features: ["Statement piece", "Bright indirect light"],
  },
  {
    id: 4,
    name: "Golden Pothos",
    category: "Low-light",
    price: 349,
    rating: 4.7,
    reviews: 401,
    badge: null,
    image: "https://images.unsplash.com/photo-1592150621744-aca64f48394a?w=600",
    features: ["Trailing vine", "Beginner-friendly"],
  },
  {
    id: 5,
    name: "Echeveria Succulent Set",
    category: "Succulent",
    price: 599,
    rating: 4.5,
    reviews: 187,
    badge: null,
    image: "https://images.unsplash.com/photo-1509423350716-97f9360b4e09?w=600",
    features: ["Low water", "Set of 3"],
  },
  {
    id: 6,
    name: "Peace Lily",
    category: "Flowering",
    price: 499,
    rating: 4.7,
    reviews: 223,
    badge: "Bestseller",
    image: "https://images.unsplash.com/photo-1519064438923-de4de326dfd1?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8UGVhY2UlMjBMaWx5JTIwcGluayUyMHBvdHxlbnwwfHwwfHx8MA%3D%3D",
    features: ["Blooms indoors", "Air-purifying"],
  },
  {
    id: 7,
    name: "catharanthus roseus",
    category: "Low-light",
    price: 549,
    rating: 4.8,
    reviews: 296,
    badge: null,
    image: "https://images.unsplash.com/photo-1726196484058-565c844de9b2?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8Y2F0aGFyYW50aHVzJTIwcm9zZXVzfGVufDB8fDB8fHww",
    features: ["Drought-tolerant", "Glossy leaves"],
  },
  {
    id: 8,
    name: " Jade Plant",
    category: "Flowering",
    price: 749,
    rating: 4.6,
    reviews: 132,
    badge: "New",
    image: "https://images.unsplash.com/photo-1616189597001-9046fce2594d?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8SmFkZSUyMFBsYW50fGVufDB8fDB8fHww",
    features: ["Long-lasting blooms", "Bright indirect light"],
  },
];