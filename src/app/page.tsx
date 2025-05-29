
'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { ProductCard } from '@/components/product-card';
import { mockProducts } from '@/lib/mock-data';
import { Search, ShoppingBag } from 'lucide-react'; // Added ShoppingBag for empty state

export default function ExplorePage() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProducts = mockProducts.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.category && p.category.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-foreground">
          Discover Products
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Find the best B2B products for your business needs.
        </p>
      </header>

      <div className="mb-8 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search products by name, category, or description..."
          className="w-full rounded-lg bg-background py-3 pl-10 pr-4 text-lg shadow-sm focus:ring-primary"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
         <div className="text-center py-16">
            <ShoppingBag className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
            <p className="text-xl text-muted-foreground">No products found.</p>
            {searchTerm ? (
                 <p className="text-sm text-muted-foreground mt-1">Try adjusting your search terms or explore all products.</p>
            ) : (
                <p className="text-sm text-muted-foreground mt-1">Check back later or broaden your horizons!</p>
            )}
        </div>
      )}
    </div>
  );
}
