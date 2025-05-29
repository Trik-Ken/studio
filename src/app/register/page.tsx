
'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { mockCompanies } from '@/lib/mock-data';
import type { Company } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { UserPlus } from 'lucide-react';

const registerSchema = z.object({
  companyName: z.string().min(3, { message: "Company name must be at least 3 characters." }),
  gstNumber: z.string().min(10, { message: "GST number must be at least 10 characters." }) // Simplified validation
    .regex(/^[0-9A-Z]+$/, { message: "GST number should be alphanumeric."}),
  description: z.string().min(20, { message: "Company description must be at least 20 characters."}),
  address: z.string().min(5, {message: "Address must be at least 5 characters."}),
  email: z.string().email(), // Will be pre-filled
  phoneNumber: z.string(),   // Will be pre-filled
});

export default function RegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      companyName: '',
      gstNumber: '',
      description: '',
      address: '',
      email: searchParams.get('email') || '',
      phoneNumber: searchParams.get('phone') || '',
    },
  });

  useEffect(() => {
    const email = searchParams.get('email');
    const phone = searchParams.get('phone');
    if (email) form.setValue('email', email);
    if (phone) form.setValue('phoneNumber', phone);
    if (!email || !phone) {
        toast({ title: "Missing information", description: "Email or phone missing for registration.", variant: "destructive"});
        router.replace('/login'); // Redirect if essential info is missing
    }
  }, [searchParams, form, router, toast]);

  const onSubmit = async (values: z.infer<typeof registerSchema>) => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000)); // Mock API delay

    const newCompany: Company = {
      id: `comp-${Date.now()}`, // Simple unique ID generation for mock
      name: values.companyName,
      logoUrl: 'https://placehold.co/100x100.png', // Default placeholder logo
      description: values.description,
      contactEmail: values.email,
      phoneNumber: values.phoneNumber,
      gstNumber: values.gstNumber,
      address: values.address,
      dataAiHint: 'new company' // Generic hint
    };

    // In a real app, this would be an API call.
    // For this mock, we push to the client-side imported array.
    // This mutation won't persist across sessions or for other users.
    mockCompanies.push(newCompany);

    toast({
      title: "Registration Successful!",
      description: `Welcome, ${newCompany.name}! Your company profile has been created.`,
    });

    // In a real app, you'd set an auth token here and manage loggedInCompanyId globally.
    // For this prototype, we just navigate. The profile page will still use the hardcoded loggedInCompanyId.
    router.push('/');
    setIsLoading(false);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-lg shadow-xl">
        <CardHeader className="text-center">
          <UserPlus className="mx-auto h-12 w-12 text-primary mb-4" />
          <CardTitle className="text-3xl font-bold">Create Your Company Profile</CardTitle>
          <CardDescription>Fill in the details below to get started.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address (from login attempt)</FormLabel>
                    <FormControl>
                      <Input type="email" {...field} readOnly className="bg-muted/50"/>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number (from login attempt)</FormLabel>
                    <FormControl>
                      <Input type="tel" {...field} readOnly className="bg-muted/50"/>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="companyName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Your Company Inc." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="gstNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>GST Number</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 22AAAAA0000A1Z5" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Briefly describe your company and what it offers." {...field} rows={3} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Address</FormLabel>
                    <FormControl>
                      <Input placeholder="123 Main Street, City, Country" {...field} />
                    </FormControl>
                     <FormDescription>Your company's primary business address.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Registering...' : 'Complete Registration'}
              </Button>
            </form>
          </Form>
           <p className="mt-6 text-center text-sm text-muted-foreground">
            By registering, you agree to our{' '}
            <Link href="/terms" className="underline hover:text-primary">
              Terms of Service
            </Link>
            {' '}and{' '}
             <Link href="/privacy" className="underline hover:text-primary">
              Privacy Policy
            </Link>
            .
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
