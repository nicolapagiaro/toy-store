import { X } from 'lucide-react';
import * as Dialog from '@radix-ui/react-dialog';

interface FilterSheetProps {
  open: boolean;
  onClose: () => void;
}

export function FilterSheet({ open, onClose }: FilterSheetProps) {
  return (
    <Dialog.Root open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
        <Dialog.Content
          className="fixed bottom-0 left-0 right-0 bg-card rounded-t-3xl p-6 max-h-[85vh] overflow-y-auto focus:outline-none"
        >
          <div className="flex justify-between items-center mb-6">
            <Dialog.Title className="text-xl font-medium">
              Filtri di ricerca
            </Dialog.Title>
            <Dialog.Close asChild>
              <button
                className="p-2 hover:bg-accent rounded-full transition-colors"
                aria-label="Chiudi filtri"
              >
                <X size={24} />
              </button>
            </Dialog.Close>
          </div>

          <Dialog.Description className="sr-only">
            Usa i filtri per raffinare la tua ricerca di giocattoli
          </Dialog.Description>

          <div className="space-y-6">
            <div>
              <label className="block mb-3">Distanza massima</label>
              <div className="flex gap-2">
                {['5 km', '10 km', '25 km', '50 km'].map((distance) => (
                  <button
                    key={distance}
                    className="flex-1 py-2 px-3 bg-[var(--pastel-mint)] rounded-lg hover:opacity-80 transition-opacity"
                  >
                    {distance}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block mb-3">Fascia d'età</label>
              <div className="grid grid-cols-3 gap-2">
                {['0-2 anni', '3-5 anni', '6-10 anni'].map((age) => (
                  <button
                    key={age}
                    className="py-3 px-3 bg-[var(--pastel-lavender)] rounded-lg hover:opacity-80 transition-opacity text-sm"
                  >
                    {age}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block mb-3">Condizione</label>
              <div className="grid grid-cols-2 gap-2">
                {['Come nuovo', 'Ottime condizioni', 'Buone condizioni', 'Usato'].map((cond) => (
                  <button
                    key={cond}
                    className="py-3 px-3 bg-[var(--pastel-yellow)] rounded-lg hover:opacity-80 transition-opacity text-sm"
                  >
                    {cond}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block mb-3">Tipo di annuncio</label>
              <div className="flex gap-2">
                {['Scambio', 'Vendita', 'Entrambi'].map((type) => (
                  <button
                    key={type}
                    className="flex-1 py-3 px-3 bg-[var(--pastel-peach)] rounded-lg hover:opacity-80 transition-opacity"
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-8 flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-3 px-4 bg-muted text-foreground rounded-[var(--radius)] hover:opacity-80 transition-opacity"
            >
              Reset
            </button>
            <button
              onClick={onClose}
              className="flex-1 py-3 px-4 bg-primary text-primary-foreground rounded-[var(--radius)] hover:opacity-90 transition-opacity"
            >
              Applica filtri
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
