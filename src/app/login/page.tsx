
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { mockCompanies } from '@/lib/mock-data'; // We'll use this for mock checking
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { LogIn } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  phoneNumber: z.string().min(10, { message: "Phone number must be at least 10 digits." })
    .regex(/^\+?[0-9\s-()]*$/, {message: "Invalid phone number format."}),
});

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      phoneNumber: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof loginSchema>) => {
    setIsLoading(true);
    // Mock API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const existingCompany = mockCompanies.find(
      (company) => company.contactEmail?.toLowerCase() === values.email.toLowerCase() && company.phoneNumber === values.phoneNumber
    );

    if (existingCompany) {
      toast({
        title: "Login Successful",
        description: `Welcome back, ${existingCompany.name}!`,
      });
      // In a real app, you'd set an auth token here and manage loggedInCompanyId globally
      // For this prototype, we just navigate. The profile page will still use the hardcoded loggedInCompanyId.
      router.push('/');
    } else {
      toast({
        title: "Account Not Found",
        description: "No account found with these details. Please register.",
        variant: "destructive",
      });
      router.push(`/register?email=${encodeURIComponent(values.email)}&phone=${encodeURIComponent(values.phoneNumber)}`);
    }
    setIsLoading(false);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <LogIn className="mx-auto h-12 w-12 text-primary mb-4" />
          <CardTitle className="text-3xl font-bold">Welcome Back!</CardTitle>
          <CardDescription>Login with your email and phone number or register if you're new.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Processing...' : 'Login / Register'}
              </Button>
            </form>
          </Form>
          <p className="mt-6 text-center text-sm text-muted-foreground">
            By logging in or registering, you agree to our{' '}
            <Link href="/terms" className="underline hover:text-primary">
              Terms of Service
            </Link>
            .
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
