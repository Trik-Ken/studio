
'use client';

import type { ChangeEvent } from 'react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { mockCompanies, mockProducts, loggedInCompanyId } from '@/lib/mock-data';
import type { Company, Product } from '@/lib/types';
import { ArrowLeft, Edit3, PlusCircle, Trash2, Package } from 'lucide-react'; // Added Package
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";


// Zod schema for company details
const companySchema = z.object({
  name: z.string().min(3, { message: "Company name must be at least 3 characters." }),
  description: z.string().min(10, { message: "Description must be at least 10 characters." }),
  contactEmail: z.string().email({ message: "Invalid email address." }).or(z.literal('')),
  website: z.string().url({ message: "Invalid URL." }).optional().or(z.literal('')),
  address: z.string().optional().or(z.literal('')),
  logoUrl: z.string().optional().or(z.literal('')),
});

// Zod schema for product
const productSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(3, { message: "Product name must be at least 3 characters." }),
  description: z.string().min(10, { message: "Description must be at least 10 characters." }),
  price: z.preprocess(
    (val) => (typeof val === 'string' && val !== '') ? parseFloat(val) : (typeof val === 'number' ? val : undefined),
    z.number({invalid_type_error: "Price must be a number."}).min(0, { message: "Price must be a positive number." })
  ),
  priceForQuantity: z.preprocess(
    (val) => (typeof val === 'string' && val !== '') ? parseInt(val,10) : (typeof val === 'number' ? val : undefined),
    z.number({invalid_type_error: "Quantity must be a whole number."}).int().min(1, { message: "Quantity must be at least 1."})
  ),
  priceUnit: z.string().min(1, {message: "Price unit is required (e.g., item, panel)."}),
  category: z.string().optional().or(z.literal('')),
  imageUrl: z.string().url({message: "Please enter a valid image URL (e.g., https://placehold.co/600x400.png)"}).optional().or(z.literal('')),
});

