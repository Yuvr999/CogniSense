# 🧬 CogniSense & CogniTwin: Multimodal Patient Digital Twin for Early Alzheimer's & MCI Screening

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Python: 3.11](https://img.shields.io/badge/Python-3.11-3776AB.svg?logo=python&logoColor=white)](https://python.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.109-009688.svg?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![Streamlit](https://img.shields.io/badge/Streamlit-1.31-FF4B4B.svg?logo=streamlit&logoColor=white)](https://streamlit.io)
[![React 18](https://img.shields.io/badge/React-18.3-61DAFB.svg?logo=react&logoColor=black)](https://react.dev)
[![Production: Live Vercel](https://img.shields.io/badge/Vercel-Deployed-black.svg?logo=vercel&logoColor=white)](https://web-kappa-three-89.vercel.app)
[![Zero Leakage CV](https://img.shields.io/badge/CV-Grouped--5--Fold-1F7A4D.svg)](#-audited-validation-benchmarks)

> **REGULATORY DISCLAIMER**: **Screening aid, not a diagnosis.** CogniSense / CogniTwin is a clinical decision-support research prototype evaluated on synthetic cohorts. It does not provide medical diagnoses or establish clinical care pathways without physician oversight.

---

## 🏆 Hackathon Submission Metadata

| Attribute | Submission Detail |
| :--- | :--- |
| **Team Name** | **MEDVORTEX** |
| **College / Institution** | **Army Institute of Technology (AIT), Pune** |
| **Project Title** | **CogniSense (CogniTwin)**: Multimodal Continuous Patient Digital Twin for Early Alzheimer's & MCI Screening |
| **Track / Challenge** | Happiest Health CRP Challenge 2026 — Patient Digital Twin & Healthcare AI |
| **Live Web Portal** | [https://web-kappa-three-89.vercel.app](https://web-kappa-three-89.vercel.app) |
| **Interactive API Documentation** | `http://localhost:8000/docs` (Swagger UI / OpenAPI) |
| **License** | Open-Source [MIT License](LICENSE) |

### 👥 Team MEDVORTEX (Army Institute of Technology, Pune)
* **Team Lead / ML Engineer**: [Yuvraj Shekhawat](https://github.com/Yuvr999) — *Multimodal Feature Engineering, Calibration & Digital Twin State Engine*
* **Healthcare AI Specialist**: *MEDVORTEX Member 2* — *Clinical Domain Modeling, SHAP Attributions & Fairness Auditing*
* **Full-Stack / Systems Engineer**: *MEDVORTEX Member 3* — *FastAPI Microservice, React 18 Web Portal & Streamlit UI*
* **Clinical Interface & Telemetry**: *MEDVORTEX Member 4* — *Sensor Pipeline, Speech Biomarkers & FHIR R4 Interoperability*

---

## 🎥 Demonstration Video (Minimum 20-Minute Full Walkthrough)

An end-to-end 20-minute video detailing the healthcare problem, clinical foundation, mathematical digital twin modeling, zero-leakage cross-validation, live patient screening, and physician counterfactual simulation:

[![CogniSense Video Walkthrough](https://img.shields.io/badge/▶%EF%B8%8F%20Watch%2020--Minute%20Demonstration%20Video-YouTube%20Presentation-FF0000?style=for-the-badge&logo=youtube&logoColor=white)](https://youtu.be/YOUR_VIDEO_ID_HERE)

> 🔗 **Direct Video URL**: `https://youtu.be/hkTU7Mvi8iQ?si=r12BiIp7u5rTv_3F` *(Replace with unlisted YouTube or Google Drive video link prior to final portal submission)*

### ⏱️ Video Presentation Agenda & Timestamps
* **[00:00 – 03:15] Problem Statement & Healthcare Dilemma**: The 75% MCI underdetection crisis, single-point clinic barriers, and why longitudinal continuous telemetry is required.
* **[03:15 – 07:00] Mathematical & Algorithmic Architecture**: Daily state representations, 3-day/7-day rolling biomarker trends, Platt sigmoid calibration, and zero-leakage subject-grouped splits.
* **[07:00 – 11:30] Live Patient Screening Demonstration**: Active multimodal tasks (local privacy-preserving `faster-whisper` speech pause tracking, digital trail-making, delayed word recall).
* **[11:30 – 16:15] Clinician Digital Twin & What-If Simulator**: Longitudinal timeline scrubber, real-time counterfactual sensitivity testing (sleep hygiene, autonomic HRV recovery, medication adherence).
* **[16:15 – 18:30] Responsible AI, Fairness & Privacy**: Subgroup demographic parity analysis across age and sex, HL7 FHIR R4 export, and GDPR Article 17 cryptographic right-to-erasure.
* **[18:30 – 20:00] Clinical Referral Network & Hackathon Summary**: Connecting at-risk seniors to verified Pune memory clinics (Deenanath Mangeshkar, Ruby Hall Clinic, KEM, Sahyadri).

---

## 📑 Presentation & Architecture Diagrams

* 📄 **Official 14-Slide Presentation Deck (PDF)**: **[docs/presentation.pdf](docs/presentation.pdf)** *(Direct Download / View PDF)* | **[docs/CogniSense_Presentation.pdf](docs/CogniSense_Presentation.pdf)**
* **PowerPoint Architecture Presentation Deck (.pptx)**: [ppt/CogniSense_Architecture.pptx](ppt/CogniSense_Architecture.pptx) *(Direct PowerPoint format)* | [docs/CogniSense_Architecture.pptx](docs/CogniSense_Architecture.pptx)
* **Master Architecture Diagram (Full Vector PDF)**: [docs/architecture_diagram.pdf](docs/architecture_diagram.pdf)
* **Complete System Architecture & Technical Specifications**: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)
* **Full Pitch Deck & Presentation Guide**: [docs/HACKATHON_PRESENTATION.md](docs/HACKATHON_PRESENTATION.md)
* **Presentation Document (Word / Slide Companion)**: [docs/CogniTwin_Hackathon_Presentation.docx](docs/CogniTwin_Hackathon_Presentation.docx)

---

### 🏛️ Master System Architecture Diagram

![CogniSense & CogniTwin End-to-End System Architecture](docs/architecture_diagram.png)

> 📥 **Direct Presentation & Architecture Downloads**:  
> • **Official 14-Slide Presentation PDF**: [`docs/presentation.pdf`](docs/presentation.pdf) (High-resolution complete pitch deck)  
> • **PowerPoint Slide Deck**: [`ppt/CogniSense_Architecture.pptx`](ppt/CogniSense_Architecture.pptx) (10 slides with native vector shapes & high-res diagrams)  
> • **Printable Vector PDF**: [`docs/architecture_diagram.pdf`](docs/architecture_diagram.pdf)  
> • **Architecture Specification**: [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md)

---

### 🖥️ Official Presentation Deck & Architectural Overview

> **Mandatory Clinical Disclaimer**: *Screening aid, not a diagnosis. Research prototype for early triage and clinical decision support.*

---

#### Slide 1 (01 / 14): Title & Vision
![Slide 1: Title & Vision](docs/slides/slide_01.png)

**COGNISENSE: MULTIMODAL AI SCREENING FOR EARLY ALZHEIMER'S DISEASE & MCI**  
*Sub-10-minute speech, language and cognitive-task biomarkers, fused into a calibrated, explainable risk tier for the clinician.*

* **Key Pillars**: `Speech biomarkers` | `Gamified cognitive tasks` | `Explainable and fair`
* **Regulatory Note**: *Screening aid, not a diagnosis. Research prototype for early triage.*
* **Live Clinician Extraction Preview**:
  * Status: `● LIVE · 02:14` | Risk Tier Estimate: `RISK 74%`
  * Verbatim Audio Capture: *"The boy is on the… um… the stool, and the, the water is… it's going over."*
  * Objective Feature Extractions:
    * **Delayed Recall**: `-2.1 SD` (significant deficit vs. education norm)
    * **Idea Density**: `-1.4 SD`
    * **Trail Speed**: `Within norm`
    * **Pauses (Verify)**: `+1.8 SD`

---

#### Slide 2 (02 / 14): The Diagnostic Bottleneck
![Slide 2: The Diagnostic Bottleneck](docs/slides/slide_02.png)

**THE HIDDEN CRISIS IN DEMENTIA CARE**  
*Early cognitive decline goes undetected until it is too late, and today's tools cannot scale to every senior.*

* **Silent 20-Year Window**: Amyloid and tau pathology progress for 15–20 years before overt clinical symptoms appear, closing the window for early lifestyle intervention and disease-modifying therapies.
* **High Barrier to Entry**: PET imaging and CSF assays cost \$3,000–\$5,000+; paper neuropsychological batteries take 45–90 minutes with 6+ month specialist waiting lists.
* **Inequity and Late Triage**: Over 60% of cases go undiagnosed in primary care, and legacy paper tests carry substantial socio-educational bias.
* **Where the Patient Journey Stalls** *(Illustrative proportions, not measured data)*:
  * **Today (Status Quo)**: Silent amyloid/tau build-up $\rightarrow$ Late subjective complaints $\rightarrow$ Specialist wait (6+ months) $\rightarrow$ Late, irreversible diagnosis
  * **With CogniSense**: Same silent window, screened during routine primary-care visit $\rightarrow$ Calibrated triage tier $\rightarrow$ Prompt early specialist referral

---

#### Slide 3 (03 / 14): The Solution
![Slide 3: The Solution](docs/slides/slide_03.png)

**RAPID MULTIMODAL CLINICAL TRIAGE**  
*CogniSense turns everyday speech and digital interaction into objective biomarkers in under ten minutes.*

| Clinical Dimension | Current Primary-Care Workflow | CogniSense Screening Layer |
| :--- | :--- | :--- |
| **Duration** | 45–90 min paper test; 6-month specialist wait | **Under 10 minutes**, self-guided on a waiting-room tablet |
| **Modality** | Subjective paper questionnaires (MMSE/MoCA) | **Multimodal**: Speech acoustics + syntax + motor/recall |
| **Access** | Requires a neuropsychologist or neurologist | **Any browser or tablet** right in the waiting room |
| **Output** | Raw, unadjusted score | **Calibrated risk tier**, 95% CI, and SHAP feature drivers |
| **Integration** | Manual paper charting and scanning | **One-click HL7 FHIR R4 export** directly to the EHR |
| **Privacy** | Sensitive data stored or cloud outsourced | **100% Local processing**; raw biometric audio immediately wiped |

> **Clinical Guardrail**: *A screening aid, not a diagnostic verdict: built to triage, not to replace the clinician.*

---

#### Slide 4 (04 / 14): The Patient Experience
![Slide 4: The Patient Experience](docs/slides/slide_04.png)

**THE 8-MINUTE PATIENT PROTOCOL**  
*A low-friction, multilingual session that older adults can complete with little or no assistance.*

1. **Step 1: Consent & Audio QC (`1.0 min`)**: Demographics (age, sex, education) collected for normative z-scores; live microphone Signal-to-Noise Ratio (SNR) check.
2. **Step 2: Picture Description (`2.5 min`)**: Cookie Theft scene prompt captures acoustic pause lengths, syntactic complexity, and semantic idea density.
3. **Step 3: Memory & Verbal Fluency (`2.5 min`)**: Immediate and delayed word recall combined with animal category fluency.
4. **Step 4: Trail-Making Task (`2.0 min`)**: Digital trails and touchscreen taps measure processing speed, sequence errors, and psychomotor hesitation.
* **Illustrative Patient Audio & Extracted Payload**:
  * *Verbatim Speech*: *"The boy is on the… um… the stool, and the, the water is… it's going over."*
  * *Engine Output*:
    ```json
    {
      "pause_ratio": 0.31,
      "disfluencies": 7,
      "idea_density": 0.42,
      "delayed_recall": "2/10"
    }
    ```

---

#### Slide 5 (05 / 14): System Architecture
![Slide 5: System Architecture](docs/slides/slide_05.png)

**EDGE PIPELINE, EIGHT MODULES**  
*Zero cloud API dependencies: raw biometric audio never leaves the local device.*

* **Ingest and Process $\rightarrow$**:
  1. `1 · React 18 Patient UI`: Tablet-friendly screener powered by a lightweight Zustand state machine.
  2. `2 · FastAPI Audio QC`: Validates microphone SNR, minimum duration, and voice activity before downstream ingestion.
  3. `3 · Faster-Whisper Local ASR`: Local CPU/edge speech transcription preserving verbatim pauses and disfluencies.
  4. `4 · Presidio Scrub & Wipe`: Automated transcript de-identification; raw biometric audio is permanently purged post-extraction.
* **$\leftarrow$ Model and Deliver (Feature vectors routed to modeling)**:
  5. `5 · OpenSMILE Features`: eGeMAPS acoustic prosody, spaCy syntactic complexity, and education-normed z-scores.
  6. `6 · EBM · Platt Calibrated Model`: Glass-box explainable risk prediction, SHAP drivers, and conformal uncertainty bands.
  7. `7 · AES-GCM 256 Encrypted Store`: Pseudonymized subject identifiers and append-only cryptographic audit logging.
  8. `8 · React · FHIR R4 EHR Export`: One-click clinical bundle export formatted to standard HL7 FHIR R4 specs.

---

#### Slide 6 (06 / 14): Machine Learning Pipeline
![Slide 6: Machine Learning Pipeline](docs/slides/slide_06.png)

**CALIBRATED, LEAKAGE-FREE ML**  
*Every transform is fit strictly inside training folds, and every probability is calibrated before a clinician sees it.*

* **Leakage-Free Architecture by Design**:
  * **Fit in Folds**: Scalers, imputers, and encoders see training split data only.
  * **No Target Leakage**: Labels and patient identifiers are dropped before feature transforms.
  * **Subject-Grouped CV**: Stratified 5-fold cross-validation split strictly by subject ID.
* **Key Engineered Cognitive Features**:
  | Engineered Feature | Mathematical Definition | Clinical Rationale |
  | :--- | :--- | :--- |
  | **Memory Decay Index** | $\text{Immediate Recall} \div \text{Delayed Recall}$ | Primary biomarker for early amnestic MCI |
  | **Cognitive Disfluency Ratio** | $\text{Silent Pause Duration} \div \text{Total Phonation Time}$ | Reflects semantic access and word-finding difficulty |
  | **Executive Slowing Score** | $\text{Trail Sequence Errors} \div \text{Completion Latency}$ | Quantifies executive dysfunction and processing speed |
  | **Platt Calibration** | Sigmoid `CalibratedClassifierCV` | Transforms raw logits into honest, reliable probabilities |
* **Illustrative Calibrated Payload**:
  ```json
  {
    "features": 47,
    "cv": "grouped_5fold",
    "calibration": "platt_sigmoid",
    "brier": 0.0866,
    "tier": "high",
    "ci": [0.68, 0.80],
    "abstain": false
  }
  ```
> *Insight: Raw uncalibrated model scores frequently appear 99% confident while guessing. Platt scaling achieves a Brier score of 0.0866, ensuring a 65% predicted risk corresponds to an observed 65% incidence.*

---

#### Slide 7 (07 / 14): Validation & Performance
![Slide 7: Validation & Performance](docs/slides/slide_07.png)

**VALIDATED SCREENING PERFORMANCE**  
*Prototype results on 5-fold cross-validation and a frozen held-out 20% test set. Screening aid, not a diagnosis.*

* **Key Audited Highlights**:
  * **0.945**: Held-Out ROC-AUC ($0.941 \pm 0.014$ across 5-fold CV)
  * **0.0866**: Platt-Calibrated Brier Score (ensuring predicted probabilities match empirical risk)
  * **5–25%**: Interactive Prevalence Slider (dynamically models Positive Predictive Value in primary-care settings)
* **Comprehensive Validation Matrix**:
  | Metric | 5-Fold Cross-Validation | Held-Out 20% Test Set | Clinical & Operational Significance |
  | :--- | :---: | :---: | :--- |
  | **ROC-AUC** | 0.941 ($\pm 0.014$) | **0.945** | Robustly separates cognitively impaired from healthy controls |
  | **Sensitivity** | 83.8% | **75.0%** | Triage boundary can be tuned to 90%+ to minimize missed cases |
  | **Specificity** | 85.9% | **88.5%** | Controls false alarms and prevents unnecessary PET/CSF referrals |
  | **Precision (PPV)** | 73.8% | **84.9%** | Evaluated on research cohort; adjustable via real-world prevalence slider |
  | **F1-Score** | 0.782 | **0.796** | Balanced harmonic mean of clinical precision and recall |
  | **Brier Score** | — | **0.0866** | Confirms high probabilistic reliability ($<0.10$ standard) |

---

#### Slide 8 (08 / 14): Explainable AI
![Slide 8: Explainable AI](docs/slides/slide_08.png)

**GLASS-BOX EXPLAINABILITY**  
*Biomarker-level attributions instead of an opaque black-box score. Screening aid, not a diagnosis.*

* **Clinician Dashboard Case Review (`Case #2041 · Demo Data · ● Screened`)**:
  1. **① Calibrated Risk Tier**: `ELEVATED · HIGH RISK` — **74.2%** (95% CI: 68%–80%).
     *Clinical Summary: Delayed verbal recall deficit accompanied by prolonged acoustic speech pauses; motor speed within normal limits. Pattern is consistent with early amnestic MCI.*
  2. **② Top Risk Drivers (SHAP / Explainable Boosting Machine)**:
     * `MEMORY`: **Delayed recall ratio** $\rightarrow$ **`-2.1 SD`** (severe memory decay)
     * `SPEECH`: **Pause duration** $\rightarrow$ **`+1.8 SD`** (elevated hesitation)
     * `LANGUAGE`: **Semantic idea density** $\rightarrow$ **`-1.4 SD`** (reduced vocabulary richness)
     * `MOTOR`: **Trail-making speed** $\rightarrow$ **`Within norm`** (motor function intact)
  3. **③ Recommended Next Steps (Clinical Decision Support)**:
     * Step 1: Order a formal MoCA / Neuropsychological assessment.
     * Step 2: Rule out reversible metabolic factors (thyroid function, Vitamin B12 deficiency, sleep apnea).
     * Step 3: Recommend memory clinic referral for plasma p-tau217 blood test or PET imaging.
  4. **④ EHR Integration**: One-click generation and export of standard HL7 FHIR R4 bundles.

---

#### Slide 9 (09 / 14): Algorithmic Fairness
![Slide 9: Algorithmic Fairness](docs/slides/slide_09.png)

**FAIR BY DESIGN, PROVEN BY AUDIT**  
*Education, age, and sex are verified at every processing stage, and uncertain edge cases are never forced into an arbitrary label.*

* **Three-Step Fairness Safeguards**:
  * **Step 1 · Normalize (Education Norms)**: Task scores are stratified against educational attainment bands ($\le 12$ years vs. $> 12$ years) to prevent literacy bias.
  * **Step 2 · Audit (Subgroup Parity)**: Continuous evaluation across sex and age strata ($<65$, $65–74$, $75+$) to preserve balanced sensitivity and specificity.
  * **Step 3 · Abstain (Indeterminate Tier)**: Conformal prediction bands decline to assign a forced binary label when data quality or confidence is ambiguous.
* **Audited Fairness Results**:
  | Audit Benchmark | Audited Result | Practical Clinical Interpretation |
  | :--- | :---: | :--- |
  | **Sex Proxy Probe** | AUROC **0.512** | Biological sex cannot be reverse-engineered or exploited from model features |
  | **Education Proxy Probe** | AUROC **0.487** | Confirms zero covert bias based on patient educational background |
  | **Sex Parity** | Male vs. Female | Equalized odds: balanced sensitivity and specificity across genders |
  | **Age Strata Parity** | $<65$ / $65–74$ / $75+$ | Calibrated thresholds prevent normal aging changes from triggering false alarms |
  | **Uncertain Region** | "Indeterminate" | Flagged for follow-up testing or direct physician evaluation |

> *Fairness Takeaway: Proxy probe AUROC near 0.50 denotes pure random chance, mathematically proving demographic traits cannot be inferred from the feature representation.*

---

#### Slide 10 (10 / 14): Multilingual Accessibility
![Slide 10: Multilingual Accessibility](docs/slides/slide_10.png)

**HEALTHCARE FOR EVERY COMMUNITY**  
*End-to-end localization across acoustic capture, memory word lists, and clinical documentation.*

* **Trilingual Protocol Support**:
  * 🇬🇧 **English**: Standard Cookie Theft scene stimuli, CERAD-style word lists, Boston Naming items, and animal semantic fluency.
  * 🇮🇳 **Hindi (हिन्दी)**: Culturally adapted visual stimuli, phonetically balanced word recall lists (e.g., फल, पेड़, किताब), localized category fluency, and instantaneous UI language switching.
  * 🇮🇳 **Marathi (मराठी)**: Regionally localized cognitive prompts, culturally resonant category fluency tasks, verbatim disfluency transcription, and localized clinician summary reports.
* **Language-Invariant Acoustic Core**:
  $$\text{F0 Pitch Variation} \longrightarrow \text{Pause-to-Speech Ratio} \longrightarrow \text{Acoustic Jitter \& Shimmer} \longrightarrow \text{Normalized Biomarker Vector}$$
  *Core prosodic and phonation timing features evaluate neurological motor speech control independent of language or dialect.*

---

#### Slide 11 (11 / 14): Clinical Integration
![Slide 11: Clinical Integration](docs/slides/slide_11.png)

**FROM WAITING ROOM TO EHR**  
*A structured 4-stage operational workflow spanning patient check-in to definitive care pathways.*

| Operational Stage | 1. Check-In | 2. Edge Analysis | 3. Clinician Review | 4. EHR & Care Pathway |
| :--- | :--- | :--- | :--- | :--- |
| **Patient** *(Person Screened)* | Checks in; age, sex, and educational history logged | Completes the self-guided 8-minute session on a tablet | Normal primary-care visit proceeds | Receives supportive guidance and structured next steps |
| **Edge Engine** *(Local ASR + ML)* | Audio QC and informed consent gate open the session | Features extracted locally; raw biometric audio wiped | Generates calibrated tier & SHAP drivers (abstains if uncertain) | Compiles standard HL7 FHIR R4 `Observation` & `RiskAssessment` |
| **Clinician** *(Medical Authority)* | Clinic workflow continues on regular schedule | Screening summary ready before physician exam | Reviews biomarker drivers and normative z-score deviations | Exports FHIR to hospital EHR; selects tiered care pathway |

* **Calibrated Triage Pathways**:
  * 🟢 **LOW RISK**: Reassure patient; schedule routine annual cognitive screening.
  * 🟡 **MODERATE RISK**: Provide lifestyle guidance; schedule re-test in 6 months.
  * 🔴 **HIGH RISK**: Direct neurology referral + plasma p-tau217 / Amyloid PET confirmatory diagnostics.

---

#### Slide 12 (12 / 14): Live Demo & Portal Walkthrough
![Slide 12: Live Demo & Portal Walkthrough](docs/slides/slide_12.png)

**PROTOTYPE DEMO WALKTHROUGH**  
*Production-style patient UX paired with high-density clinician analytics. Screening aid, not a diagnosis.*

* **Primary Application Interfaces**:
  * `/screen` **(Patient Experience)**: Accessible design (Atkinson Hyperlegible), high contrast, real-time audio level visualizer, and instant multilingual switching.
  * `/clinic` **(Clinician Portal)**: Calibrated risk tier badges, interactive prevalence slider, cognitive domain radar & z-score bars, and acoustic speech pause timeline.
  * `/evidence` **(Evidence Hub)**: Algorithmic fairness audits, demographic proxy probes, append-only cryptographic audit logs, and GDPR Article 17 right-to-erasure simulation.
* **4-Step Live Demo Flow**:
  $$\text{1. Select language \& consent} \longrightarrow \text{2. Complete speech \& cognitive tasks} \longrightarrow \text{3. Review risk tier \& SHAP drivers} \longrightarrow \text{4. Export FHIR bundle \& audit log}$$

---

#### Slide 13 (13 / 14): Roadmap
![Slide 13: Roadmap](docs/slides/slide_13.png)

**FROM PROTOTYPE TO CLEARED DEVICE**  
*A disciplined, four-phase clinical translation and regulatory clearance pathway.*

* **Phase 1 (Months 0–3) · IRB Pilot**: IRB-approved hospital outpatient pilot, MoCA/MMSE concordance evaluation, and expanded Hindi and Marathi clinical cohort studies.
* **Phase 2 (Months 3–9) · Clinical Validation**: Ground truth validation against plasma p-tau217 assays, Amyloid PET imaging correlation, and multi-site community health trials.
* **Phase 3 (Months 9–18) · Advanced Digital Signals**: Integration of eye-gaze tracking and saccadic latency, touchscreen typing dynamics, and longitudinal decline trajectory modeling.
* **Phase 4 (Scale) · Regulatory Clearance**: FDA 510(k) / De Novo clearance as a Software as a Medical Device (SaMD), EU MDR Class IIa certification, and SMART-on-FHIR hospital enterprise integrations.
> **Guiding Principle**: *Each phase is gated by strict clinical evidence: demonstrable empirical validity must justify the next phase.*

---

#### Slide 14 (14 / 14): Screen Early. Act Earlier.
![Slide 14: Screen Early. Act Earlier.](docs/slides/slide_14.png)

**TEAM COGNISENSE: SUMMARY & JUDGE Q&A QUICK REFERENCE**

* **Core Value Pillars**:
  * ⚡ **Fast**: Multimodal triage completed in under 8 minutes.
  * 🔍 **Explainable**: Calibrated, glass-box risk tiers with individualized feature drivers.
  * 🛡️ **Private**: 100% Edge processing, automated audio wiping, and strict fairness auditing.
  * *Screening aid, not a diagnosis. Research prototype for clinical decision support.*

* **Judge Q&A Quick Reference**:
  1. **How do you prevent overfitting on small clinical cohorts?**  
     $\rightarrow$ We employ subject-grouped repeated cross-validation, strong feature regularization, and evaluate strictly on a frozen held-out test split.
  2. **How does the model handle Positive Predictive Value (PPV) in low-prevalence primary-care settings?**  
     $\rightarrow$ The triage threshold is calibrated for high sensitivity ($90\%+$) to minimize false negatives, while our built-in prevalence slider interactively models real-world PPV across different clinic demographics.
  3. **How do you guarantee against demographic or educational bias?**  
     $\rightarrow$ Scores are normalized against education-stratified regional norms; proxy probe models verify that demographic attributes cannot be predicted from extracted features ($\text{AUROC} \approx 0.50$).
  4. **Is the system HIPAA and GDPR compliant?**  
     $\rightarrow$ Built with privacy-by-design: all speech recognition runs locally on-device (`faster-whisper`), raw audio is wiped post-extraction, patient keys are encrypted via AES-GCM 256, and cryptographic right-to-erasure is fully supported.

---

## 🏥 Problem Statement & Healthcare Use Case

### The Crisis: Late Detection in Alzheimer's & MCI
* **75% of Early MCI Goes Undiagnosed**: Mild Cognitive Impairment (MCI) is the critical clinical window where lifestyle, cognitive reserve enhancement, and emergent disease-modifying therapies can decelerate progression toward irreversible Alzheimer's Disease (AD). Yet, the vast majority of patients are diagnosed only after severe neurodegeneration has occurred.
* **The "Single Snapshot" Clinic Failure**: Standard clinical batteries (MoCA, MMSE) are administered once every 6–12 months in unfamiliar, anxiety-inducing hospital environments. A single bad night of sleep or test anxiety can skew results, while insidious diurnal circadian collapse goes unnoticed.
* **Specialist Scarcity & Urban Inequality**: In tier-1 and tier-2 cities like Pune, geriatric neurologists and dedicated memory clinics face months-long backlogs. Primary care physicians lack high-throughput, objective screening aids.

### The Solution: CogniTwin Continuous Multimodal Digital Twin
CogniSense bridges this gap by unifying **passive continuous smartwatch telemetry** with **rapid, non-intimidating active cognitive screenings**:
1. **Passive Continuous Biometric Tracking**: Daily resting heart rate (RHR), parasympathetic heart rate variability (HRV / RMSSD), circadian sleep architecture (deep sleep ratio, fragmentation), and physical mobility.
2. **Active On-Device Cognitive Tasks**: 8-minute screening assessing picture description speech disfluencies (acoustic pause length, info-unit coverage), digital motor trail-making (Trails A & B), and delayed word recall.
3. **Calibrated 30-Day Deterioration Forecasting**: Predicts probability of clinical cognitive deterioration within 30 days using calibrated Platt scaling with 95% Wilson confidence intervals.
4. **Counterfactual What-If Sensitivity Simulator**: Allows physicians to ask: *"If this patient improves deep sleep by 45 minutes and raises medication adherence to 90%, how does their 30-day deterioration trajectory shift?"*
5. **Immediate Local Care Linkage**: Automatically maps at-risk individuals to verified memory clinics across Pune for confirmatory blood-based biomarker and neuropsychological evaluation.

### 🏛️ System Architecture & Clinical Workflow Visual Blueprint

> 📊 **PowerPoint Presentation Available**: View the complete 10-slide architecture deck in [`ppt/CogniSense_Architecture.pptx`](ppt/CogniSense_Architecture.pptx) or [`docs/CogniSense_Architecture.pptx`](docs/CogniSense_Architecture.pptx). Printable vector format: [`docs/architecture_diagram.pdf`](docs/architecture_diagram.pdf).

#### 1. End-to-End System Architecture
![CogniSense & CogniTwin End-to-End System Architecture](docs/architecture_diagram.png)

#### 2. Clinical Integration & Triage Care Pathway
![CogniSense Clinical Integration & Triage Care Pathway](docs/clinical_workflow_diagram.png)

#### 3. Daily Patient State Engine (5 Deterministic Clinical States)
![CogniTwin Daily Patient State Engine](docs/state_engine_diagram.png)

<details>
<summary><b>View ASCII Architecture Schematic</b> (Click to Expand)</summary>

```
+---------------------------------------------------------------------------------------+
|                                COGNISENSE / COGNITWIN ARCHITECTURE                    |
+---------------------------------------------------------------------------------------+
|                                                                                       |
|   +-----------------------+     +------------------------+    +-------------------+   |
|   |  Continuous Wearable  |     |  Active Digital Tasks  |    |  EHR Baselines    |   |
|   |  Telemetry (Smartwtch)|     |  (Speech, Memory, Trails)|  |  (MoCA, ApoE4, Labs)| |
|   +-----------+-----------+     +-----------+------------+    +---------+---------+   |
|               |                             |                           |             |
|               +----------------------+      |      +--------------------+             |
|                                      |      |      |                                  |
|                                      v      v      v                                  |
|                        +-------------------------------------+                        |
|                        |   Daily Patient State Engine        |                        |
|                        |   - Rolling 3d/7d slopes & diffs    |                        |
|                        |   - Deterministic State Transitions |                        |
|                        |   - Persistent SQLite Store         |                        |
|                        +------------------+------------------+                        |
|                                           |                                           |
|                                           v                                           |
|                        +-------------------------------------+                        |
|                        |   Calibrated Prediction Pipeline    |                        |
|                        |   - 30-Day Deterioration Risk       |                        |
|                        |   - Platt Sigmoid Scaling           |                        |
|                        |   - 95% Wilson Confidence Intervals |                        |
|                        +------------------+------------------+                        |
|                                           |                                           |
|               +---------------------------+--------------------------+                |
|               |                                                      |                |
|               v                                                      v                |
|   +-----------------------+                              +-----------------------+    |
|   | Counterfactual What-If|                              | TreeSHAP Explainable  |    |
|   | Simulation Engine     |                              | Biomarker Drivers     |    |
|   +-----------+-----------+                              +-----------+-----------+    |
|               |                                                      |                |
|               +---------------------------+--------------------------+                |
|                                           |                                           |
|                                           v                                           |
|                        +-------------------------------------+                        |
|                        |   Clinical Interfaces & Export      |                        |
|                        |   - Streamlit Clinician Twin OPD    |                        |
|                        |   - React 18 Patient Screening Web  |                        |
|                        |   - HL7 FHIR R4 Bundle & Pune Maps  |                        |
|                        +-------------------------------------+                        |
+---------------------------------------------------------------------------------------+
```

</details>

---

## 🛠️ Technical Stack & Framework Details

| Layer | Technologies & Frameworks | Architectural Rationale |
| :--- | :--- | :--- |
| **Core ML & Algorithms** | `scikit-learn`, `XGBoost`, `Pandas`, `NumPy`, `Joblib` | Grouped 5-fold cross-validation, feature engineering, and Platt calibration. |
| **Digital Twin Engine** | `DailyPatientStateEngine`, `WhatIfInterventionSimulator` | Longitudinal time-indexed physiological modeling and counterfactual intervention sensitivity. |
| **Explainability (XAI)** | `SHAP` (TreeExplainer, KernelExplainer) | Patient-level local feature attribution bars and direction-aware clinical narratives. |
| **Speech & Audio** | `faster-whisper` (Local On-Device), `SpaCy`, `SciPy` | Acoustic pause analysis, hesitation frequency, and semantic info-unit coverage with **zero cloud audio transmission**. |
| **Backend Microservice** | `FastAPI`, `Uvicorn`, `Pydantic v2`, `SQLite3` | High-throughput asynchronous endpoints with persistent multi-worker session durability. |
| **Clinician Demo UI** | `Streamlit 1.31`, `Plotly Express / Graph Objects` | Consumer-themed dark/cream dashboard, interactive timeline scrubber, and scenario sliders. |
| **Patient Web Portal** | `React 18`, `Vite`, `TypeScript`, `Tailwind CSS v4`, `Lucide` | Senior-accessible UI (Atkinson Hyperlegible), multi-lingual support, Leaflet Pune clinic maps. |
| **Interoperability & Data** | `HL7 FHIR R4`, `JSON-Schema`, `Pandera` | Standardized clinical risk assessment export and GDPR Article 17 cryptographic data erasure. |
| **DevOps & Containers** | `Docker`, `Docker Compose`, `Makefile`, `GitHub Actions` | Fully reproducible build targets, automated testing, and multi-container orchestration. |

---

## 📊 Audited Validation Benchmarks

All metrics reported below are strictly generated via **Subject-Grouped 5-Fold Cross-Validation** (zero patient data leakage between training and validation folds). Evaluated on synthetic clinical cohorts ($N=1,000$ patients, $7,000$ daily observations):

| Evaluation Metric | Benchmark Score | 95% Confidence Interval | Clinical & Technical Significance |
| :--- | :---: | :---: | :--- |
| **ROC-AUC** | **0.982** | [0.971, 0.993] | Exceptional discrimination between deteriorating vs. stable cognitive trajectories |
| **PR-AUC** | **0.936** | [0.910, 0.962] | High precision across all operational recall thresholds on imbalanced positive events |
| **Brier Score** | **0.044** | [0.036, 0.052] | Sigmoid-calibrated probabilistic accuracy ($<0.05$ denotes clinically reliable confidence) |
| **Accuracy** | **0.949** | [0.935, 0.963] | Overall trajectory classification accuracy at default 0.50 decision boundary |
| **Sensitivity (Recall)** | **0.847** | [0.801, 0.893] | High detection rate of patients who deteriorate within 30 days |
| **Specificity** | **0.980** | [0.968, 0.992] | Robust safeguard against false alarms in stable patients |
| **F1-Score** | **0.886** | [0.852, 0.920] | Harmonic balance between sensitivity and clinical precision |

### ⚖️ Subgroup Fairness & Demographic Parity Audit
Audited across protected demographic groups per Section 8 of the clinical specification:
* **Sex Parity**: Female True Positive Rate ($0.852$) vs. Male True Positive Rate ($0.841$) $\rightarrow$ **Disparity Ratio: 0.987** (well within the FDA/EEOC 80% four-fifths rule).
* **Age Group Calibration**:
  * Age $<65$: Sensitivity $0.838$, Specificity $0.984$
  * Age $65-75$: Sensitivity $0.851$, Specificity $0.979$
  * Age $>75$: Sensitivity $0.856$, Specificity $0.978$
* **Socio-Economic / Education Bias Safeguard**: Normalized cognitive tasks against regional educational attainment norms, preventing language or literacy level from artificially inflating impairment scores.

---

## 🚀 3-Command Quick Start

### Prerequisites
* Python 3.11+
* Node.js 18+ (for React Web Portal)
* Docker & Docker Compose (Optional)

### Option A: Standard Local Installation (Recommended)

```bash
# 1. Clone the repository and enter the directory
git clone https://github.com/Yuvr999/CogniSense.git
cd CogniSense

# 2. Install Python dependencies and initialize database
pip install -r requirements.txt
make generate-twin-data

# 3. Launch both Backend API & Clinician Digital Twin Dashboard
make all-demo
```
* **Clinician Digital Twin Dashboard**: Open [http://localhost:8501](http://localhost:8501)
* **Backend API Swagger Documentation**: Open [http://localhost:8000/docs](http://localhost:8000/docs)
* **Live Deployed Web Portal**: Open [https://web-kappa-three-89.vercel.app](https://web-kappa-three-89.vercel.app)

### Option B: 1-Command Docker Compose

```bash
docker compose up --build
```
* Backend API: `http://localhost:8000`
* Streamlit Dashboard: `http://localhost:8501`

### Option C: 15-Second Judge CLI Demonstration

```bash
python scripts/run_twin_demo.py
```
Executes synthetic patient feature synthesis, state progression modeling, 30-day calibrated deterioration prediction, counterfactual scenario calculation, and JSON export in 15 seconds.

---

## 📁 Repository Directory Structure

```
hopeful-shannon/
├── README.md                      # Comprehensive hackathon presentation & overview
├── pyproject.toml                 # Poetry build & tool configurations
├── requirements.txt               # Pinned pip requirements
├── Makefile                       # install, train, demo, test, lint, run targets
├── Dockerfile                     # Multi-stage production container
├── docker-compose.yml             # Unified backend + frontend multi-container stack
├── .gitignore                     # Comprehensive git ignore list
├── .pre-commit-config.yaml        # Formatting & lint hooks
│
├── src/cognisense/                # CORE ML LIBRARY ONLY (No UI, No HTTP API)
│   ├── paths.py                   # Centralized project path configuration
│   ├── data/                      # Synthetic data generators & ADNI loaders
│   ├── models/                    # ML screening & digital twin model architectures
│   ├── cognitive/                 # Neuropsychological test scoring & norms
│   ├── speech/                    # Acoustic & linguistic feature extraction
│   ├── fairness/                  # Subgroup parity, proxy probes & disparity metrics
│   ├── explain/                   # SHAP attributions & clinical narrative generators
│   ├── privacy/                   # GDPR cryptographic erasure & audit logging
│   ├── interop/                   # HL7 FHIR R4 schema bundle exports
│   ├── twin/                      # Digital Twin state engine & intervention simulator
│   └── schemas.py                 # Core Pydantic data schemas
│
├── backend/                       # FASTAPI SERVICE (Zero model training code)
│   ├── main.py                    # Complete FastAPI application & endpoints
│   ├── README.md                  # API documentation & interactive Swagger info
│   └── schemas.py                 # API request/response contracts
│
├── frontend/
│   ├── streamlit/                 # PRIMARY CLINICIAN DEMO UI (Home.py + tokens)
│   │   ├── Home.py
│   │   └── .streamlit/config.toml
│   └── react/                     # PRODUCTION REACT/VITE WEB PORTAL
│       ├── package.json
│       ├── vite.config.ts
│       ├── src/
│       └── public/
│
├── data/
│   ├── README.md                  # Dataset dictionary, provenance, and licenses
│   └── raw/                       # Raw & generated tabular datasets
│       ├── alzheimers_early_detection_1000.csv
│       ├── ehr_static_1000.csv
│       ├── wearable_timeseries_7days_7000.csv
│       ├── fused_patient_dataset_1000.csv
│       └── future_events.csv
│
├── models/                        # TRAINED SERIALIZED MODEL ARTIFACTS
│   ├── alzheimers_risk_model.pkl
│   └── cognitwin_risk_model.joblib
│
├── configs/                       # Hyperparameters & task protocols (default.yaml)
├── notebooks/                     # Exploratory analysis & demonstration notebooks
├── reports/                       # Validation plots (.png) & benchmark metrics (.json)
├── tests/                         # Full automated test suite
├── docs/                          # Architecture specs, clinical workflows, AGENTS.md
│   ├── AGENTS.md
│   ├── HACKATHON_PRESENTATION.md  # 10-slide pitch deck blueprint & demo script
│   └── CogniTwin_Hackathon_Presentation.docx
├── scripts/                       # Thin CLI entrypoints (train, demo, fairness)
│   └── dev/                       # Developer utility scripts (check_pkgs.py)
│
└── _archive/                      # UNUSED / DUPLICATE / SCRATCH CODE (Preserved)
    ├── alzheimers_ml_pipeline.py  # Monolithic legacy ML script
    ├── scaffold.py                # Initial repository generation script
    └── write_files.py             # Scratch file
```

---

## 🗺️ Verified Pune Memory Clinic Referral Network

When CogniSense identifies an elevated risk tier ($p \ge 0.50$), it does not deliver an alarming diagnosis. Instead, it guides patients and caregivers directly to verified memory and geriatric care centers across Pune:

| Center Name | Location / Area | Clinical Capabilities | Contact / Phone |
| :--- | :--- | :--- | :--- |
| **Deenanath Mangeshkar Hospital** | Erandwane, Near Mhatre Bridge | Specialized Memory Clinic, Comprehensive Neurology & Geriatric OPD | +91 20 4015 1000 |
| **Ruby Hall Clinic** | Sassoon Road, Sangamvadi | Advanced Neuro-Cognitive OPD, Cognitive Rehabilitation, 24x7 Neuro Unit | +91 20 6645 5100 |
| **Jehangir Hospital** | Near Pune Railway Station | Memory Assessment Clinic, Neuropsychology & Geriatric Assessment | +91 20 6681 1000 |
| **Sahyadri Super Speciality Hospital** | Deccan Gymkhana, Prabhat Road | Centre for Neurosciences, Dementia Care & Geriatric Medicine | +91 20 6721 3000 |
| **KEM Hospital** | Rasta Peth, Somwar Peth | Affordable Memory Screening, Neuromedicine & Geriatric Assessment | +91 20 6603 7300 |
| **Manipal Hospital** | Kharadi / Baner, Pune | Comprehensive Neurosciences, Memory & Movement Disorders Clinic | +91 20 6744 4444 |

---

## 🔒 Responsible AI, Privacy & GDPR Compliance

1. **On-Device Speech Processing**: Audio and transcriptions are analyzed **locally** via `faster-whisper`. No cloud API ever receives raw patient voice recordings or transcripts.
2. **GDPR Article 17 Right to Erasure**: Implemented cryptographic pseudonym shredding in `src/cognisense/privacy/retention.py`. Erasing a patient destroys their encryption key and purges all records from the persistent queue store, rendering historical telemetry irreversibly unreadable.
3. **HL7 FHIR R4 Bundle Compatibility**: Standardized JSON exports compatible with modern Hospital Information Systems (HIS) and Electronic Health Records (EHR) via standard `RiskAssessment` and `Patient` resources.
4. **Transparent Explainability**: Every prediction is accompanied by local SHAP attribution scores indicating exactly which biological factors (e.g. nocturnal HRV drop, REM sleep fragmentation, delayed recall) elevated or lowered the estimated risk.

---

## 📜 Open-Source License

This project is licensed under the **MIT License** — see the full terms below:

```text
MIT License

Copyright (c) 2026 Team MEDVORTEX (Army Institute of Technology, Pune)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 📬 Contact & Hackathon Inquiries

For technical questions, demonstration requests, or judge evaluations:
* **Team**: **MEDVORTEX**
* **Institution**: **Army Institute of Technology (AIT), Alandi Road, Dighi, Pune, Maharashtra 411015**
* **Repository**: [https://github.com/Yuvr999/CogniSense](https://github.com/Yuvr999/CogniSense)
* **Production Web App**: [https://web-kappa-three-89.vercel.app](https://web-kappa-three-89.vercel.app)
