"""
Generate high-resolution architecture and workflow diagrams for CogniSense / CogniTwin.
Exports PNG and vector PDF diagrams for documentation, reports, and PowerPoint embedding.
"""

import os
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import matplotlib.patches as patches

# Ensure target directories exist
os.makedirs("docs", exist_ok=True)
os.makedirs("reports", exist_ok=True)
os.makedirs("ppt", exist_ok=True)

def generate_master_architecture_diagram():
    """Generates the master 4-tier system architecture diagram."""
    fig, ax = plt.subplots(figsize=(16, 9), dpi=300)
    fig.patch.set_facecolor('#0B1120')
    ax.set_facecolor('#0B1120')
    ax.set_xlim(0, 16)
    ax.set_ylim(0, 9)
    ax.axis('off')

    # Title Banner
    ax.text(8.0, 8.55, "COGNISENSE & COGNITWIN : END-TO-END SYSTEM ARCHITECTURE", 
            ha='center', va='center', fontsize=18, fontweight='bold', color='#FFFFFF', fontfamily='sans-serif')
    ax.text(8.0, 8.25, "Multimodal Continuous Patient Digital Twin for Early Alzheimer's & MCI Screening  |  Screening aid, not a diagnosis", 
            ha='center', va='center', fontsize=10, color='#94A3B8', fontfamily='sans-serif')

    # 4 Tiers Definition (x, y, w, h)
    tiers = [
        {
            "num": "TIER 1",
            "name": "MULTIMODAL INGESTION & SENSING LAYER",
            "y": 6.35, "h": 1.5,
            "border": "#0D9488", "bg": "#132337",
            "subsections": [
                {"title": "Passive Smartwatch Telemetry", "items": ["Continuous Heart Rate / RMSSD HRV", "Sleep Architecture (Deep, REM, Fragmentation)", "Daily Steps, Active Minutes & Gait"], "x": 0.6, "w": 4.6, "tag": "CONTINUOUS (7-DAY)"},
                {"title": "Active 8-Min Cognitive Tasks", "items": ["Picture Description (Cookie Theft scene)", "Immediate & Delayed Word Recall (10 words)", "Digital Motor Trail-Making (Trails A & B)"], "x": 5.6, "w": 4.8, "tag": "ON-DEMAND CLINICAL"},
                {"title": "Static EHR & Laboratory Baselines", "items": ["Demographics: Age, Education, Sex", "Clinical Baselines: Baseline MoCA (10-30)", "Labs: Vit B12, TSH, Chol, ApoE-e4, Comorbidities"], "x": 10.8, "w": 4.6, "tag": "LONGITUDINAL EHR"}
            ]
        },
        {
            "num": "TIER 2",
            "name": "SECURE EDGE INGESTION & IN-CLINIC MICROSERVICES",
            "y": 4.45, "h": 1.5,
            "border": "#3B82F6", "bg": "#0F1E36",
            "subsections": [
                {"title": "Local Privacy Audio Pipeline", "items": ["faster-whisper local on-device ASR", "Acoustic pause & hesitation duration tracking", "Zero cloud audio transmission (Ephemeral delete)"], "x": 0.6, "w": 4.6, "tag": "LOCAL ASR (<3s)"},
                {"title": "Ingestion Quality Control & De-ID", "items": ["Hardware & Audio SNR Quality Control Gate", "Wearable off-wrist dropout detection (<0.65)", "Presidio PII Transcript Anonymization"], "x": 5.6, "w": 4.8, "tag": "DATA INTEGRITY"},
                {"title": "FastAPI REST Server & Session Store", "items": ["High-throughput async endpoints (/v1/twin, /screen)", "Thread-safe SQLite persistent store (data/cognitwin.db)", "Session proxies surviving multi-worker restarts"], "x": 10.8, "w": 4.6, "tag": "FASTAPI MICROSERVICE"}
            ]
        },
        {
            "num": "TIER 3",
            "name": "COGNITWIN CORE INTELLIGENCE & ANALYTICS ENGINE",
            "y": 2.55, "h": 1.5,
            "border": "#8B5CF6", "bg": "#1A1938",
            "subsections": [
                {"title": "Daily Patient State Engine", "items": ["Personal baseline calibration (Days 1-3)", "Deterministic state machine (5 clinical states)", "Temporal strictness (Zero future data leakage)"], "x": 0.6, "w": 4.6, "tag": "STATE ENGINE"},
                {"title": "Calibrated 30-Day Predictive Model", "items": ["Grouped 5-Fold Cross Validation (by subject)", "Platt Sigmoid Calibration (0.044 Brier score)", "Wilson 95% Confidence Intervals (4 Risk Tiers)"], "x": 5.6, "w": 4.8, "tag": "0.982 ROC-AUC"},
                {"title": "XAI & What-If Counterfactual Sim", "items": ["TreeSHAP feature attributions vs. cohort median", "Plain-language direction-aware clinical narratives", "Real-time slider intervention sensitivity simulation"], "x": 10.8, "w": 4.6, "tag": "TREESHAP & SIMULATOR"}
            ]
        },
        {
            "num": "TIER 4",
            "name": "CLINICAL PRESENTATION & HEALTHCARE INTEROPERABILITY",
            "y": 0.65, "h": 1.5,
            "border": "#10B981", "bg": "#0D2526",
            "subsections": [
                {"title": "Clinician Digital Twin OPD", "items": ["Interactive Day 1 -> 7+ timeline scrubber", "State comparison (Day A vs Day B deltas)", "Real-time What-If scenario manipulation"], "x": 0.6, "w": 4.6, "tag": "STREAMLIT 1.31"},
                {"title": "Patient & Senior Web Portal", "items": ["Senior-accessible UI (Atkinson Hyperlegible)", "Multilingual: English, Hindi, Marathi", "Zero-PHI local browser state machine"], "x": 5.6, "w": 4.8, "tag": "REACT 18 + VITE"},
                {"title": "EHR Export & Referral Network", "items": ["HL7 FHIR R4 RiskAssessment & Observation Bundle", "GDPR Art 17 Cryptographic Right-to-Erasure", "Pune Nearest Memory Clinic Locator (Leaflet maps)"], "x": 10.8, "w": 4.6, "tag": "HL7 FHIR R4"}
            ]
        }
    ]

    for t in tiers:
        # Tier Container Box
        box = patches.FancyBboxPatch((0.4, t["y"]), 15.2, t["h"],
                                    boxstyle="round,pad=0.08,rounding_size=0.15",
                                    edgecolor=t["border"], facecolor=t["bg"],
                                    linewidth=1.8, alpha=0.95)
        ax.add_patch(box)

        # Tier Header Tag
        ax.text(0.65, t["y"] + t["h"] - 0.22, f"{t['num']}: {t['name']}",
                fontsize=10.5, fontweight='bold', color=t["border"], fontfamily='sans-serif')

        # Subsections inside tier
        for sub in t["subsections"]:
            sub_box = patches.FancyBboxPatch((sub["x"], t["y"] + 0.12), sub["w"], t["h"] - 0.45,
                                           boxstyle="round,pad=0.05,rounding_size=0.1",
                                           edgecolor='#334155', facecolor='#0B1325',
                                           linewidth=1.0, alpha=0.85)
            ax.add_patch(sub_box)

            # Sub-title & Tag
            ax.text(sub["x"] + 0.15, t["y"] + t["h"] - 0.48, sub["title"],
                    fontsize=9.0, fontweight='bold', color='#F1F5F9', fontfamily='sans-serif')
            
            # Badge pill
            badge = patches.FancyBboxPatch((sub["x"] + sub["w"] - 1.5, t["y"] + t["h"] - 0.54), 1.35, 0.22,
                                         boxstyle="round,pad=0.02,rounding_size=0.06",
                                         edgecolor=t["border"], facecolor=t["border"],
                                         linewidth=0.5, alpha=0.25)
            ax.add_patch(badge)
            ax.text(sub["x"] + sub["w"] - 0.825, t["y"] + t["h"] - 0.43, sub["tag"],
                    fontsize=6.5, fontweight='bold', color=t["border"], ha='center', va='center')

            # Bullet items
            for i, item in enumerate(sub["items"]):
                item_y = t["y"] + t["h"] - 0.68 - (i * 0.22)
                ax.plot(sub["x"] + 0.22, item_y, marker='s', markersize=3.0, color=t["border"])
                ax.text(sub["x"] + 0.35, item_y, item,
                        fontsize=7.8, color='#CBD5E1', va='center', fontfamily='sans-serif')

    # Flow arrows between tiers
    arrow_props = dict(facecolor='#64748B', edgecolor='#94A3B8', width=2.0, headwidth=6, shrink=0.05)
    ax.annotate('', xy=(8.0, 4.45), xytext=(8.0, 4.85), arrowprops=arrow_props)
    ax.annotate('', xy=(8.0, 2.55), xytext=(8.0, 2.95), arrowprops=arrow_props)
    ax.annotate('', xy=(8.0, 0.65), xytext=(8.0, 1.05), arrowprops=arrow_props)

    # Footer note
    ax.text(8.0, 0.2, "Zero Cloud Audio Transmission  •  Subject-Grouped Zero Leakage CV  •  Platt Calibrated Probabilities  •  HL7 FHIR R4 Interoperable",
            ha='center', va='center', fontsize=8.5, color='#64748B', fontfamily='sans-serif')

    plt.tight_layout()
    png_path = "docs/architecture_diagram.png"
    pdf_path = "docs/architecture_diagram.pdf"
    plt.savefig(png_path, dpi=300, facecolor=fig.get_facecolor(), edgecolor='none')
    plt.savefig(pdf_path, dpi=300, facecolor=fig.get_facecolor(), edgecolor='none')
    plt.savefig("reports/architecture_master.png", dpi=300, facecolor=fig.get_facecolor(), edgecolor='none')
    plt.close()
    print(f"Generated: {png_path} and {pdf_path}")

