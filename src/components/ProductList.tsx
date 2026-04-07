'use client'

import { useMemo } from 'react'

interface Product {
  id: string
  name: string
  category: string
  price: string
  rating: number
  reviews: number
  badge?: string
  imageUrl: string
  tags: string[]
  merchantKey: string
  productUrl: string
  excerpt: string
}

const products: Product[] = [
  {
    id: '1',
    name: 'Away The Carry-On',
    category: 'Hardshell',
    price: '$295',
    rating: 4.8,
    reviews: 2847,
    badge: 'Best Overall',
    imageUrl: 'https://images.unsplash.com/photo-1565026057447-bc90a3dceb87?w=600&q=80&auto=format&fit=crop',
    tags: ['TSA-approved', 'Lifetime Warranty', '7-Year Warranty'],
    merchantKey: 'away',
    productUrl: 'https://www.awaytravel.com/bags/carry-on',
    excerpt: 'The benchmark carry-on. Perfect balance of durability, style, and smart organization.',
  },
  {
    id: '2',
    name: 'Monos Carry-On Pro',
    category: 'Premium',
    price: '$395',
    rating: 4.7,
    reviews: 892,
    badge: 'Premium Pick',
    imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&q=80&auto=format&fit=crop',
    tags: ['Laptop Compartment', 'Water-resistant'],
    merchantKey: 'monos',
    productUrl: 'https://monos.com/products/carry-on-pro',
    excerpt: 'For the traveler who needs their bag to work as hard as they do.',
  },
  {
    id: '3',
    name: 'Travelpro Platinum Elite',
    category: 'Value',
    price: '$229',
    rating: 4.6,
    reviews: 3421,
    imageUrl: 'https://images.unsplash.com/photo-1581553680321-4fffae59fccd?w=600&q=80&auto=format&fit=crop',
    tags: ['Fabric', 'Expandable', '2-Year Warranty'],
    merchantKey: 'travelpro',
    productUrl: 'https://www.travelpro.com/platinum-elite-carry-on',
    excerpt: 'The road warrior&apos;s choice. Proven durability at a price that makes sense.',
  },
]

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`w-3.5 h-3.5 ${star <= Math.round(rating) ? 'text-[#c9a96e]' : 'text-[#d9d0c4]'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  )
}

function ProductCard({ product }: { product: Product }) {
  return (
    <div className="product-card bg-white border border-[#d9d0c4] overflow-hidden group">
      {/* Image */}
      <div className="relative h-56 overflow-hidden bg-[#f0ebe2]">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        {/* Category tag */}
        <div className="absolute top-4 left-4">
          <span
            className="text-[0.6rem] font-bold uppercase tracking-widest px-3 py-1.5"
            style={{ fontFamily: "'Source Sans 3', sans-serif", background: 'rgba(15,28,38,0.85)', color: '#c9a96e' }}
          >
            {product.category}
          </span>
        </div>
        {/* Badge */}
        {product.badge && (
          <div className="absolute top-4 right-4">
            <span className="badge-editorial">{product.badge}</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Header */}
        <div className="mb-3">
          <div className="flex items-start justify-between gap-2">
            <h3
              className="font-display text-xl font-bold text-[#1a1814] leading-tight"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {product.name}
            </h3>
            <span className="text-lg font-bold text-[#1a1814] shrink-0">{product.price}</span>
          </div>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-3">
          <StarRating rating={product.rating} />
          <span className="text-xs text-[#6b6560]" style={{ fontFamily: "'Source Sans 3', sans-serif" }}>
            {product.rating} ({product.reviews.toLocaleString()} reviews)
          </span>
        </div>

        {/* Excerpt */}
        <p className="text-sm text-[#6b6560] leading-relaxed mb-4" style={{ fontFamily: "'Source Sans 3', sans-serif" }}>
          {product.excerpt}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-5">
          {product.tags.map((tag) => (
            <span
              key={tag}
              className="text-[0.6rem] uppercase tracking-widest px-2 py-1 border border-[#d9d0c4] text-[#6b6560]"
              style={{ fontFamily: "'Source Sans 3', sans-serif" }}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* CTA */}
        <a
          href={product.productUrl}
          target="_blank"
          rel="noopener noreferrer sponsored"
          className="block text-center w-full py-3 border border-[#1a1814] text-[#1a1814] text-xs font-bold uppercase tracking-widest hover:bg-[#1a1814] hover:text-white transition-all"
          style={{ fontFamily: "'Source Sans 3', sans-serif" }}
        >
          View Deal →
        </a>
      </div>
    </div>
  )
}

export function ProductList() {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
