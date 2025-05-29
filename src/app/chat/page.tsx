import { Input } from '@/components/ui/input';
import { ChatListItem } from '@/components/chat-list-item';
import { mockChatConversations } from '@/lib/mock-data';
import { Separator } from '@/components/ui/separator';
import { Search, MessageSquare } from 'lucide-react';

export default function ChatListPage() {
  // Search functionality would be implemented with state
  // const [searchTerm, setSearchTerm] = useState('');
  // const filteredConversations = mockChatConversations.filter(c => c.companyName.toLowerCase().includes(searchTerm.toLowerCase()));
  
  return (
    <div className="container mx-auto max-w-2xl px-0 sm:px-4 py-8">
      <header className="px-4 mb-6">
        <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2">Chats</h1>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search chats..."
            className="w-full rounded-lg bg-background py-2.5 pl-10 pr-4 shadow-sm focus:ring-primary"
            // onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </header>

      {mockChatConversations.length > 0 ? (
        <div className="space-y-1">
          {mockChatConversations.map((conversation, index) => (
            <div key={conversation.id}>
              <ChatListItem conversation={conversation} />
              {index < mockChatConversations.length -1 && <Separator className="mx-4"/>}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <MessageSquare className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
          <p className="text-xl text-muted-foreground">No active chats.</p>
          <p className="text-sm text-muted-foreground mt-1">Start a conversation with a seller from a product page.</p>
        </div>
      )}
    </div>
  );
}
