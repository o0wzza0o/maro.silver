# MARO SILVER

متجر مجوهرات فضية فاخرة — واجهة أمامية حديثة مبنية بـ Next.js 15.

## Tech Stack

- **Next.js 15** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **shadcn/ui**
- **Lucide React Icons**
- **Framer Motion**
- **React Hook Form + Zod**

## Features

- RTL Arabic support
- Mobile-first responsive design
- Cart & Wishlist (localStorage)
- Product catalog with filtering & sorting
- Checkout flow (frontend only)
- Loading skeletons & empty states
- Smooth animations & page transitions

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Pages

| Route | Description |
|-------|-------------|
| `/` | Home — hero, categories, best sellers, new arrivals |
| `/products` | Product listing with filters |
| `/products/[slug]` | Product details |
| `/cart` | Shopping cart |
| `/checkout` | Checkout form |
| `/checkout/success` | Order confirmation |
| `/favorites` | Wishlist |
| `/search` | Search products |

## Project Structure

```
app/                  # Next.js App Router pages
components/
  ui/                 # shadcn/ui primitives
  cards/              # Product cards
  layout/             # Navbar, Footer, animations
  home/               # Home page sections
  products/           # Product-related components
  cart/               # Cart & checkout
data/                 # Dummy JSON data
hooks/                # Cart, wishlist, toast hooks
lib/                  # Utilities & helpers
types/                # TypeScript interfaces
```

## Notes

- **Frontend only** — no backend, database, or API
- All data is static dummy JSON in `data/`
- Cart and wishlist persist in browser localStorage
"# maro.silver" 
"# maro.silver" 
