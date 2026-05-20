export interface User {
  id: string;
  email: string | null;
  phone: string | null;
  name: string;
  role: string;
  address?: string | null;
  city?: string | null;
  district?: string | null;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  salePrice: number | null;
  category: string;
  subcategory: string | null;
  gender: string;
  image: string;
  images: string;
  stock: number;
  featured: boolean;
  avgRating?: number;
  reviewCount?: number;
}

export interface CartItem {
  id: string;
  quantity: number;
  product: Product;
}

export interface Review {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  user: { name: string };
}
