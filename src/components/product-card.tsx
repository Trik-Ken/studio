import type { Product } from '@/lib/types';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Package } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Link href={`/products/${product.id}`} className="block group h-full">
      <Card className="overflow-hidden shadow-lg group-hover:shadow-xl transition-shadow duration-300 h-full flex flex-col">
        <CardHeader className="p-0">
          <div className="aspect-[3/2] relative w-full">
            <Image
              src={product.imageUrl}
              alt={product.name}
              layout="fill"
              objectFit="cover"
              data-ai-hint={product.dataAiHint || "product image"}
            />
          </div>
        </CardHeader>
        <CardContent className="p-4 flex flex-col flex-grow">
          <CardTitle className="text-lg font-semibold mb-1 truncate group-hover:text-primary transition-colors">
            {product.name}
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground mb-2 h-10 overflow-hidden flex-shrink-0">
            {product.description.substring(0, 60)}...
          </CardDescription>
          <div className="mt-auto pt-2">
            <div className="flex items-center justify-between">
              <p className="text-xl font-bold text-primary">
                ${product.price.toFixed(2)}
              </p>
              <div className="flex items-center text-sm text-muted-foreground">
                <Package className="w-4 h-4 mr-1.5 flex-shrink-0" />
                <span className="truncate">
                  {product.priceForQuantity} {product.priceUnit}{product.priceForQuantity === 1 ? '' : 's'}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
