import { useState, useRef } from 'react';
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

export default function UploadPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [contentFile, setContentFile] = useState<File | null>(null);
  const [ageConfirmed, setAgeConfirmed] = useState(false);
  const [contentConfirmed, setContentConfirmed] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [error, setError] = useState('');
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Only allow MP4 videos
      if (file.type !== 'video/mp4') {
        setError('Solo se permiten archivos MP4');
        setContentFile(null);
        return;
      }

      // Check video duration
      const video = document.createElement('video');
      video.onloadedmetadata = () => {
        if (video.duration > 60) {
          setError('El video no puede exceder 1 minuto (60 segundos)');
          setContentFile(null);
          return;
        }
        setContentFile(file);
        setError('');
      };
      video.src = URL.createObjectURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!email || !contentFile || !ageConfirmed || !contentConfirmed) {
      alert('Por favor completa todos los campos y confirmaciones requeridas');
      return;
    }

    setIsProcessing(true);

    try {
      const blobUrl = URL.createObjectURL(contentFile);
      await createSubmission(blobUrl, contentFile.type);
    } catch (error) {
      console.error('Upload error:', error);
      setIsProcessing(false);
      alert('Error al subir el contenido. Por favor intenta de nuevo.');
    }
  };

  const createSubmission = async (fileContent: string, fileType: string) => {
    const submission: ContentSubmissions = {
      _id: crypto.randomUUID(),
      userEmail: email,
      submittedContent: fileContent,
      contentType: 'video',
      reviewStatus: 'approved',
      ageAndContentConfirmed: true,
      submissionDate: new Date().toISOString(),
      moderatorNotes: 'Free upload - no payment required'
    };

    try {
      await BaseCrudService.create('contentsubmissions', submission);
      setIsProcessing(false);
      setUploadSuccess(true);

      // Redirect to home after 1.5 seconds
      setTimeout(() => {
        navigate('/');
      }, 1500);
    } catch (error) {
      console.error('Create submission error:', error);
      setIsProcessing(false);
      alert('Error al subir el contenido. Por favor intenta de nuevo.');
    }
  };

  if (uploadSuccess) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1 pt-32 pb-16 flex items-center justify-center">
          <div className="max-w-2xl mx-auto text-center px-8">
            <CheckCircle className="w-24 h-24 text-primary mx-auto mb-6" />
            <h1 className="font-heading text-6xl text-soft-white mb-4">¡Enviado!</h1>
            <p className="font-paragraph text-xl text-soft-white/80 mb-8">
              Tu video ha sido enviado exitosamente y será visible en el escenario.
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
              <h1 className="font-heading text-6xl text-soft-white mb-4">Subir Video</h1>
              <p className="font-paragraph text-xl text-soft-white/80">
                Tu video será visible para todos durante 60 segundos. Máximo 1 minuto de duración.
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
                    accept="video/mp4"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <div className="border-2 border-dashed border-soft-white/30 rounded-lg p-12 text-center hover:border-soft-white/50 transition-colors">
                    <Upload className="w-12 h-12 text-primary mx-auto mb-4" />
                    <p className="font-paragraph text-soft-white/70 mb-2">
                      {contentFile ? contentFile.name : 'Seleccionar Video MP4'}
                    </p>
                    <p className="font-paragraph text-xs text-soft-white/50">
                      Arrastra o haz clic para seleccionar
                    </p>
                  </div>
                </label>
                {error && (
                  <p className="font-paragraph text-sm text-destructive">
                    {error}
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
                  disabled={!email || !contentFile || !ageConfirmed || !contentConfirmed || isProcessing || !!error}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-paragraph text-lg py-6 rounded-lg h-auto disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? 'Subiendo...' : 'Subir Video'}
                </Button>
                <p className="font-paragraph text-xs text-soft-white/60 text-center">
                  Tu video será visible durante 60 segundos cuando sea tu turno
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
