import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ClinicLayout } from './ClinicLayout';
import { KPIStrip } from './KPIStrip';
import { ContributionChart } from './ContributionChart';
import { DomainBars } from './DomainBars';
import { SpeechEvidence } from './SpeechEvidence';
import { IconArray } from './IconArray';
import { ContextPanel } from './ContextPanel';
import { DataQualityBanner, Skeleton } from '../ui';

export function Session() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['session-result', id],
    queryFn: () => fetch(`/v1/sessions/${id}/result`).then(res => {
      if (!res.ok) throw new Error('Not found');
      return res.json();
    }),
    retry: false
  });

  if (isLoading) {
    return (
      <ClinicLayout>
        <div className="mb-6"><Skeleton className="h-8 w-64" /></div>
        <Skeleton className="h-32 w-full mb-6" />
        <div className="flex gap-6">
          <div className="flex-1 space-y-6">
            <div className="flex gap-6"><Skeleton className="h-80 flex-1" /><Skeleton className="h-80 flex-1" /></div>
            <Skeleton className="h-64 w-full" />
          </div>
          <Skeleton className="w-80 h-[800px]" />
        </div>
      </ClinicLayout>
    );
  }

  if (isError || !data) {
    return (
      <ClinicLayout>
        <div className="bg-white p-12 text-center rounded-xl shadow-sm border border-red-200 mt-12">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Session not found</h2>
          <p className="text-muted mb-6">The session {id} could not be loaded.</p>
          <button onClick={() => navigate('/clinic')} className="text-ink underline font-bold">Return to queue</button>
        </div>
      </ClinicLayout>
    );
  }

  return (
    <ClinicLayout>
      <div className="flex items-center gap-4 text-sm font-bold text-muted mb-6">
        <button onClick={() => navigate('/clinic')} className="hover:text-ink">Queue</button>
        <span>/</span>
        <span className="text-ink">Session {id}</span>
        <span className="bg-gray-200 px-2 py-0.5 rounded ml-4 font-mono text-xs">{data.patient.age_band}</span>
        <span className="bg-gray-200 px-2 py-0.5 rounded font-mono text-xs">{data.patient.education_years} yrs edu</span>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Main Content Area */}
        <div className="flex-1 min-w-0">
          
          {data.data_quality.flags.map((flag: string, i: number) => (
            <DataQualityBanner key={i} level="warn" message={flag} className="mb-6" />
          ))}

          <KPIStrip data={data} />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ContributionChart features={data.features} />
            <DomainBars domains={data.cognitive_domains} />
          </div>
          
          <SpeechEvidence 
            pauses={data.speech_pauses} 
            totalDuration={data.speech_duration} 
            contentScore={data.scene_content} 
          />
          
          <IconArray />
        </div>
        
        {/* Sticky Context Panel */}
        <div className="w-full lg:w-80 flex-shrink-0">
          <ContextPanel session={data} />
        </div>
      </div>
    </ClinicLayout>
  );
}
