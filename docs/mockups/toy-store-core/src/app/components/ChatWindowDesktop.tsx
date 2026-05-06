import { BadgeCheck, Send, MoreVertical, Image as ImageIcon, Phone, Video } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface Message {
  id: number;
  text: string;
  senderId: string;
  timestamp: string;
  type: 'text' | 'proposal' | 'system';
  proposalData?: {
    action: string;
    details: string;
  };
}

interface ChatWindowDesktopProps {
  userName: string;
  isVerified: boolean;
  productTitle: string;
  productImage: string;
  messages: Message[];
}

export function ChatWindowDesktop({
  userName,
  isVerified,
  productTitle,
  productImage,
  messages,
}: ChatWindowDesktopProps) {
  const [messageText, setMessageText] = useState('');
  const [chatMessages, setChatMessages] = useState(messages);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim()) return;

    const newMessage: Message = {
      id: chatMessages.length + 1,
      text: messageText,
      senderId: 'me',
      timestamp: 'Ora',
      type: 'text',
    };

    setChatMessages([...chatMessages, newMessage]);
    setMessageText('');
  };

  const quickReplies = [
    'È ancora disponibile?',
    'Possiamo incontrarci?',
    'Accetto lo scambio!',
  ];

  return (
    <div className="flex-1 flex flex-col h-full bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="px-6 py-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-shrink-0">
              <div className="w-12 h-12 bg-gradient-to-br from-[var(--pastel-pink)] to-[var(--pastel-lavender)] rounded-full flex items-center justify-center text-lg">
                {userName.charAt(0)}
              </div>
              {isVerified && (
                <div
                  className="absolute -bottom-1 -right-1 bg-[var(--verified-badge)] rounded-full p-1"
                  aria-label="Utente verificato"
                >
                  <BadgeCheck size={14} className="text-white" />
                </div>
              )}
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-2">
                <p className="font-medium">{userName}</p>
                {isVerified && (
                  <BadgeCheck size={16} className="text-[var(--verified-badge)]" aria-label="Verificato" />
                )}
              </div>
              <p className="text-sm text-muted-foreground">Online</p>
            </div>

            <div className="flex gap-2">
              <button
                className="p-2.5 hover:bg-accent rounded-lg transition-colors"
                aria-label="Chiamata vocale"
              >
                <Phone size={20} />
              </button>
              <button
                className="p-2.5 hover:bg-accent rounded-lg transition-colors"
                aria-label="Videochiamata"
              >
                <Video size={20} />
              </button>
              <button
                className="p-2.5 hover:bg-accent rounded-lg transition-colors"
                aria-label="Altre opzioni"
              >
                <MoreVertical size={20} />
              </button>
            </div>
          </div>

          {/* Product Reference */}
          <div className="mt-3 bg-[var(--pastel-purple)]/30 rounded-lg p-3 flex items-center gap-3">
            <div className="w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 border border-border">
              <ImageWithFallback
                src={productImage}
                alt=""
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">{productTitle}</p>
              <button className="text-xs text-primary hover:underline mt-0.5">
                Visualizza annuncio
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Messages */}
      <main className="flex-1 overflow-y-auto px-6 py-6 space-y-4" role="log" aria-label="Messaggi della chat">
        {chatMessages.map((message) => {
          if (message.type === 'system') {
            return (
              <div key={message.id} className="flex justify-center">
                <p className="text-xs text-muted-foreground bg-muted px-4 py-2 rounded-full">
                  {message.text}
                </p>
              </div>
            );
          }

          if (message.type === 'proposal') {
            return (
              <div key={message.id} className="flex justify-center">
                <div className="bg-gradient-to-br from-[var(--pastel-mint)] to-[var(--pastel-yellow)] rounded-2xl p-5 max-w-md text-center">
                  <p className="font-medium mb-2">{message.proposalData?.action}</p>
                  <p className="text-sm text-foreground/80 mb-4">{message.proposalData?.details}</p>
                  <div className="flex gap-3">
                    <button className="flex-1 py-2.5 px-4 bg-card rounded-lg hover:opacity-80 transition-opacity">
                      Rifiuta
                    </button>
                    <button className="flex-1 py-2.5 px-4 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity">
                      Accetta
                    </button>
                  </div>
                </div>
              </div>
            );
          }

          const isMine = message.senderId === 'me';
          return (
            <div
              key={message.id}
              className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-md rounded-2xl px-5 py-3 ${
                  isMine
                    ? 'bg-primary text-primary-foreground rounded-br-md'
                    : 'bg-card border border-border rounded-bl-md'
                }`}
              >
                <p className="leading-relaxed">{message.text}</p>
                <p
                  className={`text-xs mt-1.5 ${
                    isMine ? 'text-primary-foreground/70' : 'text-muted-foreground'
                  }`}
                >
                  {message.timestamp}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </main>

      {/* Quick Replies */}
      <div className="px-6 py-3 border-t border-border bg-background">
        <div className="flex gap-2">
          {quickReplies.map((reply) => (
            <button
              key={reply}
              onClick={() => setMessageText(reply)}
              className="px-4 py-2 bg-[var(--pastel-lavender)] rounded-full text-sm hover:opacity-80 transition-opacity"
            >
              {reply}
            </button>
          ))}
        </div>
      </div>

      {/* Message Input */}
      <div className="px-6 py-4 border-t border-border bg-card">
        <form onSubmit={handleSendMessage} className="flex gap-3">
          <button
            type="button"
            className="p-3 hover:bg-accent rounded-lg transition-colors flex-shrink-0"
            aria-label="Allega immagine"
          >
            <ImageIcon size={22} className="text-muted-foreground" />
          </button>

          <input
            type="text"
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            placeholder="Scrivi un messaggio..."
            className="flex-1 px-5 py-3 bg-input-background rounded-full border border-border focus:outline-none focus:ring-2 focus:ring-ring"
            aria-label="Scrivi un messaggio"
          />

          <button
            type="submit"
            disabled={!messageText.trim()}
            className="px-6 py-3 bg-primary text-primary-foreground rounded-full hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0 flex items-center gap-2"
            aria-label="Invia messaggio"
          >
            <Send size={20} />
            <span>Invia</span>
          </button>
        </form>
      </div>
    </div>
  );
}
