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
import { ArrowLeft, Phone, Info, Send, Paperclip, Smile } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function DirectChatPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const companyId = params.companyId as string;
  
  const [company, setCompany] = useState<Company | undefined>(undefined);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [initialProduct, setInitialProduct] = useState<Product | undefined>(undefined);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const foundCompany = mockCompanies.find((c) => c.id === companyId);
    setCompany(foundCompany);

    // Find the conversation ID. In a real app, this would be more robust.
    // For mock, we assume the companyId can map to a conversationId or is the conversationId.
    const conversationId = companyId; // Simplified for mock
    const loadedMessages = mockMessages[conversationId] || [];
    
    const productId = searchParams.get('product');
    if (productId) {
      const product = mockProducts.find(p => p.id === productId);
      setInitialProduct(product);
      if (product && !loadedMessages.some(msg => msg.text.includes(product.name))) {
         // Add a context message if not already present (e.g. if user navigates away and back)
         const contextMessage: ChatMessage = {
          id: `product-context-${Date.now()}`,
          conversationId: conversationId,
          sender: 'user',
          text: `I'm interested in your product: ${product.name}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages([contextMessage, ...loadedMessages]);
      } else {
        setMessages(loadedMessages);
      }
    } else {
      setMessages(loadedMessages);
    }

  }, [companyId, searchParams]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() === '' || !company) return;

    const message: ChatMessage = {
      id: `msg-${Date.now()}`,
      conversationId: company.id, // Simplified
      sender: 'user',
      text: newMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages([...messages, message]);
    setNewMessage('');

    // Mock company reply
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

  if (!company) {
    return (
      <div className="flex flex-col h-[calc(100vh-4rem)] items-center justify-center">
        <p className="text-muted-foreground">Loading chat or company not found...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-muted/30"> {/* Adjusted height for bottom nav */}
      {/* Header */}
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

      {/* Messages Area */}
      <ScrollArea className="flex-grow p-4 space-y-4">
        {initialProduct && !messages.some(msg => msg.text.includes(initialProduct.name)) && (
          <div className="border p-3 rounded-md bg-background mb-3 shadow-sm text-sm text-muted-foreground">
            You are inquiring about: <Link href={`/products/${initialProduct.id}`} className="font-semibold text-primary hover:underline">{initialProduct.name}</Link>
          </div>
        )}
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}
        <div ref={messagesEndRef} />
      </ScrollArea>

      {/* Input Area */}
      <form onSubmit={handleSendMessage} className="p-3 border-t bg-background shadow-top-sm">
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" type="button">
            <Paperclip className="h-5 w-5 text-muted-foreground" />
          </Button>
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
