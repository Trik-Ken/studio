
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
import { ArrowLeft, Edit3, PlusCircle, Trash2, Package, UploadCloud, XCircle } from 'lucide-react';
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


const companySchema = z.object({
  name: z.string().min(3, { message: "Company name must be at least 3 characters." }),
  description: z.string().min(10, { message: "Description must be at least 10 characters." }),
  contactEmail: z.string().email({ message: "Invalid email address." }).or(z.literal('')),
  address: z.string().optional().or(z.literal('')),
  logoUrl: z.string().optional().or(z.literal('')), // Can be data URI or empty
});

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
  imageUrl: z.string().refine(val => val.startsWith('data:image/') || val.startsWith('https://placehold.co'), {
    message: "Primary image is required. Please upload an image or ensure a valid placeholder is set."
  }).or(z.literal('')),
  additionalImageUrls: z.array(
     z.string().refine(val => val.startsWith('data:image/') || val.startsWith('https://placehold.co') || val.startsWith('http://') || val.startsWith('https://'), {
        message: "Each additional image must be a valid data URI or URL."
    })
  ).max(6, { message: "You can upload a maximum of 6 additional images." }).optional().default([]),
  specificationsText: z.string().optional().or(z.literal('')), 
  warrantyInfo: z.string().min(1, { message: "Warranty information is required." }),
  returnPolicy: z.string().min(1, { message: "Return policy is required." }),
});

