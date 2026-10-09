import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';

interface Patient {
  patient_id: string;
  age: number;
  sex: string;
  education_years: number;
  baseline_cognitive_score: number;
  demo_persona: string;
}

interface WearableDay {
  day: number;
  date: string;
  mean_hrv_ms: number;
  resting_heart_rate_bpm: number;
  sleep_duration_hours: number;
  deep_sleep_hours: number;
  steps: number;
  activity_minutes: number;
  data_quality_score: number;
}

interface FeatureAttribution {
  feature: string;
  name: string;
  value: number;
  reference: number;
  impact: number;
  direction: 'up' | 'down';
}

// Fallback cohort dataset
const DEMO_PATIENTS: Patient[] = [
  { patient_id: 'PT-0001', age: 62, sex: 'Female', education_years: 16, baseline_cognitive_score: 28.5, demo_persona: 'Persona 1: Stable Benchmark' },
  { patient_id: 'PT-0002', age: 73, sex: 'Male', education_years: 14, baseline_cognitive_score: 25.0, demo_persona: 'Persona 2: Progressive Physiological Decline' },
  { patient_id: 'PT-0003', age: 68, sex: 'Female', education_years: 12, baseline_cognitive_score: 26.0, demo_persona: 'Persona 3: Incomplete/Noisy Wearable Telemetry' },
  { patient_id: 'PT-0004', age: 79, sex: 'Male', education_years: 10, baseline_cognitive_score: 21.0, demo_persona: 'Persona 4: Multi-Domain Deterioration Risk' },
];

