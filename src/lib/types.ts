
export interface Product {
  id: string;
  name: string;
  imageUrl: string; // Primary image, will also be images[0]
  images?: string[]; // Array of all image URLs, including primary
  description: string;
  specifications: { key: string; value: string }[];
  warrantyInfo: string;
  returnPolicy: string;
  companyId: string;
  companyName: string;
  price: number;
  unitQuantity: string; // Renamed from priceUnit, priceForQuantity is removed
  category?: string;
  rating?: number;
  reviewsCount?: number;
  quantityAvailable?: number;
  dataAiHint?: string;
}

export interface Company {
  id: string;
  name: string;
  logoUrl: string;
  description: string;
  address?: string;
  contactEmail?: string;
  phoneNumber?: string;
  gstNumber?: string;
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
