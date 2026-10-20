import React from 'react';
import type { PatientRecordedResponses } from '../../api/sessionRepository';

interface PatientTestResponsesProps {
  responses?: PatientRecordedResponses;
  patient: {
    name?: string;
    patient_id?: string;
    age_band: string;
    education_years: number;
    language: string;
    device?: string;
  };
}

export function PatientTestResponses({ responses, patient }: PatientTestResponsesProps) {
  if (!responses) {
    return null;
  }

  const {
    scene_title,
    speech_duration_sec,
    fluency_raw_text,
    fluency_word_count,
    fluency_words_list,
    recall_raw_text,
    recalled_matched_count,
    recalled_matched_words,
    trace_points_connected,
    trace_completed
  } = responses;

  return (
    <div className="bg-white rounded-2xl border-2 border-ink/20 p-6 shadow-sm mb-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 mb-5 border-b border-gray-100">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-sand/60 text-ink text-xs font-mono font-bold uppercase tracking-wider mb-1">
            <span>📝</span>
            <span>Recorded Patient Test Submissions</span>
          </div>
          <h3 className="font-display font-bold text-xl text-ink">
            {patient.name ? `${patient.name}'s Actual Screening Responses` : 'Submitted Task Responses'}
          </h3>
          <p className="text-xs text-muted">
            Direct responses captured during the patient screening session. Processed on-device.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {patient.patient_id && (
            <span className="text-xs font-mono font-bold bg-cream px-2.5 py-1 rounded-lg border border-ink/15">
              ID: {patient.patient_id}
            </span>
          )}
          <span className="text-xs font-bold bg-emerald-100 text-emerald-900 px-2.5 py-1 rounded-lg border border-emerald-300">
            ✓ 4 Tasks Completed
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Task 1: Speech Task */}
        <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-muted flex items-center gap-1.5">
                <span>🎙️</span> Task 1: Picture Description
              </span>
              <span className="text-xs font-mono font-bold bg-blue-100 text-blue-900 px-2 py-0.5 rounded">
                {speech_duration_sec}s Audio
              </span>
            </div>
            <div className="text-sm font-bold text-ink mb-1">{scene_title}</div>
            <p className="text-xs text-muted mb-3">
              Spoken description recorded via browser microphone. Evaluated for pauses, syntax, and information units.
            </p>
          </div>
          <div className="text-[11px] font-mono text-gray-500 bg-white p-2 rounded border border-gray-200">
            🔒 Local Whisper ASR · Audio remains strictly on device
          </div>
        </div>

        {/* Task 2: Delayed Word Recall */}
        <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-muted flex items-center gap-1.5">
                <span>🧠</span> Task 2: Delayed Word Recall
              </span>
              <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                recalled_matched_count >= 6 ? 'bg-emerald-100 text-emerald-900' :
                recalled_matched_count >= 3 ? 'bg-amber-100 text-amber-900' : 'bg-red-100 text-red-900'
              }`}>
                {recalled_matched_count} / 10 Recalled
              </span>
            </div>
            <div className="text-xs text-muted mb-2">
              Patient&apos;s typed recall text:
            </div>
            <div className="text-xs font-mono bg-white p-2.5 rounded border border-gray-200 mb-2 italic text-ink min-h-[48px]">
              &ldquo;{recall_raw_text || '(No text submitted)'}&rdquo;
            </div>
          </div>
          <div>
            <div className="text-[11px] font-bold text-muted uppercase tracking-wider mb-1">
              Matched Targets:
            </div>
            <div className="flex flex-wrap gap-1">
              {recalled_matched_words && recalled_matched_words.length > 0 ? (
                recalled_matched_words.map((w, idx) => (
                  <span key={idx} className="text-[11px] font-mono font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded border border-emerald-300">
                    ✓ {w}
                  </span>
                ))
              ) : (
                <span className="text-[11px] text-muted font-mono italic">None matched</span>
              )}
            </div>
          </div>
        </div>

        {/* Task 3: Category Fluency */}
        <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-muted flex items-center gap-1.5">
                <span>🐾</span> Task 3: Category Fluency (Animals)
              </span>
              <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                fluency_word_count >= 14 ? 'bg-emerald-100 text-emerald-900' :
                fluency_word_count >= 8 ? 'bg-amber-100 text-amber-900' : 'bg-red-100 text-red-900'
              }`}>
                {fluency_word_count} Items / 60s
              </span>
            </div>
            <div className="text-xs text-muted mb-2">
              Patient&apos;s typed fluency words:
            </div>
            <div className="text-xs font-mono bg-white p-2.5 rounded border border-gray-200 mb-2 text-ink min-h-[48px] max-h-[80px] overflow-y-auto">
              {fluency_raw_text || '(No words submitted)'}
            </div>
          </div>
          <div>
            <div className="text-[11px] font-bold text-muted uppercase tracking-wider mb-1">
              Parsed Items ({fluency_words_list.length}):
            </div>
            <div className="flex flex-wrap gap-1 max-h-16 overflow-y-auto">
              {fluency_words_list.slice(0, 15).map((w, idx) => (
                <span key={idx} className="text-[10px] font-mono bg-sky/30 text-ink px-1.5 py-0.5 rounded border border-sky/50">
                  {w}
                </span>
              ))}
              {fluency_words_list.length > 15 && (
                <span className="text-[10px] font-mono text-muted self-center">
                  +{fluency_words_list.length - 15} more
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Task 4: Trail Tracing */}
        <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-muted flex items-center gap-1.5">
                <span>✏️</span> Task 4: Trail Tracing (Motor & Attention)
              </span>
              <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                trace_completed ? 'bg-emerald-100 text-emerald-900' : 'bg-amber-100 text-amber-900'
              }`}>
                {trace_completed ? '✓ Completed' : `${trace_points_connected}/6 Connected`}
              </span>
            </div>
            <div className="text-sm font-bold text-ink mb-1">
              Path sequence: 1 → A → 2 → B → 3 → C
            </div>
            <p className="text-xs text-muted mb-3">
              Alternating number-letter connect-the-dots task assessing motor precision and executive task switching.
            </p>
          </div>
          <div className="text-[11px] font-mono text-ink bg-white p-2 rounded border border-gray-200 flex items-center justify-between">
            <span>Points touched: {trace_points_connected} / 6</span>
            <span className={trace_completed ? 'text-emerald-700 font-bold' : 'text-amber-700 font-bold'}>
              {trace_completed ? 'Zero sequence breaks' : 'Partial connection'}
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}
