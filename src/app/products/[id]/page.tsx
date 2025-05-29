
'use client'; 
import { mockProducts, mockCompanies } from '@/lib/mock-data';
import type { Product } from '@/lib/types';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card'; 
import { Separator } from '@/components/ui/separator';
import { ChevronLeft, ChevronRight, MessageSquare } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation'; // Import useParams

export default function ProductDetailPage() {
  const params = useParams<{ id: string }>(); // Get params using the hook
  const productId = params.id; // Extract id

  const product = mockProducts.find((p) => p.id === productId);
  const company = product ? mockCompanies.find((c) => c.id === product.companyId) : undefined;

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const displayImages = React.useMemo(() => {
    if (product?.images && product.images.length > 0) {
      return product.images;
    }
    if (product?.imageUrl) {
      return [product.imageUrl];
    }
    // Ensure a fallback with a consistent data-ai-hint for placeholder
    return ['https://placehold.co/600x400.png']; 
  }, [product]);

  useEffect(() => {
    setCurrentImageIndex(0); // Reset when product changes
  }, [product]); // Product itself depends on productId

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
  
  const handlePrevImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + displayImages.length) % displayImages.length);
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % displayImages.length);
  };

  const handleThumbnailClick = (index: number) => {
    setCurrentImageIndex(index);
  };

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
          <div className="relative aspect-video w-full bg-muted">
            <Image
              src={displayImages[currentImageIndex]}
              alt={`${product.name} - image ${currentImageIndex + 1}`}
              layout="fill"
              objectFit="contain" 
              priority={currentImageIndex === 0}
              data-ai-hint={displayImages[currentImageIndex] === 'https://placehold.co/600x400.png' ? 'product placeholder' : (product.dataAiHint || "product detail")}
              key={displayImages[currentImageIndex]} 
              unoptimized={displayImages[currentImageIndex].startsWith('https://placehold.co')}
            />
            {displayImages.length > 1 && (
              <>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full"
                  onClick={handlePrevImage}
                >
                  <ChevronLeft className="h-6 w-6" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full"
                  onClick={handleNextImage}
                >
                  <ChevronRight className="h-6 w-6" />
                </Button>
              </>
            )}
          </div>
          {displayImages.length > 1 && (
            <div className="flex gap-2 p-2 sm:p-4 bg-muted/50 overflow-x-auto">
              {displayImages.map((img, idx) => (
                <div 
                  key={idx} 
                  className={`relative h-16 w-16 sm:h-20 sm:w-20 flex-shrink-0 rounded-md overflow-hidden border-2 cursor-pointer transition-all ${currentImageIndex === idx ? 'border-primary shadow-md' : 'border-transparent hover:border-muted-foreground/50'}`}
                  onClick={() => handleThumbnailClick(idx)}
                  role="button"
                  aria-label={`View image ${idx + 1}`}
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && handleThumbnailClick(idx)}
                >
                  <Image 
                    src={img} 
                    alt={`${product.name} thumbnail ${idx+1}`} 
                    layout="fill" 
                    objectFit="cover" 
                    data-ai-hint={img === 'https://placehold.co/600x400.png' ? 'product placeholder' : (product.dataAiHint || "product thumbnail")} 
                    unoptimized={img.startsWith('https://placehold.co')}
                  />
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

          {product.specifications && product.specifications.length > 0 && (
            <>
              <Separator className="my-6" />
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-3">Specifications</h2>
                <ul className="space-y-2">
                  {product.specifications.map((spec) => (
                    <li key={spec.key} className="flex justify-between text-sm">
                      <span className="font-medium text-muted-foreground">{spec.key}:</span>
                      <span className="text-foreground text-right">{spec.value}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </>
          )}
          
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
                  <div className="flex items-center gap-3 p-2 rounded-md hover:bg-muted/50 transition-colors">
                    <Image src={company.logoUrl} alt={company.name} width={40} height={40} className="rounded-full border" data-ai-hint={company.dataAiHint || "company logo"}/>
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
