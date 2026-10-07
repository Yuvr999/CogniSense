# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### Added
- **Frontend F0**: Setup Vite + React 18 + Tailwind v4 + MSW with `patient`, `clinic`, and `landing` density modes.
- **Frontend F1**: Built core design system components (RiskTierBadge, IntervalBar, TiltCard, NavPill, DataQualityBanner, etc.) matching calm-variant specs.
- **Frontend F2**: Assembled the Landing Page (`/`) with scroll animations, tabbed previews, and dynamic mock metric evaluation displays.
- **Frontend F3**: Implemented the Patient Screening Flow (`/screen`) powered by a Zustand state machine containing Mic checks, trace tasks, and memory recall, without persisting PHI to storage.
- **Frontend F4**: Built the Clinician Dashboard (`/clinic`) featuring queue list, KPI strips, horizontal contribution charts (SHAP), cognitive domain z-score bars, speech pause timelines, and interactive threshold simulations.
