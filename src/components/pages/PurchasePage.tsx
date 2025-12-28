import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { BaseCrudService } from '@/integrations';
import { ContentSubmissions } from '@/entities';
import { CreditCard, Wallet } from 'lucide-react';

export default function PurchasePage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [contentFile, setContentFile] = useState<File | null>(null);
  const [ageConfirmed, setAgeConfirmed] = useState(false);
  const [contentConfirmed, setContentConfirmed] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'paypal' | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setContentFile(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (!email || !contentFile || !ageConfirmed || !contentConfirmed || !paymentMethod) {
      alert('Por favor completa todos los campos y confirmaciones requeridas');
      return;
    }

    setIsProcessing(true);

    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));

    const paymentConfirmationId = `PAY-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Create submission
    const submission: ContentSubmissions = {
      _id: crypto.randomUUID(),
      userEmail: email,
      submittedContent: 'https://static.wixstatic.com/media/5ad9e7_ca46191dc03f4676b722449480c20b41~mv2.png?originWidth=768&originHeight=576',
      reviewStatus: 'pending',
      ageAndContentConfirmed: true,
      submissionDate: new Date().toISOString(),
      paymentConfirmationId,
      moderatorNotes: ''
    };

    await BaseCrudService.create('contentsubmissions', submission);

    setIsProcessing(false);
    navigate('/confirmation', { state: { confirmationId: paymentConfirmationId } });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1 pt-32 pb-16">
        <div className="max-w-[100rem] mx-auto px-8">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="font-heading text-6xl text-soft-white mb-4">
                Comprar 1 Minuto
              </h1>
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

              {/* Email Input */}
              <div className="space-y-2">
                <Label htmlFor="email" className="font-paragraph text-base text-soft-white">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@email.com"
                  className="bg-background border-soft-white/20 text-soft-white font-paragraph"
                />
              </div>

              {/* File Upload */}
              <div className="space-y-20">
                <Label htmlFor="content" className="font-paragraph text-base text-soft-white">
                  Subir Imagen o Video
                </Label>
                <Input
                  id="content"
                  type="file"
                  accept="image/*,video/*"
                  onChange={handleFileChange}
                  className="bg-background border-soft-white/20 text-soft-white font-paragraph file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-primary file:text-primary-foreground file:font-paragraph file:text-sm hover:file:bg-primary/90"
                />
                {contentFile && (
                  <p className="font-paragraph text-sm text-soft-white/60">
                    Archivo seleccionado: {contentFile.name}
                  </p>
                )}
              </div>

              {/* Age Confirmation */}
              <div className="flex items-start gap-3 p-4 bg-primary/10 border border-primary/30 rounded-lg">
                <Checkbox
                  id="age"
                  checked={ageConfirmed}
                  onCheckedChange={(checked) => setAgeConfirmed(checked as boolean)}
                  className="mt-1"
                />
                <Label
                  htmlFor="age"
                  className="font-paragraph text-sm text-soft-white cursor-pointer leading-relaxed"
                >
                  Confirmo que soy mayor de 18 años y que tengo derecho legal para usar este servicio
                </Label>
              </div>

              {/* Content Confirmation */}
              <div className="flex items-start gap-3 p-4 bg-primary/10 border border-primary/30 rounded-lg">
                <Checkbox
                  id="content"
                  checked={contentConfirmed}
                  onCheckedChange={(checked) => setContentConfirmed(checked as boolean)}
                  className="mt-1"
                />
                <Label
                  htmlFor="content"
                  className="font-paragraph text-sm text-soft-white cursor-pointer leading-relaxed"
                >
                  Confirmo que mi contenido NO involucra menores de edad bajo ninguna circunstancia y que asumo total responsabilidad legal por el contenido que subo
                </Label>
              </div>

              {/* Review Notice */}
              <div className="p-4 bg-soft-white/5 border border-soft-white/10 rounded-lg">
                <p className="font-paragraph text-sm text-soft-white/80 text-center">
                  Tu contenido será revisado antes de mostrarse públicamente. Recibirás una confirmación por email.
                </p>
              </div>

              {/* Price and Submit */}
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-soft-white/5 rounded-lg">
                  <span className="font-paragraph text-lg text-soft-white">Total</span>
                  <span className="font-heading text-3xl text-primary">$3.00 USD</span>
                </div>
                <Button
                  onClick={handleSubmit}
                  disabled={!email || !contentFile || !ageConfirmed || !contentConfirmed || !paymentMethod || isProcessing}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-paragraph text-lg py-6 rounded-lg h-auto disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? 'Procesando...' : 'Pagar y Enviar'}
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
