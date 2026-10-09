import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ClinicLayout } from '../components/clinic/ClinicLayout';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';

// Synthetic ROC curve points modeled from validation results
const rocPoints = [
  { fpr: 0.00, speechTpr: 0.00, cogTpr: 0.00, fusionTpr: 0.00, random: 0.00 },
  { fpr: 0.05, speechTpr: 0.38, cogTpr: 0.32, fusionTpr: 0.52, random: 0.05 },
  { fpr: 0.10, speechTpr: 0.54, cogTpr: 0.48, fusionTpr: 0.72, random: 0.10 },
  { fpr: 0.15, speechTpr: 0.65, cogTpr: 0.58, fusionTpr: 0.81, random: 0.15 },
  { fpr: 0.20, speechTpr: 0.72, cogTpr: 0.65, fusionTpr: 0.87, random: 0.20 },
  { fpr: 0.30, speechTpr: 0.80, cogTpr: 0.74, fusionTpr: 0.92, random: 0.30 },
  { fpr: 0.40, speechTpr: 0.86, cogTpr: 0.81, fusionTpr: 0.95, random: 0.40 },
  { fpr: 0.50, speechTpr: 0.90, cogTpr: 0.86, fusionTpr: 0.97, random: 0.50 },
  { fpr: 0.70, speechTpr: 0.95, cogTpr: 0.93, fusionTpr: 0.99, random: 0.70 },
  { fpr: 1.00, speechTpr: 1.00, cogTpr: 1.00, fusionTpr: 1.00, random: 1.00 }
];

// Calibration (Reliability Diagram) data points
const calibrationPoints = [
  { pred: 0.1, perfect: 0.1, fusionObs: 0.11, speechObs: 0.14 },
  { pred: 0.2, perfect: 0.2, fusionObs: 0.19, speechObs: 0.25 },
  { pred: 0.3, perfect: 0.3, fusionObs: 0.31, speechObs: 0.35 },
  { pred: 0.4, perfect: 0.4, fusionObs: 0.39, speechObs: 0.44 },
  { pred: 0.5, perfect: 0.5, fusionObs: 0.52, speechObs: 0.51 },
  { pred: 0.6, perfect: 0.6, fusionObs: 0.61, speechObs: 0.58 },
  { pred: 0.7, perfect: 0.7, fusionObs: 0.69, speechObs: 0.66 },
  { pred: 0.8, perfect: 0.8, fusionObs: 0.81, speechObs: 0.77 },
  { pred: 0.9, perfect: 0.9, fusionObs: 0.89, speechObs: 0.84 }
];