def generate_clinical_workflow_diagram():
    """Generates the clinical integration care pathway diagram."""
    fig, ax = plt.subplots(figsize=(16, 9), dpi=300)
    fig.patch.set_facecolor('#0B1120')
    ax.set_facecolor('#0B1120')
    ax.set_xlim(0, 16)
    ax.set_ylim(0, 9)
    ax.axis('off')

    ax.text(8.0, 8.55, "COGNISENSE : CLINICAL INTEGRATION & TRIAGE CARE PATHWAY", 
            ha='center', va='center', fontsize=18, fontweight='bold', color='#FFFFFF', fontfamily='sans-serif')
    ax.text(8.0, 8.25, "From Primary Care Intake to Calibrated Risk Stratification & Specialist Linkage", 
            ha='center', va='center', fontsize=10, color='#94A3B8', fontfamily='sans-serif')

    # Step 1: Routine Intake
    p1 = patches.FancyBboxPatch((0.6, 6.2), 3.2, 1.6, boxstyle="round,pad=0.08,rounding_size=0.15",
                                edgecolor='#0D9488', facecolor='#132337', linewidth=1.5)
    ax.add_patch(p1)
    ax.text(2.2, 7.45, "STEP 1: PATIENT INTAKE", ha='center', fontsize=9.5, fontweight='bold', color='#0D9488')
    ax.text(2.2, 7.1, "• Medicare Annual Wellness Visit\n• Age >= 55-65 or memory concern\n• Initiated by MA, Nurse, or App", 
            ha='center', fontsize=7.8, color='#CBD5E1')

    # Step 2: 8-Min Protocol
    p2 = patches.FancyBboxPatch((4.4, 6.2), 3.3, 1.6, boxstyle="round,pad=0.08,rounding_size=0.15",
                                edgecolor='#3B82F6', facecolor='#0F1E36', linewidth=1.5)
    ax.add_patch(p2)
    ax.text(6.05, 7.45, "STEP 2: 8-MIN SCREENING", ha='center', fontsize=9.5, fontweight='bold', color='#3B82F6')
    ax.text(6.05, 7.1, "• Picture Description Speech (2m)\n• Word-List Encoding/Recall (2m)\n• Trail-Making & Fluency (3m)\n• 7-Day Smartwatch Telemetry", 
            ha='center', fontsize=7.8, color='#CBD5E1')

    # Step 3: QC Gate (Diamond/Box)
    p3 = patches.FancyBboxPatch((8.3, 6.2), 3.3, 1.6, boxstyle="round,pad=0.08,rounding_size=0.15",
                                edgecolor='#F59E0B', facecolor='#2B2215', linewidth=1.5)
    ax.add_patch(p3)
    ax.text(9.95, 7.45, "STEP 3: QUALITY GATE", ha='center', fontsize=9.5, fontweight='bold', color='#F59E0B')
    ax.text(9.95, 7.1, "• Audio SNR & clipping checks\n• Wearable quality score >= 0.65\n• Watch off-wrist guardrail\n  -> Prevents false alarms", 
            ha='center', fontsize=7.8, color='#CBD5E1')

    # Step 4: Calibrated Inference
    p4 = patches.FancyBboxPatch((12.2, 6.2), 3.2, 1.6, boxstyle="round,pad=0.08,rounding_size=0.15",
                                edgecolor='#8B5CF6', facecolor='#1A1938', linewidth=1.5)
    ax.add_patch(p4)
    ax.text(13.8, 7.45, "STEP 4: CALIBRATED INFERENCE", ha='center', fontsize=9.5, fontweight='bold', color='#8B5CF6')
    ax.text(13.8, 7.1, "• Grouped CV Platt Classifier\n• 30-Day Deterioration Risk\n• Wilson 95% Confidence Bounds\n• TreeSHAP Biomarker Drivers", 
            ha='center', fontsize=7.8, color='#CBD5E1')

    # Arrows row 1
    arrow_props = dict(facecolor='#64748B', edgecolor='#94A3B8', width=2.0, headwidth=6, shrink=0.05)
    ax.annotate('', xy=(4.4, 7.0), xytext=(3.8, 7.0), arrowprops=arrow_props)
    ax.annotate('', xy=(8.3, 7.0), xytext=(7.7, 7.0), arrowprops=arrow_props)
    ax.annotate('', xy=(12.2, 7.0), xytext=(11.6, 7.0), arrowprops=arrow_props)

    # Risk Tiers Branching (Row 2: 4 Pathways)
    tiers_info = [
        {"tier": "LOW RISK (<25%)", "col": "#10B981", "bg": "#0D2526", "x": 0.6,
         "title": "Annual Rescreen",
         "items": ["Reassure patient & family", "Schedule 12-month routine screen", "Lifestyle & sleep hygiene advice", "Continuous passive telemetry"]},
        {"tier": "MODERATE RISK (25-50%)", "col": "#38BDF8", "bg": "#0F2838", "x": 4.4,
         "title": "Active Monitoring",
         "items": ["Review lifestyle & adherence", "Repeat screen in 3 to 6 months", "What-If intervention simulation", "Monitor sleep/HRV slope weekly"]},
        {"tier": "ELEVATED RISK (50-75%)", "col": "#F59E0B", "bg": "#2B2215", "x": 8.3,
         "title": "Comprehensive Workup",
         "items": ["Physician reviews SHAP drivers", "Administer full clinic MoCA", "Reversible-cause lab workup (B12, TSH, depression, meds)", "Targeted clinical adherence plan"]},
        {"tier": "HIGH RISK (>=75%)", "col": "#EF4444", "bg": "#2E1518", "x": 12.2,
         "title": "Expedited Specialist Referral",
         "items": ["Expedited neurology referral", "Blood-based biomarkers (p-tau)", "Structural brain MRI assessment", "Pune Memory Clinic routing"]}
    ]

    for ti in tiers_info:
        tb = patches.FancyBboxPatch((ti["x"], 3.5), 3.2, 2.1, boxstyle="round,pad=0.08,rounding_size=0.15",
                                   edgecolor=ti["col"], facecolor=ti["bg"], linewidth=1.5)
        ax.add_patch(tb)
        ax.text(ti["x"] + 1.6, 5.3, ti["tier"], ha='center', fontsize=9.0, fontweight='bold', color=ti["col"])
        ax.text(ti["x"] + 1.6, 4.95, ti["title"], ha='center', fontsize=8.2, fontweight='bold', color='#F8FAFC')
        for idx, item in enumerate(ti["items"]):
            y_pos = 4.65 - (idx * 0.26)
            ax.plot(ti["x"] + 0.25, y_pos, marker='o', markersize=2.5, color=ti["col"])
            ax.text(ti["x"] + 0.38, y_pos, item, fontsize=7.2, color='#CBD5E1', va='center')

    # Branching arrows from Step 4 down to 4 tiers
    for ti in tiers_info:
        ax.annotate('', xy=(ti["x"] + 1.6, 5.6), xytext=(13.8, 6.2),
                    arrowprops=dict(facecolor='#475569', edgecolor='#64748B', width=1.0, headwidth=4, shrink=0.05))

    # Row 3: EHR Integration & Pune Referral Hub
    p_ehr = patches.FancyBboxPatch((0.6, 0.7), 7.1, 2.2, boxstyle="round,pad=0.08,rounding_size=0.15",
                                 edgecolor='#0D9488', facecolor='#132337', linewidth=1.5)
    ax.add_patch(p_ehr)
    ax.text(4.15, 2.55, "HL7 FHIR R4 CLINICAL INTEROPERABILITY EXPORT", ha='center', fontsize=10.0, fontweight='bold', color='#0D9488')
    ax.text(4.15, 2.25, "Standardized Clinical Resource Generation for Hospital EHR / SMART-on-FHIR", ha='center', fontsize=7.8, color='#94A3B8')
    ehr_bullets = [
        "FHIR RiskAssessment: Calibrated probability, 95% Wilson CIs, risk tier",
        "FHIR Observation: 25 digital twin biomarkers (HRV slope, deep sleep, speech pauses)",
        "FHIR DiagnosticReport: Plain-language clinician narrative & SHAP feature drivers",
        "GDPR Article 17: Cryptographic patient right-to-erasure and audit log tracking"
    ]
    for idx, b in enumerate(ehr_bullets):
        y_pos = 1.95 - (idx * 0.28)
        ax.plot(1.0, y_pos, marker='>', markersize=3.5, color='#0D9488')
        ax.text(1.2, y_pos, b, fontsize=7.5, color='#E2E8F0', va='center')

    p_pune = patches.FancyBboxPatch((8.3, 0.7), 7.1, 2.2, boxstyle="round,pad=0.08,rounding_size=0.15",
                                  edgecolor='#F59E0B', facecolor='#2B2215', linewidth=1.5)
    ax.add_patch(p_pune)
    ax.text(11.85, 2.55, "PUNE VERIFIED MEMORY CLINIC REFERRAL NETWORK", ha='center', fontsize=10.0, fontweight='bold', color='#F59E0B')
    ax.text(11.85, 2.25, "Immediate Local Triage for Confirmatory Neuropsychological Evaluation", ha='center', fontsize=7.8, color='#94A3B8')
    pune_bullets = [
        "Deenanath Mangeshkar Hospital & Research Centre (Erandwane, Pune)",
        "Ruby Hall Clinic — Dept of Neurology & Memory Clinic (Sassoon Road)",
        "Jehangir Hospital & Cognitive Disorders Clinic (Near Pune Station)",
        "KEM Hospital & Research Centre / Sahyadri Speciality Hospitals"
    ]
    for idx, b in enumerate(pune_bullets):
        y_pos = 1.95 - (idx * 0.28)
        ax.plot(8.7, y_pos, marker='*', markersize=4.0, color='#F59E0B')
        ax.text(8.9, y_pos, b, fontsize=7.5, color='#E2E8F0', va='center')

    # Arrows into row 3
    ax.annotate('', xy=(4.15, 2.9), xytext=(4.15, 3.5), arrowprops=arrow_props)
    ax.annotate('', xy=(11.85, 2.9), xytext=(13.8, 3.5), arrowprops=arrow_props)

    plt.tight_layout()
    png_path = "docs/clinical_workflow_diagram.png"
    plt.savefig(png_path, dpi=300, facecolor=fig.get_facecolor(), edgecolor='none')
    plt.savefig("reports/clinical_workflow_diagram.png", dpi=300, facecolor=fig.get_facecolor(), edgecolor='none')
    plt.close()
    print(f"Generated: {png_path}")

