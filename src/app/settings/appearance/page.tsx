
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Sun, Moon } from 'lucide-react';

type Theme = "light" | "dark" | "system";

export default function AppearanceSettingsPage() {
  const router = useRouter();
  const { toast } = useToast();
  // In a real app, you'd use a theme provider like next-themes
  // For this mock, we'll just manage local state.
  const [selectedTheme, setSelectedTheme] = useState<Theme>('system'); 
  const [effectiveTheme, setEffectiveTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    // Attempt to read stored theme preference (mocked)
    const storedTheme = localStorage.getItem('app-theme') as Theme | null;
    if (storedTheme) {
      setSelectedTheme(storedTheme);
    }
  }, []);

  useEffect(() => {
     // Mock system theme detection
    if (selectedTheme === 'system') {
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      setEffectiveTheme(prefersDark ? 'dark' : 'light');
    } else {
      setEffectiveTheme(selectedTheme);
    }
  }, [selectedTheme]);


  const handleThemeChange = (newTheme: Theme) => {
    setSelectedTheme(newTheme);
    localStorage.setItem('app-theme', newTheme); // Mock saving theme

    // In a real app with next-themes:
    // setTheme(newTheme); 
    
    // For this mock, we can try to toggle the .dark class on <html>
    // This is a simplified approach and might not perfectly reflect next-themes behavior.
    if (newTheme === 'dark' || (newTheme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    toast({
      title: "Theme Updated",
      description: `Switched to ${newTheme.charAt(0).toUpperCase() + newTheme.slice(1)} theme.`,
    });
  };

  return (
    <div className="container mx-auto max-w-2xl px-4 py-8 mb-20">
      <header className="mb-8">
        <Button variant="ghost" onClick={() => router.push('/settings')} className="mb-4 -ml-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Settings
        </Button>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Appearance</h1>
        <p className="text-muted-foreground">Customize the look and feel of the application.</p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Theme Preference</CardTitle>
          <CardDescription>Choose how B2B Commerce Connect looks to you. Select a theme or sync with your system.</CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={selectedTheme}
            onValueChange={(value) => handleThemeChange(value as Theme)}
            className="space-y-2"
          >
            <Label
              htmlFor="light-theme"
              className="flex items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary"
            >
              <span className="flex items-center gap-2 font-semibold">
                <Sun className="h-5 w-5" /> Light
              </span>
              <RadioGroupItem value="light" id="light-theme" />
            </Label>
            <Label
              htmlFor="dark-theme"
              className="flex items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary"
            >
              <span className="flex items-center gap-2 font-semibold">
                <Moon className="h-5 w-5" /> Dark
              </span>
              <RadioGroupItem value="dark" id="dark-theme" />
            </Label>
             <Label
              htmlFor="system-theme"
              className="flex items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary"
            >
              <span className="flex items-center gap-2 font-semibold">
                {/* You might need a different icon for system or keep it simple */}
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-laptop"><path d="M20 16V7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v9m16 0H4m16 0 1.28 2.55A1 1 0 0 1 20.28 20H3.72a1 1 0 0 1-.98-1.45L4 16"/><path d="M8 21h8"/></svg>
                System
              </span>
              <RadioGroupItem value="system" id="system-theme" />
            </Label>
          </RadioGroup>
          <p className="mt-4 text-sm text-muted-foreground">
            Current effective theme: <span className="font-semibold">{effectiveTheme.charAt(0).toUpperCase() + effectiveTheme.slice(1)}</span>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
