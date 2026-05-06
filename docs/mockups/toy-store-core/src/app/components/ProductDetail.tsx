import { ArrowLeft, MapPin, BadgeCheck, Heart, Share2, Star, MessageCircle } from 'lucide-react';
import { useState } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface ProductDetailProps {
  product: {
    id: number;
    title: string;
    description: string;
    distance: string;
    ageRange: string;
    condition: string;
    images: string[];
    isVerified: boolean;
    price?: string;
    sellerName: string;
    sellerRating: number;
    sellerReviews: number;
    location: string;
    category: string;
    postedDate: string;
  };
  onBack: () => void;
}

export function ProductDetail({ product, onBack }: ProductDetailProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 bg-background/95 backdrop-blur-sm border-b border-border z-10">
        <div className="flex items-center justify-between px-4 py-3">
          <button
            onClick={onBack}
            className="p-2 hover:bg-accent rounded-full transition-colors"
            aria-label="Torna indietro"
          >
            <ArrowLeft size={24} />
          </button>
          <div className="flex gap-2">
            <button
              onClick={() => setIsFavorite(!isFavorite)}
              className="p-2 hover:bg-accent rounded-full transition-colors"
              aria-label={isFavorite ? 'Rimuovi dai preferiti' : 'Aggiungi ai preferiti'}
            >
              <Heart
                size={24}
                className={isFavorite ? 'fill-[var(--pastel-pink)] text-[var(--pastel-pink)]' : ''}
              />
            </button>
            <button
              className="p-2 hover:bg-accent rounded-full transition-colors"
              aria-label="Condividi annuncio"
            >
              <Share2 size={24} />
            </button>
          </div>
        </div>
      </header>

      {/* Image Gallery */}
      <section aria-label="Galleria immagini prodotto">
        <div className="relative aspect-square bg-muted">
          <ImageWithFallback
            src={product.images[currentImageIndex]}
            alt={`${product.title} - immagine ${currentImageIndex + 1} di ${product.images.length}`}
            className="w-full h-full object-cover"
          />
          {product.isVerified && (
            <div
              className="absolute top-4 left-4 bg-[var(--verified-badge)] text-white px-3 py-1.5 rounded-full flex items-center gap-1.5"
              aria-label="Venditore verificato"
            >
              <BadgeCheck size={16} aria-hidden="true" />
              <span className="text-sm">Verificato</span>
            </div>
          )}
        </div>

        {/* Image Thumbnails */}
        {product.images.length > 1 && (
          <div className="flex gap-2 px-4 py-3 overflow-x-auto">
            {product.images.map((image, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                  currentImageIndex === index
                    ? 'border-primary ring-2 ring-primary/20'
                    : 'border-transparent'
                }`}
                aria-label={`Visualizza immagine ${index + 1}`}
                aria-current={currentImageIndex === index}
              >
                <ImageWithFallback
                  src={image}
                  alt=""
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </section>

      {/* Product Info */}
      <main className="px-4 pb-32">
        {/* Price & Title */}
        <div className="py-4 border-b border-border">
          <div className="flex items-start justify-between mb-2">
            <h1 className="flex-1 pr-4">{product.title}</h1>
            {product.price ? (
              <span className="text-2xl font-medium text-primary">{product.price}</span>
            ) : (
              <span className="text-lg font-medium text-secondary">Scambio</span>
            )}
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin size={16} aria-hidden="true" />
            <span>{product.location} · {product.distance}</span>
          </div>
        </div>

        {/* Tags */}
        <div className="py-4 border-b border-border">
          <div className="flex flex-wrap gap-2">
            <span
              className="inline-block bg-[var(--pastel-lavender)] text-foreground px-3 py-1.5 rounded-full text-sm"
              aria-label={`Età consigliata: ${product.ageRange}`}
            >
              {product.ageRange}
            </span>
            <span
              className="inline-block bg-[var(--pastel-yellow)] text-foreground px-3 py-1.5 rounded-full text-sm"
              aria-label={`Condizione: ${product.condition}`}
            >
              {product.condition}
            </span>
            <span
              className="inline-block bg-[var(--pastel-peach)] text-foreground px-3 py-1.5 rounded-full text-sm"
              aria-label={`Categoria: ${product.category}`}
            >
              {product.category}
            </span>
          </div>
        </div>

        {/* Description */}
        <div className="py-4 border-b border-border">
          <h2 className="mb-2">Descrizione</h2>
          <p className="text-foreground/80 leading-relaxed">{product.description}</p>
        </div>

        {/* Seller Info */}
        <div className="py-4 border-b border-border">
          <h2 className="mb-3">Venditore</h2>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-[var(--pastel-pink)] to-[var(--pastel-lavender)] rounded-full flex items-center justify-center text-xl">
              {product.sellerName.charAt(0)}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium">{product.sellerName}</span>
                {product.isVerified && (
                  <BadgeCheck
                    size={16}
                    className="text-[var(--verified-badge)]"
                    aria-label="Verificato"
                  />
                )}
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Star size={14} className="fill-[var(--pastel-yellow)] text-[var(--pastel-yellow)]" aria-hidden="true" />
                  <span>{product.sellerRating.toFixed(1)}</span>
                </div>
                <span>·</span>
                <span>{product.sellerReviews} recensioni</span>
              </div>
            </div>
            <button
              className="px-4 py-2 bg-accent rounded-lg hover:bg-accent/80 transition-colors text-sm"
              aria-label={`Visualizza profilo di ${product.sellerName}`}
            >
              Profilo
            </button>
          </div>
        </div>

        {/* Posted Date */}
        <div className="py-4">
          <p className="text-sm text-muted-foreground">
            Pubblicato il {product.postedDate}
          </p>
        </div>
      </main>

      {/* Fixed Bottom Actions */}
      <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border p-4 pb-safe">
        <div className="flex gap-3 max-w-screen-xl mx-auto">
          <button
            className="flex-1 py-3 px-4 bg-secondary text-secondary-foreground rounded-[var(--radius)] hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
            aria-label="Proponi uno scambio"
          >
            <Share2 size={20} aria-hidden="true" />
            <span>Proponi scambio</span>
          </button>
          <button
            className="flex-1 py-3 px-4 bg-primary text-primary-foreground rounded-[var(--radius)] hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
            aria-label="Invia messaggio al venditore"
          >
            <MessageCircle size={20} aria-hidden="true" />
            <span>Contatta</span>
          </button>
        </div>
      </div>
    </div>
  );
}
