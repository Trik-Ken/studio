
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
import { mockCompanies, loggedInCompanyId } from '@/lib/mock-data'; // We'll use this for mock checking
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { LogIn } from 'lucide-react';

const loginSchema = z.object({
  emailOrPhone: z.string().min(1, { message: "Please enter your email or phone number." }),
  password: z.string().min(1, { message: "Please enter your password." }),
});

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      emailOrPhone: '',
      password: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof loginSchema>) => {
    setIsLoading(true);
    // Mock API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // MOCK LOGIN: Check if email/phone exists and password is 'password123'
    const existingCompany = mockCompanies.find(
      (company) => (company.contactEmail?.toLowerCase() === values.emailOrPhone.toLowerCase() || company.phoneNumber === values.emailOrPhone)
    );

    if (existingCompany && values.password === 'password123') {
      toast({
        title: "Login Successful",
        description: `Welcome back, ${existingCompany.name}!`,
      });
      // In a real app, you'd set an auth token here and manage loggedInCompanyId globally
      // For this prototype, we just navigate. The profile page will still use the hardcoded loggedInCompanyId.
      // Potentially, you could set loggedInCompanyId = existingCompany.id here if you manage it in a global state.
      router.push('/');
    } else {
      toast({
        title: "Login Failed",
        description: "Invalid email/phone or password. Please try again.",
        variant: "destructive",
      });
    }
    setIsLoading(false);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <LogIn className="mx-auto h-12 w-12 text-primary mb-4" />
          <CardTitle className="text-3xl font-bold">Welcome Back!</CardTitle>
          <CardDescription>Login with your credentials.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="emailOrPhone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email or Phone Number</FormLabel>
                    <FormControl>
                      <Input placeholder="you@example.com or +91 XXXXXXXXXX" {...field} />
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
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Logging in...' : 'Login'}
              </Button>
            </form>
          </Form>
          <p className="mt-6 text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="underline hover:text-primary">
              Register here
            </Link>
          </p>
          <p className="mt-2 text-center text-xs text-muted-foreground">
            (Hint: Use any existing company email/phone from mock data and &quot;password123&quot; to login. E.g., sales@innovatech.com or 1-800-555-0100)
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
