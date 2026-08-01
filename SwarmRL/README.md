<div align="center">

  # 🤖 SwarmRL – Multi-Agent DRL Simulator

  ### Enterprise-grade Multi-Agent Deep Reinforcement Learning (MAPPO) Platform

  ![Platform](https://img.shields.io/badge/Platform-React%20%7C%20Three.js%20%7C%20Node.js-blue)
  ![License](https://img.shields.io/badge/License-MIT-green)
  ![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue)
  ![Status](https://img.shields.io/badge/Status-Active-success)

  [![Features](https://img.shields.io/badge/Features-3D%20Simulation%20%7C%20Real--time%20Telemetry%20%7C%20Training%20Analytics-orange)](https://github.com/sunbyte16)
  [![MAPO](https://img.shields.io/badge/Algorithm-MAPPO-purple)](https://github.com/sunbyte16)

  <p>
    <a href="https://github.com/sunbyte16" target="_blank">
      <img src="https://img.shields.io/badge/GitHub-sunbyte16-181717?style=for-the-badge&logo=github&logoColor=white" alt="GitHub" />
    </a>
    <a href="https://www.linkedin.com/in/sunil-kumar-bb88bb31a/" target="_blank">
      <img src="https://img.shields.io/badge/LinkedIn-Sunil%20Kumar-0077B5?style=for-the-badge&logo=linkedin&logoColor=white" alt="LinkedIn" />
    </a>
    <a href="https://lively-dodol-cc397c.netlify.app" target="_blank">
      <img src="https://img.shields.io/badge/Portfolio-View%20Online-00C853?style=for-the-badge&logo=netlify&logoColor=white" alt="Portfolio" />
    </a>
  </p>

  <p>
    <strong>Continuous 3D disaster-response simulation with real-time telemetry streaming and training analytics</strong>
  </p>

</div>

---

## 📋 Table of Contents

- [🌟 Overview](#-overview)
- [✨ Features](#-features)
- [🚀 Quick Start](#-quick-start)
- [🛠️ Installation](#️-installation)
- [💻 Usage](#-usage)
- [🏗️ Architecture](#️-architecture)
- [🧪 Tech Stack](#-tech-stack)
- [📊 Project Structure](#-project-structure)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)
- [👨‍💻 Author](#-author)

---

## 🌟 Overview

SwarmRL is an enterprise-grade **Multi-Agent Deep Reinforcement Learning (MAPPO)** platform designed for advanced disaster-response simulations. It provides a comprehensive environment for training and evaluating multiple AI agents in complex 3D scenarios with real-time performance monitoring and analytics.

### Key Capabilities

- 🎯 **Multi-Agent Coordination** using MAPPO (Multi-Agent Proximal Policy Optimization)
- 🌍 **3D Disaster Simulation** with realistic physics and environmental factors
- 📡 **Real-time Telemetry** streaming for live performance monitoring
- 📈 **Training Analytics** with comprehensive visualization tools
- 🔧 **Enterprise-grade Architecture** built for scalability and reliability

---

## ✨ Features

### 🎮 Simulation Engine
- **Continuous 3D Environment** powered by Three.js and React Three Fiber
- **Realistic Physics** simulation for disaster scenarios
- **Dynamic Agent Behavior** with autonomous decision-making
- **Real-time Rendering** with optimized performance

### 🧠 AI/ML Capabilities
- **MAPPO Algorithm** for multi-agent coordination
- **Deep Reinforcement Learning** with continuous action spaces
- **Model Training** with performance tracking
- **Agent Policy Optimization** for complex scenarios

### 📊 Analytics & Monitoring
- **Live Telemetry Dashboard** with real-time metrics
- **Performance Visualization** using Recharts and D3
- **Training Progress Tracking** with detailed analytics
- **Agent Behavior Analysis** with heatmaps and trajectory plots

### 🔧 Developer Experience
- **TypeScript** for type-safe development
- **Hot Module Replacement** for rapid iteration
- **Modular Architecture** for easy extension
- **Comprehensive Documentation** and examples

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v18 or higher)
- **npm** or **bun** package manager
- **Gemini API Key** (for AI functionality)

### Installation

```bash
# Clone the repository
git clone https://github.com/sunbyte16/swarmrl-multi-model.git
cd swarmrl-multi-model

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env
# Edit .env and add your GEMINI_API_KEY
```

### Running the Application

```bash
# Development mode
npm run dev

# Production build
npm run build
npm start

# Preview production build
npm run preview
```

The application will be available at `http://localhost:3000`

---

## 🛠️ Installation

### Step-by-Step Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Configuration**
   - Copy `.env.example` to `.env`
   - Set your `GEMINI_API_KEY` in the `.env` file
   - Configure other environment variables as needed

3. **Database Setup**
   - The application uses SQLite (via better-sqlite3)
   - Database is automatically created on first run

4. **Build the Project**
   ```bash
   npm run build
   ```

5. **Start the Server**
   ```bash
   npm start
   ```

---

## 💻 Usage

### Development Workflow

```bash
# Run in development mode with hot reload
npm run dev

# Type checking
npm run lint

# Clean build artifacts
npm run clean
```

### API Endpoints

- `GET /` - Main application
- `WS /telemetry` - WebSocket endpoint for real-time telemetry
- `POST /api/auth` - Authentication endpoints
- `GET /api/agents` - Agent management
- `GET /api/simulation` - Simulation control

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `GEMINI_API_KEY` | Google Gemini API key for AI functionality | Yes |
| `PORT` | Server port (default: 3000) | No |
| `NODE_ENV` | Environment (development/production) | No |

---

## 🏗️ Architecture

### System Components

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend (React)                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  Dashboard   │  │  Simulation  │  │  Analytics   │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            │
                    WebSocket │ HTTP
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                  Backend (Node.js/Express)                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   API Layer  │  │  Simulation  │  │  Training    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            │
                    ▼       ▼       ▼
              ┌─────────┐ ┌─────────┐ ┌─────────┐
              │ SQLite  │ │ Gemini  │ │  MAPPO  │
              │   DB    │ │   API   │ │ Engine  │
              └─────────┘ └─────────┘ └─────────┘
```

### Key Modules

- **`src/components/`** - React UI components
- **`src/simulation/`** - 3D simulation engine
- **`src/rl/`** - Reinforcement learning algorithms
- **`src/server/`** - Backend API and WebSocket handlers
- **`src/stores/`** - State management (Zustand)
- **`src/lib/`** - Utility functions and helpers

---

## 🧪 Tech Stack

### Frontend
- **React 19** - UI framework
- **Three.js** - 3D graphics
- **React Three Fiber** - React renderer for Three.js
- **React Three Drei** - Three.js helpers for React
- **Tailwind CSS** - Styling
- **Recharts** - Data visualization
- **D3.js** - Advanced data visualization
- **Lucide React** - Icon library
- **Motion** - Animation library
- **Zustand** - State management
- **React Router** - Navigation

### Backend
- **Node.js** - Runtime environment
- **Express** - Web framework
- **WebSocket (ws)** - Real-time communication
- **SQLite (better-sqlite3)** - Database
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Google GenAI SDK** - AI integration

### Development Tools
- **TypeScript** - Type safety
- **Vite** - Build tool
- **ESBuild** - Bundling
- **TSX** - TypeScript execution

---

## 📊 Project Structure

```
swarmrl-multi-model/
├── assets/              # Static assets
├── data/                # Data files
├── dist/                # Build output
├── docs/                # Documentation
├── src/
│   ├── components/      # React components
│   ├── lib/            # Utility libraries
│   ├── rl/             # Reinforcement learning
│   ├── server/         # Backend server
│   ├── simulation/     # 3D simulation
│   ├── stores/         # State management
│   ├── types/          # TypeScript types
│   ├── App.tsx         # Main app component
│   ├── DashboardApp.tsx
│   ├── main.tsx        # Entry point
│   └── index.css       # Global styles
├── .env.example        # Environment template
├── .gitignore
├── package.json
├── tsconfig.json
├── vite.config.ts
├── server.ts           # Server entry point
└── README.md
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow the existing code style
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 👨‍💻 Author

<div align="center">

**Created By 𝕊𝕦𝕟𝕚𝕝 𝕊𝕙𝕒𝕣𝕞𝕒 **

<p>
  <a href="https://github.com/sunbyte16" target="_blank">
    <img src="https://img.shields.io/badge/GitHub-sunbyte16-181717?style=for-the-badge&logo=github&logoColor=white" alt="GitHub" />
  </a>
  <a href="https://www.linkedin.com/in/sunil-kumar-bb88bb31a/" target="_blank">
    <img src="https://img.shields.io/badge/LinkedIn-Sunil%20Kumar-0077B5?style=for-the-badge&logo=linkedin&logoColor=white" alt="LinkedIn" />
  </a>
  <a href="https://lively-dodol-cc397c.netlify.app" target="_blank">
    <img src="https://img.shields.io/badge/Portfolio-View%20Online-00C853?style=for-the-badge&logo=netlify&logoColor=white" alt="Portfolio" />
  </a>
</p>

<p>
  <em>Multi-Agent Deep Reinforcement Learning Researcher & Developer</em>
</p>

</div>

---

<div align="center">

**⭐ If you find this project helpful, please consider giving it a star! ⭐**

Crafted with ☕ & by Sunil Sharma

</div>
