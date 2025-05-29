
'use client';

import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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
  gstNumber: z.string().min(10, { message: "GST number must be at least 10 characters." }) 
    .regex(/^[0-9A-Z]+$/, { message: "GST number should be alphanumeric."}),
  email: z.string().email({ message: "Please enter a valid email address." }),
  phoneNumber: z.string().min(10, { message: "Phone number must be at least 10 digits." })
    .regex(/^\+?[0-9\s-()]*$/, {message: "Invalid phone number format."}),
  password: z.string().min(8, { message: "Password must be at least 8 characters." }),
  confirmPassword: z.string().min(8, { message: "Please confirm your password." }),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match.",
  path: ["confirmPassword"], // Point error to confirmPassword field
});

export default function RegisterPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      companyName: '',
      gstNumber: '',
      email: '',
      phoneNumber: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof registerSchema>) => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000)); 

    // Check if email or phone number already exists (mock)
    const emailExists = mockCompanies.some(c => c.contactEmail?.toLowerCase() === values.email.toLowerCase());
    const phoneExists = mockCompanies.some(c => c.phoneNumber === values.phoneNumber);

    if (emailExists) {
      toast({ title: "Registration Failed", description: "This email address is already registered.", variant: "destructive"});
      setIsLoading(false);
      return;
    }
    if (phoneExists) {
      toast({ title: "Registration Failed", description: "This phone number is already registered.", variant: "destructive"});
      setIsLoading(false);
      return;
    }

    const newCompany: Company = {
      id: `comp-${Date.now()}`, 
      name: values.companyName,
      logoUrl: 'https://placehold.co/100x100.png', 
      description: '', // Description will be added later
      contactEmail: values.email,
      phoneNumber: values.phoneNumber,
      gstNumber: values.gstNumber,
      address: '', // Address will be added later
      dataAiHint: 'new company' 
      // Password is not stored in mockCompanies for this prototype
    };

    mockCompanies.push(newCompany);

    toast({
      title: "Registration Successful!",
      description: `Welcome, ${newCompany.name}! Please login with your new credentials.`,
    });
    router.push('/login'); // Redirect to login page after registration
    setIsLoading(false);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/40 p-4 py-8">
      <Card className="w-full max-w-lg shadow-xl">
        <CardHeader className="text-center">
          <UserPlus className="mx-auto h-12 w-12 text-primary mb-4" />
          <CardTitle className="text-3xl font-bold">Create Your Account</CardTitle>
          <CardDescription>Fill in the details below to get started.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="you@example.com" {...field} />
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
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input type="tel" placeholder="+1 (555) 123-4567" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Choose a strong password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Re-enter your password" {...field} />
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
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Registering...' : 'Create Account'}
              </Button>
            </form>
          </Form>
           <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link href="/login" className="underline hover:text-primary">
              Login here
            </Link>
          </p>
           <p className="mt-2 text-center text-xs text-muted-foreground">
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
