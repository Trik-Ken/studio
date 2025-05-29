import type { Product, Company, ChatConversation, ChatMessage } from './types';

export const mockCompanies: Company[] = [
  {
    id: 'comp1',
    name: 'Innovatech Solutions',
    logoUrl: 'https://placehold.co/100x100.png',
    description: 'Leading provider of innovative tech solutions for businesses. We focus on quality and customer satisfaction, delivering cutting-edge products that drive growth and efficiency.',
    address: '123 Tech Park, Silicon Valley, CA',
    contactEmail: 'sales@innovatech.com',
    website: 'www.innovatech.com',
    phoneNumber: '1-800-555-0100',
    gstNumber: 'GSTIN1234567890', // Added GST Number
    dataAiHint: 'technology company'
  },
  {
    id: 'comp2',
    name: 'EcoBuild Supplies',
    logoUrl: 'https://placehold.co/100x100.png',
    description: 'Sustainable and eco-friendly building materials for modern construction. Our products are designed to minimize environmental impact while maximizing performance and durability.',
    address: '456 Green Way, Boulder, CO',
    contactEmail: 'info@ecobuild.com',
    website: 'www.ecobuild.com',
    phoneNumber: '1-800-555-0101',
    gstNumber: 'GSTIN0987654321',
    dataAiHint: 'construction materials'
  },
  {
    id: 'comp3',
    name: 'Precision Tools Co.',
    logoUrl: 'https://placehold.co/100x100.png',
    description: 'High-quality precision tools for industrial applications. We offer a wide range of tools engineered for accuracy, reliability, and long-lasting performance.',
    address: '789 Industrial Ave, Detroit, MI',
    contactEmail: 'support@precisiontools.com',
    website: 'www.precisiontools.com',
    phoneNumber: '1-800-555-0102',
    gstNumber: 'GSTIN5432109876',
    dataAiHint: 'industrial tools'
  },
];

export const mockProducts: Product[] = [
  {
    id: 'prod1',
    name: 'Advanced AI Processor Unit',
    imageUrl: 'https://placehold.co/600x400.png',
    images: [
      'https://placehold.co/600x400.png',
      'https://placehold.co/600x400.png',
      'https://placehold.co/600x400.png',
    ],
    description: 'State-of-the-art AI processor for demanding applications. Features high computational power and energy efficiency, ideal for machine learning and data processing tasks.',
    specifications: [
      { key: 'Cores', value: '128' },
      { key: 'Clock Speed', value: '3.5 GHz' },
      { key: 'Power Consumption', value: '75W' },
    ],
    warrantyInfo: '2-year limited warranty',
    returnPolicy: '30-day return policy',
    companyId: 'comp1',
    companyName: 'Innovatech Solutions',
    price: 499.99,
    priceForQuantity: 1,
    priceUnit: 'unit',
    category: 'Electronics',
    rating: 4.8,
    reviewsCount: 120,
    quantityAvailable: 500,
    dataAiHint: 'processor chip'
  },
  {
    id: 'prod2',
    name: 'Eco-Friendly Insulation Panels (Pack of 10)',
    imageUrl: 'https://placehold.co/600x400.png',
    description: 'Sustainable insulation panels made from recycled materials. Provides excellent thermal resistance and soundproofing for residential and commercial buildings. Sold in packs of 10.',
    specifications: [
      { key: 'Material', value: 'Recycled Cellulose' },
      { key: 'R-Value per panel', value: 'R-15' },
      { key: 'Thickness per panel', value: '3.5 inches' },
      { key: 'Pack Size', value: '10 panels' },
    ],
    warrantyInfo: '10-year manufacturer warranty',
    returnPolicy: '60-day return policy, conditions apply',
    companyId: 'comp2',
    companyName: 'EcoBuild Supplies',
    price: 250.00, // Price for a pack of 10 (25.00 per panel)
    priceForQuantity: 10,
    priceUnit: 'panel',
    category: 'Building Materials',
    rating: 4.5,
    reviewsCount: 85,
    quantityAvailable: 200, // Number of packs available
    dataAiHint: 'insulation panel'
  },
  {
    id: 'prod3',
    name: 'Industrial Grade Laser Cutter',
    imageUrl: 'https://placehold.co/600x400.png',
    description: 'High-precision laser cutter for various industrial materials. Offers fast cutting speeds and accuracy for intricate designs and mass production.',
    specifications: [
      { key: 'Laser Power', value: '150W CO2' },
      { key: 'Working Area', value: '1300x900 mm' },
      { key: 'Max Cutting Speed', value: '600 mm/s' },
    ],
    warrantyInfo: '1-year comprehensive warranty',
    returnPolicy: 'Non-returnable after installation',
    companyId: 'comp3',
    companyName: 'Precision Tools Co.',
    price: 12500.00,
    priceForQuantity: 1,
    priceUnit: 'cutter',
    category: 'Machinery',
    rating: 4.9,
    reviewsCount: 45,
    quantityAvailable: 15,
    dataAiHint: 'laser cutter'
  },
  {
    id: 'prod4',
    name: 'Quantum Entanglement Communicator',
    imageUrl: 'https://placehold.co/600x400.png',
    description: 'Prototype device for instantaneous communication across any distance. Note: Requires paired device and understanding of quantum physics. Handle with care.',
    specifications: [
      { key: 'Range', value: 'Effectively Infinite' },
      { key: 'Bandwidth', value: '1 qubit/sec' },
      { key: 'Power Source', value: 'Miniature Cold Fusion Cell' },
    ],
    warrantyInfo: 'No warranty, experimental device',
    returnPolicy: 'All sales final',
    companyId: 'comp1',
    companyName: 'Innovatech Solutions',
    price: 999999.99,
    priceForQuantity: 1,
    priceUnit: 'device',
    category: 'Experimental Tech',
    quantityAvailable: 1,
    dataAiHint: 'futuristic device'
  },
];

