
'use client';

import type { Product } from '@/lib/types';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Package } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const safeImageUrl = product.imageUrl || 'https://placehold.co/600x400.png';
  const isPlaceholder = safeImageUrl.startsWith('https://placehold.co');

  return (
    <Link href={`/products/${product.id}`} className="block group h-full">
      <Card className="overflow-hidden shadow-lg group-hover:shadow-xl transition-shadow duration-300 h-full flex flex-col">
        <CardHeader className="p-0">
          <div className="aspect-[3/2] relative w-full bg-muted">
            <Image
              src={safeImageUrl}
              alt={product.name || 'Product Image'}
              layout="fill"
              objectFit="cover"
              data-ai-hint={isPlaceholder ? 'product placeholder' : (product.dataAiHint || "product image")}
              unoptimized={safeImageUrl.startsWith('https://placehold.co') || safeImageUrl.startsWith('data:image/')}
              onError={(e) => {(e.target as HTMLImageElement).src = 'https://placehold.co/600x400.png'; (e.target as HTMLImageElement).srcset = ''}}
            />
          </div>
        </CardHeader>
        <CardContent className="p-4 flex flex-col flex-grow min-w-0">
          <CardTitle className="text-lg font-semibold mb-1 truncate group-hover:text-primary transition-colors">
            {product.name || 'Unnamed Product'}
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground mb-2 h-10 overflow-hidden flex-shrink-0">
            {product.description ? (product.description.length > 60 ? `${product.description.substring(0, 60)}...` : product.description) : 'No description available.'}
          </CardDescription>
          <div className="mt-auto pt-2">
            <div className="flex items-center justify-between">
              <p className="text-xl font-bold text-primary">
                ₹{typeof product.price === 'number' ? product.price.toFixed(2) : '0.00'}
              </p>
              {product.unitQuantity && (
                <div className="flex items-center text-sm text-muted-foreground">
                  <Package className="w-4 h-4 mr-1.5 flex-shrink-0" />
                  <span className="truncate">
                    / {product.unitQuantity}
                  </span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
