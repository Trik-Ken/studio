
'use client';
import { useState, useEffect } from 'react';
import { mockCompanies, mockProducts, loggedInCompanyId } from '@/lib/mock-data';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/product-card';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings, Package } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Company, Product } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'; // Added Avatar imports

export default function ProfilePage() {
  const [company, setCompany] = useState<Company | null>(null);
  const [companyProducts, setCompanyProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    const currentCompany = mockCompanies.find((c) => c.id === loggedInCompanyId);
    setCompany(currentCompany || null);

    if (currentCompany) {
      const products = mockProducts.filter((p) => p.companyId === loggedInCompanyId);
      setCompanyProducts(products);

      const uniqueCategories = Array.from(new Set(products.map(p => p.category).filter(Boolean) as string[]));
      setCategories(uniqueCategories.sort());
    }
  }, []);


  if (!company) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-semibold">Profile not found. Please log in.</h1>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div className="flex items-center gap-4 mb-4 sm:mb-0">
            <Avatar className="h-20 w-20 border bg-muted"> {/* Using Avatar component */}
              <AvatarImage
                src={company.logoUrl}
                alt={`${company.name} logo`}
                data-ai-hint={company.dataAiHint || "company logo"}
              />
              <AvatarFallback>{company.name.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-foreground">{company.name}</h1>
              <p className="text-muted-foreground">Your Company Profile</p>
            </div>
          </div>
          <Link href="/settings" passHref>
            <Button variant="outline">
              <Settings className="mr-2 h-4 w-4" /> Settings
            </Button>
          </Link>
        </div>
      </header>

      <Card className="mb-8 shadow-lg">
        <CardHeader>
          <CardTitle>Description</CardTitle>
          <CardDescription>View your company's public information.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {company.description && (
            <p className="text-md text-foreground leading-relaxed">
              {company.description}
            </p>
          )}
          {(company.description && (company.contactEmail || company.phoneNumber || company.website || company.address || company.gstNumber)) && <Separator className="my-4" />}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3 text-sm">
            <div>
              <span className="font-semibold text-muted-foreground">Email: </span>
              <span>{company.contactEmail || 'Not set'}</span>
            </div>
            <div>
              <span className="font-semibold text-muted-foreground">Phone: </span>
              <span>{company.phoneNumber || 'Not set'}</span>
            </div>
            <div>
              <span className="font-semibold text-muted-foreground">Website: </span>
              {company.website ? (
                <a href={company.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                  {company.website}
                </a>
              ) : (
                'Not set'
              )}
            </div>
            <div>
              <span className="font-semibold text-muted-foreground">Address: </span>
              <span>{company.address || 'Not set'}</span>
            </div>
            <div>
              <span className="font-semibold text-muted-foreground">GST Number: </span>
              <span>{company.gstNumber || 'Not set'}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Separator className="my-8" />

      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-foreground">Your Listed Products</h2>
        </div>

        {companyProducts.length > 0 ? (
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="inline-flex h-10 items-center justify-start rounded-md bg-muted p-1 text-muted-foreground w-full overflow-x-auto mb-4">
              <TabsTrigger value="all" className="whitespace-nowrap">All Products</TabsTrigger>
              {categories.map(category => (
                <TabsTrigger key={category} value={category} className="whitespace-nowrap capitalize">
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="all">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {companyProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </TabsContent>

            {categories.map(category => (
              <TabsContent key={category} value={category}>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {companyProducts.filter(p => p.category === category).map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        ) : (
          <div className="text-center py-12 border-2 border-dashed rounded-lg">
            <Package className="mx-auto h-12 w-12 text-muted-foreground mb-3" />
            <p className="text-xl text-muted-foreground">You haven't listed any products yet.</p>
            <p className="text-sm text-muted-foreground mt-1">Go to Settings &gt; Manage Company &amp; Products to add some.</p>
          </div>
        )}
      </div>
    </div>
  );
}
