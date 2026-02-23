import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { CreditCard, Wallet, CheckCircle } from 'lucide-react';

export default function PurchasePage() {
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'paypal' | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const handleSubmit = async () => {
    if (!paymentMethod) {
      alert('Por favor selecciona un método de pago');
      return;
    }

    setIsProcessing(true);

    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));

    setIsProcessing(false);
    setPaymentSuccess(true);
    
    // Redirect to upload page after successful payment
    setTimeout(() => {
      navigate('/upload');
    }, 2000);
  };

  if (paymentSuccess) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1 pt-32 pb-16 flex items-center justify-center">
          <div className="max-w-2xl mx-auto text-center px-8">
            <CheckCircle className="w-24 h-24 text-primary mx-auto mb-6" />
            <h1 className="font-heading text-6xl text-soft-white mb-4">¡Pago Exitoso!</h1>
            <p className="font-paragraph text-xl text-soft-white/80 mb-8">
              Tu pago de $3.00 USD ha sido procesado. Ahora puedes subir tu contenido.
            </p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 pt-32 pb-16">
        <div className="max-w-[100rem] mx-auto px-8">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="font-heading text-6xl text-soft-white mb-4">Comprar</h1>
              <p className="font-paragraph text-xl text-soft-white/80">
                Tu contenido será visible para todos durante 60 segundos
              </p>
            </div>

            <div className="space-y-8 bg-soft-white/5 border border-soft-white/10 rounded-2xl p-8">
              {/* Payment Method Selection */}
              <div className="space-y-4">
                <Label className="font-paragraph text-base text-soft-white">
                  Método de Pago
                </Label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setPaymentMethod('card')}
                    className={`p-6 rounded-lg border-2 transition-all ${
                      paymentMethod === 'card'
                        ? 'border-primary bg-primary/10'
                        : 'border-soft-white/20 hover:border-soft-white/40'
                    }`}
                  >
                    <CreditCard className="w-8 h-8 mx-auto mb-2 text-soft-white" />
                    <p className="font-paragraph text-sm text-soft-white">
                      Tarjeta de Crédito/Débito
                    </p>
                  </button>
                  <button
                    onClick={() => setPaymentMethod('paypal')}
                    className={`p-6 rounded-lg border-2 transition-all ${
                      paymentMethod === 'paypal'
                        ? 'border-primary bg-primary/10'
                        : 'border-soft-white/20 hover:border-soft-white/40'
                    }`}
                  >
                    <Wallet className="w-8 h-8 mx-auto mb-2 text-soft-white" />
                    <p className="font-paragraph text-sm text-soft-white">
                      PayPal
                    </p>
                  </button>
                </div>
              </div>

              {/* Price and Submit */}
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-soft-white/5 rounded-lg">
                  <span className="font-paragraph text-lg text-soft-white">Total</span>
                  <span className="font-heading text-3xl text-primary-foreground">$3.00 USD</span>
                </div>
                <Button
                  onClick={handleSubmit}
                  disabled={!paymentMethod || isProcessing}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-paragraph text-lg py-6 rounded-lg h-auto disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? 'Procesando...' : 'Pagar y Continuar'}
                </Button>
                <p className="font-paragraph text-xs text-soft-white/60 text-center">
                  Pago único y no reembolsable
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
