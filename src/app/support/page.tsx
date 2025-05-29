
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, MessageSquare, HelpCircle } from 'lucide-react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";

const supportMessageSchema = z.object({
  message: z.string().min(10, { message: "Message must be at least 10 characters." }).max(1000, { message: "Message cannot exceed 1000 characters." }),
  email: z.string().email({ message: "Please enter a valid email address for follow-up." }),
});

const faqs = [
  {
    id: "faq1",
    question: "How do I update my company profile?",
    answer: "You can update your company profile, including name, logo, and description, by navigating to Settings > Manage Company & Products. From there, you'll find an 'Edit Company Details' section."
  },
  {
    id: "faq2",
    question: "How can I list a new product?",
    answer: "To list a new product, go to Settings > Manage Company & Products. Click on the 'Add New Product' button within the 'Manage Products' section and fill out the required product information."
  },
  {
    id: "faq3",
    question: "What is the return policy for products?",
    answer: "Return policies are specific to each seller and product. You can find this information on the product detail page under the 'Warranty & Returns' section. If you have specific questions, please contact the seller directly via chat."
  },
  {
    id: "faq4",
    question: "How does the chat functionality work?",
    answer: "You can initiate a chat with a seller from their company profile page or directly from a product detail page. Your conversations will be saved under the 'Chat' tab in the bottom navigation for easy access."
  },
  {
    id: "faq5",
    question: "I forgot my password. How can I reset it?",
    answer: "Currently, password reset functionality is managed through the 'Security & Login' section in Settings. If you are unable to access your account, please use the contact form below describing your issue, and our support team will assist you."
  }
];

export default function SupportPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof supportMessageSchema>>({
    resolver: zodResolver(supportMessageSchema),
    defaultValues: {
      message: '',
      email: '', // Prefill if user email is available from auth state
    },
  });

  const onSubmitSupportMessage = async (values: z.infer<typeof supportMessageSchema>) => {
    setIsLoading(true);
    console.log("Support message submitted:", values);
    // Mock API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    toast({
      title: "Message Sent",
      description: "Our support team has received your message and will get back to you shortly.",
    });
    form.reset();
    setIsLoading(false);
  };

  return (
    <div className="container mx-auto max-w-2xl px-4 py-8 mb-20">
      <header className="mb-8">
        <Button variant="ghost" onClick={() => router.push('/settings')} className="mb-4 -ml-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Settings
        </Button>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Help &amp; Support</h1>
        <p className="text-muted-foreground">Find answers or get in touch with our support team.</p>
      </header>

      <div className="space-y-8">
        {/* FAQs Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center"><HelpCircle className="mr-2 h-5 w-5 text-primary" /> Frequently Asked Questions</CardTitle>
            <CardDescription>Find quick answers to common questions about using ConTrad.</CardDescription> {/* Updated App Name */}
          </CardHeader>
          <CardContent>
            {faqs.length > 0 ? (
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq) => (
                  <AccordionItem value={faq.id} key={faq.id}>
                    <AccordionTrigger className="text-left hover:no-underline">{faq.question}</AccordionTrigger>
                    <AccordionContent className="text-muted-foreground leading-relaxed">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            ) : (
              <p className="text-muted-foreground">No FAQs available at the moment.</p>
            )}
          </CardContent>
        </Card>

        {/* Contact Support Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center"><MessageSquare className="mr-2 h-5 w-5 text-primary" /> Contact Customer Support</CardTitle>
            <CardDescription>If you can't find an answer in the FAQs, please send us a message.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmitSupportMessage)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your Email Address</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="your.email@example.com" {...field} />
                      </FormControl>
                      <FormDescription>We'll use this email to respond to your inquiry.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your Message</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Please describe your issue or question in detail..."
                          rows={6}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isLoading || form.formState.isSubmitting} className="w-full sm:w-auto">
                  {isLoading || form.formState.isSubmitting ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
