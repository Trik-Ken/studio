import type { ChatConversation } from '@/lib/types';
import Link from 'next/link';
import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

interface ChatListItemProps {
  conversation: ChatConversation;
}

export function ChatListItem({ conversation }: ChatListItemProps) {
  return (
    <Link href={`/chat/${conversation.companyId}`} className="block hover:bg-muted/50 transition-colors rounded-lg">
      <div className="flex items-center p-4 space-x-4">
        <Avatar className="h-12 w-12 border">
          <AvatarImage src={conversation.companyLogoUrl} alt={conversation.companyName} data-ai-hint={conversation.dataAiHint || "company logo"}/>
          <AvatarFallback>{conversation.companyName.substring(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-center mb-0.5">
            <p className="text-md font-semibold text-foreground truncate">{conversation.companyName}</p>
            <span className="text-xs text-muted-foreground">{conversation.lastMessageTimestamp}</span>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground truncate pr-2">{conversation.lastMessage}</p>
            {conversation.unreadCount && conversation.unreadCount > 0 && (
              <Badge variant="default" className="h-5 px-2 text-xs">{conversation.unreadCount}</Badge>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
