import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-background border-t border-soft-white/10 py-16">
      <div className="max-w-[120rem] mx-auto px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="font-paragraph text-sm text-soft-white/60">© 2026 The Slotety. Todos los derechos reservados.</div>
          <div className="flex gap-8">
            <Link 
              to="/privacy" 
              className="font-paragraph text-sm text-soft-white/80 hover:text-primary transition-colors"
            >
              Política de Privacidad
            </Link>
            <Link 
              to="/terms" 
              className="font-paragraph text-sm text-soft-white/80 hover:text-primary transition-colors"
            >
              Términos de Servicio
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
