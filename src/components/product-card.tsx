import type { Product } from '@/lib/types';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
      <Link href={`/products/${product.id}`} className="block">
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
      </Link>
      <CardContent className="p-4">
        <Link href={`/products/${product.id}`}>
          <CardTitle className="text-lg font-semibold mb-1 truncate hover:text-primary transition-colors">
            {product.name}
          </CardTitle>
        </Link>
        <CardDescription className="text-sm text-muted-foreground mb-2 h-10 overflow-hidden">
          {product.description.substring(0, 60)}...
        </CardDescription>
        <div className="flex items-center justify-between mb-3">
          <p className="text-xl font-bold text-primary">
            ${product.pricePerUnit.toFixed(2)}
          </p>
          {product.rating && (
            <div className="flex items-center text-sm text-muted-foreground">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-yellow-400 mr-1">
                <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clipRule="evenodd" />
              </svg>
              {product.rating.toFixed(1)} ({product.reviewsCount})
            </div>
          )}
        </div>
         <Link href={`/products/${product.id}`} passHref>
            <Button variant="outline" className="w-full group">
                View Details <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
