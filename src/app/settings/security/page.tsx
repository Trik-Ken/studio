
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Mail, Phone, Lock } from 'lucide-react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { mockCompanies, loggedInCompanyId } from '@/lib/mock-data'; // Assuming current user is a company

const emailSchema = z.object({
  currentEmail: z.string().email().optional().or(z.literal('')), // Assuming current email is for display or prefill
  newEmail: z.string().email({ message: "Please enter a valid new email address." }),
  confirmEmail: z.string().email({ message: "Please confirm your new email address." }),
}).refine(data => data.newEmail === data.confirmEmail, {
  message: "New emails don't match.",
  path: ["confirmEmail"],
});

const phoneSchema = z.object({
  currentPhoneNumber: z.string().optional().or(z.literal('')), // Assuming current phone is for display or prefill
  newPhoneNumber: z.string().min(10, { message: "Phone number must be at least 10 digits." }).regex(/^\+?[0-9\s-()]*$/, {message: "Invalid phone number format."}),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(1, { message: "Current password is required." }),
  newPassword: z.string().min(8, { message: "New password must be at least 8 characters." }),
  confirmNewPassword: z.string().min(8, { message: "Please confirm your new password." }),
}).refine(data => data.newPassword === data.confirmNewPassword, {
  message: "New passwords don't match.",
  path: ["confirmNewPassword"],
});


export default function SecuritySettingsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  // Fetch current user/company data (mocked)
  const currentUser = mockCompanies.find(c => c.id === loggedInCompanyId);

  const emailForm = useForm<z.infer<typeof emailSchema>>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      currentEmail: currentUser?.contactEmail || '',
      newEmail: '',
      confirmEmail: '',
    },
  });

  const phoneForm = useForm<z.infer<typeof phoneSchema>>({
    resolver: zodResolver(phoneSchema),
    defaultValues: {
      currentPhoneNumber: currentUser?.phoneNumber || '',
      newPhoneNumber: '',
    },
  });

  const passwordForm = useForm<z.infer<typeof passwordSchema>>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: '',
    },
  });

  const onSubmitEmail = async (values: z.infer<typeof emailSchema>) => {
    setIsLoading(true);
    console.log("Changing email to:", values.newEmail);
    // Mock API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    if (currentUser) {
        currentUser.contactEmail = values.newEmail; // Update mock data
    }
    toast({ title: "Email Updated", description: "Your email address has been successfully updated." });
    emailForm.reset({ ...values, currentEmail: values.newEmail, newEmail: '', confirmEmail: '' });
    setIsLoading(false);
  };

  const onSubmitPhone = async (values: z.infer<typeof phoneSchema>) => {
    setIsLoading(true);
    console.log("Changing phone number to:", values.newPhoneNumber);
    // Mock API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    if (currentUser) {
        currentUser.phoneNumber = values.newPhoneNumber; // Update mock data
    }
    toast({ title: "Phone Number Updated", description: "Your phone number has been successfully updated." });
    phoneForm.reset({ ...values, currentPhoneNumber: values.newPhoneNumber, newPhoneNumber: '' });
    setIsLoading(false);
  };

  const onSubmitPassword = async (values: z.infer<typeof passwordSchema>) => {
    setIsLoading(true);
    console.log("Changing password. Current (mock):", values.currentPassword, "New:", values.newPassword);
    // Mock API call - in a real app, you'd verify currentPassword
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast({ title: "Password Updated", description: "Your password has been successfully updated." });
    passwordForm.reset();
    setIsLoading(false);
  };

  return (
    <div className="container mx-auto max-w-2xl px-4 py-8 mb-20">
      <header className="mb-8">
        <Button variant="ghost" onClick={() => router.push('/settings')} className="mb-4 -ml-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Settings
        </Button>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Security &amp; Login</h1>
        <p className="text-muted-foreground">Manage your account's security settings.</p>
      </header>

      <div className="space-y-8">
        {/* Change Email Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center"><Mail className="mr-2 h-5 w-5 text-primary" /> Change Email</CardTitle>
            <CardDescription>Update the email address associated with your account.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...emailForm}>
              <form onSubmit={emailForm.handleSubmit(onSubmitEmail)} className="space-y-4">
                <FormField
                  control={emailForm.control}
                  name="currentEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current Email</FormLabel>
                      <FormControl>
                        <Input {...field} readOnly disabled className="bg-muted/50" />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={emailForm.control}
                  name="newEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="your.new.email@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={emailForm.control}
                  name="confirmEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm New Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="confirm.new.email@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isLoading || emailForm.formState.isSubmitting}>
                  {isLoading || emailForm.formState.isSubmitting ? "Updating..." : "Update Email"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <Separator />

        {/* Change Phone Number Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center"><Phone className="mr-2 h-5 w-5 text-primary" /> Change Phone Number</CardTitle>
            <CardDescription>Update the phone number for your account.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...phoneForm}>
              <form onSubmit={phoneForm.handleSubmit(onSubmitPhone)} className="space-y-4">
                 <FormField
                  control={phoneForm.control}
                  name="currentPhoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current Phone Number</FormLabel>
                      <FormControl>
                         <Input {...field} readOnly disabled className="bg-muted/50" />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={phoneForm.control}
                  name="newPhoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New Phone Number</FormLabel>
                      <FormControl>
                        <Input type="tel" placeholder="+1 (555) 123-4567" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isLoading || phoneForm.formState.isSubmitting}>
                 {isLoading || phoneForm.formState.isSubmitting ? "Updating..." : "Update Phone Number"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <Separator />

        {/* Change Password Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center"><Lock className="mr-2 h-5 w-5 text-primary" /> Change Password</CardTitle>
            <CardDescription>Set a new password for your account.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...passwordForm}>
              <form onSubmit={passwordForm.handleSubmit(onSubmitPassword)} className="space-y-4">
                <FormField
                  control={passwordForm.control}
                  name="currentPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="Enter your current password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={passwordForm.control}
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="Enter your new password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={passwordForm.control}
                  name="confirmNewPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm New Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="Confirm your new password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isLoading || passwordForm.formState.isSubmitting}>
                  {isLoading || passwordForm.formState.isSubmitting ? "Updating..." : "Update Password"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
