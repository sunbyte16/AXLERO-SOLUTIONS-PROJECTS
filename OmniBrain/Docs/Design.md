# OmniBrain - Design System

Version: 1.0

Status: Planning

Purpose:
This document defines the complete UI/UX design system for OmniBrain. It establishes the visual identity, component library, design principles, layout rules, accessibility standards, and responsive behavior for the application.

---

# Design Philosophy

OmniBrain is an Enterprise AI Platform.

The interface should feel

- Clean
- Modern
- Professional
- Minimal
- Fast
- Intelligent

The design should reduce cognitive load while allowing users to focus on documents and AI-generated insights.

---

# Design Principles

- Simplicity over complexity
- Functionality before decoration
- Consistent spacing
- Accessible interfaces
- Responsive layouts
- Minimal animations
- Enterprise-grade appearance
- Dark Mode first
- Mobile friendly
- Performance optimized

---

# Theme

Primary Theme

Dark Mode

Secondary Theme

Light Mode

Default

Dark

---

# Color Palette

## Primary

Primary Blue

#2563EB

Hover

#1D4ED8

Pressed

#1E40AF

---

## Secondary

Purple

#7C3AED

---

## Success

#22C55E

---

## Warning

#F59E0B

---

## Error

#EF4444

---

## Background

Dark

#0F172A

Surface

#1E293B

Card

#334155

Border

#475569

---

## Text

Primary

#FFFFFF

Secondary

#CBD5E1

Muted

#94A3B8

Disabled

#64748B

---

# Typography

Primary Font

Inter

Fallback

System UI

---

# Font Sizes

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

Cards

16px

Dialogs

20px

Inputs

12px

Badges

999px

---

# Shadows

Small

Soft elevation

Medium

Cards

Large

Modals

No excessive shadows.

---

# Spacing Scale

4

8

12

16

20

24

32

40

48

64

80

---

# Grid System

Desktop

12 Columns

Tablet

8 Columns

Mobile

4 Columns

Maximum Width

1440px

---

# Layout

Top Navigation

↓

Sidebar

↓

Main Content

↓

Footer

---

# Sidebar

Contains

- Dashboard
- Chat
- Documents
- Collections
- Agents
- Analytics
- Settings
- Profile

Collapsible

Yes

---

# Navigation Bar

Contains

- Logo
- Search
- Notifications
- User Menu

Sticky

Yes

---

# Dashboard

Widgets

- Uploaded Documents
- AI Conversations
- Recent Activity
- Token Usage
- Agent Health
- Storage Usage

---

# Chat Interface

Layout

Left

Conversation History

Center

Chat Window

Right

Document Context

---

# Chat Bubble

User

Right aligned

Assistant

Left aligned

Maximum Width

70%

Support

Markdown

Code Blocks

Tables

Images

LaTeX

---

# AI Response Card

Contains

- Answer
- Sources
- Confidence Score
- Agent Used
- Processing Time

Expandable

Yes

---

# Citation Viewer

Display

- Document Name
- Page Number
- Highlighted Text
- Confidence

Clicking citation

↓

Open PDF

↓

Scroll to exact location

---

# Document Upload

Supports

- Drag & Drop
- Browse Files

Display

- Upload Progress
- Processing Status
- Success Message
- Error Message

---

# Document Viewer

Features

- Zoom
- Search
- Page Navigation
- Highlight Sources
- Image Viewer
- Table Viewer

---

# Analytics Dashboard

Cards

- Documents Indexed
- Average Response Time
- Active Users
- Token Usage
- Retrieval Accuracy

Charts

- Daily Usage
- Agent Performance
- API Requests
- Search Trends

---

# Buttons

Primary

Filled Blue

Secondary

Outlined

Danger

Red

Ghost

Transparent

Loading State

Spinner

Disabled State

Lower Opacity

---

# Forms

Input Fields

Rounded

Label Above

Validation Below

Required

Red Asterisk

---

# Icons

Library

Lucide React

Size

16

20

24

32

Use SVG only.

---

# Tables

Features

- Sorting
- Filtering
- Pagination
- Search
- Sticky Header

---

# Modals

Used For

- Delete Confirmation
- Upload
- Settings
- Agent Details

Close Methods

- ESC
- Close Button
- Outside Click

---

# Notifications

Toast Position

Top Right

Types

- Success
- Warning
- Error
- Info

Duration

3–5 seconds

---

# Loading States

Use

- Skeleton Loaders
- Progress Bars
- Spinners

Avoid blank pages.

---

# Empty States

Every empty page should include

- Illustration
- Description
- Action Button

Example

"No documents uploaded yet."

---

# Error Pages

404

Page Not Found

500

Internal Server Error

Network Error

Connection Lost

Each page should include

- Friendly message
- Retry button

---

# Accessibility

Minimum Contrast

WCAG AA

Keyboard Navigation

Required

Focus Indicators

Visible

Screen Reader Support

Required

Images

Alt Text Required

---

# Responsive Breakpoints

Mobile

<640px

Tablet

640px–1024px

Desktop

1024px–1440px

Large Desktop

>1440px

---

# Animation Guidelines

Use subtle animations only.

Allowed

- Fade
- Slide
- Scale
- Skeleton Loading

Duration

150–300ms

Avoid excessive motion.

---

# Component Library

Core Components

- Button
- Input
- Select
- Textarea
- Checkbox
- Radio
- Modal
- Drawer
- Card
- Badge
- Avatar
- Tooltip
- Spinner
- Table
- Tabs
- Breadcrumb
- Pagination

AI Components

- Chat Bubble
- Citation Card
- Confidence Badge
- Agent Status
- Upload Progress
- Source Viewer
- Markdown Renderer

---

# Design Consistency Rules

Always

- Use 8px spacing system.
- Keep typography consistent.
- Use the defined color palette.
- Follow responsive grid.
- Reuse components.
- Maintain accessibility standards.

Never

- Use random colors.
- Mix fonts.
- Use inline styles.
- Introduce inconsistent spacing.
- Create duplicate components.

---

# Future Design Enhancements

- Glassmorphism support
- Custom themes
- AI-generated dashboards
- Collaborative workspaces
- Real-time presence indicators
- White-label branding
- Multi-language UI
- Voice interaction interface
- Adaptive layouts for large displays
