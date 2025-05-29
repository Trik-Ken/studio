
import { mockCompanies, mockProducts } from '@/lib/mock-data';
import type { Company } from '@/lib/types';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/product-card';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare, Globe, Mail, MapPin } from 'lucide-react';

export default function CompanyProfilePage({ params }: { params: { id: string } }) {
  const { id } = params; // Destructure id from params
  const company = mockCompanies.find((c) => c.id === id);
  const companyProducts = mockProducts.filter((p) => p.companyId === id);

  if (!company) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-semibold">Company not found</h1>
        <Link href="/" passHref>
          <Button variant="link" className="mt-4">Go back to explore</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="mb-8 shadow-lg">
        <CardHeader className="flex flex-col items-center p-6 text-center sm:flex-row sm:text-left sm:items-start">
          <Image
            src={company.logoUrl}
            alt={`${company.name} logo`}
            width={120}
            height={120}
            className="rounded-lg border bg-muted mb-4 sm:mb-0 sm:mr-6"
            data-ai-hint={company.dataAiHint || "company logo"}
            unoptimized={company.logoUrl.startsWith('https://placehold.co')}
          />
          <div className="flex-1">
            <CardTitle className="text-3xl font-bold mb-2">{company.name}</CardTitle>
            <CardDescription className="text-muted-foreground mb-4 text-md leading-relaxed">{company.description}</CardDescription>
            <div className="flex flex-wrap justify-center sm:justify-start gap-2 text-sm text-muted-foreground mb-4">
              {company.address && <span className="flex items-center"><MapPin className="h-4 w-4 mr-1.5"/> {company.address}</span>}
              {company.contactEmail && <span className="flex items-center"><Mail className="h-4 w-4 mr-1.5"/> {company.contactEmail}</span>}
              {company.website && <span className="flex items-center"><Globe className="h-4 w-4 mr-1.5"/> <a href={company.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{company.website}</a></span>}
            </div>
            <Link href={`/chat/${company.id}`} passHref>
              <Button size="lg">
                <MessageSquare className="mr-2 h-5 w-5" /> Chat with {company.name}
              </Button>
            </Link>
          </div>
        </CardHeader>
      </Card>

      <h2 className="text-2xl font-semibold mb-6 text-foreground">Products from {company.name}</h2>
      {companyProducts.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {companyProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground text-center py-8">This company has not listed any products yet.</p>
      )}
    </div>
  );
}
