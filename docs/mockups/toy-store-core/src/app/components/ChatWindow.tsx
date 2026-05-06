import { ArrowLeft, BadgeCheck, Send, MoreVertical, Image as ImageIcon } from 'lucide-react';
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

interface ChatWindowProps {
  chatId: number;
  userName: string;
  isVerified: boolean;
  productTitle: string;
  productImage: string;
  messages: Message[];
  onBack: () => void;
}

export function ChatWindow({
  userName,
  isVerified,
  productTitle,
  productImage,
  messages,
  onBack,
}: ChatWindowProps) {
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
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 bg-card/95 backdrop-blur-sm border-b border-border z-10">
        <div className="px-4 py-3">
          <div className="flex items-center gap-3 mb-3">
            <button
              onClick={onBack}
              className="p-2 hover:bg-accent rounded-full transition-colors -ml-2"
              aria-label="Torna alla lista messaggi"
            >
              <ArrowLeft size={24} />
            </button>

            <div className="relative flex-shrink-0">
              <div className="w-10 h-10 bg-gradient-to-br from-[var(--pastel-pink)] to-[var(--pastel-lavender)] rounded-full flex items-center justify-center">
                {userName.charAt(0)}
              </div>
              {isVerified && (
                <div
                  className="absolute -bottom-0.5 -right-0.5 bg-[var(--verified-badge)] rounded-full p-0.5"
                  aria-label="Utente verificato"
                >
                  <BadgeCheck size={12} className="text-white" />
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{userName}</p>
              <p className="text-xs text-muted-foreground">Online</p>
            </div>

            <button
              className="p-2 hover:bg-accent rounded-full transition-colors"
              aria-label="Altre opzioni"
            >
              <MoreVertical size={20} />
            </button>
          </div>

          {/* Product Reference */}
          <div className="bg-[var(--pastel-purple)]/30 rounded-lg p-2 flex items-center gap-2">
            <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 border border-border">
              <ImageWithFallback
                src={productImage}
                alt=""
                className="w-full h-full object-cover"
              />
            </div>
            <p className="text-sm flex-1 truncate">{productTitle}</p>
          </div>
        </div>
      </header>

      {/* Messages */}
      <main className="flex-1 overflow-y-auto px-4 py-4 space-y-3" role="log" aria-label="Messaggi della chat">
        {chatMessages.map((message) => {
          if (message.type === 'system') {
            return (
              <div key={message.id} className="flex justify-center">
                <p className="text-xs text-muted-foreground bg-muted px-3 py-1.5 rounded-full">
                  {message.text}
                </p>
              </div>
            );
          }

          if (message.type === 'proposal') {
            return (
              <div key={message.id} className="flex justify-center">
                <div className="bg-gradient-to-br from-[var(--pastel-mint)] to-[var(--pastel-yellow)] rounded-2xl p-4 max-w-[85%] text-center">
                  <p className="font-medium mb-1">{message.proposalData?.action}</p>
                  <p className="text-sm text-foreground/80 mb-3">{message.proposalData?.details}</p>
                  <div className="flex gap-2">
                    <button className="flex-1 py-2 px-4 bg-card rounded-lg text-sm hover:opacity-80 transition-opacity">
                      Rifiuta
                    </button>
                    <button className="flex-1 py-2 px-4 bg-primary text-primary-foreground rounded-lg text-sm hover:opacity-90 transition-opacity">
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
                className={`max-w-[75%] rounded-2xl px-4 py-2 ${
                  isMine
                    ? 'bg-primary text-primary-foreground rounded-br-md'
                    : 'bg-card border border-border rounded-bl-md'
                }`}
              >
                <p className="text-sm leading-relaxed">{message.text}</p>
                <p
                  className={`text-xs mt-1 ${
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
      <div className="px-4 py-2 border-t border-border bg-background">
        <div className="flex gap-2 overflow-x-auto pb-1">
          {quickReplies.map((reply) => (
            <button
              key={reply}
              onClick={() => setMessageText(reply)}
              className="flex-shrink-0 px-3 py-1.5 bg-[var(--pastel-lavender)] rounded-full text-sm hover:opacity-80 transition-opacity"
            >
              {reply}
            </button>
          ))}
        </div>
      </div>

      {/* Message Input */}
      <div className="px-4 py-3 border-t border-border bg-card pb-safe">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <button
            type="button"
            className="p-3 hover:bg-accent rounded-full transition-colors flex-shrink-0"
            aria-label="Allega immagine"
          >
            <ImageIcon size={24} className="text-muted-foreground" />
          </button>

          <input
            type="text"
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            placeholder="Scrivi un messaggio..."
            className="flex-1 px-4 py-3 bg-input-background rounded-full border border-border focus:outline-none focus:ring-2 focus:ring-ring"
            aria-label="Scrivi un messaggio"
          />

          <button
            type="submit"
            disabled={!messageText.trim()}
            className="p-3 bg-primary text-primary-foreground rounded-full hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
            aria-label="Invia messaggio"
          >
            <Send size={24} />
          </button>
        </form>
      </div>
    </div>
  );
}