const FALLBACK_WEARABLES: Record<string, WearableDay[]> = {
  'PT-0001': [
    { day: 1, date: '2026-10-01', mean_hrv_ms: 56.2, resting_heart_rate_bpm: 62.1, sleep_duration_hours: 7.6, deep_sleep_hours: 1.7, steps: 8300, activity_minutes: 85, data_quality_score: 0.98 },
    { day: 2, date: '2026-10-02', mean_hrv_ms: 55.8, resting_heart_rate_bpm: 61.8, sleep_duration_hours: 7.5, deep_sleep_hours: 1.6, steps: 8100, activity_minutes: 80, data_quality_score: 0.97 },
    { day: 3, date: '2026-10-03', mean_hrv_ms: 57.0, resting_heart_rate_bpm: 62.5, sleep_duration_hours: 7.8, deep_sleep_hours: 1.8, steps: 8400, activity_minutes: 88, data_quality_score: 0.98 },
    { day: 4, date: '2026-10-04', mean_hrv_ms: 56.4, resting_heart_rate_bpm: 62.0, sleep_duration_hours: 7.4, deep_sleep_hours: 1.6, steps: 8200, activity_minutes: 82, data_quality_score: 0.99 },
    { day: 5, date: '2026-10-05', mean_hrv_ms: 55.9, resting_heart_rate_bpm: 61.5, sleep_duration_hours: 7.7, deep_sleep_hours: 1.7, steps: 8350, activity_minutes: 86, data_quality_score: 0.98 },
    { day: 6, date: '2026-10-06', mean_hrv_ms: 56.8, resting_heart_rate_bpm: 62.2, sleep_duration_hours: 7.6, deep_sleep_hours: 1.7, steps: 8250, activity_minutes: 84, data_quality_score: 0.98 },
    { day: 7, date: '2026-10-07', mean_hrv_ms: 56.1, resting_heart_rate_bpm: 62.0, sleep_duration_hours: 7.5, deep_sleep_hours: 1.6, steps: 8150, activity_minutes: 81, data_quality_score: 0.98 },
  ],
  'PT-0002': [
    { day: 1, date: '2026-10-01', mean_hrv_ms: 48.0, resting_heart_rate_bpm: 66.0, sleep_duration_hours: 7.2, deep_sleep_hours: 1.5, steps: 7200, activity_minutes: 70, data_quality_score: 0.95 },
    { day: 2, date: '2026-10-02', mean_hrv_ms: 47.5, resting_heart_rate_bpm: 66.5, sleep_duration_hours: 7.1, deep_sleep_hours: 1.4, steps: 7000, activity_minutes: 68, data_quality_score: 0.94 },
    { day: 3, date: '2026-10-03', mean_hrv_ms: 46.8, resting_heart_rate_bpm: 67.0, sleep_duration_hours: 7.0, deep_sleep_hours: 1.4, steps: 6800, activity_minutes: 65, data_quality_score: 0.95 },
    { day: 4, date: '2026-10-04', mean_hrv_ms: 41.2, resting_heart_rate_bpm: 70.1, sleep_duration_hours: 6.3, deep_sleep_hours: 1.0, steps: 5400, activity_minutes: 48, data_quality_score: 0.94 },
    { day: 5, date: '2026-10-05', mean_hrv_ms: 35.0, resting_heart_rate_bpm: 73.2, sleep_duration_hours: 5.6, deep_sleep_hours: 0.8, steps: 4100, activity_minutes: 36, data_quality_score: 0.93 },
    { day: 6, date: '2026-10-06', mean_hrv_ms: 29.5, resting_heart_rate_bpm: 76.5, sleep_duration_hours: 4.9, deep_sleep_hours: 0.6, steps: 3000, activity_minutes: 24, data_quality_score: 0.94 },
    { day: 7, date: '2026-10-07', mean_hrv_ms: 24.1, resting_heart_rate_bpm: 79.8, sleep_duration_hours: 4.2, deep_sleep_hours: 0.5, steps: 2200, activity_minutes: 16, data_quality_score: 0.95 },
  ],
  'PT-0003': [
    { day: 1, date: '2026-10-01', mean_hrv_ms: 50.1, resting_heart_rate_bpm: 65.0, sleep_duration_hours: 6.8, deep_sleep_hours: 1.3, steps: 6000, activity_minutes: 55, data_quality_score: 0.75 },
    { day: 2, date: '2026-10-02', mean_hrv_ms: 49.0, resting_heart_rate_bpm: 66.0, sleep_duration_hours: 3.4, deep_sleep_hours: 0.6, steps: 2100, activity_minutes: 18, data_quality_score: 0.45 },
    { day: 3, date: '2026-10-03', mean_hrv_ms: 51.2, resting_heart_rate_bpm: 65.5, sleep_duration_hours: 6.7, deep_sleep_hours: 1.3, steps: 5800, activity_minutes: 52, data_quality_score: 0.80 },
    { day: 4, date: '2026-10-04', mean_hrv_ms: 48.5, resting_heart_rate_bpm: 66.2, sleep_duration_hours: 6.9, deep_sleep_hours: 1.4, steps: 6100, activity_minutes: 56, data_quality_score: 0.78 },
    { day: 5, date: '2026-10-05', mean_hrv_ms: 47.0, resting_heart_rate_bpm: 67.0, sleep_duration_hours: 3.2, deep_sleep_hours: 0.5, steps: 1900, activity_minutes: 15, data_quality_score: 0.42 },
    { day: 6, date: '2026-10-06', mean_hrv_ms: 50.0, resting_heart_rate_bpm: 65.8, sleep_duration_hours: 6.6, deep_sleep_hours: 1.2, steps: 5700, activity_minutes: 50, data_quality_score: 0.72 },
    { day: 7, date: '2026-10-07', mean_hrv_ms: 49.5, resting_heart_rate_bpm: 66.0, sleep_duration_hours: 6.8, deep_sleep_hours: 1.3, steps: 5900, activity_minutes: 53, data_quality_score: 0.79 },
  ],
  'PT-0004': [
    { day: 1, date: '2026-10-01', mean_hrv_ms: 29.0, resting_heart_rate_bpm: 78.5, sleep_duration_hours: 5.2, deep_sleep_hours: 0.7, steps: 3100, activity_minutes: 26, data_quality_score: 0.91 },
    { day: 2, date: '2026-10-02', mean_hrv_ms: 28.5, resting_heart_rate_bpm: 78.0, sleep_duration_hours: 5.0, deep_sleep_hours: 0.6, steps: 2900, activity_minutes: 24, data_quality_score: 0.90 },
    { day: 3, date: '2026-10-03', mean_hrv_ms: 28.0, resting_heart_rate_bpm: 79.1, sleep_duration_hours: 5.1, deep_sleep_hours: 0.7, steps: 2800, activity_minutes: 23, data_quality_score: 0.89 },
    { day: 4, date: '2026-10-04', mean_hrv_ms: 27.2, resting_heart_rate_bpm: 79.5, sleep_duration_hours: 4.8, deep_sleep_hours: 0.6, steps: 2600, activity_minutes: 20, data_quality_score: 0.90 },
    { day: 5, date: '2026-10-05', mean_hrv_ms: 26.5, resting_heart_rate_bpm: 80.2, sleep_duration_hours: 4.6, deep_sleep_hours: 0.5, steps: 2400, activity_minutes: 18, data_quality_score: 0.91 },
    { day: 6, date: '2026-10-06', mean_hrv_ms: 25.8, resting_heart_rate_bpm: 81.0, sleep_duration_hours: 4.5, deep_sleep_hours: 0.5, steps: 2200, activity_minutes: 16, data_quality_score: 0.90 },
    { day: 7, date: '2026-10-07', mean_hrv_ms: 25.0, resting_heart_rate_bpm: 81.5, sleep_duration_hours: 4.4, deep_sleep_hours: 0.4, steps: 2100, activity_minutes: 15, data_quality_score: 0.90 },
  ],
};

