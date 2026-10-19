# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### Added
- **Dedicated Doctor & Patient Login Portals and Role-Based Route Isolation**:
  - Created dedicated Clinic Doctor & Admin Login page (`/login/clinic`, `/login/doctor`, `/login/admin`) featuring institutional clinical design (`data-mode="clinic"`), clinic affiliation selection, medical registration verification, and 1-click doctor presets (Dr. Priya Sharma, Dr. Rahul Mehta).
  - Created senior-accessible Patient Login page (`/login/patient`) featuring high-contrast Atkinson Hyperlegible Next styling (`data-mode="patient"`), local on-device privacy notices, and 1-click patient presets (Anita Deshmukh, Gopal Joshi, Guest Participant).
  - Built dedicated Patient Portal Dashboard (`/patient`) featuring welcoming patient greeting, 8-minute screening trigger (`/screen`), Pune memory clinic locator (`/clinics`), screening status tracking, and on-device privacy guarantee cards.
  - Implemented role-based route guards (`ClinicianRoute`, `PatientRoute` in `ProtectedRoute.tsx`) ensuring doctor tools (`/clinic`, `/clinic/session/:id`, `/twin`, `/evidence`, `/fairness`) are only accessible by authenticated clinicians, and redirecting patients exclusively to patient features.
  - Added `useAuthStore` with Zustand and `localStorage` persistence, supporting credentials, session management, and instant profile switching.
  - Updated `NavPill`, `Hero`, `ClinicLayout`, `AskBand`, and `Footer` with dual login entry points, dynamic authenticated user badges, and sign-out controls.
