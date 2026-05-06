import { Search, BadgeCheck } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface Chat {
  id: number;
  userName: string;
  userAvatar: string;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  isVerified: boolean;
  productTitle: string;
  productImage: string;
}

interface ChatListDesktopProps {
  chats: Chat[];
  selectedChatId: number | null;
  onChatSelect: (chatId: number) => void;
}

export function ChatListDesktop({ chats, selectedChatId, onChatSelect }: ChatListDesktopProps) {
  return (
    <div className="w-96 border-r border-border flex flex-col h-full bg-background">
      <div className="p-4 border-b border-border">
        <h2 className="mb-3">Messaggi</h2>
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            size={18}
            aria-hidden="true"
          />
          <input
            type="search"
            placeholder="Cerca conversazioni..."
            className="w-full pl-10 pr-4 py-2.5 bg-input-background rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-ring text-sm"
            aria-label="Cerca nelle conversazioni"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {chats.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
            <div className="w-16 h-16 bg-[var(--pastel-purple)] rounded-full flex items-center justify-center mb-3">
              <Search size={24} className="text-foreground/60" />
            </div>
            <p className="text-sm text-muted-foreground">
              Nessun messaggio disponibile
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-border" role="list">
            {chats.map((chat) => {
              const isSelected = selectedChatId === chat.id;
              return (
                <li key={chat.id}>
                  <button
                    onClick={() => onChatSelect(chat.id)}
                    className={`w-full px-4 py-3 transition-colors text-left ${
                      isSelected ? 'bg-accent/50' : 'hover:bg-accent/30'
                    }`}
                    aria-label={`Apri conversazione con ${chat.userName} su ${chat.productTitle}`}
                    aria-current={isSelected ? 'true' : undefined}
                  >
                    <div className="flex gap-3">
                      <div className="relative flex-shrink-0">
                        <div className="w-12 h-12 bg-gradient-to-br from-[var(--pastel-pink)] to-[var(--pastel-lavender)] rounded-full flex items-center justify-center">
                          {chat.userName.charAt(0)}
                        </div>
                        {chat.isVerified && (
                          <div
                            className="absolute -bottom-1 -right-1 bg-[var(--verified-badge)] rounded-full p-0.5"
                            aria-label="Utente verificato"
                          >
                            <BadgeCheck size={12} className="text-white" />
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-1">
                          <p className="font-medium text-sm truncate">{chat.userName}</p>
                          <div className="flex flex-col items-end gap-1 ml-2 flex-shrink-0">
                            <span className="text-xs text-muted-foreground whitespace-nowrap">
                              {chat.timestamp}
                            </span>
                            {chat.unreadCount > 0 && (
                              <span
                                className="bg-primary text-primary-foreground text-xs px-1.5 py-0.5 rounded-full min-w-[18px] text-center"
                                aria-label={`${chat.unreadCount} messaggi non letti`}
                              >
                                {chat.unreadCount}
                              </span>
                            )}
                          </div>
                        </div>

                        <p className="text-xs text-muted-foreground truncate mb-1">
                          {chat.productTitle}
                        </p>

                        <p className="text-sm text-muted-foreground truncate">
                          {chat.lastMessage}
                        </p>
                      </div>
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
