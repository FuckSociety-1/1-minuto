import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { BaseCrudService } from '@/integrations';
import { LegalPolicies } from '@/entities';

export default function TermsPage() {
  const [policy, setPolicy] = useState<LegalPolicies | null>(null);

  useEffect(() => {
    loadPolicy();
  }, []);

  const loadPolicy = async () => {
    const { items } = await BaseCrudService.getAll<LegalPolicies>('legalpolicies');
    const termsPolicy = items.find(item => item.policyName === 'terms');
    if (termsPolicy) {
      setPolicy(termsPolicy);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 pt-32 pb-16">
        <div className="max-w-[100rem] mx-auto px-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="font-heading text-6xl text-soft-white mb-8">
              {policy?.policyTitle || 'Términos de Servicio'}
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
                      <h2 className="font-heading text-3xl text-soft-white mb-4">1. Aceptación de Términos</h2>
                      <p>Al usar , TheSlotety aceptas estos términos de servicio. Si no estás de acuerdo, no uses el servicio.</p>
                    </section>

                    <section>
                      <h2 className="font-heading text-3xl text-soft-white mb-4">2. Requisitos de Edad</h2>
                      <p className="font-bold text-primary">Este servicio es exclusivamente para mayores de 18 años.</p>
                      <p>Al usar el servicio, confirmas que tienes al menos 18 años de edad.</p>
                    </section>

                    <section>
                      <h2 className="font-heading text-3xl text-soft-white mb-4">3. Política de Contenido</h2>
                      <p className="font-bold text-primary">CERO TOLERANCIA con contenido ilegal o que involucre menores.</p>
                      <p>Contenido prohibido:</p>
                      <ul className="list-disc list-inside space-y-2 ml-4">
                        <li>Cualquier contenido que involucre menores de edad</li>
                        <li>Contenido ilegal o que viole derechos de terceros</li>

                        <li>Contenido pornográfico</li>
                      </ul>
                    </section>

                    <section>
                      <h2 className="font-heading text-3xl text-soft-white mb-4">4. Responsabilidad del Usuario</h2>
                      <p>El usuario asume TOTAL RESPONSABILIDAD por el contenido que sube. Esto incluye:</p>
                      <ul className="list-disc list-inside space-y-2 ml-4">
                        <li>Responsabilidad legal por el contenido</li>
                        <li>Garantía de tener derechos sobre el contenido</li>
                        <li>Consecuencias legales por contenido ilegal</li>
                      </ul>
                    </section>

                    <section>
                      <h2 className="font-heading text-3xl text-soft-white mb-4">5. Proceso de Revisión</h2>
                      <p>Todo contenido será revisado antes de mostrarse públicamente. Nos reservamos el derecho de rechazar cualquier contenido sin dar explicaciones.</p>
                    </section>

                    <section>
                      <h2 className="font-heading text-3xl text-soft-white mb-4">6. Pagos y Reembolsos</h2>
                      <p>El pago de $3 USD es único y NO REEMBOLSABLE bajo ninguna circunstancia, incluso si el contenido es rechazado.</p>
                    </section>

                    <section>
                      <h2 className="font-heading text-3xl text-soft-white mb-4">7. Duración del Servicio</h2>
                      <p>El contenido aprobado se mostrará durante exactamente 60 segundos. No garantizamos un horario específico de visualización.</p>
                    </section>

                    <section>
                      <h2 className="font-heading text-3xl text-soft-white mb-4">8. Modificaciones</h2>
                      <p>Nos reservamos el derecho de modificar estos términos en cualquier momento. El uso continuado del servicio implica aceptación de los cambios.</p>
                    </section>

                    <section>
                      <h2 className="font-heading text-3xl text-soft-white mb-4">9. Terminación</h2>
                      <p>Podemos terminar o suspender el acceso al servicio inmediatamente, sin previo aviso, por cualquier violación de estos términos.</p>
                    </section>

                    <section>
                      <h2 className="font-heading text-3xl text-soft-white mb-4">10. Contacto</h2>
                      <p>Para preguntas sobre estos términos, contáctanos en: legal@1minuto.com</p>
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
