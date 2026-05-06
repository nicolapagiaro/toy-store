import { ArrowLeft, MapPin, BadgeCheck, Heart, Share2, Star, MessageCircle, X } from 'lucide-react';
import { useState } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import * as Dialog from '@radix-ui/react-dialog';

interface ProductDetailDesktopProps {
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
  onClose: () => void;
}

export function ProductDetailDesktop({ product, onClose }: ProductDetailDesktopProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);

  return (
    <Dialog.Root open={true} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" />
        <Dialog.Content
          className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[95vw] max-w-6xl h-[90vh] bg-card rounded-2xl overflow-hidden shadow-2xl z-50 focus:outline-none"
          aria-describedby="product-description"
        >
          <div className="flex h-full">
            {/* Left: Images */}
            <div className="w-1/2 bg-muted flex flex-col">
              <div className="relative flex-1">
                <ImageWithFallback
                  src={product.images[currentImageIndex]}
                  alt={`${product.title} - immagine ${currentImageIndex + 1} di ${product.images.length}`}
                  className="w-full h-full object-contain"
                />
                {product.isVerified && (
                  <div
                    className="absolute top-6 left-6 bg-[var(--verified-badge)] text-white px-4 py-2 rounded-full flex items-center gap-2"
                    aria-label="Venditore verificato"
                  >
                    <BadgeCheck size={20} aria-hidden="true" />
                    <span>Verificato</span>
                  </div>
                )}
              </div>

              {/* Thumbnails */}
              {product.images.length > 1 && (
                <div className="flex gap-3 p-6 overflow-x-auto bg-background/50 backdrop-blur-sm">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                        currentImageIndex === index
                          ? 'border-primary ring-2 ring-primary/20'
                          : 'border-transparent hover:border-border'
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
            </div>

            {/* Right: Details */}
            <div className="w-1/2 flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between px-8 py-6 border-b border-border">
                <Dialog.Title className="text-2xl font-medium">{product.title}</Dialog.Title>
                <div className="flex gap-2">
                  <button
                    onClick={() => setIsFavorite(!isFavorite)}
                    className="p-2 hover:bg-accent rounded-lg transition-colors"
                    aria-label={isFavorite ? 'Rimuovi dai preferiti' : 'Aggiungi ai preferiti'}
                  >
                    <Heart
                      size={24}
                      className={isFavorite ? 'fill-[var(--pastel-pink)] text-[var(--pastel-pink)]' : ''}
                    />
                  </button>
                  <button
                    className="p-2 hover:bg-accent rounded-lg transition-colors"
                    aria-label="Condividi annuncio"
                  >
                    <Share2 size={24} />
                  </button>
                  <Dialog.Close asChild>
                    <button
                      className="p-2 hover:bg-accent rounded-lg transition-colors"
                      aria-label="Chiudi"
                    >
                      <X size={24} />
                    </button>
                  </Dialog.Close>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto px-8 py-6">
                <Dialog.Description id="product-description" className="sr-only">
                  Dettagli completi del prodotto {product.title}
                </Dialog.Description>

                {/* Price & Location */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-3">
                    {product.price ? (
                      <span className="text-3xl font-medium text-primary">{product.price}</span>
                    ) : (
                      <span className="text-2xl font-medium text-secondary">Scambio</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin size={18} aria-hidden="true" />
                    <span>{product.location} · {product.distance}</span>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-6">
                  <span className="inline-block bg-[var(--pastel-lavender)] text-foreground px-4 py-2 rounded-full">
                    {product.ageRange}
                  </span>
                  <span className="inline-block bg-[var(--pastel-yellow)] text-foreground px-4 py-2 rounded-full">
                    {product.condition}
                  </span>
                  <span className="inline-block bg-[var(--pastel-peach)] text-foreground px-4 py-2 rounded-full">
                    {product.category}
                  </span>
                </div>

                {/* Description */}
                <div className="mb-6">
                  <h3 className="mb-3">Descrizione</h3>
                  <p className="text-foreground/80 leading-relaxed">{product.description}</p>
                </div>

                {/* Seller Info */}
                <div className="mb-6 p-5 bg-accent/30 rounded-xl">
                  <h3 className="mb-4">Venditore</h3>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-[var(--pastel-pink)] to-[var(--pastel-lavender)] rounded-full flex items-center justify-center text-2xl">
                      {product.sellerName.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-medium text-lg">{product.sellerName}</span>
                        {product.isVerified && (
                          <BadgeCheck
                            size={18}
                            className="text-[var(--verified-badge)]"
                            aria-label="Verificato"
                          />
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Star size={16} className="fill-[var(--pastel-yellow)] text-[var(--pastel-yellow)]" aria-hidden="true" />
                          <span>{product.sellerRating.toFixed(1)}</span>
                        </div>
                        <span>·</span>
                        <span>{product.sellerReviews} recensioni</span>
                      </div>
                    </div>
                    <button className="px-5 py-2.5 bg-card border border-border rounded-lg hover:bg-accent transition-colors">
                      Visualizza profilo
                    </button>
                  </div>
                </div>

                {/* Posted Date */}
                <p className="text-sm text-muted-foreground">
                  Pubblicato il {product.postedDate}
                </p>
              </div>

              {/* Footer Actions */}
              <div className="px-8 py-6 border-t border-border">
                <div className="flex gap-3">
                  <button className="flex-1 py-3.5 px-6 bg-secondary text-secondary-foreground rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
                    <Share2 size={20} aria-hidden="true" />
                    <span>Proponi scambio</span>
                  </button>
                  <button className="flex-1 py-3.5 px-6 bg-primary text-primary-foreground rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
                    <MessageCircle size={20} aria-hidden="true" />
                    <span>Contatta venditore</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
