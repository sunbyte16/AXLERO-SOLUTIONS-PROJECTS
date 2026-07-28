# FedMed – UI/UX & Design System Guidelines

---

### 1. Visual Theme & Aesthetics
- **Core Theme**: High-contrast, slate-teal healthcare dark/light theme designed for clinical review environments and high-density monitoring.
- **Color Palette**:
  - Primary Accent: Emerald / Medical Teal (`#0d9488`, `#14b8a6`)
  - Secondary Accent: Indigo / Deep Cyber Blue (`#4f46e5`, `#6366f1`)
  - Background Dark: Deep Slate (`#0f172a`, `#1e293b`, `#334155`)
  - Status Indicators:
    - Online / Healthy: Emerald (`#22c55e`)
    - Training / Active: Cyan / Teal (`#06b6d4`)
    - Warning / High Privacy Loss: Amber (`#f59e0b`)
    - Error / Disconnected: Rose (`#f43f5e`)

---

### 2. Layout & Structure
- **Navigation**: Persistent left sidebar with clean icons (Dashboard, Hospitals, FL Engine, Privacy, 3D MRI Viewer, Audit Logs, Settings).
- **Header**: Top status bar displaying real-time platform connectivity, active FL round, active nodes count, system security lock badge, and theme switch.
- **Data Density**: High-density cards with subtle borders (`border-slate-800`), clean typography hierarchy, crisp Recharts visualization charts, and interactive controls.
- **Canvas Rendering**: HTML5 Canvas rendering 3D Medical MRI slices with dual-layer compositing (Gray-scale anatomical slice + Semi-transparent colored U-Net segmentation mask).
