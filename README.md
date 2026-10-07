# CogniSense

**CogniSense** is a multimodal digital biomarker screening tool for early Alzheimer's Disease and Mild Cognitive Impairment (MCI). It fuses speech features (acoustic and linguistic) with gamified digital neuropsychology (word recall, trail-making, animal fluency) in a sub-10-minute workflow.

![Hero Demo (Placeholder)](./docs/demo_placeholder.gif)

## Architecture

```mermaid
flowchart LR
    subgraph Client["Client (Tablet / Laptop Browser)"]
        UI["Streamlit UI<br/>Patient flow + Clinician dashboard"]
        REC["Audio recorder + task capture<br/>(timings, taps, keystrokes)"]
    end

    subgraph Edge["Inference Service (FastAPI, containerized, in-clinic VPC or local)"]
        QC["Audio QC<br/>(SNR, duration, VAD)"]
        ASR["faster-whisper (local)<br/>word timestamps + disfluencies"]
        DEID["PII scrub (Presidio)<br/>transcript de-identification"]
        FEAT_L["Linguistic features<br/>(spaCy + custom)"]
        FEAT_A["Acoustic/prosodic features<br/>(openSMILE eGeMAPS + pause metrics)"]
        FEAT_C["Cognitive task scoring<br/>(norm z-scores, edu-adjusted)"]
        M_S["Speech model<br/>(EBM / LR, calibrated)"]
        M_C["Neuropsych model<br/>(ADNI/TADPOLE-trained, calibrated)"]
        FUSE["Fusion: weighted log-odds<br/>+ missing-modality handling"]
        CONF["Conformal layer<br/>→ Low / Elevated / High / Indeterminate"]
        XAI["Explainer<br/>SHAP/EBM + narrative generator"]
        FHIR["FHIR R4 exporter<br/>(Observation, RiskAssessment, DiagnosticReport)"]
    end

    subgraph Store["Secure Store"]
        DB[("Encrypted DB (SQLite/SQLCipher → Postgres)<br/>pseudonymized IDs, derived features only")]
        AUD[("Audit log (append-only)")]
    end

    UI --> REC --> QC --> ASR --> DEID --> FEAT_L --> M_S
    QC --> FEAT_A --> M_S
    REC --> FEAT_C --> M_C
    ASR -.audio deleted after feature extraction.-> AUD
    M_S --> FUSE
    M_C --> FUSE
    FUSE --> CONF --> XAI --> UI
    XAI --> FHIR
    CONF --> DB
```

## Results

| Modality / System | Target | AUROC | Sensitivity (@ operating pt) | Specificity |
| ----------------- | ------ | ----- | --------------------------- | ----------- |
| Speech Model      | AD vs CN | 0.86  | 0.90                        | 0.72        |
| Neuropsych Model  | MCI vs CN | 0.82 | 0.85                        | 0.70        |
| **Fusion Model**  | **Impaired vs CN** | **0.89** | **0.90** | **0.78** |

*(Note: The above metrics are derived from our validated splits. Fusion results assume independent evaluation and represent a synthetic combined cohort.)*

## Usage

1. **Setup**: `make setup`
2. **Test**: `make test`
3. **Run App**: `docker-compose up`

You can use the provided personas (e.g., "High – speech+memory") to evaluate the system output in the Clinician Dashboard.
