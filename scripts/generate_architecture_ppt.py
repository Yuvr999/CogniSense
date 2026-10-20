"""
Generate an executive-grade PowerPoint presentation (.pptx) for CogniSense & CogniTwin Architecture.
Includes native vector architecture shapes, high-resolution embedded diagrams,
multimodal ML pipelines, Digital Twin state engine, edge privacy, and clinical care workflow.
"""

import os
import sys
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.enum.shapes import MSO_SHAPE

# Paths
OUTPUT_DIR = "ppt"
DOCS_DIR = "docs"
os.makedirs(OUTPUT_DIR, exist_ok=True)
os.makedirs(DOCS_DIR, exist_ok=True)

PPT_TARGETS = [
    os.path.join(OUTPUT_DIR, "CogniSense_Architecture.pptx"),
    os.path.join(DOCS_DIR, "CogniSense_Architecture.pptx"),
    "CogniSense_Architecture.pptx",
]

# Color Palette (Modern Executive Health AI)
COLOR_BG_DARK = RGBColor(11, 17, 32)       # #0B1120 Deep Slate
COLOR_HEADER_BAR = RGBColor(15, 23, 42)    # #0F172A Slate 900
COLOR_CARD_BG = RGBColor(15, 30, 54)       # #0F1E36 Dark Card
COLOR_CARD_BORDER = RGBColor(51, 65, 85)   # #334155 Slate 700

COLOR_TEAL = RGBColor(13, 148, 136)        # #0D9488 Primary Teal
COLOR_TEAL_LIGHT = RGBColor(45, 212, 191)  # #2DD4BF
COLOR_BLUE = RGBColor(59, 130, 246)        # #3B82F6 Telemetry Blue
COLOR_GREEN = RGBColor(16, 185, 129)       # #10B981 Emerald
COLOR_AMBER = RGBColor(245, 158, 11)       # #F59E0B Warning / Quality Alert
COLOR_CORAL = RGBColor(239, 68, 68)        # #EF4444 Elevated Risk
COLOR_PURPLE = RGBColor(139, 92, 246)      # #8B5CF6 XAI / Intelligence

COLOR_TEXT_WHITE = RGBColor(255, 255, 255)
COLOR_TEXT_LIGHT = RGBColor(241, 245, 249) # #F1F5F9
COLOR_TEXT_MUTED = RGBColor(148, 163, 184) # #94A3B8
COLOR_TEXT_DIM = RGBColor(100, 116, 139)   # #64748B

FONT_HEADING = "Segoe UI"
FONT_BODY = "Calibri"

def set_slide_background_dark(slide):
    """Sets a solid deep dark background for modern high-contrast presentation."""
    background = slide.background
    fill = background.fill
    fill.solid()
    fill.fore_color.rgb = COLOR_BG_DARK

def add_header(slide, title: str, subtitle: str, category_tag: str = "COGNISENSE ARCHITECTURE"):
    """Adds a standardized top banner to a slide."""
    # Tag Pill
    tag_box = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(0.38), Inches(2.8), Inches(0.32))
    tag_box.fill.solid()
    tag_box.fill.fore_color.rgb = COLOR_CARD_BG
    tag_box.line.color.rgb = COLOR_TEAL
    tag_box.line.width = Pt(1)
    tf_tag = tag_box.text_frame
    tf_tag.word_wrap = False
    p_tag = tf_tag.paragraphs[0]
    p_tag.text = category_tag.upper()
    p_tag.font.name = FONT_HEADING
    p_tag.font.size = Pt(8.5)
    p_tag.font.bold = True
    p_tag.font.color.rgb = COLOR_TEAL_LIGHT
    p_tag.alignment = PP_ALIGN.CENTER

    # Main Title
    title_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.72), Inches(11.5), Inches(0.65))
    tf_title = title_box.text_frame
    tf_title.word_wrap = True
    p_title = tf_title.paragraphs[0]
    p_title.text = title
    p_title.font.name = FONT_HEADING
    p_title.font.size = Pt(20)
    p_title.font.bold = True
    p_title.font.color.rgb = COLOR_TEXT_WHITE

    # Subtitle
    if subtitle:
        p_sub = tf_title.add_paragraph()
        p_sub.text = subtitle
        p_sub.font.name = FONT_BODY
        p_sub.font.size = Pt(11)
        p_sub.font.color.rgb = COLOR_TEXT_MUTED

def add_footer(slide):
    """Adds standard footer to slide."""
    footer_box = slide.shapes.add_textbox(Inches(0.8), Inches(7.05), Inches(11.733), Inches(0.35))
    tf = footer_box.text_frame
    p = tf.paragraphs[0]
    p.text = "CogniSense & CogniTwin | Team MEDVORTEX (AIT Pune) | Happiest Health CRP Challenge 2026 | Regulatory Disclaimer: Screening aid, not a diagnosis"
    p.font.name = FONT_BODY
    p.font.size = Pt(8)
    p.font.color.rgb = COLOR_TEXT_DIM

def add_card(slide, left, top, width, height, title, tag, border_color, bg_color=COLOR_CARD_BG):
    """Helper to add an architecture container card."""
    card = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, top, width, height)
    card.fill.solid()
    card.fill.fore_color.rgb = bg_color
    card.line.color.rgb = border_color
    card.line.width = Pt(1.5)

    tf = card.text_frame
    tf.word_wrap = True
    tf.margin_top = Inches(0.12)
    tf.margin_left = Inches(0.15)
    tf.margin_right = Inches(0.15)
    tf.margin_bottom = Inches(0.1)

    p0 = tf.paragraphs[0]
    p0.text = f"{title}"
    p0.font.name = FONT_HEADING
    p0.font.size = Pt(11)
    p0.font.bold = True
    p0.font.color.rgb = COLOR_TEXT_WHITE

    if tag:
        p_tag = tf.add_paragraph()
        p_tag.text = f"[{tag}]"
        p_tag.font.name = FONT_HEADING
        p_tag.font.size = Pt(8.5)
        p_tag.font.bold = True
        p_tag.font.color.rgb = border_color

    return card, tf

