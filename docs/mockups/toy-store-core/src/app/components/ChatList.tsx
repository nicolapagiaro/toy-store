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

interface ChatListProps {
  chats: Chat[];
  onChatSelect: (chatId: number) => void;
}

export function ChatList({ chats, onChatSelect }: ChatListProps) {
  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 bg-background/95 backdrop-blur-sm border-b border-border z-10">
        <div className="px-4 py-4">
          <h1 className="mb-4">Messaggi</h1>
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              size={20}
              aria-hidden="true"
            />
            <input
              type="search"
              placeholder="Cerca conversazioni..."
              className="w-full pl-10 pr-4 py-3 bg-input-background rounded-[var(--radius)] border border-border focus:outline-none focus:ring-2 focus:ring-ring"
              aria-label="Cerca nelle conversazioni"
            />
          </div>
        </div>
      </header>

      <main>
        {chats.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
            <div className="w-20 h-20 bg-[var(--pastel-purple)] rounded-full flex items-center justify-center mb-4">
              <Search size={32} className="text-foreground/60" />
            </div>
            <h2 className="mb-2">Nessun messaggio</h2>
            <p className="text-muted-foreground">
              Inizia a chattare con altri genitori per scambiare o acquistare giocattoli
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-border" role="list">
            {chats.map((chat) => (
              <li key={chat.id}>
                <button
                  onClick={() => onChatSelect(chat.id)}
                  className="w-full px-4 py-3 hover:bg-accent/50 transition-colors text-left"
                  aria-label={`Apri conversazione con ${chat.userName} su ${chat.productTitle}`}
                >
                  <div className="flex gap-3">
                    {/* User Avatar */}
                    <div className="relative flex-shrink-0">
                      <div className="w-14 h-14 bg-gradient-to-br from-[var(--pastel-pink)] to-[var(--pastel-lavender)] rounded-full flex items-center justify-center text-lg">
                        {chat.userName.charAt(0)}
                      </div>
                      {chat.isVerified && (
                        <div
                          className="absolute -bottom-1 -right-1 bg-[var(--verified-badge)] rounded-full p-0.5"
                          aria-label="Utente verificato"
                        >
                          <BadgeCheck size={14} className="text-white" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-1">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{chat.userName}</p>
                          <p className="text-xs text-muted-foreground truncate">
                            {chat.productTitle}
                          </p>
                        </div>
                        <div className="flex flex-col items-end gap-1 ml-2 flex-shrink-0">
                          <span className="text-xs text-muted-foreground whitespace-nowrap">
                            {chat.timestamp}
                          </span>
                          {chat.unreadCount > 0 && (
                            <span
                              className="bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full min-w-[20px] text-center"
                              aria-label={`${chat.unreadCount} messaggi non letti`}
                            >
                              {chat.unreadCount}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <p className="text-sm text-muted-foreground truncate flex-1">
                          {chat.lastMessage}
                        </p>
                        <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 border border-border">
                          <ImageWithFallback
                            src={chat.productImage}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