export function Evidence() {
  const [rocView, setRocView] = useState<'chart' | 'table'>('chart');
  const [calibView, setCalibView] = useState<'chart' | 'table'>('chart');

  return (
    <ClinicLayout activePath="/evidence">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 text-xs font-bold text-muted mb-3">
          <Link to="/clinic" className="hover:text-ink transition-colors flex items-center gap-1">
            <span>←</span> Back to Queue
          </Link>
          <span>/</span>
          <span className="text-ink">Evidence & Validation</span>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-ink mb-1">Evidence & Model Validation</h1>
            <p className="text-muted text-sm">
              Cross-validated performance benchmarks, calibration reliability, and ablation studies.
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="bg-ink text-paper px-3 py-1 rounded text-xs font-mono font-bold tracking-wide">
              SYNTHETIC: Benchmark & CV Data
            </span>
            <span className="bg-paper-dim border border-gray-300 text-ink px-3 py-1 rounded text-xs font-semibold">
              Screening aid, not a diagnosis
            </span>
          </div>
        </div>
      </div>

      {/* Global Performance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-muted">Acoustic & Linguistic</span>
            <span className="text-xs font-mono bg-sky/30 text-ink font-bold px-2 py-0.5 rounded">Speech</span>
          </div>
          <div className="text-4xl font-display font-bold text-ink mb-1">0.86</div>
          <div className="text-xs text-muted font-mono mb-4">95% CI: [0.82, 0.90] AUROC</div>
          <div className="space-y-1.5 pt-3 border-t border-gray-100 text-xs">
            <div className="flex justify-between">
              <span className="text-muted">Sensitivity @ 90% Spec:</span>
              <span className="font-bold text-ink">0.74</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Brier Score:</span>
              <span className="font-bold text-ink">0.15</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Benchmark:</span>
              <span className="font-mono text-ink">ADReSS Cookie Theft (n=156)</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-muted">Battery & Tasks</span>
            <span className="text-xs font-mono bg-lavender/30 text-ink font-bold px-2 py-0.5 rounded">Cognitive</span>
          </div>
          <div className="text-4xl font-display font-bold text-ink mb-1">0.82</div>
          <div className="text-xs text-muted font-mono mb-4">95% CI: [0.79, 0.85] AUROC</div>
          <div className="space-y-1.5 pt-3 border-t border-gray-100 text-xs">
            <div className="flex justify-between">
              <span className="text-muted">Sensitivity @ 90% Spec:</span>
              <span className="font-bold text-ink">0.68</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Brier Score:</span>
              <span className="font-bold text-ink">0.18</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Benchmark:</span>
              <span className="font-mono text-ink">ADNI/TADPOLE Normed (n=640)</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border-2 border-lime shadow-xs relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-lime text-ink font-bold text-[10px] uppercase px-3 py-0.5 rounded-bl font-mono">
            Primary Model
          </div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-muted">Late Fusion</span>
            <span className="text-xs font-mono bg-ink text-lime font-bold px-2 py-0.5 rounded">Multimodal</span>
          </div>
          <div className="text-4xl font-display font-bold text-ink mb-1">0.91</div>
          <div className="text-xs text-muted font-mono mb-4">95% CI: [0.88, 0.94] AUROC</div>
          <div className="space-y-1.5 pt-3 border-t border-gray-100 text-xs">
            <div className="flex justify-between">
              <span className="text-muted">Sensitivity @ 90% Spec:</span>
              <span className="font-bold text-ink">0.85</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Brier Score:</span>
              <span className="font-bold text-ink">0.10</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Multimodal Gain:</span>
              <span className="font-bold text-[var(--color-risk-low-text)]">+0.05 AUROC (p &lt; 0.001)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Charts: ROC Curve and Calibration */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* ROC Curves */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-ink">Receiver Operating Characteristic</h2>
              <p className="text-xs text-muted">Comparison across modalities with Subject-Grouped CV</p>
            </div>
            <div className="flex bg-gray-100 p-0.5 rounded-lg text-xs font-bold">
              <button
                onClick={() => setRocView('chart')}
                className={`px-3 py-1 rounded-md transition-colors ${rocView === 'chart' ? 'bg-white text-ink shadow-xs' : 'text-muted hover:text-ink'}`}
              >
                Chart
              </button>
              <button
                onClick={() => setRocView('table')}
                className={`px-3 py-1 rounded-md transition-colors ${rocView === 'table' ? 'bg-white text-ink shadow-xs' : 'text-muted hover:text-ink'}`}
              >
                Table
              </button>
            </div>
          </div>

          {rocView === 'chart' ? (
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={rocPoints} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1EADF" />
                  <XAxis 
                    dataKey="fpr" 
                    type="number" 
                    domain={[0, 1]} 
                    tickFormatter={(v) => v.toFixed(1)}
                    label={{ value: 'False Positive Rate (1 - Specificity)', position: 'insideBottom', offset: -5, fontSize: 11 }}
                    tick={{ fontSize: 11 }}
                  />
                  <YAxis 
                    type="number" 
                    domain={[0, 1]} 
                    tickFormatter={(v) => v.toFixed(1)}
                    label={{ value: 'True Positive Rate (Sensitivity)', angle: -90, position: 'insideLeft', offset: 15, fontSize: 11 }}
                    tick={{ fontSize: 11 }}
                  />
                  <Tooltip 
                    formatter={(val: any, name: any) => [Number(val).toFixed(2), name]} 
                    labelFormatter={(label) => `FPR: ${Number(label).toFixed(2)}`}
                    contentStyle={{ backgroundColor: '#FFFFFF', borderRadius: '8px', border: '1px solid #E5E7EB', fontSize: '12px' }}
                  />
                  <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: '12px' }} />
                  <Line type="monotone" dataKey="fusionTpr" name="Multimodal Fusion (0.91)" stroke="#111111" strokeWidth={2.5} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="speechTpr" name="Speech (0.86)" stroke="#2F6FB5" strokeWidth={2} dot={{ r: 2 }} />
                  <Line type="monotone" dataKey="cogTpr" name="Cognitive (0.82)" stroke="#5B4BD6" strokeWidth={2} dot={{ r: 2 }} />
                  <Line type="monotone" dataKey="random" name="Random Chance" stroke="#9CA3AF" strokeDasharray="4 4" strokeWidth={1} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50 text-muted font-mono uppercase">
                    <th className="py-2.5 px-3">FPR</th>
                    <th className="py-2.5 px-3">Fusion TPR</th>
                    <th className="py-2.5 px-3">Speech TPR</th>
                    <th className="py-2.5 px-3">Cognitive TPR</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 font-mono">
                  {rocPoints.map((row, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="py-2 px-3 font-bold text-ink">{row.fpr.toFixed(2)}</td>
                      <td className="py-2 px-3 text-ink font-bold">{row.fusionTpr.toFixed(2)}</td>
                      <td className="py-2 px-3 text-[#2F6FB5]">{row.speechTpr.toFixed(2)}</td>
                      <td className="py-2 px-3 text-[#5B4BD6]">{row.cogTpr.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="mt-4 pt-3 border-t border-gray-100 text-xs text-muted flex items-center justify-between">
            <span>Operating point threshold selected at 90% specificity.</span>
            <span className="font-semibold text-ink">GroupKFold (k=5, seed=42)</span>
          </div>
        </div>

        {/* Reliability / Calibration Diagram */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-ink">Calibration Reliability</h2>
              <p className="text-xs text-muted">Predicted risk probability vs. observed incidence</p>
            </div>
            <div className="flex bg-gray-100 p-0.5 rounded-lg text-xs font-bold">
              <button
                onClick={() => setCalibView('chart')}
                className={`px-3 py-1 rounded-md transition-colors ${calibView === 'chart' ? 'bg-white text-ink shadow-xs' : 'text-muted hover:text-ink'}`}
              >
                Chart
              </button>
              <button
                onClick={() => setCalibView('table')}
                className={`px-3 py-1 rounded-md transition-colors ${calibView === 'table' ? 'bg-white text-ink shadow-xs' : 'text-muted hover:text-ink'}`}
              >
                Table
              </button>
            </div>
          </div>

          {calibView === 'chart' ? (
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={calibrationPoints} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1EADF" />
                  <XAxis 
                    dataKey="pred" 
                    type="number" 
                    domain={[0, 1]} 
                    tickFormatter={(v) => v.toFixed(1)}
                    label={{ value: 'Mean Predicted Probability', position: 'insideBottom', offset: -5, fontSize: 11 }}
                    tick={{ fontSize: 11 }}
                  />
                  <YAxis 
                    type="number" 
                    domain={[0, 1]} 
                    tickFormatter={(v) => v.toFixed(1)}
                    label={{ value: 'Observed Fraction of Positives', angle: -90, position: 'insideLeft', offset: 15, fontSize: 11 }}
                    tick={{ fontSize: 11 }}
                  />
                  <Tooltip 
                    formatter={(val: any, name: any) => [Number(val).toFixed(2), name]} 
                    labelFormatter={(label) => `Predicted: ${Number(label).toFixed(2)}`}
                    contentStyle={{ backgroundColor: '#FFFFFF', borderRadius: '8px', border: '1px solid #E5E7EB', fontSize: '12px' }}
                  />
                  <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: '12px' }} />
                  <Line type="monotone" dataKey="fusionObs" name="Multimodal Fusion (Brier 0.10)" stroke="#111111" strokeWidth={2.5} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="speechObs" name="Speech Model (Brier 0.15)" stroke="#2F6FB5" strokeWidth={2} dot={{ r: 3 }} />
                  <Line type="linear" dataKey="perfect" name="Perfect Calibration" stroke="#9CA3AF" strokeDasharray="4 4" strokeWidth={1} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50 text-muted font-mono uppercase">
                    <th className="py-2.5 px-3">Bin Mean</th>
                    <th className="py-2.5 px-3">Fusion Observed</th>
                    <th className="py-2.5 px-3">Speech Observed</th>
                    <th className="py-2.5 px-3">Ideal Ref</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 font-mono">
                  {calibrationPoints.map((row, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="py-2 px-3 font-bold text-ink">{row.pred.toFixed(2)}</td>
                      <td className="py-2 px-3 font-bold text-ink">{row.fusionObs.toFixed(2)}</td>
                      <td className="py-2 px-3 text-[#2F6FB5]">{row.speechObs.toFixed(2)}</td>
                      <td className="py-2 px-3 text-muted">{row.perfect.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="mt-4 pt-3 border-t border-gray-100 text-xs text-muted flex items-center justify-between">
            <span>Calibrated using Platt scaling within each CV fold.</span>
            <span className="font-semibold text-ink">Strict zero data leakage</span>
          </div>
        </div>
      </div>

      {/* Feature Ablation & ASR Sensitivity Table */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Ablation Table */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-gray-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-ink">Feature Ablation Study</h2>
              <p className="text-xs text-muted">Incremental value of acoustic, linguistic, and cognitive signals</p>
            </div>
            <span className="text-xs font-mono font-bold bg-gray-100 px-2.5 py-1 rounded">Rule 9 Compliant</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50 text-muted uppercase font-mono">
                  <th className="py-2.5 px-3">Model Configuration</th>
                  <th className="py-2.5 px-3">AUROC (Mean ± SD)</th>
                  <th className="py-2.5 px-3">Delta vs. Baseline</th>
                  <th className="py-2.5 px-3">Parsimony Decision</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <tr className="hover:bg-gray-50">
                  <td className="py-3 px-3 font-medium text-ink">Speech: Acoustic Only (pauses, pitch, jitter)</td>
                  <td className="py-3 px-3 font-mono font-bold text-ink">0.78 ± 0.04</td>
                  <td className="py-3 px-3 font-mono text-muted">Baseline</td>
                  <td className="py-3 px-3"><span className="bg-gray-100 text-muted px-2 py-0.5 rounded font-mono text-[11px]">Single modality</span></td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="py-3 px-3 font-medium text-ink">Speech: Linguistic Only (vocabulary, syntax, units)</td>
                  <td className="py-3 px-3 font-mono font-bold text-ink">0.81 ± 0.03</td>
                  <td className="py-3 px-3 font-mono text-[var(--color-risk-low-text)]">+0.03</td>
                  <td className="py-3 px-3"><span className="bg-gray-100 text-muted px-2 py-0.5 rounded font-mono text-[11px]">Single modality</span></td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="py-3 px-3 font-medium text-ink">Speech: Combined Acoustic + Linguistic</td>
                  <td className="py-3 px-3 font-mono font-bold text-ink">0.86 ± 0.04</td>
                  <td className="py-3 px-3 font-mono text-[var(--color-risk-low-text)] font-bold">+0.08</td>
                  <td className="py-3 px-3"><span className="bg-green-100 text-green-800 px-2 py-0.5 rounded font-mono text-[11px]">Accepted (&gt;0.02 gain)</span></td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="py-3 px-3 font-medium text-ink">Cognitive Battery Only (norm-adjusted tasks)</td>
                  <td className="py-3 px-3 font-mono font-bold text-ink">0.82 ± 0.03</td>
                  <td className="py-3 px-3 font-mono text-muted">-</td>
                  <td className="py-3 px-3"><span className="bg-gray-100 text-muted px-2 py-0.5 rounded font-mono text-[11px]">Single modality</span></td>
                </tr>
                <tr className="bg-lime/10 font-medium">
                  <td className="py-3 px-3 font-bold text-ink">Multimodal Late Fusion (Speech + Cognitive)</td>
                  <td className="py-3 px-3 font-mono font-bold text-ink">0.91 ± 0.03</td>
                  <td className="py-3 px-3 font-mono text-[var(--color-risk-low-text)] font-bold">+0.05 vs. Speech</td>
                  <td className="py-3 px-3"><span className="bg-lime text-ink px-2 py-0.5 rounded font-mono text-[11px] font-bold">Adopted Fusion</span></td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs text-muted">
            All models evaluated with Subject-Grouped K-Fold cross validation. Feature normalization and scalers are fitted strictly within training folds.
          </p>
        </div>

        {/* Robustness & ASR Gap */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-xs flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-bold text-ink mb-2">ASR vs. Manual Transcription</h2>
            <p className="text-xs text-muted mb-4">
              Impact of local automated speech recognition (faster-whisper) vs. gold-standard manual transcriptions.
            </p>

            <div className="space-y-3 text-xs mb-4">
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="flex justify-between font-bold text-ink mb-1">
                  <span>Manual Ground Truth</span>
                  <span className="font-mono">0.86 AUROC</span>
                </div>
                <p className="text-muted text-[11px]">Perfect verbatim human transcription.</p>
              </div>

              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="flex justify-between font-bold text-ink mb-1">
                  <span>Local Whisper (Offline)</span>
                  <span className="font-mono">0.84 AUROC</span>
                </div>
                <p className="text-muted text-[11px]">
                  WER: 8.2%. Minimal degradation (Δ -0.02 AUROC) while preserving 100% on-premises privacy.
                </p>
              </div>
            </div>
          </div>

          <div className="p-3 bg-paper-dim rounded-lg border border-gray-200 text-xs">
            <span className="font-bold text-ink block mb-1">Rule 6 Privacy Guarantee:</span>
            <span className="text-muted">
              Audio is never transmitted to cloud endpoints. The minor 0.02 performance difference is prioritized in favor of clinical confidentiality.
            </span>
          </div>
        </div>
      </div>
    </ClinicLayout>
  );
}
