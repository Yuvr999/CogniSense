import { useEffect } from 'react';
import { 
  Button, 
  NavPill, 
  RiskTierBadge, 
  BandSection, 
  StickyChip, 
  TiltCard, 
  IntervalBar, 
  DataQualityBanner, 
  Skeleton, 
  EmptyState, 
  ErrorState, 
  DisclaimerBar,
  LanguageSwitcher
} from '../components/ui';

export function Styleguide() {
  useEffect(() => {
    document.documentElement.setAttribute('data-mode', 'clinic');
    return () => document.documentElement.removeAttribute('data-mode');
  }, []);

  return (
    <div className="bg-paper min-h-screen pb-32">
      <NavPill links={[{ label: 'How it works', href: '#how' }, { label: 'Evidence', href: '#evidence' }]} />
      
      <div className="p-8 max-w-6xl mx-auto pt-32">
        <h1 className="text-4xl font-display font-bold mb-8 text-ink">CogniSense Styleguide</h1>
        
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6 border-b border-gray-200 pb-2">1. Palette</h2>
          <div className="flex flex-wrap gap-4">
            {[
              { name: 'Ink', class: 'bg-ink text-paper' },
              { name: 'Paper', class: 'bg-paper text-ink border border-gray-200' },
              { name: 'Sand', class: 'bg-sand text-ink' },
              { name: 'Sky', class: 'bg-sky text-ink' },
              { name: 'Lavender', class: 'bg-lavender text-ink' },
              { name: 'Lime', class: 'bg-lime text-ink' },
              { name: 'Berry', class: 'bg-berry text-white' },
            ].map(c => (
              <div key={c.name} className="flex flex-col items-center">
                <div className={`w-20 h-20 rounded-full shadow-[var(--shadow-float)] mb-2 flex items-center justify-center text-xs font-bold ${c.class}`}>
                  {c.name}
                </div>
              </div>
            ))}
          </div>
        </section>
        
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6 border-b border-gray-200 pb-2">2. Typography</h2>
          <div className="space-y-6 bg-white p-8 rounded-2xl shadow-sm">
            <div>
              <div className="text-sm text-muted mb-1">Display (Archivo Variable)</div>
              <div className="font-display text-6xl font-black uppercase tracking-tight leading-none">Eight minutes to an earlier answer.</div>
            </div>
            <div>
              <div className="text-sm text-muted mb-1">H1 (Atkinson Hyperlegible Next)</div>
              <div className="font-sans text-4xl font-bold">Describe everything you see in this picture.</div>
            </div>
            <div>
              <div className="text-sm text-muted mb-1">H2</div>
              <div className="font-sans text-2xl font-bold">Patient Information</div>
            </div>
            <div>
              <div className="text-sm text-muted mb-1">Body</div>
              <div className="font-sans text-lg max-w-2xl">CogniSense listens to a short picture description, checks memory and attention, and gives your clinician an explained risk estimate. A screening aid, not a diagnosis.</div>
            </div>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6 border-b border-gray-200 pb-2">3. Buttons</h2>
          <div className="space-y-8 bg-white p-8 rounded-2xl shadow-sm">
            <div>
              <h3 className="text-lg font-bold mb-4">Clinic Size (Default)</h3>
              <div className="flex flex-wrap gap-4 items-center">
                <Button variant="primary">Primary Action</Button>
                <Button variant="secondary">Secondary Action</Button>
                <Button variant="link-arrow">Link Action</Button>
                <Button variant="primary" loading>Loading...</Button>
                <Button variant="primary" disabled>Disabled</Button>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Patient Size (Large)</h3>
              <div className="flex flex-wrap gap-4 items-center">
                <Button variant="primary" size="patient">Start talking</Button>
                <Button variant="secondary" size="patient">I need help</Button>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6 border-b border-gray-200 pb-2">4. Risk Tier Badges</h2>
          <div className="bg-white p-8 rounded-2xl shadow-sm space-y-6">
            <div className="flex flex-wrap gap-4 items-center">
              <RiskTierBadge tier="Low" size="sm" />
              <RiskTierBadge tier="Low" size="md" />
              <RiskTierBadge tier="Low" size="lg" />
            </div>
            <div className="flex flex-wrap gap-4 items-center">
              <RiskTierBadge tier="Elevated" size="md" />
              <RiskTierBadge tier="High" size="md" />
              <RiskTierBadge tier="Indeterminate" size="md" />
            </div>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6 border-b border-gray-200 pb-2">5. Cards & Chips</h2>
          <div className="bg-sand p-12 rounded-3xl overflow-hidden relative min-h-[400px]">
            <TiltCard rotation={-3} className="max-w-sm absolute top-12 left-12 z-10">
              <h3 className="text-xl font-bold mb-2">Evidence Card</h3>
              <p className="text-muted">This is an example of a tilted card used on the landing page.</p>
            </TiltCard>
            
            <TiltCard rotation={2} tone="white" className="max-w-sm absolute top-32 left-64 z-20">
              <h3 className="text-xl font-bold mb-2">Another Card</h3>
              <p className="text-muted">Cards can overlap and have different tones.</p>
            </TiltCard>
            
            <div className="absolute top-20 right-20 z-30">
              <StickyChip text="15–20 years" tone="lime" tilt={4} />
            </div>
            <div className="absolute top-40 right-40 z-30">
              <StickyChip text="under 10 min" tone="sky" tilt={-2} />
            </div>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6 border-b border-gray-200 pb-2">6. Dashboard Components</h2>
          <div className="bg-white p-8 rounded-2xl shadow-sm space-y-8">
            <div>
              <h3 className="text-lg font-bold mb-4">Interval Bar (Probability + CI)</h3>
              <div className="max-w-md space-y-6">
                <div>
                  <div className="flex justify-between text-sm mb-2 font-bold">
                    <span>High Risk</span>
                    <span>0.85 (0.75-0.92)</span>
                  </div>
                  <IntervalBar p={0.85} low={0.75} high={0.92} />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2 font-bold">
                    <span>Elevated Risk</span>
                    <span>0.55 (0.40-0.68)</span>
                  </div>
                  <IntervalBar p={0.55} low={0.40} high={0.68} />
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-bold mb-4">Data Quality Banner</h3>
              <div className="space-y-4 max-w-2xl">
                <DataQualityBanner level="warn" message="Audio quality was low (background noise). Treat the speech score with caution." />
                <DataQualityBanner level="error" message="The model is not confident enough. Repeat the screen or use clinical judgement." />
              </div>
            </div>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6 border-b border-gray-200 pb-2">7. Band Sections</h2>
          <div className="space-y-4">
            <BandSection tone="sky" inset>
              <h3 className="text-3xl font-display font-bold mb-4">Three short tasks. One explained result.</h3>
              <p>Speech analysis block.</p>
            </BandSection>
            <BandSection tone="lavender" inset>
              <h3 className="text-3xl font-display font-bold mb-4">Numbers you can check.</h3>
              <p>Cognitive metrics block.</p>
            </BandSection>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6 border-b border-gray-200 pb-2">8. States & Feedback</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <EmptyState 
              title="No screenings yet" 
              message="Start a new screening session from the patient tablet." 
              actionLabel="Start Patient Flow"
              onAction={() => alert('Start clicked')}
            />
            <ErrorState 
              title="Connection lost" 
              message="We couldn't send your answers. Ask the clinic staff for help." 
              actionLabel="Retry Connection"
              onAction={() => alert('Retry clicked')}
            />
          </div>
          
          <div className="mt-8 bg-white p-8 rounded-2xl shadow-sm">
            <h3 className="text-lg font-bold mb-4">Loading Skeleton</h3>
            <div className="space-y-4 max-w-md">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <div className="flex gap-4 pt-4">
                <Skeleton className="h-10 w-24 rounded-full" />
                <Skeleton className="h-10 w-24 rounded-full" />
              </div>
            </div>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6 border-b border-gray-200 pb-2">9. Language Switcher (Multilingual: EN / HI / MR)</h2>
          <div className="bg-white p-8 rounded-2xl shadow-sm space-y-6">
            <div>
              <h3 className="text-sm font-bold text-muted mb-3 uppercase tracking-wider">Segmented Control (Default)</h3>
              <div className="flex flex-wrap gap-4 items-center">
                <LanguageSwitcher size="sm" />
                <LanguageSwitcher size="md" />
                <LanguageSwitcher size="lg" />
              </div>
            </div>
            <div>
              <h3 className="text-sm font-bold text-muted mb-3 uppercase tracking-wider">Compact Variant</h3>
              <div className="flex flex-wrap gap-4 items-center">
                <LanguageSwitcher variant="compact" />
              </div>
            </div>
          </div>
        </section>
      </div>

      <DisclaimerBar className="fixed bottom-0 left-0 right-0 z-50" />
    </div>
  );
}