export const mockChatConversations: ChatConversation[] = [
  {
    id: 'chat1',
    companyId: 'comp1',
    companyName: 'Innovatech Solutions',
    companyLogoUrl: 'https://placehold.co/80x80.png',
    lastMessage: 'Thanks for your inquiry! We will get back to you shortly.',
    lastMessageTimestamp: '10:30 AM',
    unreadCount: 2,
    dataAiHint: 'technology logo'
  },
  {
    id: 'chat2',
    companyId: 'comp2',
    companyName: 'EcoBuild Supplies',
    companyLogoUrl: 'https://placehold.co/80x80.png',
    lastMessage: 'Can you provide a quote for 1000 units?',
    lastMessageTimestamp: 'Yesterday',
    dataAiHint: 'nature logo'
  },
  {
    id: 'chat3',
    companyId: 'comp3',
    companyName: 'Precision Tools Co.',
    companyLogoUrl: 'https://placehold.co/80x80.png',
    lastMessage: 'Great, the order is confirmed.',
    lastMessageTimestamp: 'Mon',
    unreadCount: 0,
    dataAiHint: 'gear logo'
  },
];

export const mockMessages: { [conversationId: string]: ChatMessage[] } = {
  comp1: [ // Changed from chat1 to comp1 to match direct chat routing by companyId
    { id: 'msg1', conversationId: 'comp1', sender: 'user', text: 'Hello, I am interested in the AI Processor Unit.', timestamp: '10:25 AM' },
    { id: 'msg2', conversationId: 'comp1', sender: 'company', text: 'Thanks for your inquiry! We will get back to you shortly.', timestamp: '10:30 AM' },
    { id: 'msg3', conversationId: 'comp1', sender: 'user', text: 'Could you tell me more about the power consumption under load?', timestamp: '10:32 AM' },
    { id: 'msg4', conversationId: 'comp1', sender: 'user', text: 'And what are the bulk pricing options?', timestamp: '10:33 AM' },
  ],
  comp2: [ // Changed from chat2 to comp2
    { id: 'msg5', conversationId: 'comp2', sender: 'user', text: 'We need insulation panels for a large project.', timestamp: 'Yesterday' },
    { id: 'msg6', conversationId: 'comp2', sender: 'company', text: 'Certainly! What is the total square footage you are looking to cover?', timestamp: 'Yesterday' },
    { id: 'msg7', conversationId: 'comp2', sender: 'user', text: 'Can you provide a quote for 1000 units?', timestamp: 'Yesterday' },
  ],
  comp3: [ // Changed from chat3 to comp3
    { id: 'msg8', conversationId: 'comp3', sender: 'company', text: 'Your laser cutter has been shipped.', timestamp: 'Mon' },
    { id: 'msg9', conversationId: 'comp3', sender: 'user', text: 'Great, the order is confirmed.', timestamp: 'Mon' },
  ],
};

export const loggedInCompanyId = 'comp1'; // Assume Innovatech Solutions is the logged-in user for profile page
