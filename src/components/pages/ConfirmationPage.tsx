import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';

export default function ConfirmationPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const confirmationId = location.state?.confirmationId;

  useEffect(() => {
    if (!confirmationId) {
      navigate('/');
    }
  }, [confirmationId, navigate]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1 flex items-center justify-center pt-24 pb-16">
        <div className="max-w-[100rem] w-full px-8">
          <div className="max-w-2xl mx-auto text-center space-y-8">
            <CheckCircle className="w-24 h-24 mx-auto text-primary" />
            
            <div className="space-y-4">
              <h1 className="font-heading text-6xl text-soft-white">
                ¡Pago Confirmado!
              </h1>
              <p className="font-paragraph text-xl text-soft-white/80">
                Tu contenido está en revisión
              </p>
            </div>

            <div className="bg-soft-white/5 border border-soft-white/10 rounded-2xl p-8 space-y-6">
              <div className="space-y-2">
                <p className="font-paragraph text-sm text-soft-white/60">
                  ID de Confirmación
                </p>
                <p className="font-paragraph text-lg text-soft-white font-mono">
                  {confirmationId}
                </p>
              </div>

              <div className="space-y-4 text-left">
                <p className="font-paragraph text-base text-soft-white">
                  ¿Qué sigue?
                </p>
                <ul className="font-paragraph text-sm text-soft-white/80 space-y-2 list-disc list-inside">
                  <li>Tu contenido se mostrará durante 60 segundos a todos los visitantes</li>
                  <li>Se publicará cuando termine el contenido actual</li>
                </ul>
              </div>

              <div className="p-4 bg-primary/10 border border-primary/30 rounded-lg">
                <p className="font-paragraph text-sm text-soft-white/80">
                  Recuerda: El pago es único y no reembolsable. Solo se mostrará contenido que cumpla con nuestras políticas de uso.
                </p>
              </div>
            </div>

            <Button
              onClick={() => navigate('/')}
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-paragraph text-lg px-8 py-6 rounded-lg h-auto"
            >
              Volver al Inicio
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