export default function ManageCompanyProductsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [company, setCompany] = useState<Company | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [_selectedLogoFile, setSelectedLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [primaryProductImagePreview, setPrimaryProductImagePreview] = useState<string | null>(null);
  const [additionalProductImagePreviews, setAdditionalProductImagePreviews] = useState<string[]>([]);


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
      imageUrl: 'https://placehold.co/600x400.png',
      additionalImageUrls: [],
      specificationsText: '',
      warrantyInfo: 'Standard 1-year warranty.',
      returnPolicy: '30-day return policy, see terms for details.',
    },
  });

  useEffect(() => {
    if (company) {
      companyForm.reset({
        name: company.name,
        description: company.description,
        contactEmail: company.contactEmail || '',
        address: company.address || '',
        logoUrl: company.logoUrl || '',
      });
      setLogoPreview(company.logoUrl || null);
    }
  }, [company, companyForm]);

  const handleLogoChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({ title: "File too large", description: "Logo image must be under 5MB.", variant: "destructive"});
        event.target.value = ''; 
        return;
      }
      setSelectedLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUri = reader.result as string;
        setLogoPreview(dataUri);
        companyForm.setValue('logoUrl', dataUri, { shouldValidate: true, shouldDirty: true });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveLogo = () => {
    setLogoPreview(null);
    setSelectedLogoFile(null);
    companyForm.setValue('logoUrl', '', { shouldValidate: true, shouldDirty: true });
    const logoUploadInput = document.getElementById('logo-upload') as HTMLInputElement;
    if (logoUploadInput) {
        logoUploadInput.value = '';
    }
    toast({ title: "Logo Removed", description: "The company logo has been cleared."});
  };

  const handlePrimaryProductImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({ title: "File too large", description: "Product image must be under 5MB.", variant: "destructive"});
        event.target.value = '';
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUri = reader.result as string;
        setPrimaryProductImagePreview(dataUri);
        productForm.setValue('imageUrl', dataUri, { shouldValidate: true });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAdditionalProductImagesChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
        const currentPreviews = [...additionalProductImagePreviews];
        const currentFormValues = productForm.getValues('additionalImageUrls') || [];

        if (currentPreviews.length + files.length > 6) {
            toast({ title: "Too many files", description: `You can upload a maximum of 6 additional images in total. You already have ${currentPreviews.length}.`, variant: "destructive" });
            if (event.target) event.target.value = '';
            return;
        }

        const filePromises = Array.from(files).map(file => {
            return new Promise<string | null>((resolve) => {
                if (file.size > 5 * 1024 * 1024) { // 5MB limit per image
                    toast({ title: "File too large", description: `${file.name} is over 5MB. Please select smaller images.`, variant: "destructive"});
                    resolve(null); // Resolve with null for large files
                    return;
                }
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result as string);
                reader.onerror = (error) => {
                    console.error("Error reading file:", file.name, error);
                    toast({ title: "File Read Error", description: `Could not read ${file.name}.`, variant: "destructive"});
                    resolve(null); // Resolve with null on error
                };
                reader.readAsDataURL(file);
            });
        });

        try {
            const settledPreviewsOrNulls = await Promise.all(filePromises);
            const validNewPreviews = settledPreviewsOrNulls.filter(p => p !== null) as string[];
            
            const combinedPreviews = [...currentPreviews, ...validNewPreviews].slice(0, 6);
            const combinedFormValues = [...currentFormValues, ...validNewPreviews].slice(0, 6);

            setAdditionalProductImagePreviews(combinedPreviews);
            productForm.setValue('additionalImageUrls', combinedFormValues, { shouldValidate: true });
            
            if (validNewPreviews.length !== files.length && files.length > 0 && event.target) {
                 event.target.value = '';
            } else if (event.target) {
                event.target.value = ''; 
            }

        } catch (error) {
            console.error("Unexpected error processing additional images:", error);
            toast({ title: "Error", description: "An unexpected error occurred while processing images.", variant: "destructive" });
            if (event.target) event.target.value = '';
        }
    }
  };


  const onSubmitCompanyDetails = (values: z.infer<typeof companySchema>) => {
    if (!company) return;

    const updatedCompanyData: Company = {
        ...company,
        ...values,
        gstNumber: company.gstNumber, 
        website: company.website,
        phoneNumber: company.phoneNumber,
        dataAiHint: company.dataAiHint
    };

    setCompany(updatedCompanyData);

    const companyIndex = mockCompanies.findIndex(c => c.id === loggedInCompanyId);
    if (companyIndex !== -1) {
        mockCompanies[companyIndex] = updatedCompanyData;
    }

    toast({
      title: 'Company Details Updated',
      description: 'Your company information has been saved.',
    });
  };

  const formatSpecificationsToText = (specs: {key: string, value: string}[]) => {
    return specs.map(spec => `${spec.key}: ${spec.value}`).join('\n');
  };

  const parseSpecificationsFromText = (text: string): {key: string, value: string}[] => {
    if (!text?.trim()) return [];
    return text.split('\n').map(line => {
      const parts = line.split(':');
      const key = parts[0]?.trim();
      const value = parts.slice(1).join(':').trim();
      return { key, value };
    }).filter(spec => spec.key && spec.value);
  };


  const handleAddNewProduct = () => {
    setEditingProduct(null);
    setPrimaryProductImagePreview('https://placehold.co/600x400.png');
    setAdditionalProductImagePreviews([]);
    productForm.reset({
      name: '',
      description: '',
      price: 0,
      priceForQuantity: 1,
      priceUnit: 'unit',
      category: '',
      imageUrl: 'https://placehold.co/600x400.png',
      additionalImageUrls: [],
      specificationsText: '',
      warrantyInfo: 'Standard 1-year warranty.',
      returnPolicy: '30-day return policy, see terms for details.',
    });
    setIsProductModalOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    const specsText = product.specifications ? formatSpecificationsToText(product.specifications) : '';
    
    const additionalImages = product.images && product.images.length > 1 
        ? product.images.slice(1).filter(img => img !== product.imageUrl) 
        : (product.images?.filter(img => img !== product.imageUrl) || []);

    setPrimaryProductImagePreview(product.imageUrl || 'https://placehold.co/600x400.png');
    setAdditionalProductImagePreviews(additionalImages);


    productForm.reset({
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      priceForQuantity: product.priceForQuantity,
      priceUnit: product.priceUnit,
      category: product.category || '',
      imageUrl: product.imageUrl || 'https://placehold.co/600x400.png',
      additionalImageUrls: additionalImages,
      specificationsText: specsText,
      warrantyInfo: product.warrantyInfo || '',
      returnPolicy: product.returnPolicy || '',
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

    const primaryImageUrl = values.imageUrl || 'https://placehold.co/600x400.png';
    let allImageUrls: string[] = [primaryImageUrl];

    if (values.additionalImageUrls && values.additionalImageUrls.length > 0) {
      const uniqueAdditional = values.additionalImageUrls.filter(url => url !== primaryImageUrl);
      allImageUrls = [primaryImageUrl, ...uniqueAdditional];
    }
    allImageUrls = allImageUrls.slice(0, 7); 

    const parsedSpecifications = values.specificationsText ? parseSpecificationsFromText(values.specificationsText) : [];

    const productData = {
        ...values,
        imageUrl: primaryImageUrl,
        images: allImageUrls,
        specifications: parsedSpecifications,
        dataAiHint: values.category || "product image", 
        companyId: loggedInCompanyId,
        companyName: company.name,
    };

    const { specificationsText, ...finalProductData } = productData;


    if (editingProduct) {
      const updatedProduct: Product = { ...editingProduct, ...finalProductData };
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
        ...finalProductData,
        id: `prod-${Date.now()}`, 
      };
      setProducts(prev => [newProduct, ...prev]);
      mockProducts.unshift(newProduct); 
      toast({
        title: 'Product Added',
        description: `${values.name} has been added to your listings.`,
      });
    }
    setIsProductModalOpen(false);
    setEditingProduct(null);
    setPrimaryProductImagePreview(null);
    setAdditionalProductImagePreviews([]);
  };


  if (!company) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p>Loading company data...</p>
      </div>
    );
  }

  const watchedImageUrl = productForm.watch('imageUrl');


  return (
    <div className="container mx-auto max-w-4xl px-4 py-8 mb-20">
      <header className="mb-8">
        <Button variant="ghost" onClick={() => router.back()} className="mb-4 -ml-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Settings
        </Button>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Manage Company &amp; Products</h1>
        <p className="text-muted-foreground">Edit your company's public profile and manage your product listings. Upload images directly from your device.</p>
      </header>

      <Card className="mb-8 shadow-md">
        <CardHeader>
          <CardTitle>Edit Company Details</CardTitle>
          <CardDescription>Update your company's information. Click "Save Company Details" to apply changes.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...companyForm}>
            <form onSubmit={companyForm.handleSubmit(onSubmitCompanyDetails)} className="space-y-6">
              <div className="flex flex-col items-center space-y-2 mb-6">
                <Avatar className="h-32 w-32 border-2 border-primary shadow-sm">
                  <AvatarImage
                    src={logoPreview || undefined}
                    alt={company.name}
                    data-ai-hint={company.dataAiHint || "company logo"}
                  />
                  <AvatarFallback>{company.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex items-center gap-2">
                  <Button type="button" variant="outline" size="sm" onClick={() => document.getElementById('logo-upload')?.click()}>
                    <UploadCloud className="mr-2 h-4 w-4" /> Change Logo
                  </Button>
                  {logoPreview && (
                    <Button type="button" variant="ghost" size="sm" onClick={handleRemoveLogo} className="text-destructive hover:text-destructive/90">
                       <XCircle className="mr-2 h-4 w-4" /> Remove Logo
                    </Button>
                  )}
                </div>
                <FormItem className="w-full max-w-sm sr-only">
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
                </FormItem>
                <FormDescription className="text-center text-xs">PNG, JPG, GIF up to 5MB.</FormDescription>
                 <FormMessage>{companyForm.formState.errors.logoUrl?.message}</FormMessage>
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
            <CardDescription>Add new products or edit existing ones. Upload primary and additional images directly from your device.</CardDescription>
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
                    src={product.imageUrl || 'https://placehold.co/80x80.png'}
                    alt={product.name || 'Product image'}
                    width={80}
                    height={80}
                    className="rounded-md object-cover aspect-square border bg-muted flex-shrink-0"
                    data-ai-hint={product.dataAiHint || "product image"}
                    unoptimized={product.imageUrl?.startsWith('data:image/') || product.imageUrl?.startsWith('https://placehold.co')}
                    onError={(e) => {(e.target as HTMLImageElement).src = 'https://placehold.co/80x80.png'}}
                  />
                  <div className="flex-grow w-full min-w-0 overflow-hidden">
                    <h3 className="font-semibold text-lg truncate" title={product.name}>{product.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      ${product.price.toFixed(2)} / {product.priceForQuantity} {product.priceUnit}{product.priceForQuantity !== 1 ? 's' : ''}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">{product.category || 'Uncategorized'}</p>
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
          if (!open) { 
            setEditingProduct(null);
            setPrimaryProductImagePreview(null);
            setAdditionalProductImagePreviews([]);
          }
      }}>
        <AlertDialogContent className="max-w-2xl flex flex-col max-h-[calc(100vh-4rem)] sm:max-h-[90vh] p-0">
          <AlertDialogHeader className="p-6 pb-4 border-b flex-shrink-0">
            <AlertDialogTitle>{editingProduct ? 'Edit Product' : 'Add New Product'}</AlertDialogTitle>
            <AlertDialogDescription>
              {editingProduct ? `Update the details for ${editingProduct.name}.` : 'Enter the details for your new product.'}
              <br/>Upload a primary image and up to 6 additional images from your device (max 7 total images, 5MB per image).
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex-grow overflow-y-auto custom-scrollbar px-6 py-4">
            <Form {...productForm}>
              <form
                  onSubmit={productForm.handleSubmit(onSubmitProduct)}
                  className="space-y-4" 
              >
                  <FormItem>
                    <FormLabel>Primary Product Image</FormLabel>
                    <FormControl>
                      <div className="flex flex-col items-center gap-4">
                          <Image
                              src={primaryProductImagePreview || watchedImageUrl || 'https://placehold.co/200x200.png'}
                              alt="Product Preview"
                              width={120}
                              height={120}
                              className="rounded-md border object-contain aspect-square bg-muted flex-shrink-0"
                              data-ai-hint="product image"
                              unoptimized={ (primaryProductImagePreview || watchedImageUrl)?.startsWith('data:image/') || (primaryProductImagePreview || watchedImageUrl)?.startsWith('https://placehold.co') }
                              onError={(e) => {(e.target as HTMLImageElement).src = 'https://placehold.co/200x200.png'}}
                          />
                          <Input
                              id="primary-product-image-upload"
                              type="file"
                              accept="image/*"
                              onChange={handlePrimaryProductImageChange}
                              className="w-full max-w-xs"
                          />
                      </div>
                    </FormControl>
                    <FormDescription className="text-center">Upload the main image for your product from your device (max 5MB).</FormDescription>
                    <FormField
                      control={productForm.control}
                      name="imageUrl" 
                      render={({ field }) => ( <Input type="hidden" {...field} /> )}
                    />
                     <FormMessage>{productForm.formState.errors.imageUrl?.message}</FormMessage>
                  </FormItem>

                  <FormField
                      control={productForm.control}
                      name="additionalImageUrls" 
                      render={() => ( 
                          <FormItem>
                              <FormLabel>Additional Product Images (Up to 6)</FormLabel>
                              <FormControl>
                                  <Input
                                      id="additional-product-images-upload"
                                      type="file"
                                      multiple
                                      accept="image/*"
                                      onChange={handleAdditionalProductImagesChange}
                                      className="w-full"
                                  />
                              </FormControl>
                              <FormDescription>Select up to 6 additional images from your device (max 5MB each).</FormDescription>
                              {additionalProductImagePreviews.length > 0 && (
                                  <div className="mt-2 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2">
                                      {additionalProductImagePreviews.map((previewUrl, index) => (
                                          <div key={index} className="relative aspect-square">
                                              <Image
                                                  src={previewUrl}
                                                  alt={`Additional product image ${index + 1}`}
                                                  layout="fill"
                                                  objectFit="cover"
                                                  className="rounded-md border bg-muted"
                                                  data-ai-hint="product image"
                                                  unoptimized={previewUrl.startsWith('data:image/') || previewUrl.startsWith('https://placehold.co')}
                                              />
                                          </div>
                                      ))}
                                  </div>
                              )}
                             <FormMessage>{productForm.formState.errors.additionalImageUrls?.message || (productForm.formState.errors.additionalImageUrls as any)?.root?.message}</FormMessage>
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
                        <FormDescription>Helps organize products on your profile page.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={productForm.control}
                    name="specificationsText"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Specifications</FormLabel>
                        <FormControl><Textarea placeholder="Enter each specification on a new line, e.g., Color: Red\nMaterial: Steel" {...field} rows={4}/></FormControl>
                        <FormDescription>Key-value pairs, one per line (e.g., Size: Large).</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={productForm.control}
                    name="warrantyInfo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Warranty Information</FormLabel>
                        <FormControl><Textarea placeholder="Describe the product warranty..." {...field} rows={3}/></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={productForm.control}
                    name="returnPolicy"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Return Policy</FormLabel>
                        <FormControl><Textarea placeholder="Describe the return policy..." {...field} rows={3}/></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
              </form>
            </Form>
          </div>
          <AlertDialogFooter className="p-6 pt-4 border-t flex-shrink-0">
            <AlertDialogCancel onClick={() => { setIsProductModalOpen(false); setEditingProduct(null); setPrimaryProductImagePreview(null); setAdditionalProductImagePreviews([]); }}>Cancel</AlertDialogCancel>
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

