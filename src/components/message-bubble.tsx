import type { ChatMessage } from '@/lib/types';
import { cn } from '@/lib/utils';

interface MessageBubbleProps {
  message: ChatMessage;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.sender === 'user';

  return (
    <div className={cn('flex mb-3', isUser ? 'justify-end' : 'justify-start')}>
      <div
        className={cn(
          'max-w-[70%] rounded-xl px-4 py-2.5 shadow',
          isUser ? 'bg-primary text-primary-foreground rounded-br-none' : 'bg-card text-card-foreground rounded-bl-none border'
        )}
      >
        <p className="text-sm break-words">{message.text}</p>
        <p className={cn('text-xs mt-1', isUser ? 'text-primary-foreground/70 text-right' : 'text-muted-foreground/80 text-left')}>
          {message.timestamp}
        </p>
      </div>
    </div>
  );
}
