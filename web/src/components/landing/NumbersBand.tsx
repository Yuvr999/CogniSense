import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { BandSection, TiltCard } from '../ui';
import { motion, useMotionValue, useTransform, animate } from 'motion/react';

function CountUp({ to, decimals = 0 }: { to: number; decimals?: number }) {
  const [motionOk, setMotionOk] = useState(true);
  useEffect(() => setMotionOk(!window.matchMedia('(prefers-reduced-motion: reduce)').matches), []);
  
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => latest.toFixed(decimals));

  useEffect(() => {
    if (motionOk) {
      const controls = animate(count, to, { duration: 0.9, ease: "easeOut" });
      return controls.stop;
    } else {
      count.set(to);
    }
  }, [to, motionOk, count]);

  return <motion.span>{rounded}</motion.span>;
}

export function NumbersBand() {
  const { data, isLoading } = useQuery({
    queryKey: ['model-card'],
    queryFn: () => fetch('/v1/model/card').then(res => res.json())
  });

  return (
    <BandSection tone="lavender" className="overflow-hidden">
      <div className="flex flex-col md:flex-row gap-12 items-start max-w-7xl mx-auto">
        <div className="md:w-1/3">
          <h2 className="text-4xl md:text-5xl font-display font-bold leading-tight mb-4">Numbers you can check.</h2>
          <p className="text-xl mb-4 font-medium opacity-90">Cross-validated on public research data. Not a clinical validation.</p>
          {data?.data_mode === 'synthetic' && (
            <span className="inline-block bg-black text-white px-3 py-1 text-sm font-bold uppercase rounded-md tracking-wider">
              SYNTHETIC: pipeline test only
            </span>
          )}
        </div>
        
        <div className="md:w-2/3 grid grid-cols-1 sm:grid-cols-3 gap-6">
          {isLoading ? (
            <div className="col-span-3 text-xl font-bold opacity-60">Evaluation hasn't been run yet...</div>
          ) : data ? (
            <>
              <div className="bg-white/40 p-6 rounded-2xl">
                <div className="text-sm font-bold uppercase tracking-wider mb-2">AUROC</div>
                <div className="text-5xl font-display font-bold tabular-nums mb-1">
                  <CountUp to={data.auroc?.value || 0} decimals={2} />
                </div>
                <div className="text-sm opacity-80">95% CI: [{data.auroc?.ci?.join(', ')}]</div>
              </div>
              <div className="bg-white/40 p-6 rounded-2xl">
                <div className="text-sm font-bold uppercase tracking-wider mb-2">Sensitivity</div>
                <div className="text-5xl font-display font-bold tabular-nums mb-1">
                  <CountUp to={data.sensitivity?.value || 0} decimals={2} />
                </div>
                <div className="text-sm opacity-80">95% CI: [{data.sensitivity?.ci?.join(', ')}]</div>
              </div>
              <div className="bg-white/40 p-6 rounded-2xl">
                <div className="text-sm font-bold uppercase tracking-wider mb-2">Specificity</div>
                <div className="text-5xl font-display font-bold tabular-nums mb-1">
                  <CountUp to={data.specificity?.value || 0} decimals={2} />
                </div>
                <div className="text-sm opacity-80">95% CI: [{data.specificity?.ci?.join(', ')}]</div>
              </div>
            </>
          ) : null}
        </div>
      </div>
      
      {/* Evidence cards carousel */}
      <div className="mt-24 pb-8 flex gap-6 overflow-x-auto snap-x px-4 md:px-0 -mx-4 md:mx-0">
        <Link to="/evidence" className="block focus:outline-none">
          <TiltCard rotation={-2} tone="cream" className="min-w-[300px] snap-center hover:shadow-md transition-shadow cursor-pointer h-full">
            <h3 className="text-xl font-bold mb-2 flex items-center justify-between">
              <span>Why this flag</span>
              <span className="text-xs font-mono text-muted">View →</span>
            </h3>
            <p className="text-muted">Every risk estimate comes with a waterfall chart of exactly which features drove the result.</p>
          </TiltCard>
        </Link>
        <Link to="/evidence/fairness" className="block focus:outline-none">
          <TiltCard rotation={1} tone="white" className="min-w-[300px] snap-center hover:shadow-md transition-shadow cursor-pointer h-full">
            <h3 className="text-xl font-bold mb-2 flex items-center justify-between">
              <span>Fair across groups?</span>
              <span className="text-xs font-mono text-muted">View →</span>
            </h3>
            <p className="text-muted">Explore the subgroup audit to check for demographic bias before deploying.</p>
          </TiltCard>
        </Link>
        <Link to="/privacy" className="block focus:outline-none">
          <TiltCard rotation={3} tone="paper" className="min-w-[300px] snap-center hover:shadow-md transition-shadow cursor-pointer h-full">
            <h3 className="text-xl font-bold mb-2 flex items-center justify-between">
              <span>Where your data goes</span>
              <span className="text-xs font-mono text-muted">View →</span>
            </h3>
            <p className="text-muted">Audio is processed entirely on the local server and deleted immediately.</p>
          </TiltCard>
        </Link>
        <Link to="/clinic" className="block focus:outline-none">
          <TiltCard rotation={-1} tone="cream" className="min-w-[300px] snap-center hover:shadow-md transition-shadow cursor-pointer h-full">
            <h3 className="text-xl font-bold mb-2 flex items-center justify-between">
              <span>Where it fits</span>
              <span className="text-xs font-mono text-muted">View →</span>
            </h3>
            <p className="text-muted">Designed as a triage step before a full neuropsychological battery.</p>
          </TiltCard>
        </Link>
      </div>
    </BandSection>
  );
}