export default function ManageCompanyProductsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [company, setCompany] = useState<Company | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedLogoFile, setSelectedLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  useEffect(() => {
    const currentCompany = mockCompanies.find(c => c.id === loggedInCompanyId);
    if (currentCompany) {
      setCompany(currentCompany);
    }
    const companyProducts = mockProducts.filter(p => p.companyId === loggedInCompanyId);
    setProducts(companyProducts);
  }, []);

  const companyForm = useForm<z.infer<typeof companySchema>>({
    resolver: zodResolver(companySchema),
    defaultValues: {
      name: '',
      description: '',
      contactEmail: '',
      website: '',
      address: '',
      logoUrl: '',
    },
  });

  const productForm = useForm<z.infer<typeof productSchema>>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      priceForQuantity: 1,
      priceUnit: 'unit',
      category: '',
      imageUrl: '',
    },
  });

  useEffect(() => {
    if (company) {
      companyForm.reset({
        name: company.name,
        description: company.description,
        contactEmail: company.contactEmail || '',
        website: company.website || '',
        address: company.address || '',
        logoUrl: company.logoUrl || '',
      });
      setLogoPreview(company.logoUrl || null);
    }
  }, [company, companyForm]);

  const handleLogoChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // Max 2MB
        toast({ title: "File too large", description: "Logo image must be under 2MB.", variant: "destructive"});
        return;
      }
      setSelectedLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmitCompanyDetails = (values: z.infer<typeof companySchema>) => {
    if (!company) return;
    
    const updatedCompanyData: Company = {
        ...company,
        ...values,
        logoUrl: logoPreview || company.logoUrl, // Use preview if a new logo was selected
        dataAiHint: company.dataAiHint // Preserve existing AI hint
    };
    
    setCompany(updatedCompanyData);
    
    const companyIndex = mockCompanies.findIndex(c => c.id === loggedInCompanyId);
    if (companyIndex !== -1) {
        mockCompanies[companyIndex] = updatedCompanyData;
    }
    if (selectedLogoFile) {
      console.log('Logo file to upload (mock):', selectedLogoFile.name);
    }

    toast({
      title: 'Company Details Updated',
      description: 'Your company information has been saved.',
    });
  };

  const handleAddNewProduct = () => {
    setEditingProduct(null);
    productForm.reset({
      name: '',
      description: '',
      price: 0,
      priceForQuantity: 1,
      priceUnit: 'unit',
      category: '',
      imageUrl: 'https://placehold.co/600x400.png', // Default placeholder
    });
    setIsProductModalOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    productForm.reset({
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      priceForQuantity: product.priceForQuantity,
      priceUnit: product.priceUnit,
      category: product.category || '',
      imageUrl: product.imageUrl || 'https://placehold.co/600x400.png',
    });
    setIsProductModalOpen(true);
  };

  const handleDeleteProduct = (productId: string) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
    const productIndex = mockProducts.findIndex(p => p.id === productId);
    if (productIndex !== -1) {
        mockProducts.splice(productIndex, 1);
    }
    toast({
      title: 'Product Deleted',
      description: 'The product has been removed from your listings.',
      variant: 'destructive'
    });
  };

  const onSubmitProduct = (values: z.infer<typeof productSchema>) => {
    if (!company) return;

    const productData = {
        ...values,
        imageUrl: values.imageUrl || 'https://placehold.co/600x400.png',
        images: [values.imageUrl || 'https://placehold.co/600x400.png'], // Simplified images array
        specifications: [], // Default, can be expanded
        warrantyInfo: "Standard warranty", // Default
        returnPolicy: "30-day returns", // Default
        dataAiHint: values.category || "product image", // Use category for hint or default
        companyId: loggedInCompanyId,
        companyName: company.name,
    };

    if (editingProduct) { 
      const updatedProduct: Product = { ...editingProduct, ...productData };
      setProducts(prev => prev.map(p => p.id === editingProduct.id ? updatedProduct : p));
      const productIndex = mockProducts.findIndex(p => p.id === editingProduct.id);
      if (productIndex !== -1) {
        mockProducts[productIndex] = updatedProduct;
      }
      toast({
        title: 'Product Updated',
        description: `${values.name} has been updated.`,
      });
    } else { 
      const newProduct: Product = {
        ...productData,
        id: `prod-${Date.now()}`, // Mock ID generation
      };
      setProducts(prev => [newProduct, ...prev]);
      mockProducts.unshift(newProduct); // Add to the beginning of mock data for visibility
      toast({
        title: 'Product Added',
        description: `${values.name} has been added to your listings.`,
      });
    }
    setIsProductModalOpen(false);
    setEditingProduct(null);
  };


  if (!company) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p>Loading company data...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8 mb-20">
      <header className="mb-8">
        <Button variant="ghost" onClick={() => router.back()} className="mb-4 -ml-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Settings
        </Button>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Manage Company & Products</h1>
        <p className="text-muted-foreground">Edit your company's public profile and manage your product listings.</p>
      </header>

      <Card className="mb-8 shadow-md">
        <CardHeader>
          <CardTitle>Edit Company Details</CardTitle>
          <CardDescription>Update your company's information. Click "Save Company Details" to apply changes.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...companyForm}>
            <form onSubmit={companyForm.handleSubmit(onSubmitCompanyDetails)} className="space-y-6">
              <div className="flex flex-col items-center space-y-4 mb-6">
                <Avatar className="h-32 w-32 border-2 border-primary shadow-sm">
                  <AvatarImage src={logoPreview || undefined} alt={company.name} data-ai-hint={company.dataAiHint || "company logo"}/>
                  <AvatarFallback>{company.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <FormItem className="w-full max-w-sm">
                   <FormLabel htmlFor="logo-upload" className="text-center block cursor-pointer text-sm font-medium text-primary hover:underline">Change Logo</FormLabel>
                  <FormControl>
                    <Input
                      id="logo-upload"
                      type="file"
                      accept="image/png, image/jpeg, image/gif"
                      onChange={handleLogoChange}
                      className="sr-only" 
                    />
                  </FormControl>
                  <FormDescription className="text-center text-xs">Click label to upload (PNG, JPG, GIF up to 2MB).</FormDescription>
                </FormItem>
              </div>

              <FormField
                control={companyForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Your Company Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={companyForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Tell us about your company" {...field} rows={4}/>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={companyForm.control}
                name="contactEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="contact@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={companyForm.control}
                name="website"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Website (Optional)</FormLabel>
                    <FormControl>
                      <Input type="url" placeholder="https://example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={companyForm.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="123 Main St, City, Country" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={companyForm.formState.isSubmitting} className="w-full sm:w-auto">
                {companyForm.formState.isSubmitting ? "Saving..." : "Save Company Details"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Separator className="my-10" />

      <Card className="shadow-md">
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <CardTitle>Manage Products</CardTitle>
            <CardDescription>Add new products or edit existing ones from your company's listings.</CardDescription>
          </div>
          <Button onClick={handleAddNewProduct} className="w-full sm:w-auto">
            <PlusCircle className="mr-2 h-4 w-4" /> Add New Product
          </Button>
        </CardHeader>
        <CardContent>
          {products.length > 0 ? (
            <div className="space-y-6">
              {products.map(product => (
                <Card key={product.id} className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 shadow-sm border">
                  <Image
                    src={product.imageUrl}
                    alt={product.name}
                    width={80}
                    height={80}
                    className="rounded-md object-cover aspect-square border bg-muted flex-shrink-0"
                    data-ai-hint={product.dataAiHint || "product image"}
                    onError={(e) => {(e.target as HTMLImageElement).src = 'https://placehold.co/80x80.png'}}
                  />
                  <div className="flex-grow min-w-0">
                    <h3 className="font-semibold text-lg truncate" title={product.name}>{product.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      ${product.price.toFixed(2)} / {product.priceForQuantity} {product.priceUnit}{product.priceForQuantity !== 1 ? 's' : ''}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{product.description}</p>
                  </div>
                  <div className="flex gap-2 mt-3 sm:mt-0 flex-shrink-0 self-start sm:self-center">
                    <Button variant="outline" size="sm" onClick={() => handleEditProduct(product)}>
                      <Edit3 className="mr-1.5 h-3.5 w-3.5" /> Edit
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="sm">
                          <Trash2 className="mr-1.5 h-3.5 w-3.5" /> Delete
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the product "{product.name}".
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDeleteProduct(product.id)} className="bg-destructive hover:bg-destructive/90 text-destructive-foreground">
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 border-2 border-dashed rounded-lg">
              <Package className="mx-auto h-12 w-12 text-muted-foreground mb-3" />
              <p className="text-xl font-semibold text-muted-foreground">No products listed yet.</p>
              <p className="text-sm text-muted-foreground mt-1">Click the button below to add your first product.</p>
              <Button onClick={handleAddNewProduct} className="mt-6">
                <PlusCircle className="mr-2 h-4 w-4" /> List Your First Product
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={isProductModalOpen} onOpenChange={(open) => {
          setIsProductModalOpen(open);
          if (!open) setEditingProduct(null); // Reset editing state when modal closes
      }}>
        <AlertDialogContent className="max-w-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>{editingProduct ? 'Edit Product' : 'Add New Product'}</AlertDialogTitle>
            <AlertDialogDescription>
              {editingProduct ? `Update the details for ${editingProduct.name}.` : 'Enter the details for your new product.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <Form {...productForm}>
            <form 
                onSubmit={productForm.handleSubmit(onSubmitProduct)} 
                className="space-y-4 max-h-[60vh] overflow-y-auto p-1 pr-4 custom-scrollbar"
            >
                <FormField
                  control={productForm.control}
                  name="imageUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product Image URL</FormLabel>
                      <FormControl>
                        <div className="flex items-center gap-4">
                            <Image 
                                src={field.value || 'https://placehold.co/100x100.png'} 
                                alt="Product Preview" 
                                width={80} 
                                height={80} 
                                className="rounded-md border object-cover aspect-square bg-muted flex-shrink-0"
                                data-ai-hint="product placeholder"
                                onError={(e) => {(e.target as HTMLImageElement).src = 'https://placehold.co/100x100.png'}}
                            />
                            <Input 
                                placeholder="https://example.com/image.png" 
                                {...field} 
                                className="flex-grow"
                            />
                        </div>
                      </FormControl>
                      <FormDescription>Enter a direct URL for the product image. (e.g. https://placehold.co/600x400.png)</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={productForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product Name</FormLabel>
                      <FormControl><Input placeholder="e.g., Super Widget Model X" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={productForm.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product Description</FormLabel>
                      <FormControl><Textarea placeholder="Detailed product description, features, benefits..." {...field} rows={3} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                    control={productForm.control}
                    name="price"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Price ($)</FormLabel>
                        <FormControl><Input type="number" step="0.01" placeholder="e.g., 99.99" {...field} /></FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={productForm.control}
                    name="priceForQuantity"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Items per Price</FormLabel>
                        <FormControl><Input type="number" inputMode="numeric" pattern="[0-9]*" step="1" placeholder="e.g., 1" {...field} /></FormControl>
                         <FormDescription className="text-xs">How many items this price is for.</FormDescription>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={productForm.control}
                    name="priceUnit"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Unit Name (Singular)</FormLabel>
                        <FormControl><Input placeholder="e.g., item, panel, kg" {...field} /></FormControl>
                        <FormDescription className="text-xs">The name of one item/unit.</FormDescription>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                </div>
                 <FormField
                  control={productForm.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category (Optional)</FormLabel>
                      <FormControl><Input placeholder="e.g., Electronics, Industrial Parts" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
            </form>
          </Form>
          <AlertDialogFooter className="mt-6 pt-4 border-t">
            <AlertDialogCancel onClick={() => { setIsProductModalOpen(false); setEditingProduct(null); }}>Cancel</AlertDialogCancel>
            <Button onClick={productForm.handleSubmit(onSubmitProduct)} disabled={productForm.formState.isSubmitting}>
              {productForm.formState.isSubmitting ? "Saving..." : (editingProduct ? 'Save Changes' : 'Add Product')}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: hsl(var(--muted) / 0.5);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: hsl(var(--border));
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: hsl(var(--primary) / 0.7);
        }
      `}</style>
    </div>
  );
}

    