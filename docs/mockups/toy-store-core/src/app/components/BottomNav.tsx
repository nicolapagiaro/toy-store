import { Home, Search, PlusCircle, MessageCircle, User } from 'lucide-react';

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  const tabs = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'search', label: 'Cerca', icon: Search },
    { id: 'add', label: 'Aggiungi', icon: PlusCircle },
    { id: 'messages', label: 'Messaggi', icon: MessageCircle },
    { id: 'profile', label: 'Profilo', icon: User },
  ];

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 bg-card border-t border-border pb-safe"
      role="navigation"
      aria-label="Navigazione principale"
    >
      <div className="flex justify-around items-center h-16 max-w-screen-xl mx-auto">
        {tabs.map(({ id, label, icon: Icon }) => {
          const isActive = activeTab === id;
          return (
            <button
              key={id}
              onClick={() => onTabChange(id)}
              className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
                isActive ? 'text-primary' : 'text-muted-foreground'
              }`}
              aria-label={label}
              aria-current={isActive ? 'page' : undefined}
            >
              <Icon
                size={24}
                aria-hidden="true"
                strokeWidth={isActive ? 2.5 : 2}
              />
              <span className="text-xs mt-1">{label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
