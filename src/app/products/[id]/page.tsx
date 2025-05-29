import { mockProducts, mockCompanies } from '@/lib/mock-data';
import type { Product } from '@/lib/types';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ChevronLeft, ChevronRight, MessageSquare } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const product = mockProducts.find((p) => p.id === params.id);
  const company = product ? mockCompanies.find((c) => c.id === product.companyId) : undefined;

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-semibold">Product not found</h1>
        <Link href="/" passHref>
          <Button variant="link" className="mt-4">Go back to explore</Button>
        </Link>
      </div>
    );
  }

  // Simplified image display instead of a full carousel
  const displayImages = product.images && product.images.length > 0 ? product.images : [product.imageUrl];
  
  const priceDisplayString = () => {
    const unitString = `${product.priceForQuantity} ${product.priceUnit}${product.priceForQuantity === 1 ? '' : 's'}`;
    if (product.priceForQuantity === 1) {
      return `$${product.price.toFixed(2)} / ${product.priceUnit}`;
    }
    return `$${product.price.toFixed(2)} / ${unitString}`;
  };

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <Card className="overflow-hidden shadow-xl">
        <CardHeader className="p-0">
          <div className="relative aspect-video w-full">
            <Image
              src={displayImages[0]}
              alt={product.name}
              layout="fill"
              objectFit="cover"
              priority
              data-ai-hint={product.dataAiHint || "product detail"}
            />
            {/* Basic navigation for multiple images if present */}
            {displayImages.length > 1 && (
              <>
                <Button variant="ghost" size="icon" className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white">
                  <ChevronLeft className="h-6 w-6" />
                </Button>
                <Button variant="ghost" size="icon" className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white">
                  <ChevronRight className="h-6 w-6" />
                </Button>
              </>
            )}
          </div>
          {/* Thumbnails if multiple images */}
          {displayImages.length > 1 && (
            <div className="flex gap-2 p-4 bg-muted/50 overflow-x-auto">
              {displayImages.map((img, idx) => (
                <div key={idx} className="relative h-20 w-20 flex-shrink-0 rounded-md overflow-hidden border-2 border-transparent hover:border-primary cursor-pointer">
                  <Image src={img} alt={`${product.name} thumbnail ${idx+1}`} layout="fill" objectFit="cover" data-ai-hint={product.dataAiHint || "product thumbnail"}/>
                </div>
              ))}
            </div>
          )}
        </CardHeader>
        <CardContent className="p-6">
          <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2">{product.name}</h1>
          {product.category && <Badge variant="secondary" className="mb-3">{product.category}</Badge>}
          <p className="text-2xl font-semibold text-primary mb-4">{priceDisplayString()}</p>
          
          <div className="mb-6 text-foreground leading-relaxed">
            <h2 className="text-xl font-semibold mb-2">Description</h2>
            <p>{product.description}</p>
          </div>

          <Separator className="my-6" />

          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-3">Specifications</h2>
            <ul className="space-y-2">
              {product.specifications.map((spec) => (
                <li key={spec.key} className="flex justify-between text-sm">
                  <span className="font-medium text-muted-foreground">{spec.key}:</span>
                  <span className="text-foreground">{spec.value}</span>
                </li>
              ))}
            </ul>
          </div>

          <Separator className="my-6" />
          
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <h2 className="text-xl font-semibold mb-2">Warranty &amp; Returns</h2>
              <p className="text-sm text-muted-foreground mb-1"><strong>Warranty:</strong> {product.warrantyInfo}</p>
              <p className="text-sm text-muted-foreground"><strong>Returns:</strong> {product.returnPolicy}</p>
            </div>
            {company && (
              <div>
                <h2 className="text-xl font-semibold mb-2">Sold By</h2>
                <Link href={`/companies/${company.id}`} className="group">
                  <div className="flex items-center gap-3">
                    <Image src={company.logoUrl} alt={company.name} width={40} height={40} className="rounded-full" data-ai-hint={company.dataAiHint || "company logo"}/>
                    <div>
                      <p className="text-primary font-medium group-hover:underline">{company.name}</p>
                      <p className="text-xs text-muted-foreground">View company profile</p>
                    </div>
                  </div>
                </Link>
              </div>
            )}
          </div>
          
          <Separator className="my-6" />

          <div className="flex flex-col sm:flex-row gap-4">
            {company && (
              <Link href={`/chat/${company.id}?product=${product.id}`} passHref className="flex-1">
                <Button variant="outline" size="lg" className="w-full">
                  <MessageSquare className="mr-2 h-5 w-5" /> Contact Seller
                </Button>
              </Link>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
