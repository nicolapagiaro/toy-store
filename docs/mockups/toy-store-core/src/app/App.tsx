import { useState } from 'react';
import { ToyCard } from './components/ToyCard';
import { SearchBar } from './components/SearchBar';
import { BottomNav } from './components/BottomNav';
import { FilterSheet } from './components/FilterSheet';
import { ProductDetail } from './components/ProductDetail';
import { ChatList } from './components/ChatList';
import { ChatWindow } from './components/ChatWindow';
import { Sidebar } from './components/Sidebar';
import { ChatListDesktop } from './components/ChatListDesktop';
import { ChatWindowDesktop } from './components/ChatWindowDesktop';
import { ProductDetailDesktop } from './components/ProductDetailDesktop';
import { FeaturedSection } from './components/FeaturedSection';
import { MessageCircle } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<number | null>(null);
  const [selectedChat, setSelectedChat] = useState<number | null>(null);

  const mockToys = [
    {
      id: 1,
      title: 'Set costruzioni colorate 100 pezzi',
      distance: '2.5 km',
      ageRange: '3-5 anni',
      condition: 'Come nuovo',
      imageUrl: 'https://images.unsplash.com/photo-1553158399-3796bdbc82fd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400',
      isVerified: true,
      price: '15€',
      description: 'Set completo di costruzioni colorate in ottime condizioni. Include 100 pezzi di diverse forme e dimensioni, perfetti per sviluppare la creatività dei bambini. Tutti i pezzi sono presenti e puliti. Ideale per bambini dai 3 ai 5 anni.',
      images: [
        'https://images.unsplash.com/photo-1553158399-3796bdbc82fd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800',
        'https://images.unsplash.com/photo-1754294437669-9501390c12bb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800',
      ],
      sellerName: 'Sara M.',
      sellerRating: 4.8,
      sellerReviews: 23,
      location: 'Milano, Zona Navigli',
      category: 'Costruzioni',
      postedDate: '3 maggio 2026'
    },
    {
      id: 2,
      title: 'Peluche coniglietto morbido bianco e giallo',
      distance: '1.2 km',
      ageRange: '0-2 anni',
      condition: 'Ottime condizioni',
      imageUrl: 'https://images.unsplash.com/photo-1615486363973-f79d875780cf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400',
      isVerified: true,
      description: 'Dolcissimo peluche a forma di coniglietto, morbidissimo e sicuro per i più piccoli. Lavato di recente e igienizzato. Disponibile per scambio con altri giocattoli adatti alla fascia 0-2 anni.',
      images: [
        'https://images.unsplash.com/photo-1615486363973-f79d875780cf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800',
        'https://images.unsplash.com/photo-1615486364134-62a4c72c822d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800',
      ],
      sellerName: 'Marco R.',
      sellerRating: 5.0,
      sellerReviews: 15,
      location: 'Milano, Porta Romana',
      category: 'Peluche',
      postedDate: '5 maggio 2026'
    },
    {
      id: 3,
      title: 'Camion LEGO giallo e nero con accessori',
      distance: '4.8 km',
      ageRange: '6-10 anni',
      condition: 'Buone condizioni',
      imageUrl: 'https://images.unsplash.com/photo-1610213881011-ba006d40d5b4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400',
      isVerified: false,
      price: '25€',
      description: 'Set LEGO camion da cantiere completo di accessori e minifigure. Tutti i pezzi sono presenti. Qualche piccolo segno di usura ma perfettamente funzionante. Include le istruzioni originali.',
      images: [
        'https://images.unsplash.com/photo-1610213881011-ba006d40d5b4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800',
        'https://images.unsplash.com/photo-1610213880945-9b020ccc2843?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800',
      ],
      sellerName: 'Giulia B.',
      sellerRating: 4.5,
      sellerReviews: 8,
      location: 'Milano, Lambrate',
      category: 'LEGO',
      postedDate: '1 maggio 2026'
    },
    {
      id: 4,
      title: 'Orsacchiotto azzurro e bianco morbidissimo',
      distance: '3.1 km',
      ageRange: '0-2 anni',
      condition: 'Come nuovo',
      imageUrl: 'https://images.unsplash.com/photo-1615486364134-62a4c72c822d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400',
      isVerified: true,
      description: 'Tenero orsacchiotto in perfette condizioni, quasi mai usato. Tessuto morbido e lavabile. Regalo perfetto per neonati.',
      images: ['https://images.unsplash.com/photo-1615486364134-62a4c72c822d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800'],
      sellerName: 'Anna P.',
      sellerRating: 4.9,
      sellerReviews: 31,
      location: 'Milano, Isola',
      category: 'Peluche',
      postedDate: '2 maggio 2026'
    },
    {
      id: 5,
      title: 'Set giochi educativi colorati assortiti',
      distance: '5.4 km',
      ageRange: '3-5 anni',
      condition: 'Buone condizioni',
      imageUrl: 'https://images.unsplash.com/photo-1754294437669-9501390c12bb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400',
      isVerified: true,
      price: '20€',
      description: 'Collezione di giochi educativi per stimolare creatività e apprendimento. Include puzzle, forme geometriche e giochi di abbinamento.',
      images: ['https://images.unsplash.com/photo-1754294437669-9501390c12bb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800'],
      sellerName: 'Luca T.',
      sellerRating: 4.7,
      sellerReviews: 19,
      location: 'Milano, Bicocca',
      category: 'Educativi',
      postedDate: '4 maggio 2026'
    },
    {
      id: 6,
      title: 'Personaggio LEGO con accessori fotocamera',
      distance: '6.7 km',
      ageRange: '6-10 anni',
      condition: 'Ottime condizioni',
      imageUrl: 'https://images.unsplash.com/photo-1610213880945-9b020ccc2843?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400',
      isVerified: false,
      description: 'Minifigure LEGO completa di accessori. Perfetta per collezionisti o per arricchire il set esistente.',
      images: ['https://images.unsplash.com/photo-1610213880945-9b020ccc2843?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800'],
      sellerName: 'Francesco D.',
      sellerRating: 4.3,
      sellerReviews: 6,
      location: 'Milano, Corvetto',
      category: 'LEGO',
      postedDate: '30 aprile 2026'
    }
  ];

  const mockChats = [
    {
      id: 1,
      userName: 'Sara M.',
      userAvatar: '',
      lastMessage: 'Perfetto! Ci vediamo domani alle 15',
      timestamp: '10:30',
      unreadCount: 2,
      isVerified: true,
      productTitle: 'Set costruzioni colorate 100 pezzi',
      productImage: 'https://images.unsplash.com/photo-1553158399-3796bdbc82fd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200',
      messages: [
        {
          id: 1,
          text: 'Ciao! Sono interessata al set di costruzioni',
          senderId: 'other',
          timestamp: '9:15',
          type: 'text' as const,
        },
        {
          id: 2,
          text: 'Ciao Sara! Certamente, è ancora disponibile',
          senderId: 'me',
          timestamp: '9:20',
          type: 'text' as const,
        },
        {
          id: 3,
          text: 'Proposta di scambio',
          senderId: 'other',
          timestamp: '9:25',
          type: 'proposal' as const,
          proposalData: {
            action: 'Proposta di scambio',
            details: 'Sara propone uno scambio con "Puzzle educativo 50 pezzi"',
          },
        },
        {
          id: 4,
          text: 'Accettato! Dove possiamo incontrarci?',
          senderId: 'me',
          timestamp: '9:30',
          type: 'text' as const,
        },
        {
          id: 5,
          text: 'Ti va bene domani pomeriggio in zona Navigli?',
          senderId: 'other',
          timestamp: '10:15',
          type: 'text' as const,
        },
        {
          id: 6,
          text: 'Perfetto! Ci vediamo domani alle 15',
          senderId: 'other',
          timestamp: '10:30',
          type: 'text' as const,
        },
      ],
    },
    {
      id: 2,
      userName: 'Marco R.',
      userAvatar: '',
      lastMessage: 'È ancora disponibile?',
      timestamp: 'Ieri',
      unreadCount: 0,
      isVerified: true,
      productTitle: 'Camion LEGO giallo e nero con accessori',
      productImage: 'https://images.unsplash.com/photo-1610213881011-ba006d40d5b4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200',
      messages: [
        {
          id: 1,
          text: 'Ciao! Sono interessato al camion LEGO',
          senderId: 'other',
          timestamp: 'Ieri 18:30',
          type: 'text' as const,
        },
        {
          id: 2,
          text: 'È ancora disponibile?',
          senderId: 'other',
          timestamp: 'Ieri 18:31',
          type: 'text' as const,
        },
      ],
    },
    {
      id: 3,
      userName: 'Giulia B.',
      userAvatar: '',
      lastMessage: 'Grazie mille!',
      timestamp: '2 giorni fa',
      unreadCount: 0,
      isVerified: false,
      productTitle: 'Peluche coniglietto morbido',
      productImage: 'https://images.unsplash.com/photo-1615486363973-f79d875780cf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200',
      messages: [
        {
          id: 1,
          text: 'Scambio completato',
          senderId: 'system',
          timestamp: '2 giorni fa',
          type: 'system' as const,
        },
        {
          id: 2,
          text: 'Grazie mille!',
          senderId: 'other',
          timestamp: '2 giorni fa 16:20',
          type: 'text' as const,
        },
      ],
    },
  ];

  const handleSearch = (query: string) => {
    console.log('Searching for:', query);
  };

  const selectedProductData = mockToys.find(toy => toy.id === selectedProduct);
  const selectedChatData = mockChats.find(chat => chat.id === selectedChat);

  if (selectedChatData) {
    return (
      <ChatWindow
        chatId={selectedChatData.id}
        userName={selectedChatData.userName}
        isVerified={selectedChatData.isVerified}
        productTitle={selectedChatData.productTitle}
        productImage={selectedChatData.productImage}
        messages={selectedChatData.messages}
        onBack={() => setSelectedChat(null)}
      />
    );
  }

  // Product Detail Modal (Desktop uses modal, Mobile uses full screen)
  const ProductDetailComponent = () => {
    if (!selectedProductData) return null;

    return (
      <>
        {/* Desktop: Modal */}
        <div className="hidden lg:block">
          <ProductDetailDesktop
            product={selectedProductData}
            onClose={() => setSelectedProduct(null)}
          />
        </div>

        {/* Mobile: Full Screen */}
        <div className="lg:hidden">
          <ProductDetail
            product={selectedProductData}
            onBack={() => setSelectedProduct(null)}
          />
        </div>
      </>
    );
  };

  if (activeTab === 'messages') {
    return (
      <>
        <ProductDetailComponent />
        <div className="flex h-screen">
          <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Mobile View */}
        <div className="flex-1 lg:hidden">
          {selectedChatData ? (
            <ChatWindow
              chatId={selectedChatData.id}
              userName={selectedChatData.userName}
              isVerified={selectedChatData.isVerified}
              productTitle={selectedChatData.productTitle}
              productImage={selectedChatData.productImage}
              messages={selectedChatData.messages}
              onBack={() => setSelectedChat(null)}
            />
          ) : (
            <ChatList chats={mockChats} onChatSelect={setSelectedChat} />
          )}
        </div>

        {/* Desktop View */}
        <div className="hidden lg:flex flex-1">
          <ChatListDesktop
            chats={mockChats}
            selectedChatId={selectedChat}
            onChatSelect={setSelectedChat}
          />
          {selectedChatData ? (
            <ChatWindowDesktop
              userName={selectedChatData.userName}
              isVerified={selectedChatData.isVerified}
              productTitle={selectedChatData.productTitle}
              productImage={selectedChatData.productImage}
              messages={selectedChatData.messages}
            />
          ) : (
            <div className="flex-1 flex items-center justify-center bg-background/50">
              <div className="text-center">
                <div className="w-20 h-20 bg-[var(--pastel-purple)] rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageCircle size={32} className="text-foreground/60" />
                </div>
                <h3 className="mb-2">Seleziona una conversazione</h3>
                <p className="text-muted-foreground text-sm">
                  Scegli una chat dalla lista per iniziare a messaggiare
                </p>
              </div>
            </div>
          )}
        </div>

        <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
        </div>
      </>
    );
  }

  return (
    <>
      <ProductDetailComponent />
      <div className="flex min-h-screen">
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
        <div className="flex-1 bg-background pb-20 lg:pb-0">
      <header className="sticky top-0 bg-background/95 backdrop-blur-sm border-b border-border z-10">
        <div className="max-w-screen-xl mx-auto px-4 lg:px-8 py-4 lg:py-6">
          <div className="flex items-center justify-between mb-4 lg:hidden">
            <h1 className="bg-gradient-to-r from-[var(--pastel-pink)] via-[var(--pastel-lavender)] to-[var(--pastel-mint)] bg-clip-text text-transparent">
              Toy Store
            </h1>
            <span className="text-sm text-muted-foreground">Milano</span>
          </div>
          <SearchBar
            onSearch={handleSearch}
            onFilterClick={() => setFilterOpen(true)}
          />
        </div>
      </header>

      <main className="max-w-screen-xl mx-auto px-4 lg:px-8 py-6">
        <FeaturedSection />

        <section aria-label="Annunci di giocattoli disponibili">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg">Annunci vicino a te</h2>
            <button
              className="text-sm text-primary hover:underline"
              aria-label="Visualizza tutti gli annunci"
            >
              Vedi tutti
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {mockToys.map((toy) => (
              <button
                key={toy.id}
                onClick={() => setSelectedProduct(toy.id)}
                className="text-left"
                aria-label={`Visualizza dettagli di ${toy.title}`}
              >
                <ToyCard {...toy} />
              </button>
            ))}
          </div>
        </section>

        <section className="mt-8 bg-gradient-to-br from-[var(--pastel-purple)] to-[var(--pastel-peach)] rounded-2xl p-6 lg:p-8 text-center" aria-labelledby="cta-heading">
          <h2 id="cta-heading" className="mb-2">
            Hai giocattoli da scambiare?
          </h2>
          <p className="text-sm text-foreground/80 mb-4 max-w-lg mx-auto">
            Pubblica il tuo annuncio e trova nuovi amici per i tuoi giochi
          </p>
          <button className="px-6 py-3 bg-primary text-primary-foreground rounded-[var(--radius)] hover:opacity-90 transition-opacity">
            Crea annuncio
          </button>
        </section>
      </main>

      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
      <FilterSheet open={filterOpen} onClose={() => setFilterOpen(false)} />
        </div>
      </div>
    </>
  );
}