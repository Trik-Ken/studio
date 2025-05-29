export interface Product {
  id: string;
  name: string;
  imageUrl: string;
  images?: string[];
  description: string;
  specifications: { key: string; value: string }[];
  warrantyInfo: string;
  returnPolicy: string;
  companyId: string;
  companyName: string;
  pricePerUnit: number;
  category?: string;
  rating?: number;
  reviewsCount?: number;
  dataAiHint?: string;
}

export interface Company {
  id: string;
  name: string;
  logoUrl: string;
  description: string;
  address?: string;
  contactEmail?: string;
  website?: string;
  dataAiHint?: string;
}

export interface ChatConversation {
  id: string;
  companyId: string;
  companyName: string;
  companyLogoUrl: string;
  lastMessage: string;
  lastMessageTimestamp: string;
  unreadCount?: number;
  dataAiHint?: string;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  sender: 'user' | 'company';
  text: string;
  timestamp: string;
}
