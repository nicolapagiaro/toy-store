import { TrendingUp, Users, Award } from 'lucide-react';

export function FeaturedSection() {
  const stats = [
    {
      icon: Users,
      value: '2.500+',
      label: 'Genitori attivi',
      color: 'var(--pastel-pink)',
    },
    {
      icon: TrendingUp,
      value: '5.000+',
      label: 'Scambi completati',
      color: 'var(--pastel-mint)',
    },
    {
      icon: Award,
      value: '98%',
      label: 'Soddisfazione',
      color: 'var(--pastel-lavender)',
    },
  ];

  return (
    <section className="hidden lg:block mb-8" aria-labelledby="stats-heading">
      <h2 id="stats-heading" className="sr-only">Statistiche della community</h2>
      <div className="grid grid-cols-3 gap-4">
        {stats.map(({ icon: Icon, value, label, color }) => (
          <div
            key={label}
            className="bg-card border border-border rounded-xl p-6 text-center hover:shadow-md transition-shadow"
          >
            <div
              className="w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center"
              style={{ backgroundColor: `${color}40` }}
            >
              <Icon size={24} style={{ color }} aria-hidden="true" />
            </div>
            <p className="text-2xl font-medium mb-1">{value}</p>
            <p className="text-sm text-muted-foreground">{label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