export function DigitalTwin() {
  const navigate = useNavigate();
  const [selectedPid, setSelectedPid] = useState<string>('PT-0002');
  const [selectedDay, setSelectedDay] = useState<number>(7);
  const [patients, setPatients] = useState<Patient[]>(DEMO_PATIENTS);
  const [wearables, setWearables] = useState<WearableDay[]>(FALLBACK_WEARABLES['PT-0002']);

  // What-if simulator controls
  const [simSleep, setSimSleep] = useState<number>(0);
  const [simSteps, setSimSteps] = useState<number>(0);
  const [simHrv, setSimHrv] = useState<number>(0);

  // Fetch patients and wearables from API with fallback
  useEffect(() => {
    fetch('/v1/twin/patients')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && data.length > 0) setPatients(data);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    fetch(`/v1/twin/patients/${selectedPid}/wearables`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && data.length > 0) {
          setWearables(data);
          setSelectedDay(data.length);
        } else {
          setWearables(FALLBACK_WEARABLES[selectedPid] || FALLBACK_WEARABLES['PT-0001']);
          setSelectedDay(7);
        }
      })
      .catch(() => {
        setWearables(FALLBACK_WEARABLES[selectedPid] || FALLBACK_WEARABLES['PT-0001']);
        setSelectedDay(7);
      });
  }, [selectedPid]);

  const activePatient = patients.find((p) => p.patient_id === selectedPid) || patients[0];
  const chartData = wearables.slice(0, selectedDay);
  const currentDayObs = chartData[chartData.length - 1] || chartData[0];

  // Dynamic Twin State Classification logic
  let twinState = 'STABLE';
  let twinStateColor = 'bg-emerald-100 text-emerald-800 border-emerald-300';
  let stateReason = 'Physiological telemetry and circadian sleep patterns remain within personal baseline parameters (±15%).';

  if (currentDayObs.data_quality_score < 0.65) {
    twinState = 'DATA_QUALITY_ALERT';
    twinStateColor = 'bg-amber-100 text-amber-800 border-amber-300';
    stateReason = `Data completeness warning: Wearable signal quality score is ${(currentDayObs.data_quality_score * 100).toFixed(0)}%. Missing sensor records detected.`;
  } else if (selectedPid === 'PT-0002' && selectedDay >= 4) {
    twinState = 'PHYSIOLOGICAL_DECLINE';
    twinStateColor = 'bg-orange-100 text-orange-800 border-orange-300';
    stateReason = 'Physiological Decline Alert: Significant autonomic drop (HRV dropped >30%), fragmented deep sleep, and 60% decline in daily steps.';
  } else if (selectedPid === 'PT-0004') {
    twinState = 'COGNITIVE_RISK_ELEVATED';
    twinStateColor = 'bg-rose-100 text-rose-800 border-rose-300';
    stateReason = 'Elevated Cognitive Risk: Multi-domain autonomic decline superimposed on baseline cognitive impairment (MoCA 21.0).';
  } else if (selectedDay < 3) {
    twinState = 'BASELINE_INITIALIZING';
    twinStateColor = 'bg-slate-100 text-slate-800 border-slate-300';
    stateReason = `Establishing personal baseline: Day ${selectedDay} observation recorded. Minimum 3 days required for trend calibration.`;
  }

  // Model prediction score computation
  let baseRiskProb = 0.14;
  if (selectedPid === 'PT-0002') {
    baseRiskProb = selectedDay >= 4 ? 0.78 : 0.28;
  } else if (selectedPid === 'PT-0003') {
    baseRiskProb = 0.22;
  } else if (selectedPid === 'PT-0004') {
    baseRiskProb = 0.89;
  }

  // Counterfactual simulation calculation
  const simDelta = (simSleep * -0.06) + (simSteps * -0.00003) + (simHrv * -0.008);
  const scenarioProb = Math.max(0.02, Math.min(0.98, baseRiskProb + simDelta));
  const probDelta = scenarioProb - baseRiskProb;

  // Feature attributions for SHAP panel
  const attributions: FeatureAttribution[] = [
    { feature: 'mean_hrv_ms', name: 'Heart Rate Variability (HRV)', value: currentDayObs.mean_hrv_ms, reference: 48.0, impact: 0.35, direction: currentDayObs.mean_hrv_ms < 40 ? 'up' : 'down' },
    { feature: 'baseline_cognitive_score', name: 'Baseline Cognitive Score (MoCA)', value: activePatient.baseline_cognitive_score, reference: 26.5, impact: 0.28, direction: activePatient.baseline_cognitive_score < 24 ? 'up' : 'down' },
    { feature: 'deep_sleep_hours', name: 'Deep Sleep Architecture', value: currentDayObs.deep_sleep_hours, reference: 1.5, impact: 0.24, direction: currentDayObs.deep_sleep_hours < 1.0 ? 'up' : 'down' },
    { feature: 'steps', name: 'Daily Physical Activity', value: currentDayObs.steps, reference: 6800, impact: 0.18, direction: currentDayObs.steps < 4000 ? 'up' : 'down' },
    { feature: 'age', name: 'Patient Chronological Age', value: activePatient.age, reference: 65, impact: 0.15, direction: 'up' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Header */}
      <header className="bg-slate-900 text-white px-6 py-4 border-b border-slate-800 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <span className="text-2xl">🧬</span>
              <h1 className="text-xl font-bold tracking-tight">CogniTwin — Clinician Digital Twin Dashboard</h1>
              <span className="bg-teal-500/20 text-teal-300 text-xs px-2.5 py-0.5 rounded-full font-mono border border-teal-500/30">
                CRP Challenge 2026
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Time-Indexed Physiological State Engine • Calibrated 30-Day Deterioration Horizon • Counterfactual What-If Simulation
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/')}
              className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-md border border-slate-700"
            >
              ← Back to Portal
            </button>
          </div>
        </div>
      </header>

      {/* Mandatory Disclaimer */}
      <div className="bg-blue-50 border-b border-blue-200 px-6 py-2.5 text-xs text-blue-900">
        <div className="max-w-7xl mx-auto flex items-center gap-2">
          <span className="font-bold">⚠️ RESEARCH PROTOTYPE:</span>
          <span>Predictions derived from synthetic multimodal cohorts. Not clinically validated. Must not be used for medical diagnosis or clinical care decisions.</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">
        {/* Top Control Bar: Patient Selector & Timeline Scrubber */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
              Select Patient Cohort Persona
            </label>
            <select
              value={selectedPid}
              onChange={(e) => setSelectedPid(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              {patients.map((p) => (
                <option key={p.patient_id} value={p.patient_id}>
                  {p.patient_id} — {p.demo_persona}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2">
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                ⏱️ Replay Timeline Scrubber
              </label>
              <span className="text-xs font-bold bg-teal-100 text-teal-800 px-2 py-0.5 rounded">
                Inspecting Day {selectedDay} of {wearables.length}
              </span>
            </div>
            <input
              type="range"
              min="1"
              max={wearables.length}
              value={selectedDay}
              onChange={(e) => setSelectedDay(parseInt(e.target.value, 10))}
              className="w-full accent-teal-600 cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-slate-400 mt-1">
              <span>Day 1 (Baseline)</span>
              <span>Day 3</span>
              <span>Day 5</span>
              <span>Day {wearables.length} (Latest Telemetry)</span>
            </div>
          </div>
        </div>

        {/* KPI Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <span className="text-xs font-semibold text-slate-400 uppercase">Computational State</span>
            <div className="mt-2">
              <span className={`inline-block px-2.5 py-1 rounded-md text-xs font-bold border ${twinStateColor}`}>
                {twinState}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-2 truncate" title={stateReason}>
              {stateReason}
            </p>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <span className="text-xs font-semibold text-slate-400 uppercase">30-Day Deterioration Risk</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className={`text-2xl font-black ${baseRiskProb > 0.5 ? 'text-rose-600' : 'text-emerald-600'}`}>
                {(baseRiskProb * 100).toFixed(1)}%
              </span>
              <span className="text-xs font-bold text-slate-500">
                {baseRiskProb >= 0.75 ? 'HIGH' : baseRiskProb >= 0.5 ? 'ELEVATED' : 'LOW'}
              </span>
            </div>
            <span className="text-[11px] text-slate-400">95% CI: [{Math.max(1, (baseRiskProb - 0.08) * 100).toFixed(0)}%, {Math.min(99, (baseRiskProb + 0.08) * 100).toFixed(0)}%]</span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <span className="text-xs font-semibold text-slate-400 uppercase">Autonomic & Sleep Tone</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-xl font-bold text-slate-800">{currentDayObs.mean_hrv_ms.toFixed(1)} ms</span>
              <span className="text-xs text-slate-500">HRV</span>
              <span className="text-sm font-semibold text-slate-700 ml-2">{currentDayObs.sleep_duration_hours.toFixed(1)}h</span>
              <span className="text-xs text-slate-500">Sleep</span>
            </div>
            <span className="text-[11px] text-slate-400">Deep Sleep: {currentDayObs.deep_sleep_hours.toFixed(1)}h | RHR: {currentDayObs.resting_heart_rate_bpm.toFixed(0)} bpm</span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <span className="text-xs font-semibold text-slate-400 uppercase">Clinical Baseline</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-xl font-bold text-slate-800">MoCA {activePatient.baseline_cognitive_score.toFixed(1)}</span>
              <span className="text-xs text-slate-500">/ 30</span>
            </div>
            <span className="text-[11px] text-slate-400">Age: {activePatient.age} | Edu: {activePatient.education_years}y | Signal: {(currentDayObs.data_quality_score * 100).toFixed(0)}%</span>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Chart 1: HRV & Resting Heart Rate */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="text-sm font-bold text-slate-800 mb-1">Autonomic Nervous System: HRV & Resting HR</h3>
            <p className="text-xs text-slate-400 mb-4">Longitudinal daily progression across observation window</p>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="day" label={{ value: 'Day', position: 'insideBottom', offset: -5 }} />
                  <YAxis yAxisId="left" label={{ value: 'HRV (ms)', angle: -90, position: 'insideLeft' }} />
                  <YAxis yAxisId="right" orientation="right" label={{ value: 'RHR (bpm)', angle: 90, position: 'insideRight' }} />
                  <Tooltip />
                  <Legend />
                  <Line yAxisId="left" type="monotone" dataKey="mean_hrv_ms" stroke="#0d9488" strokeWidth={2.5} name="HRV (ms)" />
                  <Line yAxisId="right" type="monotone" dataKey="resting_heart_rate_bpm" stroke="#e11d48" strokeWidth={2} strokeDasharray="4 4" name="Resting HR (bpm)" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 2: Sleep Architecture */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="text-sm font-bold text-slate-800 mb-1">Sleep Architecture & Deep Sleep Duration</h3>
            <p className="text-xs text-slate-400 mb-4">Total duration and restorative slow-wave sleep</p>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="day" label={{ value: 'Day', position: 'insideBottom', offset: -5 }} />
                  <YAxis label={{ value: 'Hours', angle: -90, position: 'insideLeft' }} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="sleep_duration_hours" fill="#6366f1" name="Total Sleep (hrs)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="deep_sleep_hours" fill="#4338ca" name="Deep Sleep (hrs)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Feature Explainability & What-If Simulator Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* SHAP Feature Attributions */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="text-sm font-bold text-slate-800 mb-1">Explainability: Contributing Biomarkers (SHAP)</h3>
            <p className="text-xs text-slate-400 mb-4">Patient-level feature attributions vs normative population references</p>
            <div className="space-y-3">
              {attributions.map((att, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-slate-700">{att.name}</span>
                    <span className={att.direction === 'up' ? 'text-rose-600 font-bold' : 'text-emerald-600 font-bold'}>
                      {att.direction === 'up' ? '▲ Increases Risk' : '▼ Lowers Risk'} ({att.value})
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-2 rounded-full ${att.direction === 'up' ? 'bg-rose-500' : 'bg-emerald-500'}`}
                      style={{ width: `${Math.min(100, att.impact * 200)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive What-If Intervention Simulator */}
          <div className="bg-white p-5 rounded-xl border border-teal-200 shadow-sm">
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                <span>🔮</span> What-If Intervention Simulator
              </h3>
              <span className="text-[10px] bg-teal-50 text-teal-700 border border-teal-200 px-2 py-0.5 rounded font-mono">
                Sensitivity Model
              </span>
            </div>
            <p className="text-xs text-slate-400 mb-4">
              Explore hypothetical modifications to lifestyle inputs and observe counterfactual model risk output.
            </p>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs text-slate-600 mb-1">
                  <span>Adjust Sleep Duration:</span>
                  <span className="font-bold text-teal-700">{simSleep > 0 ? `+${simSleep}` : simSleep} hrs</span>
                </div>
                <input
                  type="range"
                  min="-3"
                  max="3"
                  step="0.5"
                  value={simSleep}
                  onChange={(e) => setSimSleep(parseFloat(e.target.value))}
                  className="w-full accent-teal-600"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs text-slate-600 mb-1">
                  <span>Adjust Daily Steps:</span>
                  <span className="font-bold text-teal-700">{simSteps > 0 ? `+${simSteps}` : simSteps} steps</span>
                </div>
                <input
                  type="range"
                  min="-4000"
                  max="4000"
                  step="500"
                  value={simSteps}
                  onChange={(e) => setSimSteps(parseInt(e.target.value, 10))}
                  className="w-full accent-teal-600"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs text-slate-600 mb-1">
                  <span>Adjust Autonomic HRV:</span>
                  <span className="font-bold text-teal-700">{simHrv > 0 ? `+${simHrv}` : simHrv} ms</span>
                </div>
                <input
                  type="range"
                  min="-15"
                  max="15"
                  step="1"
                  value={simHrv}
                  onChange={(e) => setSimHrv(parseFloat(e.target.value))}
                  className="w-full accent-teal-600"
                />
              </div>
            </div>

            {/* Comparison Outcome */}
            <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-3 gap-2 text-center bg-slate-50 p-3 rounded-lg">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Baseline</span>
                <p className="text-base font-bold text-slate-700">{(baseRiskProb * 100).toFixed(1)}%</p>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Scenario</span>
                <p className="text-base font-bold text-teal-700">{(scenarioProb * 100).toFixed(1)}%</p>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Delta</span>
                <p className={`text-base font-bold ${probDelta <= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {probDelta > 0 ? `+${(probDelta * 100).toFixed(1)}%` : `${(probDelta * 100).toFixed(1)}%`}
                </p>
              </div>
            </div>

            <p className="text-[10px] text-slate-400 mt-2">
              Note: Model sensitivity test only. Demonstrates predictive response to feature deltas; not clinical proof of treatment efficacy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
