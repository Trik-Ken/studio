
import type { Product, Company, ChatConversation, ChatMessage } from './types';

export const mockCompanies: Company[] = [
  {
    id: 'comp1',
    name: 'Innovatech Solutions',
    logoUrl: 'https://placehold.co/100x100.png',
    description: 'Leading provider of innovative tech solutions for businesses. We focus on quality and customer satisfaction, delivering cutting-edge products that drive growth and efficiency.',
    address: '123 Tech Park, Silicon Valley, CA',
    contactEmail: 'sales@innovatech.com',
    phoneNumber: '1-800-555-0100',
    gstNumber: 'GSTIN1234567890',
    dataAiHint: 'technology company'
  },
  {
    id: 'comp2',
    name: 'EcoBuild Supplies',
    logoUrl: 'https://placehold.co/100x100.png',
    description: 'Sustainable and eco-friendly building materials for modern construction. Our products are designed to minimize environmental impact while maximizing performance and durability.',
    address: '456 Green Way, Boulder, CO',
    contactEmail: 'info@ecobuild.com',
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
    phoneNumber: '1-800-555-0102',
    gstNumber: 'GSTIN5432109876',
    dataAiHint: 'industrial tools'
  },
];

export const mockProducts: Product[] = [
  {
    id: 'prod1',
    name: 'Advanced AI Processor Unit',
    imageUrl: 'https://placehold.co/600x400.png?text=Primary+AI+Processor',
    images: [
      'https://placehold.co/600x400.png?text=Primary+AI+Processor',
      'https://placehold.co/600x400.png?text=AI+Processor+Side+View',
      'https://placehold.co/600x400.png?text=AI+Processor+Packaging',
      'https://placehold.co/600x400.png?text=AI+Processor+In+Use',
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
    imageUrl: 'https://placehold.co/600x400.png?text=Eco+Panels+Primary',
    images: [
        'https://placehold.co/600x400.png?text=Eco+Panels+Primary',
        'https://placehold.co/600x400.png?text=Eco+Panels+Stack',
        'https://placehold.co/600x400.png?text=Eco+Panels+Installation',
    ],
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
    price: 250.00, 
    priceForQuantity: 10,
    priceUnit: 'panel',
    category: 'Building Materials',
    rating: 4.5,
    reviewsCount: 85,
    quantityAvailable: 200,
    dataAiHint: 'insulation panel'
  },
  {
    id: 'prod3',
    name: 'Industrial Grade Laser Cutter',
    imageUrl: 'https://placehold.co/600x400.png?text=Laser+Cutter+Main',
    images: [
        'https://placehold.co/600x400.png?text=Laser+Cutter+Main',
        'https://placehold.co/600x400.png?text=Laser+Cutter+Close+Up',
    ],
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
    imageUrl: 'https://placehold.co/600x400.png?text=Quantum+Device',
    images: [
        'https://placehold.co/600x400.png?text=Quantum+Device',
        'https://placehold.co/600x400.png?text=Quantum+Device+Glowing',
    ],
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
  {
    id: 'prod5',
    name: 'Smart Office Hub X2000',
    imageUrl: 'https://placehold.co/600x400.png?text=Smart+Hub',
    images: [
        'https://placehold.co/600x400.png?text=Smart+Hub',
        'https://placehold.co/600x400.png?text=Hub+Interface',
        'https://placehold.co/600x400.png?text=Hub+Connections',
    ],
    description: 'Centralize your office automation with the Smart Office Hub. Controls lighting, climate, security, and more. Integrates with popular IoT platforms.',
    specifications: [
      { key: 'Connectivity', value: 'Wi-Fi, Bluetooth, Zigbee, Z-Wave' },
      { key: 'Processor', value: 'Quad-core ARM Cortex-A72' },
      { key: 'Supported Devices', value: 'Up to 200' },
    ],
    warrantyInfo: '3-year limited warranty',
    returnPolicy: '45-day return policy',
    companyId: 'comp1',
    companyName: 'Innovatech Solutions',
    price: 299.00,
    priceForQuantity: 1,
    priceUnit: 'hub',
    category: 'Electronics', 
    quantityAvailable: 150,
    dataAiHint: 'smart home device'
  },
  {
    id: 'prod6',
    name: 'Secure Data Vault S1',
    imageUrl: 'https://placehold.co/600x400.png?text=Data+Vault',
    images: [
        'https://placehold.co/600x400.png?text=Data+Vault',
        'https://placehold.co/600x400.png?text=Vault+Interior',
    ],
    description: 'Enterprise-grade secure storage for sensitive data. Multi-layer encryption and biometric access.',
    specifications: [
      { key: 'Capacity', value: '10 PB' },
      { key: 'Security', value: 'AES-256, Biometric Lock' },
    ],
    warrantyInfo: '5-year full warranty',
    returnPolicy: '60-day return policy',
    companyId: 'comp1',
    companyName: 'Innovatech Solutions',
    price: 75000.00,
    priceForQuantity: 1,
    priceUnit: 'system',
    category: 'Cybersecurity',
    quantityAvailable: 5,
    dataAiHint: 'secure server'
  },
  {
    id: 'prod7',
    name: 'VR Collaboration Suite Pro',
    imageUrl: 'https://placehold.co/600x400.png?text=VR+Suite',
    images: [
        'https://placehold.co/600x400.png?text=VR+Suite',
    ],
    description: 'Immersive virtual reality suite for remote team collaboration. Includes headsets and software licenses for 10 users.',
    specifications: [
      { key: 'Users', value: '10 Licenses' },
      { key: 'Resolution per eye', value: '2K' },
    ],
    warrantyInfo: '1-year hardware, lifetime software updates',
    returnPolicy: '30-day satisfaction guarantee',
    companyId: 'comp1',
    companyName: 'Innovatech Solutions',
    price: 4999.00,
    priceForQuantity: 1,
    priceUnit: 'suite',
    category: 'Software',
    quantityAvailable: 20,
    dataAiHint: 'virtual reality headset'
  },
  {
    id: 'prod8',
    name: 'Automated Logistics Drone X-Wing',
    imageUrl: 'https://placehold.co/600x400.png?text=Logistics+Drone',
    images: [
        'https://placehold.co/600x400.png?text=Logistics+Drone',
    ],
    description: 'Heavy-lift drone for automated warehouse and delivery logistics. 50kg payload capacity.',
    specifications: [
      { key: 'Payload', value: '50 kg' },
      { key: 'Flight Time', value: '45 minutes' },
    ],
    warrantyInfo: '2-year warranty on frame and motors',
    returnPolicy: 'Conditional returns, contact for details',
    companyId: 'comp1',
    companyName: 'Innovatech Solutions',
    price: 18000.00,
    priceForQuantity: 1,
    priceUnit: 'drone',
    category: 'Robotics',
    quantityAvailable: 8,
    dataAiHint: 'delivery drone'
  },
  {
    id: 'prod9',
    name: 'Bio-Enhanced Protein Synthesizer',
    imageUrl: 'https://placehold.co/600x400.png?text=Protein+Synthesizer',
    images: [
        'https://placehold.co/600x400.png?text=Protein+Synthesizer',
    ],
    description: 'Advanced synthesizer for custom protein creation for research and pharmaceutical applications.',
    specifications: [
      { key: 'Synthesis Rate', value: '10g/hour' },
      { key: 'Purity', value: '99.9%' },
    ],
    warrantyInfo: '1-year full warranty',
    returnPolicy: 'No returns on consumables',
    companyId: 'comp1',
    companyName: 'Innovatech Solutions',
    price: 120000.00,
    priceForQuantity: 1,
    priceUnit: 'unit',
    category: 'Biotechnology',
    quantityAvailable: 3,
    dataAiHint: 'lab equipment'
  },
  {
    id: 'prod10',
    name: 'Renewable Energy Storage Unit RSU-500',
    imageUrl: 'https://placehold.co/600x400.png?text=Energy+Storage',
    images: [
        'https://placehold.co/600x400.png?text=Energy+Storage',
    ],
    description: 'High-capacity battery storage for solar and wind energy systems. 500kWh capacity.',
    specifications: [
      { key: 'Capacity', value: '500 kWh' },
      { key: 'Lifespan', value: '15 years' },
    ],
    warrantyInfo: '10-year battery warranty',
    returnPolicy: 'Subject to installation agreement',
    companyId: 'comp1',
    companyName: 'Innovatech Solutions',
    price: 65000.00,
    priceForQuantity: 1,
    priceUnit: 'unit',
    category: 'Energy Solutions',
    quantityAvailable: 12,
    dataAiHint: 'battery storage'
  }
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
  comp1: [ 
    { id: 'msg1', conversationId: 'comp1', sender: 'user', text: 'Hello, I am interested in the AI Processor Unit.', timestamp: '10:25 AM' },
    { id: 'msg3', conversationId: 'comp1', sender: 'user', text: 'Could you tell me more about the power consumption under load?', timestamp: '10:32 AM' },
    { id: 'msg4', conversationId: 'comp1', sender: 'user', text: 'And what are the bulk pricing options?', timestamp: '10:33 AM' },
  ],
  comp2: [ 
    { id: 'msg5', conversationId: 'comp2', sender: 'user', text: 'We need insulation panels for a large project.', timestamp: 'Yesterday' },
    { id: 'msg6', conversationId: 'comp2', sender: 'company', text: 'Certainly! What is the total square footage you are looking to cover?', timestamp: 'Yesterday' },
    { id: 'msg7', conversationId: 'comp2', sender: 'user', text: 'Can you provide a quote for 1000 units?', timestamp: 'Yesterday' },
  ],
  comp3: [ 
    { id: 'msg8', conversationId: 'comp3', sender: 'company', text: 'Your laser cutter has been shipped.', timestamp: 'Mon' },
    { id: 'msg9', conversationId: 'comp3', sender: 'user', text: 'Great, the order is confirmed.', timestamp: 'Mon' },
  ],
};

export const loggedInCompanyId = 'comp1';