def generate_state_engine_diagram():
    """Generates the 5-state Digital Twin state machine diagram."""
    fig, ax = plt.subplots(figsize=(16, 9), dpi=300)
    fig.patch.set_facecolor('#0B1120')
    ax.set_facecolor('#0B1120')
    ax.set_xlim(0, 16)
    ax.set_ylim(0, 9)
    ax.axis('off')

    ax.text(8.0, 8.55, "COGNITWIN : DAILY PATIENT STATE ENGINE (5 DETERMINISTIC STATES)", 
            ha='center', va='center', fontsize=18, fontweight='bold', color='#FFFFFF', fontfamily='sans-serif')
    ax.text(8.0, 8.25, "Personal Baseline Deviations  •  3-Day / 7-Day Rolling Windows  •  Temporal Strictness (Zero Future Leakage)", 
            ha='center', va='center', fontsize=10, color='#94A3B8', fontfamily='sans-serif')

    states = [
        {
            "id": "STATE 1", "name": "BASELINE_INITIALIZING", "col": "#94A3B8", "bg": "#1E293B",
            "x": 0.6, "y": 4.5, "w": 2.7, "h": 2.8,
            "condition": "Days 1 to 2 of Telemetry",
            "details": ["Computes initial personal physiological reference bounds", "Averages Resting HR, HRV, Deep Sleep ratio & Daily Steps", "Suppresses premature clinical alerts until norms established"]
        },
        {
            "id": "STATE 2", "name": "STABLE", "col": "#10B981", "bg": "#0D2526",
            "x": 3.7, "y": 4.5, "w": 2.7, "h": 2.8,
            "condition": "Deviations within ±15% of Baseline",
            "details": ["Physiological telemetry tracks within individual norms", "HRV slope stable (>-1.5 ms/day)", "Deep sleep ratio maintained (>15%)", "Zero risk elevation; routine monitoring"]
        },
        {
            "id": "STATE 3", "name": "PHYSIOLOGICAL_DECLINE", "col": "#F59E0B", "bg": "#2B2215",
            "x": 6.8, "y": 4.5, "w": 2.7, "h": 2.8,
            "condition": ">= 2 Multi-Domain Adverse Drops",
            "details": ["HRV drops >= 20% from personal norm", "Deep Sleep drops >= 25% or fragmented", "Daily steps drop >= 25% or RHR >= +5 bpm", "Triggers early warning before cognitive shift"]
        },
        {
            "id": "STATE 4", "name": "COGNITIVE_RISK_ELEVATED", "col": "#EF4444", "bg": "#2E1518",
            "x": 9.9, "y": 4.5, "w": 2.7, "h": 2.8,
            "condition": "Decline + Cognitive Vulnerability",
            "details": ["Physiological decline superimposed on low baseline MoCA (<24) or Prior MCI", "Accelerated deterioration velocity", "High probability of 30-day impairment", "Requires immediate clinical intervention"]
        },
        {
            "id": "STATE 5", "name": "DATA_QUALITY_ALERT", "col": "#38BDF8", "bg": "#0F2838",
            "x": 13.0, "y": 4.5, "w": 2.5, "h": 2.8,
            "condition": "Quality Score < 0.65 (Dropout)",
            "details": ["Watch off-wrist, missing days, or low sensor SNR", "SAFETY GUARD: Immediately bypasses clinical alarm", "Prevents model hallucinating decline from sensor gaps", "Prompts patient: 'Please wear smartwatch'"]
        }
    ]

    for st in states:
        box = patches.FancyBboxPatch((st["x"], st["y"]), st["w"], st["h"],
                                    boxstyle="round,pad=0.08,rounding_size=0.15",
                                    edgecolor=st["col"], facecolor=st["bg"], linewidth=1.8)
        ax.add_patch(box)
        ax.text(st["x"] + st["w"]/2, st["y"] + st["h"] - 0.28, st["id"], ha='center', fontsize=9.0, fontweight='bold', color=st["col"])
        ax.text(st["x"] + st["w"]/2, st["y"] + st["h"] - 0.58, st["name"], ha='center', fontsize=8.0, fontweight='bold', color='#FFFFFF')
        
        # Condition pill
        cpill = patches.FancyBboxPatch((st["x"] + 0.15, st["y"] + st["h"] - 1.05), st["w"] - 0.3, 0.35,
                                      boxstyle="round,pad=0.02,rounding_size=0.06",
                                      edgecolor=st["col"], facecolor=st["col"], alpha=0.2)
        ax.add_patch(cpill)
        ax.text(st["x"] + st["w"]/2, st["y"] + st["h"] - 0.88, st["condition"], ha='center', fontsize=6.8, fontweight='bold', color=st["col"])

        for idx, det in enumerate(st["details"]):
            y_pos = st["y"] + st["h"] - 1.3 - (idx * 0.42)
            ax.plot(st["x"] + 0.22, y_pos, marker='s', markersize=3.0, color=st["col"])
            ax.text(st["x"] + 0.35, y_pos, det, fontsize=7.0, color='#CBD5E1', va='center', wrap=True)

    # Transition arrows
    arrow_props = dict(facecolor='#94A3B8', edgecolor='#CBD5E1', width=1.5, headwidth=5, shrink=0.05)
    # State 1 -> State 2
    ax.annotate('', xy=(3.7, 5.9), xytext=(3.3, 5.9), arrowprops=arrow_props)
    # State 2 <-> State 3
    ax.annotate('', xy=(6.8, 6.2), xytext=(6.4, 6.2), arrowprops=dict(facecolor='#F59E0B', edgecolor='#F59E0B', width=1.5, headwidth=5, shrink=0.05))
    ax.annotate('', xy=(6.4, 5.6), xytext=(6.8, 5.6), arrowprops=dict(facecolor='#10B981', edgecolor='#10B981', width=1.5, headwidth=5, shrink=0.05))
    # State 3 -> State 4
    ax.annotate('', xy=(9.9, 5.9), xytext=(9.5, 5.9), arrowprops=dict(facecolor='#EF4444', edgecolor='#EF4444', width=1.5, headwidth=5, shrink=0.05))

    # Guardrail bypass to State 5 from anywhere
    ax.annotate('', xy=(13.0, 5.9), xytext=(12.6, 5.9), arrowprops=dict(facecolor='#38BDF8', edgecolor='#38BDF8', width=1.5, headwidth=5, shrink=0.05))

    # Bottom Architecture Principles Container
    p_bot = patches.FancyBboxPatch((0.6, 0.8), 14.8, 3.0, boxstyle="round,pad=0.08,rounding_size=0.15",
                                 edgecolor='#64748B', facecolor='#0B1325', linewidth=1.2)
    ax.add_patch(p_bot)
    ax.text(8.0, 3.45, "TEMPORAL GUARANTEES & CLINICAL GUARDRAILS IMPLEMENTED IN CODE", 
            ha='center', fontsize=11.0, fontweight='bold', color='#FFFFFF')

    principles = [
        {"title": "1. Zero Future Information Leakage", "desc": "State computation at Day t only evaluates time-indexed observations [1 ... t]. Future observations are strictly sequestered, guaranteeing reproducible historical reconstruction.", "col": "#10B981"},
        {"title": "2. Personal Baseline Normalization", "desc": "Rather than arbitrary population cutoffs (e.g., HRV < 35 ms), the engine evaluates percent drops from the patient's own calibrated Days 1-3 physiological setpoints.", "col": "#38BDF8"},
        {"title": "3. Sensor Dropout Hallucination Defense", "desc": "Whenever data_quality_score < 0.65, the system asserts DATA_QUALITY_ALERT and freezes clinical state transitions, preventing false-positive deterioration alarms.", "col": "#F59E0B"},
        {"title": "4. Rolling Trajectory Slope Estimation", "desc": "Linear regressions over 3-day and 7-day sliding windows compute hrv_trend_slope, resting_hr_trend_slope, and steps_trend_slope to detect velocity of decline.", "col": "#8B5CF6"}
    ]

    for i, pr in enumerate(principles):
        col_x = 0.9 if i % 2 == 0 else 8.2
        row_y = 2.8 if i < 2 else 1.7
        pbox = patches.FancyBboxPatch((col_x, row_y - 0.4), 6.9, 0.85, boxstyle="round,pad=0.05,rounding_size=0.08",
                                     edgecolor=pr["col"], facecolor='#111C33', linewidth=1.0)
        ax.add_patch(pbox)
        ax.text(col_x + 0.2, row_y + 0.25, pr["title"], fontsize=8.5, fontweight='bold', color=pr["col"])
        ax.text(col_x + 0.2, row_y - 0.1, pr["desc"], fontsize=7.2, color='#94A3B8', wrap=True)

    plt.tight_layout()
    png_path = "docs/state_engine_diagram.png"
    plt.savefig(png_path, dpi=300, facecolor=fig.get_facecolor(), edgecolor='none')
    plt.savefig("reports/state_engine_diagram.png", dpi=300, facecolor=fig.get_facecolor(), edgecolor='none')
    plt.close()
    print(f"Generated: {png_path}")

if __name__ == "__main__":
    generate_master_architecture_diagram()
    generate_clinical_workflow_diagram()
    generate_state_engine_diagram()
    print("All architecture diagram images generated successfully.")
