
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronRight, ShieldCheck, HelpCircle, Bell, Palette, LogOut, Briefcase } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

const settingsOptions = [
  {
    id: 'manage-company-products',
    title: 'Manage Company & Products',
    description: 'Edit company details, add new products, and update existing product listings.',
    icon: Briefcase,
    href: '/settings/manage-company-products',
  },
  {
    id: 'security',
    title: 'Security & Login',
    description: 'Manage your password, two-factor authentication, and active sessions.',
    icon: ShieldCheck,
    href: '/settings/security',
  },
  {
    id: 'notifications',
    title: 'Notification Preferences',
    description: 'Choose how you receive alerts for messages, orders, and system updates.',
    icon: Bell,
    href: '/settings/notifications',
  },
  {
    id: 'appearance',
    title: 'Appearance',
    description: 'Customize the look and feel of the app (e.g., theme).',
    icon: Palette,
    href: '/settings/appearance',
  },
  {
    id: 'help',
    title: 'Help & Support',
    description: 'Access FAQs, contact support, or report an issue.',
    icon: HelpCircle,
    href: '/support',
  },
];

export default function SettingsPage() {
  return (
    <div className="container mx-auto max-w-2xl px-4 py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Settings</h1>
        <p className="text-muted-foreground">Manage your account and application preferences.</p>
      </header>

      <Card className="shadow-lg">
        <CardContent className="p-0">
          <ul className="divide-y divide-border">
            {settingsOptions.map((option) => (
              <li key={option.id}>
                <Link href={option.href} className="block hover:bg-muted/50 transition-colors">
                  <div className="flex items-center p-4 sm:p-6">
                    <option.icon className="h-6 w-6 mr-4 text-primary flex-shrink-0" />
                    <div className="flex-grow">
                      <h3 className="text-md font-semibold text-foreground">{option.title}</h3>
                      <p className="text-sm text-muted-foreground">{option.description}</p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground ml-2" />
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <div className="mt-8 text-center">
        <Button variant="destructive" className="w-full sm:w-auto">
          <LogOut className="mr-2 h-4 w-4" /> Logout
        </Button>
      </div>

      <Separator className="my-8" />
      <div className="text-center text-sm text-muted-foreground space-y-1">
        <p>B2B Commerce Connect v1.0.0</p>
        <p>
            <Link href="/terms" className="hover:text-primary hover:underline">Terms of Service</Link> | <Link href="/privacy" className="hover:text-primary hover:underline">Privacy Policy</Link>
        </p>
      </div>
    </div>
  );
}
