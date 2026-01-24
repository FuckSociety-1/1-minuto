import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { BaseCrudService } from '@/integrations';
import { LegalPolicies } from '@/entities';

export default function PrivacyPage() {
  const [policy, setPolicy] = useState<LegalPolicies | null>(null);

  useEffect(() => {
    loadPolicy();
  }, []);

  const loadPolicy = async () => {
    const { items } = await BaseCrudService.getAll<LegalPolicies>('legalpolicies');
    const privacyPolicy = items.find(item => item.policyName === 'privacy');
    if (privacyPolicy) {
      setPolicy(privacyPolicy);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 pt-32 pb-16">
        <div className="max-w-[100rem] mx-auto px-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="font-heading text-6xl text-soft-white mb-8">
              {policy?.policyTitle || 'Política de Privacidad'}
            </h1>
            
            {policy?.lastUpdatedDate && (
              <p className="font-paragraph text-sm text-soft-white/60 mb-12">
                Última actualización: {new Date(policy.lastUpdatedDate).toLocaleDateString('es-ES')}
              </p>
            )}

            <div className="prose prose-invert max-w-none">
              <div className="font-paragraph text-base text-soft-white/80 space-y-6 whitespace-pre-wrap">
                {policy?.policyContent || (
                  <div className="space-y-6">
                    <section>
                      <h2 className="font-heading text-3xl text-soft-white mb-4">1. Información que Recopilamos</h2>
                      <p>Recopilamos la siguiente información cuando utilizas nuestro servicio:</p>
                      <ul className="list-disc list-inside space-y-2 ml-4">
                        <li>Dirección de correo electrónico</li>
                        <li>Contenido multimedia (imágenes o videos) que subes</li>
                        <li>Información de pago procesada por terceros</li>
                        <li>Datos de uso y navegación</li>
                      </ul>
                    </section>

                    <section>
                      <h2 className="font-heading text-3xl text-soft-white mb-4">2. Uso de la Información</h2>
                      <p>Utilizamos tu información para:</p>
                      <ul className="list-disc list-inside space-y-2 ml-4">
                        <li>Procesar tu pago y mostrar tu contenido</li>
                        <li>Enviarte confirmaciones y notificaciones</li>
                        <li>Revisar y moderar el contenido subido</li>
                        <li>Cumplir con obligaciones legales</li>
                      </ul>
                    </section>

                    <section>
                      <h2 className="font-heading text-3xl text-soft-white mb-4">3. Protección de Datos</h2>
                      <p>Implementamos medidas de seguridad para proteger tu información personal. Sin embargo, ningún método de transmisión por Internet es 100% seguro.</p>
                    </section>

                    <section>
                      <h2 className="font-heading text-3xl text-soft-white mb-4">4. Compartir Información</h2>
                      <p>No vendemos ni compartimos tu información personal con terceros, excepto cuando sea necesario para procesar pagos o cumplir con la ley.</p>
                    </section>

                    <section>
                      <h2 className="font-heading text-3xl text-soft-white mb-4">5. Tus Derechos</h2>
                      <p>Tienes derecho a acceder, corregir o eliminar tu información personal. Contáctanos para ejercer estos derechos.</p>
                    </section>

                    <section>
                      <h2 className="font-heading text-3xl text-soft-white mb-4">6. Contacto</h2>
                      <p>Para preguntas sobre esta política, contáctanos en: privacy@theslot.com</p>
                    </section>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