- **Tabular Risk Screening Pipeline**: Integrated a complete, leakage-safe multimodal tabular risk screening pipeline (`src/cognisense/models/screening_pipeline.py` & `src/cognisense/models/screening_model.py`) featuring clinical domain feature engineering, Stratified 5-Fold cross-validation, and Platt scaling probability calibration.
- **Reproducible Training & Audit Reports**: Added `scripts/train_screening_model.py` generating auditable metrics (`reports/screening_metrics.json`) and serialized model artifacts (`alzheimers_risk_model.pkl`).
- **Online FastAPI Screening Endpoint**: Added `/v1/screen/tabular-risk` endpoint to `src/cognisense/api/main.py` with Pydantic validation schemas (`TabularRiskInput`, `TabularRiskResult`) and non-diagnostic clinical decision support guidance.
- **Automated Test Suite**: Added `tests/test_screening_pipeline.py` covering synthetic generation, leakage prevention, domain feature engineering, probability calibration, risk tiering, and API integration.
- **Frontend F0**: Setup Vite + React 18 + Tailwind v4 + MSW with `patient`, `clinic`, and `landing` density modes.
- **Frontend F1**: Built core design system components (RiskTierBadge, IntervalBar, TiltCard, NavPill, DataQualityBanner, etc.) matching calm-variant specs.
- **Frontend F2**: Assembled the Landing Page (`/`) with scroll animations, tabbed previews, and dynamic mock metric evaluation displays.
- **Frontend F3**: Implemented the Patient Screening Flow (`/screen`) powered by a Zustand state machine containing Mic checks, trace tasks, and memory recall, without persisting PHI to storage.
- **Frontend F4**: Built the Clinician Dashboard (`/clinic`) featuring queue list, KPI strips, horizontal contribution charts (SHAP), cognitive domain z-score bars, speech pause timelines, and interactive threshold simulations.
- **Multilingual Support**: Added LanguageSwitcher button and i18next support for English, Hindi (हिन्दी), and Marathi (मराठी) across the patient screening flow, landing page, and clinician dashboard with localized memory word lists.
- **Pune Nearest Clinic Finder & Interactive Map (`/clinics`)**: Integrated a dedicated clinic locator and interactive Leaflet map featuring verified memory clinics, geriatric care units, and tertiary neurology hospitals across Pune (Deenanath Mangeshkar, Ruby Hall, Jehangir, Sahyadri, KEM, Manipal Kharadi/Baner, Bharati Hospital). Supports GPS proximity calculation, Pune Standard Center reference, multilingual hospital details (मराठी, हिन्दी, English), zone filtering, and integrated post-screening recommendation cards.
- **Frontend F5 (Evidence, Fairness, and Privacy Pages)**: Implemented dedicated routes and pages for Evidence (`/evidence`), Fairness Audit (`/evidence/fairness`, `/fairness`), and Privacy & Compliance (`/privacy`) with interactive Recharts visualizations, subgroup audits, proxy probes, GDPR right-to-erasure simulation, and immutable audit logs. Updated `ClinicLayout` and `routes.tsx` with client-side SPA navigation.
- **CogniTwin (Digital Twin Architecture - Happiest Health CRP Challenge 2026)**:
  - **Synthetic Multimodal Datasets**: Implemented generator for `ehr_static_1000.csv`, `wearable_timeseries_7days_7000.csv`, `fused_patient_dataset_1000.csv`, `patient_daily_state.csv`, and `future_events.csv`.
  - **Daily Patient State Engine**: Time-indexed state representation computing 3-day and 7-day rolling means, slopes, personal baseline deviations, and deterministic state transitions (Stable, Physiological Decline, Data Quality Alert, Elevated Cognitive Risk).
  - **Persistent SQLite Storage**: SQLite database (`data/cognitwin.db`) maintaining longitudinal records, observations, states, and prediction audit logs.
  - **Calibrated Future-Event Prediction Pipeline**: 30-day cognitive deterioration prediction (`cognitive_deterioration_30d`) with Platt scaling, 95% Wilson confidence intervals, and SHAP-based feature attributions. Evaluated with 5-fold grouped cross-validation (ROC-AUC 0.982, PR-AUC 0.936, Brier 0.044).
  - **What-If Intervention Simulator**: Real-time counterfactual model sensitivity simulation for sleep duration, physical steps, autonomic HRV, and medication adherence.
  - **Clinician Dashboards**: Upgraded Streamlit dashboard (`app/pages/2_Clinician_Dashboard.py`) with timeline scrubber, interactive Plotly charts, state transition diffs, and export options; created React web portal view (`web/src/pages/DigitalTwin.tsx` at `/twin`).
  - **REST API Endpoints**: Full FastAPI suite (`/v1/twin/...`) supporting patient retrieval, streaming ingestion, state inspection, predictions, and simulation.
  - **Comprehensive Test Suite**: Automated verification in `tests/test_digital_twin.py` (8 passing unit & integration tests) and judge demonstration CLI (`scripts/run_twin_demo.py`).
  - **Hackathon Presentation Documentation**: Added complete pitch deck guide, slide-by-slide blueprint, live demo playbook, and judge Q&A reference in `docs/HACKATHON_PRESENTATION.md` and Microsoft Word format (`docs/CogniTwin_Hackathon_Presentation.docx`).
  - **Consumer-Ready UI/UX Overhaul & Page Consolidation**: Redesigned Streamlit dashboard (`frontend/streamlit/Home.py`) to match the warm aesthetic of the React main site (`localhost:5173`) with custom `.streamlit/config.toml` (paper `#FBF7F0`, ink `#111111`, cream `#F1EADF`), floating NavPill header, calm disclaimer banner, and rounded KPI cards. Removed redundant and unpolished subpages in `frontend/streamlit/pages/`, consolidating into a streamlined 3-tab consumer portal (Patient Digital Twin with What-If Simulator, Pune Memory Clinic Finder, and Clinical Validation Audit).
  - **Landing Page Hero Cleanup**: Removed the unfinished rising tablet mockup and placeholder picture box from `frontend/react/src/components/landing/Hero.tsx`, creating a clean hero section with direct CTA buttons to Launch Digital Twin and Clinician Demo.
  - **Zero-Config Public Launch & Tunnels**: Configured `allowedHosts: true` in `vite.config.ts` and `vercel.json` rewrite routing. Deployed secure, zero-password public HTTPS live tunnels for both the React patient/landing web app and the Streamlit Clinician Digital Twin dashboard for friction-free judge evaluation.
  - **Vercel Production Deployment**: Successfully deployed the React Consumer Portal to Vercel production edge network (`https://web-kappa-three-89.vercel.app`) with full client-side SPA routing for all subpaths (`/twin`, `/screen`, `/clinics`, `/clinic`).
  - **End-to-End Feature Completeness & 'Session not found' Fix**:
    - **Standalone Clinical Session Repository (`src/api/sessionRepository.ts`)**: Built a client-side data service with complete clinical records for all queue sessions (`7F3A`, `8E4D`, `1A5B`, `2B9C`) plus dynamic session synthesis for any arbitrary ID, permanently eliminating "Session not found" 404 errors on static deployments.
    - **Reactive Clinician Queue Store (`src/state/clinicQueueStore.ts`)**: Added a persistent Zustand store with real-time multi-field search filtering (by ID, age band, risk tier, status, modalities) and dynamic tab counts ("All", "Needs review", "Reviewed").
    - **Stateful Clinical Sign-Off Workflow**: Integrated clinician verification in `ContextPanel.tsx` that transitions sessions to "Reviewed", stores contextual notes, records reviewer attribution, and moves items between queue tabs.
    - **Printable Clinical Summary Export**: Wired the "Export ▾" button in `ContextPanel.tsx` to an interactive Clinical Summary modal with browser print / PDF export support (`window.print()`) featuring risk interval bars, SHAP feature waterfalls, and Rule 7 compliance disclaimers.
    - **Closed Patient-to-Clinic Screening Loop**: Updated `Done.tsx` so completing a screening session on `/screen` registers the new session in the repository and automatically inserts it into the clinician screening queue for physician review.
    - **Clinician Navigation Integration**: Added `Patient Twin` (`/twin`) to the clinician navigation header in `ClinicLayout.tsx` for seamless movement between screening queue, twin telemetry, evidence, fairness, and privacy.
    - **Production MSW Resilience**: Updated `main.tsx` and `handlers.ts` to support client-side service worker API interception in production environments alongside the zero-dependency repository fallback.






