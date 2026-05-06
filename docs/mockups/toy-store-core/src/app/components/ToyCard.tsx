import { MapPin, BadgeCheck } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface ToyCardProps {
  title: string;
  distance: string;
  ageRange: string;
  condition: string;
  imageUrl: string;
  isVerified: boolean;
  price?: string;
}

export function ToyCard({
  title,
  distance,
  ageRange,
  condition,
  imageUrl,
  isVerified,
  price
}: ToyCardProps) {
  return (
    <article
      className="bg-card rounded-[var(--radius)] overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
      aria-label={`Annuncio: ${title}`}
    >
      <div className="relative aspect-square overflow-hidden">
        <ImageWithFallback
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-2 right-2 bg-white/95 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1">
          <MapPin size={12} className="text-muted-foreground" aria-hidden="true" />
          <span className="text-xs">{distance}</span>
        </div>
        {isVerified && (
          <div
            className="absolute top-2 left-2 bg-[var(--verified-badge)] text-white px-2 py-1 rounded-full flex items-center gap-1"
            aria-label="Utente verificato"
          >
            <BadgeCheck size={14} aria-hidden="true" />
            <span className="text-xs">Verificato</span>
          </div>
        )}
      </div>

      <div className="p-3">
        <h3 className="mb-1 line-clamp-2">{title}</h3>

        <div className="flex flex-wrap gap-1.5 mb-2">
          <span
            className="inline-block bg-[var(--pastel-lavender)] text-foreground px-2 py-0.5 rounded-full text-xs"
            aria-label={`Età consigliata: ${ageRange}`}
          >
            {ageRange}
          </span>
          <span
            className="inline-block bg-[var(--pastel-yellow)] text-foreground px-2 py-0.5 rounded-full text-xs"
            aria-label={`Condizione: ${condition}`}
          >
            {condition}
          </span>
        </div>

        {price && (
          <p className="text-primary font-medium" aria-label={`Prezzo: ${price}`}>
            {price}
          </p>
        )}
        {!price && (
          <p className="text-secondary font-medium">Scambio</p>
        )}
      </div>
    </article>
  );
}
