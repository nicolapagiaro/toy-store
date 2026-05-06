import { Home, Search, PlusCircle, MessageCircle, User, Heart, Settings } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  const tabs = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'search', label: 'Cerca', icon: Search },
    { id: 'add', label: 'Nuovo annuncio', icon: PlusCircle },
    { id: 'messages', label: 'Messaggi', icon: MessageCircle },
    { id: 'favorites', label: 'Preferiti', icon: Heart },
    { id: 'profile', label: 'Profilo', icon: User },
  ];

  return (
    <aside
      className="hidden lg:flex lg:flex-col w-64 bg-card border-r border-border h-screen sticky top-0"
      role="navigation"
      aria-label="Navigazione principale"
    >
      <div className="p-6">
        <h1 className="text-2xl bg-gradient-to-r from-[var(--pastel-pink)] via-[var(--pastel-lavender)] to-[var(--pastel-mint)] bg-clip-text text-transparent">
          Toy Store
        </h1>
        <p className="text-sm text-muted-foreground mt-1">Milano</p>
      </div>

      <nav className="flex-1 px-3">
        <ul className="space-y-1">
          {tabs.map(({ id, label, icon: Icon }) => {
            const isActive = activeTab === id;
            return (
              <li key={id}>
                <button
                  onClick={() => onTabChange(id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-[var(--pastel-pink)]/20 to-[var(--pastel-lavender)]/20 text-foreground'
                      : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                  }`}
                  aria-label={label}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <Icon
                    size={22}
                    aria-hidden="true"
                    strokeWidth={isActive ? 2.5 : 2}
                  />
                  <span className={isActive ? 'font-medium' : ''}>{label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-3 border-t border-border">
        <button
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-muted-foreground hover:bg-accent hover:text-foreground transition-all"
          aria-label="Impostazioni"
        >
          <Settings size={22} aria-hidden="true" />
          <span>Impostazioni</span>
        </button>
      </div>
    </aside>
  );
}
