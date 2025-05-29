
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Mail, Bell } from 'lucide-react';

export default function NotificationSettingsPage() {
  const router = useRouter();
  const { toast } = useToast();

  // Mock state for notification preferences
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [appNotifications, setAppNotifications] = useState(true);

  const handleNotificationChange = (type: 'email' | 'app', value: boolean) => {
    if (type === 'email') {
      setEmailNotifications(value);
    } else {
      setAppNotifications(value);
    }
    // In a real app, you would save this preference to a backend or localStorage
    toast({
      title: "Notification Settings Updated",
      description: `${type === 'email' ? 'Email' : 'In-App'} notifications ${value ? 'enabled' : 'disabled'}.`,
    });
  };

  return (
    <div className="container mx-auto max-w-2xl px-4 py-8 mb-20">
      <header className="mb-8">
        <Button variant="ghost" onClick={() => router.push('/settings')} className="mb-4 -ml-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Settings
        </Button>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Notification Preferences</h1>
        <p className="text-muted-foreground">Choose how you receive alerts and updates.</p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Manage Notifications</CardTitle>
          <CardDescription>Control your notification settings for various alerts.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center">
              <Mail className="mr-3 h-5 w-5 text-primary" />
              <div>
                <Label htmlFor="email-notifications" className="text-md font-medium text-foreground">
                  Email Notifications
                </Label>
                <p className="text-sm text-muted-foreground">
                  Receive important updates via email.
                </p>
              </div>
            </div>
            <Switch
              id="email-notifications"
              checked={emailNotifications}
              onCheckedChange={(value) => handleNotificationChange('email', value)}
            />
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center">
                <Bell className="mr-3 h-5 w-5 text-primary" />
              <div>
                <Label htmlFor="app-notifications" className="text-md font-medium text-foreground">
                  In-App Notifications
                </Label>
                <p className="text-sm text-muted-foreground">
                  Get alerts directly within the application.
                </p>
              </div>
            </div>
            <Switch
              id="app-notifications"
              checked={appNotifications}
              onCheckedChange={(value) => handleNotificationChange('app', value)}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
