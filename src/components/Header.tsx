import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b border-soft-white/10">
      <div className="max-w-[120rem] mx-auto px-8 py-6 flex justify-between items-center">
        <Link to="/" className="font-heading text-3xl text-soft-white hover:text-primary transition-colors">
          1 Minuto
        </Link>
        <div className="flex items-center gap-6">
          <span className="font-paragraph text-sm text-primary border border-primary px-4 py-2 rounded-lg">
            +18 SOLO ADULTOS
          </span>
        </div>
      </div>
    </header>
  );
}
