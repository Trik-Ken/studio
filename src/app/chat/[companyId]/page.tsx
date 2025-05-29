
'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { mockCompanies, mockMessages, mockProducts } from '@/lib/mock-data';
import type { Company, ChatMessage, Product } from '@/lib/types';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MessageBubble } from '@/components/message-bubble';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArrowLeft, Phone, Info, Send, Paperclip, Smile, ImagePlus, FileText as FileTextIcon, X, Copy } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useToast } from "@/hooks/use-toast";

export default function DirectChatPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const companyId = params.companyId as string;
  const { toast } = useToast();

  const [company, setCompany] = useState<Company | undefined>(undefined);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [productContext, setProductContext] = useState<Product | undefined>(undefined);
  const [fileToSend, setFileToSend] = useState<{ name: string; type: 'media' | 'document' } | null>(null);
  const prefillDoneRef = useRef<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [attachmentPopoverOpen, setAttachmentPopoverOpen] = useState(false);
  const [phonePopoverOpen, setPhonePopoverOpen] = useState(false);

  const queryString = searchParams.toString();
  const productIdFromQuery = useMemo(() => new URLSearchParams(queryString).get('product'), [queryString]);

  useEffect(() => {
    const foundCompany = mockCompanies.find((c) => c.id === companyId);
    setCompany(foundCompany);

    const conversationId = companyId;
    const loadedMessages = mockMessages[conversationId] || [];
    setMessages(loadedMessages);

    if (productIdFromQuery) {
      if (productContext?.id !== productIdFromQuery) {
        const product = mockProducts.find(p => p.id === productIdFromQuery);
        setProductContext(product);
        prefillDoneRef.current = false; // Reset prefill flag when product context changes
        if (product) {
            setNewMessage(''); // Clear message if a new product is in context
        }
      }
    } else {
      // If productIdFromQuery is null/undefined (no product in query)
      if (productContext) { // and there was a product context before
        setProductContext(undefined); // Clear it
        prefillDoneRef.current = false; // Reset prefill flag
      }
    }
  }, [companyId, productIdFromQuery, productContext?.id]);


  useEffect(() => {
    if (productContext && !prefillDoneRef.current) {
      setNewMessage(`I'm interested in your product: ${productContext.name}. `);
      prefillDoneRef.current = true;
    }
  }, [productContext]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if ((newMessage.trim() === '' && !fileToSend) || !company) return;

    let messageText = newMessage.trim();
    if (fileToSend) {
      messageText += `${messageText ? ' ' : ''}[Attached: ${fileToSend.name}]`;
    }

    if (messageText.trim() === '') return;

    const message: ChatMessage = {
      id: `msg-${Date.now()}`,
      conversationId: company.id,
      sender: 'user',
      text: messageText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages([...messages, message]);
    setNewMessage('');
    setFileToSend(null);
    prefillDoneRef.current = true; // Mark as prefill done so it doesn't overwrite user typing after first send
  };

  const handleAttachmentClick = (attachmentType: 'media' | 'document') => {
    if (fileInputRef.current) {
      if (attachmentType === 'media') {
        fileInputRef.current.accept = 'image/*,video/*';
      } else { // document
        fileInputRef.current.accept = '.pdf,.doc,.docx,.txt,.xls,.xlsx,.ppt,.pptx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation';
      }
      fileInputRef.current.click();
    }
    setAttachmentPopoverOpen(false);
  };

  const handleFileSelected = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const fileTypeForDisplay = file.type.startsWith('image/') || file.type.startsWith('video/') ? 'media' : 'document';
      setFileToSend({ name: file.name, type: fileTypeForDisplay });
    }
    // Reset file input to allow selecting the same file again if needed
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleCopyToClipboard = async (text: string) => {
    if (!navigator.clipboard) {
      toast({
        title: "Error",
        description: "Clipboard API not available in this browser.",
        variant: "destructive",
      });
      return;
    }
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied!",
        description: "Phone number copied to clipboard.",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to copy phone number.",
        variant: "destructive",
      });
      console.error('Failed to copy: ', err);
    }
    setPhonePopoverOpen(false);
  };

  if (!company) {
    return (
      <div className="flex flex-col h-[calc(100vh-4rem)] items-center justify-center">
        <p className="text-muted-foreground">Loading chat or company not found...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-muted/30">
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        onChange={handleFileSelected}
      />
      <header className="flex items-center p-3 border-b bg-background shadow-sm">
        <Button variant="ghost" size="icon" className="mr-2" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <Link href={`/companies/${company.id}`} className="flex items-center space-x-3 flex-grow min-w-0">
          <Avatar className="h-10 w-10 border">
            <AvatarImage src={company.logoUrl} alt={company.name} data-ai-hint={company.dataAiHint || "company logo"} />
            <AvatarFallback>{company.name.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <span className="font-semibold text-foreground truncate">{company.name}</span>
        </Link>
        <div className="space-x-1">
          <Popover open={phonePopoverOpen} onOpenChange={setPhonePopoverOpen}>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon">
                <Phone className="h-5 w-5 text-muted-foreground hover:text-primary" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-3">
              {company.phoneNumber ? (
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium">{company.phoneNumber}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => handleCopyToClipboard(company.phoneNumber!)}
                  >
                    <Copy className="h-3.5 w-3.5" />
                  </Button>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No phone number available.</p>
              )}
            </PopoverContent>
          </Popover>
          <Link href={`/companies/${company.id}`} passHref>
            <Button variant="ghost" size="icon">
              <Info className="h-5 w-5 text-muted-foreground hover:text-primary" />
            </Button>
          </Link>
        </div>
      </header>

      <ScrollArea className="flex-grow p-4 space-y-4">
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}
        <div ref={messagesEndRef} />
      </ScrollArea>

      <div className="p-3 border-t bg-background shadow-top-sm">
        {fileToSend && (
          <div className="mb-2 p-2 border rounded-md flex justify-between items-center text-sm bg-muted/50">
            <span className="truncate">Selected: {fileToSend.name} ({fileToSend.type})</span>
            <Button variant="ghost" size="icon" className="h-6 w-6 flex-shrink-0" onClick={() => setFileToSend(null)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}
        <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
          <Popover open={attachmentPopoverOpen} onOpenChange={setAttachmentPopoverOpen}>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" type="button">
                <Paperclip className="h-5 w-5 text-muted-foreground" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-2">
              <div className="flex flex-col space-y-1">
                <Button variant="ghost" className="justify-start px-3 py-2 h-auto w-full" onClick={() => handleAttachmentClick('media')}>
                  <ImagePlus className="mr-2 h-4 w-4" /> Media (Image/Video)
                </Button>
                <Button variant="ghost" className="justify-start px-3 py-2 h-auto w-full" onClick={() => handleAttachmentClick('document')}>
                  <FileTextIcon className="mr-2 h-4 w-4" /> Document
                </Button>
              </div>
            </PopoverContent>
          </Popover>
          <Input
            type="text"
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-grow rounded-full px-4 py-2.5 focus-visible:ring-1 focus-visible:ring-primary"
          />
          <Button variant="ghost" size="icon" type="button">
            <Smile className="h-5 w-5 text-muted-foreground" />
          </Button>
          <Button type="submit" size="icon" className="rounded-full bg-primary hover:bg-primary/90">
            <Send className="h-5 w-5 text-primary-foreground" />
          </Button>
        </form>
      </div>
    </div>
  );
}
