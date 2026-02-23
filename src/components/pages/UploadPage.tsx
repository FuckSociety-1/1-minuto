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
import { Upload, CheckCircle, AlertCircle } from 'lucide-react';

// Google Vision API for nudity detection
const detectNudity = async (imageDataUrl: string): Promise<boolean> => {
  try {
    const response = await fetch('https://vision.googleapis.com/v1/images:annotate?key=AIzaSyDYY_qWWWWWWWWWWWWWWWWWWWWWWWWWWW', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        requests: [{
          image: { content: imageDataUrl.split(',')[1] },
          features: [{ type: 'SAFE_SEARCH_DETECTION' }]
        }]
      })
    });
    
    const data = await response.json();
    const safeSearch = data.responses?.[0]?.safeSearchAnnotation;
    
    // Check if nudity likelihood is HIGH or VERY_HIGH
    if (safeSearch?.nude === 'HIGH' || safeSearch?.nude === 'VERY_HIGH') {
      return true; // Nudity detected
    }
    return false;
  } catch (error) {
    console.error('Error checking nudity:', error);
    return false; // Allow if check fails
  }
};

export default function UploadPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [contentFile, setContentFile] = useState<File | null>(null);
  const [ageConfirmed, setAgeConfirmed] = useState(false);
  const [contentConfirmed, setContentConfirmed] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [nudityDetected, setNudityDetected] = useState(false);
  const [hasPaid, setHasPaid] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setContentFile(e.target.files[0]);
      setNudityDetected(false);
    }
  };

  const handleSubmit = async () => {
    if (!email || !contentFile || !ageConfirmed || !contentConfirmed) {
      alert('Por favor completa todos los campos y confirmaciones requeridas');
      return;
    }

    setIsProcessing(true);

    // Convert file to data URL
    const reader = new FileReader();
    reader.onload = async (e) => {
      const fileContent = e.target?.result as string;
      
      // Check for nudity (only for images)
      if (contentFile.type.startsWith('image/')) {
        const hasNudity = await detectNudity(fileContent);
        if (hasNudity) {
          setNudityDetected(true);
          setIsProcessing(false);
          return;
        }
      }

      const paymentConfirmationId = hasPaid 
        ? `PAID-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
        : `FREE-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      // Create submission with actual uploaded file
      const submission: ContentSubmissions = {
        _id: crypto.randomUUID(),
        userEmail: email,
        submittedContent: fileContent,
        reviewStatus: 'approved',
        ageAndContentConfirmed: true,
        submissionDate: new Date().toISOString(),
        paymentConfirmationId,
        moderatorNotes: hasPaid ? 'Paid upload' : 'Free upload - no payment required'
      };

      await BaseCrudService.create('contentsubmissions', submission);

      setIsProcessing(false);
      setUploadSuccess(true);

      // Redirect to confirmation after 2 seconds
      setTimeout(() => {
        navigate('/confirmation', { state: { confirmationId: paymentConfirmationId } });
      }, 2000);
    };
    reader.readAsDataURL(contentFile);
  };

  if (nudityDetected) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1 pt-32 pb-16 flex items-center justify-center">
          <div className="max-w-2xl mx-auto text-center px-8">
            <AlertCircle className="w-24 h-24 text-destructive mx-auto mb-6" />
            <h1 className="font-heading text-6xl text-soft-white mb-4">Contenido Rechazado</h1>
            <p className="font-paragraph text-xl text-soft-white/80 mb-8">
              Tu contenido contiene desnudez y no cumple con nuestras políticas de moderación. Por favor, sube contenido diferente.
            </p>
            <Button
              onClick={() => {
                setNudityDetected(false);
                setContentFile(null);
                setIsProcessing(false);
              }}
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-paragraph text-lg px-10 py-6 rounded-lg"
            >
              Intentar de Nuevo
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (uploadSuccess) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1 pt-32 pb-16 flex items-center justify-center">
          <div className="max-w-2xl mx-auto text-center px-8">
            <CheckCircle className="w-24 h-24 text-primary mx-auto mb-6" />
            <h1 className="font-heading text-6xl text-soft-white mb-4">¡Enviado!</h1>
            <p className="font-paragraph text-xl text-soft-white/80 mb-8">
              Tu contenido ha sido enviado exitosamente y será visible en el escenario.
            </p>
            <Button
              onClick={() => navigate('/')}
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-paragraph text-lg px-10 py-6 rounded-lg"
            >
              Volver al Inicio
            </Button>
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
              <h1 className="font-heading text-6xl text-soft-white mb-4">Subir Contenido</h1>
              <p className="font-paragraph text-xl text-soft-white/80">
                Tu contenido será visible para todos durante 60 segundos. Sube una imagen o video.
              </p>
            </div>

            <div className="space-y-8 bg-soft-white/5 border border-soft-white/10 rounded-2xl p-8">
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
              <div className="space-y-4">
                <label htmlFor="content" className="block cursor-pointer">
                  <input
                    id="content"
                    type="file"
                    accept="image/*,video/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <div className="border-2 border-dashed border-soft-white/30 rounded-lg p-12 text-center hover:border-soft-white/50 transition-colors">
                    <Upload className="w-12 h-12 text-primary mx-auto mb-4" />
                    <p className="font-paragraph text-soft-white/70 mb-2">
                      {contentFile ? contentFile.name : 'Seleccionar Imagen o Video'}
                    </p>
                    <p className="font-paragraph text-xs text-soft-white/50">
                      Arrastra o haz clic para seleccionar
                    </p>
                  </div>
                </label>
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
                  Confirmo que tengo al menos 18 años de edad y que he leído y acepto los Términos del Servicio y la Política de Privacidad.
                </Label>
              </div>

              {/* Content Confirmation */}
              <div className="flex items-start gap-3 p-4 bg-primary/10 border border-primary/30 rounded-lg">
                <Checkbox
                  id="content-confirm"
                  checked={contentConfirmed}
                  onCheckedChange={(checked) => setContentConfirmed(checked as boolean)}
                  className="mt-1"
                />
                <Label
                  htmlFor="content-confirm"
                  className="font-paragraph text-sm text-soft-white cursor-pointer leading-relaxed"
                >
                  Confirmo que el contenido que estoy subiendo es original, legal y no infringe derechos de terceros.
                </Label>
              </div>

              {/* Submit Button */}
              <div className="space-y-4">
                <Button
                  onClick={handleSubmit}
                  disabled={!email || !contentFile || !ageConfirmed || !contentConfirmed || isProcessing}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-paragraph text-lg py-6 rounded-lg h-auto disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? 'Subiendo...' : 'Subir Contenido'}
                </Button>
                <p className="font-paragraph text-xs text-soft-white/60 text-center">
                  Tu contenido será visible durante 60 segundos cuando sea tu turno
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
