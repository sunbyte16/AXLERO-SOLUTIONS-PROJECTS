# Design.md

# SwarmRL - Design System

Version: 1.0

Status: Planning

Purpose:
This document defines the complete visual design system and user experience guidelines for the SwarmRL platform. The design focuses on creating a modern, professional, technical interface for monitoring autonomous drone swarms, reinforcement learning experiments, 3D simulations, and AI training performance.

---

# Design Philosophy

SwarmRL is an advanced AI and autonomous systems platform.

The interface should communicate:

- Intelligence
- Precision
- Technology
- Control
- Real-Time Awareness
- Reliability
- Scientific Analysis

The design must make complex reinforcement learning and swarm simulation information easy to understand.

The interface should feel like a professional autonomous systems control center rather than a generic dashboard.

---

# Design Principles

- Clean
- Technical
- Modern
- Minimal
- Data-focused
- Responsive
- Accessible
- Performance-oriented
- Consistent
- Visualization-first

---

# User Experience Principles

The application should prioritize:

1. Understanding the current swarm state.
2. Monitoring training progress.
3. Interacting with the 3D environment.
4. Understanding agent behavior.
5. Analyzing performance metrics.
6. Controlling simulation and training safely.

Important information should always be visible without unnecessary navigation.

---

# Theme

Primary Theme:

Dark Mode

Secondary Theme:

Light Mode

Default Theme:

Dark

Reason:

SwarmRL is a visualization-heavy technical platform. A dark interface provides better contrast for:

- 3D simulation
- Charts
- Sensor visualization
- Flight paths
- Status indicators
- Real-time telemetry

---

# Color Palette

## Primary

Primary Blue

#2563EB

Used for:

- Primary buttons
- Active navigation
- Main interactive controls
- Selected elements

---

## Secondary

Cyan

#06B6D4

Used for:

- Telemetry
- Real-time information
- Sensor indicators
- Technical highlights

---

## Accent

Purple

#8B5CF6

Used for:

- AI-related elements
- Training indicators
- Advanced analytics

---

## Success

Green

#22C55E

Used for:

- Healthy agents
- Successful training
- Completed episodes
- Explored regions

---

## Warning

Amber

#F59E0B

Used for:

- High resource usage
- Near-collision alerts
- Training warnings
- Performance warnings

---

## Error

Red

#EF4444

Used for:

- Collisions
- Failed training
- Offline agents
- Critical errors

---

## Background

Primary

#0B1120

Secondary

#111827

Surface

#1E293B

Card

#243244

Border

#334155

---

# Text Colors

Primary

#F8FAFC

Secondary

#CBD5E1

Muted

#94A3B8

Disabled

#64748B

---

# Typography

Primary Font:

Inter

Fallback:

System UI

Monospace:

JetBrains Mono

Use the monospace font for:

- Coordinates
- Telemetry
- Logs
- Configuration
- Code
- Training values

---

# Typography Scale

Display

48px

Heading 1

36px

Heading 2

30px

Heading 3

24px

Heading 4

20px

Body

16px

Small

14px

Caption

12px

Telemetry

13px

---

# Font Weight

Light

300

Regular

400

Medium

500

SemiBold

600

Bold

700

---

# Border Radius

Buttons

10px

Inputs

10px

Cards

16px

Dialogs

18px

Panels

16px

Badges

999px

---

# Shadows

Use subtle shadows.

Small

Navigation elements

Medium

Cards and panels

Large

Dialogs and overlays

Avoid excessive shadows.

---

# Spacing System

Use a consistent 8px spacing system.

Base values:

4px

8px

12px

16px

20px

24px

32px

40px

48px

64px

80px

---

# Grid System

Desktop:

12 columns

Tablet:

8 columns

Mobile:

4 columns

Maximum content width:

1600px

---

# Application Layout

```text
┌─────────────────────────────────────────────────────────┐
│                     Top Navigation                      │
├──────────────┬──────────────────────────────────────────┤
│              │                                          │
│   Sidebar    │              Main Content                │
│              │                                          │
│              │                                          │
│              │                                          │
│              │                                          │
└──────────────┴──────────────────────────────────────────┘





---

 Sidebar Navigation

```
The sidebar is the primary navigation area of the application.

Navigation items:

Dashboard
Simulation
Training
Agents
Environment
Analytics
Models
Experiments
Logs
Settings

The sidebar must support:

Expanded mode
Collapsed mode
Tooltips when collapsed
Active route indicator
Keyboard navigation
Responsive drawer mode on smaller screens

The active navigation item must be visually distinguishable.

The sidebar should remain available throughout the main application workflow.

```
