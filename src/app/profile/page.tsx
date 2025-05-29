
import { mockCompanies, mockProducts, loggedInCompanyId } from '@/lib/mock-data';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/product-card';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

export default function ProfilePage() {
  const company = mockCompanies.find((c) => c.id === loggedInCompanyId);
  const companyProducts = mockProducts.filter((p) => p.companyId === loggedInCompanyId);

  if (!company) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-semibold">Profile not found. Please log in.</h1>
        {/* In a real app, you'd have a login button here */}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div className="flex items-center gap-4 mb-4 sm:mb-0">
            <Image
              src={company.logoUrl}
              alt={`${company.name} logo`}
              width={80}
              height={80}
              className="rounded-full border bg-muted"
              data-ai-hint={company.dataAiHint || "company logo"}
            />
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
          {/* "Manage Orders" and "Add New Product" buttons removed from here */}
        </div>
        {companyProducts.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {companyProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 border-2 border-dashed rounded-lg">
            <p className="text-xl text-muted-foreground">You haven't listed any products yet.</p>
            {/* "List Your First Product" button removed */}
          </div>
        )}
      </div>
    </div>
  );
}
