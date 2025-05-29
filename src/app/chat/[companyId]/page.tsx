
'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { mockCompanies, mockMessages, mockProducts } from '@/lib/mock-data';
import type { Company, ChatMessage, Product } from '@/lib/types';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MessageBubble } from '@/components/message-bubble';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArrowLeft, Phone, Info, Send, Paperclip, Smile, Image as ImageIcon, Video as VideoIcon, FileText as FileTextIcon } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

export default function DirectChatPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const companyId = params.companyId as string;
  
  const [company, setCompany] = useState<Company | undefined>(undefined);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [productContext, setProductContext] = useState<Product | undefined>(undefined);
  const prefillDoneRef = useRef<boolean>(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const foundCompany = mockCompanies.find((c) => c.id === companyId);
    setCompany(foundCompany);

    const conversationId = companyId; 
    const loadedMessages = mockMessages[conversationId] || [];
    setMessages(loadedMessages);

    const productIdFromQuery = searchParams.get('product');

    if (productIdFromQuery) {
      if (productContext?.id !== productIdFromQuery) {
        const product = mockProducts.find(p => p.id === productIdFromQuery);
        setProductContext(product);
        prefillDoneRef.current = false; 
        if (product) { 
            setNewMessage(''); 
        }
      }
    } else {
      if (productContext) { 
        setProductContext(undefined);
        prefillDoneRef.current = false;
      }
    }
  }, [companyId, searchParams, productContext?.id]);

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
    if (newMessage.trim() === '' || !company) return;

    const message: ChatMessage = {
      id: `msg-${Date.now()}`,
      conversationId: company.id,
      sender: 'user',
      text: newMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages([...messages, message]);
    setNewMessage('');
    prefillDoneRef.current = true; 

    setTimeout(() => {
      const reply: ChatMessage = {
        id: `reply-${Date.now()}`,
        conversationId: company.id,
        sender: 'company',
        text: "Thanks for your message! We'll get back to you soon.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, reply]);
    }, 1000);
  };

  const handleAttachmentSelect = (type: 'image' | 'video' | 'document') => {
    // Placeholder for actual attachment handling logic
    console.log(`Selected to attach a ${type}`);
    // In a real app, this would open a file picker or other UI
    const attachmentMessage: ChatMessage = {
      id: `msg-attachment-${Date.now()}`,
      conversationId: company!.id,
      sender: 'user',
      text: `[Attachment: User selected a ${type}]`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages(prev => [...prev, attachmentMessage]);
    // Mock company reply for attachment
    setTimeout(() => {
      const reply: ChatMessage = {
        id: `reply-attachment-${Date.now()}`,
        conversationId: company!.id,
        sender: 'company',
        text: `We've received your ${type} selection. (This is a mock response)`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, reply]);
    }, 1500);
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
          <Button variant="ghost" size="icon">
            <Phone className="h-5 w-5 text-muted-foreground hover:text-primary" />
          </Button>
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

      <form onSubmit={handleSendMessage} className="p-3 border-t bg-background shadow-top-sm">
        <div className="flex items-center space-x-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" type="button">
                <Paperclip className="h-5 w-5 text-muted-foreground" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-2">
              <div className="flex flex-col space-y-1">
                <Button variant="ghost" className="justify-start px-3 py-2 h-auto" onClick={() => handleAttachmentSelect('image')}>
                  <ImageIcon className="mr-2 h-4 w-4" /> Image
                </Button>
                <Button variant="ghost" className="justify-start px-3 py-2 h-auto" onClick={() => handleAttachmentSelect('video')}>
                  <VideoIcon className="mr-2 h-4 w-4" /> Video
                </Button>
                <Button variant="ghost" className="justify-start px-3 py-2 h-auto" onClick={() => handleAttachmentSelect('document')}>
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
        </div>
      </form>
    </div>
  );
}
