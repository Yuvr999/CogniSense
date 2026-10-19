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
import { getSessionResult } from '../../api/sessionRepository';
import { useClinicQueueStore } from '../../state/clinicQueueStore';

export function Session() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queueItems = useClinicQueueStore(state => state.items);

  const sessionId = id || '7F3A';
  const queueItem = queueItems.find(q => q.id.toUpperCase() === sessionId.toUpperCase());

  const { data, isLoading, isError } = useQuery({
    queryKey: ['session-result', sessionId],
    queryFn: async () => {
      // Attempt backend/MSW API first; seamlessly fall back to local session repository
      try {
        const res = await fetch(`/v1/sessions/${sessionId}/result`);
        if (res.ok) {
          const contentType = res.headers.get('content-type') || '';
          if (contentType.includes('application/json')) {
            const json = await res.json();
            if (json && json.id) return json;
          }
        }
      } catch {
        // Fall back to repository
      }
      return await getSessionResult(sessionId);
    },
    retry: false
  });

  const sessionData = data ? {
    ...data,
    review_status: queueItem ? queueItem.status : data.review_status,
    clinician_notes: queueItem?.clinicianNotes || data.clinician_notes,
    reviewed_at: queueItem?.reviewedAt || data.reviewed_at
  } : null;

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

  if (isError || !sessionData) {
    return (
      <ClinicLayout>
        <div className="bg-white p-12 text-center rounded-xl shadow-sm border border-red-200 mt-12">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Session not found</h2>
          <p className="text-muted mb-6">The session {sessionId} could not be loaded.</p>
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
        <span className="text-ink">Session {sessionId}</span>
        <span className="bg-gray-200 px-2 py-0.5 rounded ml-4 font-mono text-xs">{sessionData.patient.age_band}</span>
        <span className="bg-gray-200 px-2 py-0.5 rounded font-mono text-xs">{sessionData.patient.education_years} yrs edu</span>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Main Content Area */}
        <div className="flex-1 min-w-0">
          
          {sessionData.data_quality.flags.map((flag: string, i: number) => (
            <DataQualityBanner key={i} level="warn" message={flag} className="mb-6" />
          ))}

          <KPIStrip data={sessionData} />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ContributionChart features={sessionData.features} />
            <DomainBars domains={sessionData.cognitive_domains} />
          </div>
          
          <SpeechEvidence 
            pauses={sessionData.speech_pauses} 
            totalDuration={sessionData.speech_duration} 
            contentScore={sessionData.scene_content} 
          />
          
          <IconArray />
        </div>
        
        {/* Sticky Context Panel */}
        <div className="w-full lg:w-80 flex-shrink-0">
          <ContextPanel session={sessionData} />
        </div>
      </div>
    </ClinicLayout>
  );
}