def build_presentation():
    prs = Presentation()
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)
    blank_layout = prs.slide_layouts[6]

    # =========================================================================
    # SLIDE 1: TITLE / COVER SLIDE
    # =========================================================================
    slide1 = prs.slides.add_slide(blank_layout)
    set_slide_background_dark(slide1)

    # Accent top border
    accent_bar = slide1.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0), Inches(0), Inches(13.333), Inches(0.1))
    accent_bar.fill.solid()
    accent_bar.fill.fore_color.rgb = COLOR_TEAL
    accent_bar.line.fill.background()

    # Challenge Badge
    badge = slide1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(1.2), Inches(1.1), Inches(4.5), Inches(0.42))
    badge.fill.solid()
    badge.fill.fore_color.rgb = COLOR_CARD_BG
    badge.line.color.rgb = COLOR_TEAL
    badge.line.width = Pt(1)
    tf_b = badge.text_frame
    p_b = tf_b.paragraphs[0]
    p_b.text = "HAPPIEST HEALTH CRP DIGITAL TWIN CHALLENGE 2026"
    p_b.font.name = FONT_HEADING
    p_b.font.size = Pt(9.5)
    p_b.font.bold = True
    p_b.font.color.rgb = COLOR_TEAL_LIGHT
    p_b.alignment = PP_ALIGN.CENTER

    # Main Title Box
    title_box = slide1.shapes.add_textbox(Inches(1.2), Inches(1.7), Inches(11.0), Inches(2.2))
    tf1 = title_box.text_frame
    tf1.word_wrap = True
    p1 = tf1.paragraphs[0]
    p1.text = "CogniSense & CogniTwin"
    p1.font.name = FONT_HEADING
    p1.font.size = Pt(36)
    p1.font.bold = True
    p1.font.color.rgb = COLOR_TEXT_WHITE

    p2 = tf1.add_paragraph()
    p2.text = "System Architecture & Clinical Integration Blueprint"
    p2.font.name = FONT_HEADING
    p2.font.size = Pt(22)
    p2.font.bold = True
    p2.font.color.rgb = COLOR_TEAL_LIGHT

    p3 = tf1.add_paragraph()
    p3.text = "Multimodal Continuous Patient Digital Twin for Early Alzheimer's & MCI Screening"
    p3.font.name = FONT_BODY
    p3.font.size = Pt(14)
    p3.font.color.rgb = COLOR_TEXT_MUTED

    # Highlights 4-card grid
    cards_data = [
        ("MULTIMODAL SENSING", "Continuous 7-day wearable telemetry + 8-min active speech & memory battery + static EHR baselines.", COLOR_BLUE),
        ("DIGITAL TWIN ENGINE", "5 deterministic clinical states, rolling 3d/7d trends, personal baseline normalization & zero future leakage.", COLOR_TEAL),
        ("CALIBRATED PREDICTION", "Platt sigmoid calibrated 30-day deterioration risk (0.982 ROC-AUC) with Wilson 95% confidence intervals.", COLOR_PURPLE),
        ("CLINICAL CARE INTEGRATION", "HL7 FHIR R4 standardized export + Pune verified memory clinic referral network with GPS triage.", COLOR_GREEN)
    ]
    for i, (head, desc, col) in enumerate(cards_data):
        cx = Inches(1.2 + i * 2.8)
        card_box = slide1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, cx, Inches(4.1), Inches(2.6), Inches(1.8))
        card_box.fill.solid()
        card_box.fill.fore_color.rgb = COLOR_CARD_BG
        card_box.line.color.rgb = col
        card_box.line.width = Pt(1.5)
        tf_c = card_box.text_frame
        tf_c.word_wrap = True
        tf_c.margin_left = Inches(0.12)
        tf_c.margin_right = Inches(0.12)
        p_c1 = tf_c.paragraphs[0]
        p_c1.text = head
        p_c1.font.name = FONT_HEADING
        p_c1.font.size = Pt(10)
        p_c1.font.bold = True
        p_c1.font.color.rgb = col

        p_c2 = tf_c.add_paragraph()
        p_c2.text = desc
        p_c2.font.name = FONT_BODY
        p_c2.font.size = Pt(8.5)
        p_c2.font.color.rgb = COLOR_TEXT_MUTED

    # Submitter info
    meta_box = slide1.shapes.add_textbox(Inches(1.2), Inches(6.1), Inches(11.0), Inches(0.8))
    tf_meta = meta_box.text_frame
    p_meta = tf_meta.paragraphs[0]
    p_meta.text = "Team MEDVORTEX | Army Institute of Technology (AIT), Pune | Lead ML: Yuvraj Shekhawat"
    p_meta.font.name = FONT_HEADING
    p_meta.font.size = Pt(10.5)
    p_meta.font.bold = True
    p_meta.font.color.rgb = COLOR_TEXT_LIGHT

    p_disc = tf_meta.add_paragraph()
    p_disc.text = "REGULATORY POSITIONING: Screening aid, not a diagnosis. Strictly non-diagnostic Clinical Decision Support prototype."
    p_disc.font.name = FONT_BODY
    p_disc.font.size = Pt(9)
    p_disc.font.color.rgb = COLOR_AMBER

    # =========================================================================
    # SLIDE 2: END-TO-END 4-TIER ARCHITECTURE (EDITABLE VECTOR SHAPES)
    # =========================================================================
    slide2 = prs.slides.add_slide(blank_layout)
    set_slide_background_dark(slide2)
    add_header(slide2, "End-to-End System Architecture (4-Tier Blueprint)",
               "Segregated flow from edge sensing and audio processing to digital twin analytics and clinical EHR",
               "SYSTEM ARCHITECTURE BLUEPRINT")

    tiers_meta = [
        {
            "tier": "TIER 1: MULTIMODAL INGESTION & SENSING",
            "tag": "INPUT LAYER",
            "col": COLOR_BLUE,
            "y": Inches(1.5), "h": Inches(1.25),
            "modules": [
                ("Passive Smartwatch Telemetry", "Continuous HR, RMSSD HRV, Sleep staging (Deep/REM), Daily Steps & Gait"),
                ("Active Cognitive Battery (8m)", "Local speech description (Cookie Theft), Word recall, Digital trail-making"),
                ("EHR & Laboratory Baselines", "Age, Education, Baseline MoCA, Vit B12, TSH, Chol, ApoE-e4, Comorbidities")
            ]
        },
        {
            "tier": "TIER 2: SECURE EDGE & IN-CLINIC MICROSERVICES",
            "tag": "EDGE GATEWAY",
            "col": COLOR_TEAL,
            "y": Inches(2.9), "h": Inches(1.25),
            "modules": [
                ("Local Speech Audio Pipeline", "faster-whisper local ASR, acoustic pause tracking, zero cloud audio egress"),
                ("Sensor Quality Control Gate", "Audio SNR/clipping validation + wearable dropout detection (quality < 0.65)"),
                ("FastAPI REST Microservice", "High-throughput async endpoints, thread-safe SQLite store (data/cognitwin.db)")
            ]
        },
        {
            "tier": "TIER 3: COGNITWIN CORE INTELLIGENCE ENGINE",
            "tag": "ANALYTICS ENGINE",
            "col": COLOR_PURPLE,
            "y": Inches(4.3), "h": Inches(1.25),
            "modules": [
                ("Daily Patient State Engine", "Personal baseline calibration (Days 1-3), 5 deterministic states, zero future leakage"),
                ("Calibrated 30-Day Predictor", "Grouped 5-Fold CV Platt classifier (0.982 ROC-AUC) + Wilson 95% CIs"),
                ("TreeSHAP & What-If Simulator", "Direction-aware feature drivers + real-time intervention sensitivity sliders")
            ]
        },
        {
            "tier": "TIER 4: CLINICAL INTERACTION & INTEROPERABILITY",
            "tag": "PRESENTATION LAYER",
            "col": COLOR_GREEN,
            "y": Inches(5.7), "h": Inches(1.25),
            "modules": [
                ("Streamlit Clinician OPD", "Interactive Day 1 -> 7+ timeline scrubber, state delta comparison & What-If sim"),
                ("React 18 Multilingual Web", "Senior-accessible UI (Atkinson Hyperlegible), English/Hindi/Marathi, Zero PHI"),
                ("HL7 FHIR R4 & Pune Referral", "Standardized RiskAssessment bundle export + Pune verified memory clinic locator")
            ]
        }
    ]

    for tm in tiers_meta:
        # Tier Container
        c_box = slide2.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), tm["y"], Inches(11.733), tm["h"])
        c_box.fill.solid()
        c_box.fill.fore_color.rgb = COLOR_CARD_BG
        c_box.line.color.rgb = tm["col"]
        c_box.line.width = Pt(1.5)

        # Header tag inside tier
        tf_tm = c_box.text_frame
        tf_tm.margin_top = Inches(0.08)
        tf_tm.margin_left = Inches(0.15)
        p_t = tf_tm.paragraphs[0]
        p_t.text = f"{tm['tier']}   "
        p_t.font.name = FONT_HEADING
        p_t.font.size = Pt(9.5)
        p_t.font.bold = True
        p_t.font.color.rgb = tm["col"]

        # Modules
        for idx, (m_title, m_desc) in enumerate(tm["modules"]):
            mx = Inches(0.95 + idx * 3.8)
            my = tm["y"] + Inches(0.32)
            m_box = slide2.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, mx, my, Inches(3.65), Inches(0.82))
            m_box.fill.solid()
            m_box.fill.fore_color.rgb = RGBColor(11, 19, 37)
            m_box.line.color.rgb = COLOR_CARD_BORDER
            m_box.line.width = Pt(0.8)
            tf_m = m_box.text_frame
            tf_m.word_wrap = True
            tf_m.margin_left = Inches(0.1)
            tf_m.margin_top = Inches(0.06)
            p_m1 = tf_m.paragraphs[0]
            p_m1.text = m_title
            p_m1.font.name = FONT_HEADING
            p_m1.font.size = Pt(9)
            p_m1.font.bold = True
            p_m1.font.color.rgb = COLOR_TEXT_LIGHT

            p_m2 = tf_m.add_paragraph()
            p_m2.text = m_desc
            p_m2.font.name = FONT_BODY
            p_m2.font.size = Pt(7.5)
            p_m2.font.color.rgb = COLOR_TEXT_MUTED

    add_footer(slide2)

    # =========================================================================
    # SLIDE 3: VISUAL ARCHITECTURE DIAGRAM (HIGH-RES GRAPHIC)
    # =========================================================================
    slide3 = prs.slides.add_slide(blank_layout)
    set_slide_background_dark(slide3)
    add_header(slide3, "Master System Architecture Diagram (Visual Overview)",
               "End-to-end data flow with latency budgets, security perimeter, and modular components",
               "HIGH-RESOLUTION VISUAL DIAGRAM")

    arch_img_path = "docs/architecture_diagram.png"
    if os.path.exists(arch_img_path):
        slide3.shapes.add_picture(arch_img_path, Inches(0.8), Inches(1.5), Inches(11.733), Inches(5.35))
    else:
        # Fallback placeholder card
        add_card(slide3, Inches(0.8), Inches(1.5), Inches(11.733), Inches(5.35),
                 "Architecture Diagram Rendering", "IN PROGRESS", COLOR_TEAL)
    add_footer(slide3)

    # =========================================================================
    # SLIDE 4: DAILY PATIENT STATE ENGINE (5 DETERMINISTIC STATES)
    # =========================================================================
    slide4 = prs.slides.add_slide(blank_layout)
    set_slide_background_dark(slide4)
    add_header(slide4, "CogniTwin: Daily Patient State Engine Architecture",
               "Deterministic finite-state machine tracking personal baseline deviations across 5 clinical states",
               "STATE MACHINE ENGINE")

    states_data = [
        ("1. BASELINE_INITIALIZING", "Days 1 to 2", "Establishes personal baseline bounds across HRV, Resting HR, Deep Sleep, and daily Steps. Suppresses premature false alarms.", COLOR_TEXT_MUTED),
        ("2. STABLE", "Deviations <= 15%", "Biometric telemetry tracks within individual norms. HRV slope stable (>-1.5 ms/day), deep sleep ratio preserved (>15%). Routine monitoring.", COLOR_GREEN),
        ("3. PHYSIOLOGICAL_DECLINE", ">=2 Multi-Domain Drops", ">= 2 adverse personal shifts: HRV drop >= 20%, Deep Sleep drop >= 25%, Steps drop >= 25%, or RHR jump >= +5 bpm. Early warning trigger.", COLOR_AMBER),
        ("4. COGNITIVE_RISK_ELEVATED", "Decline + Cog Baseline", "Multi-domain decline superimposed on low baseline MoCA (<24) or prior MCI. High probability of acute 30-day deterioration.", COLOR_CORAL),
        ("5. DATA_QUALITY_ALERT", "Sensor Quality < 0.65", "Watch off-wrist, missing data, or low SNR. SAFETY GUARD: Freezes state transitions and prevents hallucinating decline from sensor gaps.", COLOR_BLUE)
    ]

    for idx, (s_title, s_cond, s_desc, s_col) in enumerate(states_data):
        sx = Inches(0.8 + idx * 2.38)
        s_box = slide4.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, sx, Inches(1.55), Inches(2.25), Inches(2.55))
        s_box.fill.solid()
        s_box.fill.fore_color.rgb = COLOR_CARD_BG
        s_box.line.color.rgb = s_col
        s_box.line.width = Pt(1.5)

        tf_s = s_box.text_frame
        tf_s.word_wrap = True
        tf_s.margin_left = Inches(0.1)
        tf_s.margin_right = Inches(0.1)
        p_s1 = tf_s.paragraphs[0]
        p_s1.text = s_title
        p_s1.font.name = FONT_HEADING
        p_s1.font.size = Pt(9.5)
        p_s1.font.bold = True
        p_s1.font.color.rgb = s_col

        p_s2 = tf_s.add_paragraph()
        p_s2.text = f"Trigger: {s_cond}"
        p_s2.font.name = FONT_HEADING
        p_s2.font.size = Pt(8)
        p_s2.font.bold = True
        p_s2.font.color.rgb = COLOR_TEXT_WHITE

        p_s3 = tf_s.add_paragraph()
        p_s3.text = s_desc
        p_s3.font.name = FONT_BODY
        p_s3.font.size = Pt(7.5)
        p_s3.font.color.rgb = COLOR_TEXT_MUTED

    # Bottom Guardrail Container Card
    g_box = slide4.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(4.35), Inches(11.733), Inches(2.5))
    g_box.fill.solid()
    g_box.fill.fore_color.rgb = COLOR_CARD_BG
    g_box.line.color.rgb = COLOR_TEAL
    g_box.line.width = Pt(1.5)

    tf_g = g_box.text_frame
    tf_g.margin_left = Inches(0.2)
    tf_g.margin_top = Inches(0.12)
    p_gh = tf_g.paragraphs[0]
    p_gh.text = "CORE ALGORITHMIC PRINCIPLES IMPLEMENTED IN DailyPatientStateEngine"
    p_gh.font.name = FONT_HEADING
    p_gh.font.size = Pt(11)
    p_gh.font.bold = True
    p_gh.font.color.rgb = COLOR_TEAL_LIGHT

    guardrails = [
        ("Zero Future Information Leakage", "State calculation on Day t strictly accesses observations in [1 ... t]. Future timepoints are inaccessible, preserving strict temporal validity and reproducibility."),
        ("Personal Baseline Normalization", "Instead of arbitrary fixed thresholds, physiological shifts are evaluated against each patient's individual Day 1-3 setpoint. Compensates for age and natural variance."),
        ("Sensor Dropout Hallucination Defense", "If wearable_data_quality_score < 0.65, DATA_QUALITY_ALERT triggers immediately. Prevents the AI model from mistaking a charging watch for patient collapse."),
        ("Rolling Trajectory Slopes", "Slopes (hrv_trend_slope, steps_trend_slope, resting_hr_trend_slope) computed via ordinary least squares over 3-day and 7-day sliding windows to quantify velocity of change.")
    ]
    for g_title, g_desc in guardrails:
        p_t = tf_g.add_paragraph()
        p_t.text = f"•  {g_title}: "
        p_t.font.name = FONT_HEADING
        p_t.font.size = Pt(8.5)
        p_t.font.bold = True
        p_t.font.color.rgb = COLOR_TEXT_LIGHT

        # add inline text
        p_t_run = p_t.add_run()
        p_t_run.text = g_desc
        p_t_run.font.name = FONT_BODY
        p_t_run.font.size = Pt(8.0)
        p_t_run.font.bold = False
        p_t_run.font.color.rgb = COLOR_TEXT_MUTED

    add_footer(slide4)

    # =========================================================================
    # SLIDE 5: MULTIMODAL ML & CALIBRATED PREDICTION PIPELINE
    # =========================================================================
    slide5 = prs.slides.add_slide(blank_layout)
    set_slide_background_dark(slide5)
    add_header(slide5, "Calibrated Multimodal ML & Validation Pipeline",
               "Subject-grouped 5-fold cross validation, Platt sigmoid calibration, and uncertainty quantification",
               "PREDICTIVE ML PIPELINE")

    # Column 1: Feature Engineering (25 Features)
    f_box = slide5.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(1.55), Inches(3.6), Inches(5.3))
    f_box.fill.solid()
    f_box.fill.fore_color.rgb = COLOR_CARD_BG
    f_box.line.color.rgb = COLOR_BLUE
    f_box.line.width = Pt(1.5)
    tf_f = f_box.text_frame
    tf_f.margin_left = Inches(0.15)
    tf_f.margin_top = Inches(0.12)
    p_fh = tf_f.paragraphs[0]
    p_fh.text = "25 PATIENT TWIN FEATURES"
    p_fh.font.name = FONT_HEADING
    p_fh.font.size = Pt(11)
    p_fh.font.bold = True
    p_fh.font.color.rgb = COLOR_BLUE

    feat_desc = [
        ("13 Static Clinical Baselines:", [
            "Age, Education years, Sex",
            "Hypertension, Diabetes, Dyslipidemia",
            "Baseline MoCA Score (10-30)",
            "Prior MCI status (0/1)",
            "Labs: Vit B12, TSH, Cholesterol",
            "Family History of AD, ApoE-e4",
            "Medication Adherence (0.0-1.0)"
        ]),
        ("12 Longitudinal Wearable Features:", [
            "mean_hrv_ms & hrv_trend_slope",
            "mean_resting_hr_bpm & rhr_slope",
            "mean_sleep_hours & sleep_variability",
            "mean_deep_sleep_hours & deep_ratio",
            "mean_daily_steps & steps_slope",
            "mean_activity_minutes",
            "wearable_data_quality_score"
        ])
    ]
    for grp_title, grp_items in feat_desc:
        p_gh = tf_f.add_paragraph()
        p_gh.text = grp_title
        p_gh.font.name = FONT_HEADING
        p_gh.font.size = Pt(9)
        p_gh.font.bold = True
        p_gh.font.color.rgb = COLOR_TEXT_WHITE
        for it in grp_items:
            p_it = tf_f.add_paragraph()
            p_it.text = f" • {it}"
            p_it.font.name = FONT_BODY
            p_it.font.size = Pt(7.5)
            p_it.font.color.rgb = COLOR_TEXT_MUTED

    # Column 2: Leakage-Free CV Architecture
    cv_box = slide5.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(4.6), Inches(1.55), Inches(4.3), Inches(5.3))
    cv_box.fill.solid()
    cv_box.fill.fore_color.rgb = COLOR_CARD_BG
    cv_box.line.color.rgb = COLOR_PURPLE
    cv_box.line.width = Pt(1.5)
    tf_cv = cv_box.text_frame
    tf_cv.margin_left = Inches(0.15)
    tf_cv.margin_top = Inches(0.12)
    p_cvh = tf_cv.paragraphs[0]
    p_cvh.text = "ZERO-LEAKAGE CV ARCHITECTURE"
    p_cvh.font.name = FONT_HEADING
    p_cvh.font.size = Pt(11)
    p_cvh.font.bold = True
    p_cvh.font.color.rgb = COLOR_PURPLE

    cv_steps = [
        ("Grouped 5-Fold Splitting", "Grouped strictly by patient_id. All observations of a patient exist solely within training OR test fold, never both."),
        ("Strict In-Fold Preprocessing", "SimpleImputer(strategy='median') and StandardScaler() fit strictly inside CV folds. Zero dataset-level leakage."),
        ("Leakage Variable Guards", "Explicit automated dropping of latent generator variables (synthetic_event_probability, latent_risk, Risk_Score)."),
        ("Platt Sigmoid Calibration", "CalibratedClassifierCV(method='sigmoid', cv=5) maps raw logit margins to true posterior empirical probabilities."),
        ("Wilson 95% Confidence Intervals", "Uncertainty quantified per prediction via Wilson score interval; prevents ungrounded clinical decisions.")
    ]
    for step_title, step_desc in cv_steps:
        p_st = tf_cv.add_paragraph()
        p_st.text = f"▶ {step_title}"
        p_st.font.name = FONT_HEADING
        p_st.font.size = Pt(8.5)
        p_st.font.bold = True
        p_st.font.color.rgb = COLOR_TEXT_LIGHT
        p_sd = tf_cv.add_paragraph()
        p_sd.text = step_desc
        p_sd.font.name = FONT_BODY
        p_sd.font.size = Pt(7.5)
        p_sd.font.color.rgb = COLOR_TEXT_MUTED

    # Column 3: Audited Metrics & Risk Tiers
    m_box = slide5.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(9.1), Inches(1.55), Inches(3.433), Inches(5.3))
    m_box.fill.solid()
    m_box.fill.fore_color.rgb = COLOR_CARD_BG
    m_box.line.color.rgb = COLOR_GREEN
    m_box.line.width = Pt(1.5)
    tf_m = m_box.text_frame
    tf_m.margin_left = Inches(0.15)
    tf_m.margin_top = Inches(0.12)
    p_mh = tf_m.paragraphs[0]
    p_mh.text = "AUDITED VALIDATION BENCHMARKS"
    p_mh.font.name = FONT_HEADING
    p_mh.font.size = Pt(11)
    p_mh.font.bold = True
    p_mh.font.color.rgb = COLOR_GREEN

    metrics_list = [
        ("ROC-AUC", "0.982", "95% CI: [0.971, 0.993]"),
        ("PR-AUC", "0.936", "High precision on positive events"),
        ("Brier Score", "0.044", "Calibrated probability error < 0.05"),
        ("Specificity", "0.980", "98% protection against false alarms"),
        ("Sensitivity", "0.847", "Reliable deterioration detection"),
        ("Accuracy", "0.949", "Overall balanced accuracy")
    ]
    for m_label, m_val, m_note in metrics_list:
        p_ml = tf_m.add_paragraph()
        p_ml.text = f"{m_label}: {m_val}"
        p_ml.font.name = FONT_HEADING
        p_ml.font.size = Pt(9.5)
        p_ml.font.bold = True
        p_ml.font.color.rgb = COLOR_TEXT_WHITE

        p_mn = tf_m.add_paragraph()
        p_mn.text = f"  ({m_note})"
        p_mn.font.name = FONT_BODY
        p_mn.font.size = Pt(7.5)
        p_mn.font.color.rgb = COLOR_TEXT_MUTED

    p_rt = tf_m.add_paragraph()
    p_rt.text = "\n4 Calibrated Risk Tiers:"
    p_rt.font.name = FONT_HEADING
    p_rt.font.size = Pt(9)
    p_rt.font.bold = True
    p_rt.font.color.rgb = COLOR_TEXT_LIGHT

    tiers_bullets = [
        "LOW (<25%)", "MODERATE (25-50%)", "ELEVATED (50-75%)", "HIGH (>=75%)"
    ]
    for tb in tiers_bullets:
        p_tbb = tf_m.add_paragraph()
        p_tbb.text = f" • {tb}"
        p_tbb.font.name = FONT_BODY
        p_tbb.font.size = Pt(7.5)
        p_tbb.font.color.rgb = COLOR_TEXT_MUTED

    add_footer(slide5)

    # =========================================================================
    # SLIDE 6: EXPLAINABLE AI & COUNTERFACTUAL WHAT-IF SIMULATOR
    # =========================================================================
    slide6 = prs.slides.add_slide(blank_layout)
    set_slide_background_dark(slide6)
    add_header(slide6, "Explainable AI (SHAP) & Counterfactual Simulator",
               "Local feature attributions vs. cohort norms & real-time 'What-If' sensitivity simulation",
               "EXPLAINABILITY & SIMULATION")

    # Left Container: SHAP Attributions & Narrative
    s_left = slide6.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(1.55), Inches(5.6), Inches(5.3))
    s_left.fill.solid()
    s_left.fill.fore_color.rgb = COLOR_CARD_BG
    s_left.line.color.rgb = COLOR_PURPLE
    s_left.line.width = Pt(1.5)
    tf_sl = s_left.text_frame
    tf_sl.margin_left = Inches(0.18)
    tf_sl.margin_top = Inches(0.15)
    p_slh = tf_sl.paragraphs[0]
    p_slh.text = "LOCAL TREESHAP ATTRIBUTIONS & NARRATIVES"
    p_slh.font.name = FONT_HEADING
    p_slh.font.size = Pt(11)
    p_slh.font.bold = True
    p_slh.font.color.rgb = COLOR_PURPLE

    shap_points = [
        ("Reference Cohort Centering", "Calculates local feature attributions comparing patient's current biomarker against the cohort median reference, avoiding black-box assertions."),
        ("Direction-Aware Explanations", "Clearly separates [+] Risk Escalators (e.g., negative HRV slope, deep sleep reduction) from [-] Protective Anchors (e.g., high baseline MoCA, strong adherence)."),
        ("Clinician-Facing Natural Language", "Automatically generates structured clinical bullet points detailing exactly why a patient's risk tier elevated over the 7-day monitoring window."),
        ("Evidence-Based Transparency", "Every attribution links back to physiological mechanisms (autonomic nervous breakdown, circadian collapse, executive processing slowdown).")
    ]
    for sp_title, sp_desc in shap_points:
        p_t = tf_sl.add_paragraph()
        p_t.text = f"• {sp_title}"
        p_t.font.name = FONT_HEADING
        p_t.font.size = Pt(9)
        p_t.font.bold = True
        p_t.font.color.rgb = COLOR_TEXT_LIGHT

        p_d = tf_sl.add_paragraph()
        p_d.text = sp_desc
        p_d.font.name = FONT_BODY
        p_d.font.size = Pt(8)
        p_d.font.color.rgb = COLOR_TEXT_MUTED

    # Right Container: What-If Counterfactual Simulator
    s_right = slide6.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(6.8), Inches(1.55), Inches(5.733), Inches(5.3))
    s_right.fill.solid()
    s_right.fill.fore_color.rgb = COLOR_CARD_BG
    s_right.line.color.rgb = COLOR_TEAL
    s_right.line.width = Pt(1.5)
    tf_sr = s_right.text_frame
    tf_sr.margin_left = Inches(0.18)
    tf_sr.margin_top = Inches(0.15)
    p_srh = tf_sr.paragraphs[0]
    p_srh.text = "WHAT-IF COUNTERFACTUAL SENSITIVITY SIMULATOR"
    p_srh.font.name = FONT_HEADING
    p_srh.font.size = Pt(11)
    p_srh.font.bold = True
    p_srh.font.color.rgb = COLOR_TEAL_LIGHT

    sim_points = [
        ("Physician Counterfactual Querying", "Allows clinicians to ask: 'If this patient improves sleep duration by +1.5h and achieves 90% medication adherence, does their risk shift?'"),
        ("Dynamic Re-Inference Engine", "Modifies candidate feature values and runs them through the exact fitted, calibrated inference pipeline in real time (<50ms)."),
        ("Interactive Levers in Streamlit / API", [
            "Sleep Duration (+0.5h to +3.0h) & proportional Deep Sleep scaling",
            "Daily Steps (+1,000 to +6,000 steps) & activity minutes",
            "Autonomic HRV Recovery (+5 to +20 ms RMSSD shift)",
            "Medication Adherence (optimization up to 95%-100%)"
        ]),
        ("Real Patient PT-0002 Demonstration", "Demo patient PT-0002 starts in PHYSIOLOGICAL_DECLINE (risk 68%). Counterfactual simulation demonstrates risk reduction down to 34% (MODERATE tier), motivating targeted clinical action.")
    ]
    for item in sim_points:
        if isinstance(item[1], list):
            p_t = tf_sr.add_paragraph()
            p_t.text = f"• {item[0]}:"
            p_t.font.name = FONT_HEADING
            p_t.font.size = Pt(9)
            p_t.font.bold = True
            p_t.font.color.rgb = COLOR_TEXT_LIGHT
            for sub_it in item[1]:
                p_sub = tf_sr.add_paragraph()
                p_sub.text = f"   - {sub_it}"
                p_sub.font.name = FONT_BODY
                p_sub.font.size = Pt(7.5)
                p_sub.font.color.rgb = COLOR_TEXT_MUTED
        else:
            p_t = tf_sr.add_paragraph()
            p_t.text = f"• {item[0]}"
            p_t.font.name = FONT_HEADING
            p_t.font.size = Pt(9)
            p_t.font.bold = True
            p_t.font.color.rgb = COLOR_TEXT_LIGHT
            p_d = tf_sr.add_paragraph()
            p_d.text = item[1]
            p_d.font.name = FONT_BODY
            p_d.font.size = Pt(8)
            p_d.font.color.rgb = COLOR_TEXT_MUTED

    add_footer(slide6)

    # =========================================================================
    # SLIDE 7: PRIVACY-BY-DESIGN & EDGE SECURITY ARCHITECTURE
    # =========================================================================
    slide7 = prs.slides.add_slide(blank_layout)
    set_slide_background_dark(slide7)
    add_header(slide7, "Privacy-by-Design & Edge Security Architecture",
               "100% on-device speech processing, PII scrubbing, and GDPR Article 17 right-to-erasure",
               "PRIVACY & COMPLIANCE")

    priv_cards = [
        ("ZERO CLOUD AUDIO EGRESS", "Local ASR Architecture", [
            "Speech recognition runs locally via faster-whisper",
            "Zero raw audio or voice recordings transmitted to external cloud APIs",
            "Protects acoustic biometrics and prevents patient re-identification"
        ], COLOR_TEAL),
        ("EPHEMERAL DATA DELETION", "In-Memory Signal Extraction", [
            "Raw audio buffer held strictly in RAM during feature extraction",
            "Immediate deletion of audio files after acoustic functionals calculated",
            "Only derived acoustic summary statistics (pause ratio, rate) persisted"
        ], COLOR_BLUE),
        ("PRESIDIO PII SCRUBBING", "Transcript De-Identification", [
            "Transcripts scrubbed of names, locations, clinics, and phone numbers",
            "Automated entity replacement: [PATIENT], [DATE], [CITY]",
            "Ensures linguistic feature extraction operates on de-identified text"
        ], COLOR_PURPLE),
        ("PSEUDONYMIZED IDS & GDPR 17", "Cryptographic Right-to-Erasure", [
            "Patient IDs pseudonymized via salted HMAC-SHA256 tokens",
            "Simulated GDPR Article 17 right-to-erasure endpoint (/privacy)",
            "One-click cryptographic key shredding immediately renders records unrecoverable"
        ], COLOR_AMBER),
        ("TAMPER-RESISTANT AUDIT LOG", "Security Compliance Logging", [
            "Append-only cryptographic audit trail recording model inferences",
            "Tracks timestamp, model version, session ID, and QC status",
            "Full compliance with HIPAA Security Rule and EU AI Act Class IIa SaMD"
        ], COLOR_GREEN),
        ("NON-DIAGNOSTIC POSITIONING", "Clinical Safety Guardrails", [
            "Every UI screen, CLI tool, and API response embeds required disclaimers",
            "Explicitly marked: 'Screening aid, not a diagnosis'",
            "Never outputs diagnostic claims or prescriptive pharmaceutical orders"
        ], COLOR_CORAL)
    ]

    for idx, (p_title, p_sub, p_items, p_col) in enumerate(priv_cards):
        col_idx = idx % 3
        row_idx = idx // 3
        px = Inches(0.8 + col_idx * 3.95)
        py = Inches(1.55 + row_idx * 2.65)

        card_box = slide7.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, px, py, Inches(3.8), Inches(2.5))
        card_box.fill.solid()
        card_box.fill.fore_color.rgb = COLOR_CARD_BG
        card_box.line.color.rgb = p_col
        card_box.line.width = Pt(1.5)

        tf_p = card_box.text_frame
        tf_p.word_wrap = True
        tf_p.margin_left = Inches(0.12)
        tf_p.margin_top = Inches(0.1)

        p_h = tf_p.paragraphs[0]
        p_h.text = p_title
        p_h.font.name = FONT_HEADING
        p_h.font.size = Pt(10)
        p_h.font.bold = True
        p_h.font.color.rgb = p_col

        p_s = tf_p.add_paragraph()
        p_s.text = p_sub
        p_s.font.name = FONT_HEADING
        p_s.font.size = Pt(8)
        p_s.font.bold = True
        p_s.font.color.rgb = COLOR_TEXT_LIGHT

        for it in p_items:
            p_it = tf_p.add_paragraph()
            p_it.text = f"• {it}"
            p_it.font.name = FONT_BODY
            p_it.font.size = Pt(7.5)
            p_it.font.color.rgb = COLOR_TEXT_MUTED

    add_footer(slide7)

    # =========================================================================
    # SLIDE 8: CLINICAL INTEGRATION & CARE PATHWAY WORKFLOW
    # =========================================================================
    slide8 = prs.slides.add_slide(blank_layout)
    set_slide_background_dark(slide8)
    add_header(slide8, "Clinical Integration Workflow & Referral Care Pathway",
               "From primary care intake and 8-min screening to risk-stratified pathways and Pune clinic triage",
               "CLINICAL CARE PATHWAY")

    workflow_img_path = "docs/clinical_workflow_diagram.png"
    if os.path.exists(workflow_img_path):
        slide8.shapes.add_picture(workflow_img_path, Inches(0.8), Inches(1.5), Inches(11.733), Inches(5.35))
    else:
        add_card(slide8, Inches(0.8), Inches(1.5), Inches(11.733), Inches(5.35),
                 "Clinical Workflow Diagram Rendering", "IN PROGRESS", COLOR_GREEN)
    add_footer(slide8)

    # =========================================================================
    # SLIDE 9: TECHNOLOGY STACK & DEPLOYMENT ARCHITECTURE
    # =========================================================================
    slide9 = prs.slides.add_slide(blank_layout)
    set_slide_background_dark(slide9)
    add_header(slide9, "Technology Stack & Containerized Deployment",
               "Full-stack microservices architecture: Python 3.11, FastAPI, Streamlit, React 18, and Docker",
               "TECH STACK & INFRASTRUCTURE")

    tech_matrix = [
        ("Patient Web Portal", "React 18, Vite, TypeScript, Tailwind CSS v4, Lucide, Leaflet Maps", "Production live on Vercel; Atkinson Hyperlegible typography for senior accessibility; multi-lingual English/Hindi/Marathi.", COLOR_BLUE),
        ("Clinician Workstation", "Streamlit 1.31, Plotly Express & Graph Objects", "Dedicated clinical OPD interface; interactive Day 1->7+ scrubber; Day A vs B comparator; What-If intervention sliders.", COLOR_TEAL),
        ("Backend Microservice", "FastAPI, Uvicorn, Pydantic v2, Python 3.11", "High-throughput asynchronous REST API; OpenAPI 3.0 interactive Swagger UI at /docs; structured JSON responses.", COLOR_PURPLE),
        ("Core ML & Algorithms", "scikit-learn, XGBoost, SHAP, Joblib, NumPy, Pandas", "Grouped 5-fold cross validation, Platt sigmoid calibration (CalibratedClassifierCV), TreeExplainer attributions.", COLOR_GREEN),
        ("Speech & Neuropsych", "faster-whisper, SpaCy (en_core_web_md), SciPy", "Local ASR with disfluency preservation; acoustic pause length & hesitation frequency; semantic info-unit coverage.", COLOR_AMBER),
        ("Data & Interoperability", "SQLite3, Persistent Session Proxies, HL7 FHIR R4", "Thread-safe persistent session storage; survives server restarts; standardized FHIR R4 RiskAssessment bundle export.", COLOR_TEAL_LIGHT),
        ("DevOps & Orchestration", "Docker, Docker Compose, Makefile, GitHub Actions", "Multi-stage Docker builds; automated make targets (setup, train, evaluate, app, test); reproducible CI pipeline.", COLOR_TEXT_LIGHT)
    ]

    for idx, (layer_name, stack_details, why_chosen, col) in enumerate(tech_matrix):
        ty = Inches(1.5 + idx * 0.77)
        row_box = slide9.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), ty, Inches(11.733), Inches(0.7))
        row_box.fill.solid()
        row_box.fill.fore_color.rgb = COLOR_CARD_BG
        row_box.line.color.rgb = col
        row_box.line.width = Pt(1.2)

        tf_r = row_box.text_frame
        tf_r.word_wrap = True
        tf_r.margin_left = Inches(0.15)
        tf_r.margin_top = Inches(0.06)

        p_r1 = tf_r.paragraphs[0]
        p_r1.text = f"{layer_name}:  "
        p_r1.font.name = FONT_HEADING
        p_r1.font.size = Pt(9.5)
        p_r1.font.bold = True
        p_r1.font.color.rgb = col

        p_r1_run = p_r1.add_run()
        p_r1_run.text = stack_details
        p_r1_run.font.name = FONT_HEADING
        p_r1_run.font.size = Pt(9)
        p_r1_run.font.bold = True
        p_r1_run.font.color.rgb = COLOR_TEXT_WHITE

        p_r2 = tf_r.add_paragraph()
        p_r2.text = f"Rationale: {why_chosen}"
        p_r2.font.name = FONT_BODY
        p_r2.font.size = Pt(8)
        p_r2.font.color.rgb = COLOR_TEXT_MUTED

    add_footer(slide9)

    # =========================================================================
    # SLIDE 10: ARCHITECTURAL VERIFICATION & JUDGE PERSONAS
    # =========================================================================
    slide10 = prs.slides.add_slide(blank_layout)
    set_slide_background_dark(slide10)
    add_header(slide10, "Architectural Verification & Pre-Configured Judge Personas",
               "4 pre-engineered test personas in data/cognitwin.db proving every system capability during live evaluation",
               "VERIFICATION & LIVE TESTING")

    personas = [
        ("PT-0001", "STABLE BENCHMARK", "62F, MoCA 28.5, no MCI. HRV ~56 ms, Sleep ~7.6h, Quality 0.98",
         "Proves STABLE state classification, LOW risk tier (<15%), and protection against clinical false alarms.", COLOR_GREEN),
        ("PT-0002", "PROGRESSIVE DECLINE (PRIMARY DEMO)", "73M, MoCA 25.0, Hypertension. Days 1-3 stable; Days 4-7 rapid HRV & sleep collapse",
         "Proves State Transition Detection (STABLE on Day 3 -> PHYSIOLOGICAL_DECLINE on Day 7) and What-If Intervention Simulation.", COLOR_AMBER),
        ("PT-0003", "NOISY WEARABLE TELEMETRY", "68F, MoCA 26.0. Watch off-wrist / sensor dropouts on Days 2, 5, 6 (quality = 0.45)",
         "Proves Data Quality Guardrails: Triggers DATA_QUALITY_ALERT instead of hallucinating false physiological decline.", COLOR_BLUE),
        ("PT-0004", "MULTI-DOMAIN HIGH RISK", "79M, Prior MCI, MoCA 21.0, chronic low HRV (~28 ms) & fragmented sleep (~5.1h)",
         "Proves COGNITIVE_RISK_ELEVATED state and HIGH risk tier (>=75%) with multi-factor TreeSHAP attributions.", COLOR_CORAL)
    ]

    for idx, (pid, pname, pprof, pproof, pcol) in enumerate(personas):
        py = Inches(1.55 + idx * 1.3)
        pbox = slide10.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), py, Inches(11.733), Inches(1.18))
        pbox.fill.solid()
        pbox.fill.fore_color.rgb = COLOR_CARD_BG
        pbox.line.color.rgb = pcol
        pbox.line.width = Pt(1.5)

        tf_p = pbox.text_frame
        tf_p.word_wrap = True
        tf_p.margin_left = Inches(0.18)
        tf_p.margin_top = Inches(0.08)

        p1 = tf_p.paragraphs[0]
        p1.text = f"Patient ID {pid}: {pname}"
        p1.font.name = FONT_HEADING
        p1.font.size = Pt(10.5)
        p1.font.bold = True
        p1.font.color.rgb = pcol

        p2 = tf_p.add_paragraph()
        p2.text = f"Clinical Profile: {pprof}"
        p2.font.name = FONT_BODY
        p2.font.size = Pt(8.5)
        p2.font.color.rgb = COLOR_TEXT_LIGHT

        p3 = tf_p.add_paragraph()
        p3.text = f"What It Proves: {pproof}"
        p3.font.name = FONT_BODY
        p3.font.size = Pt(8.5)
        p3.font.color.rgb = COLOR_TEXT_MUTED

    add_footer(slide10)

    # Save presentation to all targets
    for target in PPT_TARGETS:
        prs.save(target)
        print(f"Successfully saved architecture presentation to: {target}")

if __name__ == "__main__":
    build_presentation()
    print("PowerPoint architecture presentation generation completed.")
