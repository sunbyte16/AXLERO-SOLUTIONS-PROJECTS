# 🤝 Contributing to FedMed AI Engine

Thank you for your interest in contributing to **FedMed AI Engine**! We welcome contributions from healthcare researchers, cryptographers, machine learning engineers, and software developers around the globe.

---

## 📜 Table of Contents

- [Code of Conduct](#-code-of-conduct)
- [How Can I Contribute?](#-how-can-i-contribute)
  - [Reporting Bugs](#reporting-bugs)
  - [Suggesting Enhancements](#suggesting-enhancements)
  - [Contributing Code](#contributing-code)
- [Development Setup](#-development-setup)
- [Git Workflow & Branching Strategy](#-git-workflow--branching-strategy)
- [Commit Message Guidelines](#-commit-message-guidelines)
- [Pull Request Process](#-pull-request-process)
- [Coding Standards](#-coding-standards)
- [Community & Support](#-community--support)

---

## 🕊️ Code of Conduct

All contributors and maintainers are expected to adhere to our [Code of Conduct](./CODE_OF_CONDUCT.md). Please report any unacceptable behavior to the project maintainer.

---

## 💡 How Can I Contribute?

### Reporting Bugs
If you find a bug or vulnerability:
1. Search existing [GitHub Issues](https://github.com/sunbyte16/fedmed-ai-engine/issues) to ensure it has not already been reported.
2. If not found, open a new issue using our **Bug Report Template**.
3. Include:
   - Clear description of the bug
   - Minimal steps to reproduce
   - Expected behavior vs. actual behavior
   - Screenshots or console logs if applicable
   - Environment info (OS, Node.js version, browser)

### Suggesting Enhancements
Feature requests are always appreciated!
1. Check existing issues to see if the feature is already under discussion.
2. Open an issue using the **Feature Request Template**.
3. Detail the clinical, cryptographic, or machine learning rationale and proposed implementation.

### Contributing Code
1. Browse open issues labeled `good first issue` or `help wanted`.
2. Leave a comment expressing interest so work is not duplicated.
3. Fork the repository and develop your changes in a feature branch.

---

## 💻 Development Setup

### 1. Prerequisites
- **Node.js**: `v18.0.0` or higher
- **npm** or **bun** package manager
- **Python**: `3.9+` *(optional for native PyTorch & TenSEAL testing)*
- **Git**

### 2. Local Installation
```bash
# 1. Fork and clone the repository
git clone https://github.com/<your-username>/fedmed-ai-engine.git
cd fedmed-ai-engine

# 2. Install dependencies
npm install

# 3. Create local environment configuration
cp .env.example .env.local

# 4. Start the development server
npm run dev
```

### 3. Verification Scripts
```bash
# Run TypeScript compilation and lint check
npm run lint

# Build full production bundle
npm run build
```

---

## 🌿 Git Workflow & Branching Strategy

1. **Fork** the repository and create your branch from `main`.
2. Branch naming conventions:
   - `feat/<feature-name>` for new features (e.g., `feat/add-fl-strategy-fedprox`)
   - `fix/<bug-name>` for bug fixes (e.g., `fix/sqlite-session-bind`)
   - `docs/<doc-name>` for documentation updates (e.g., `docs/update-he-formula`)
   - `refactor/<module>` for code refactoring
   - `perf/<optimization>` for performance improvements

---

## ✍️ Commit Message Guidelines

We enforce the **Conventional Commits** specification:

```
<type>(<scope>): <short description>

[optional body explaining rationale]

[optional footer(s), e.g. Closes #123]
```

### Allowed Types:
- `feat`: A new user-facing feature or API capability
- `fix`: A bug fix
- `docs`: Documentation changes only
- `style`: Changes that do not affect the meaning of code (formatting, white-space)
- `refactor`: A code change that neither fixes a bug nor adds a feature
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `chore`: Build process or auxiliary tool changes

### Examples:
```bash
git commit -m "feat(fl-engine): integrate FedProx straggler mitigation strategy"
git commit -m "fix(mri-viewer): resolve canvas aspect ratio on mobile screens"
git commit -m "docs(readme): add interactive architecture sequence diagram"
```

---

## 🚀 Pull Request Process

1. Ensure your code passes all type checks (`npm run lint`) and builds cleanly (`npm run build`).
2. Update documentation and inline docstrings if modifying APIs or components.
3. Fill out the **Pull Request Template** completely.
4. Keep pull requests focused on a single topic or feature.
5. Rebase on the latest `main` branch before submitting.
6. A project maintainer will review your PR and provide constructive feedback.

---

## 📐 Coding Standards

### TypeScript & React
- Use strict TypeScript types. Avoid using `any` whenever possible.
- Favor functional components with React Hooks.
- Use Tailwind CSS utility classes adhering to the project's medical dark-mode design system.
- Ensure all clickable interactive elements provide clear feedback and accessibility indicators.

### Python (FL & Cryptography Modules)
- Adhere to **PEP 8** style guidelines.
- Use explicit type annotations (`from typing import Tuple, List, Optional`).
- Ensure all tensor transformations strictly preserve homomorphic encryption contexts and differential privacy noise bounds.

---

## 👨‍💻 Community & Support

Have questions or need guidance?
- **Author & Maintainer**: [**𝕊𝕦𝕟𝕚𝕝 𝕊𝕙𝕒𝕣𝕞𝕒**](https://github.com/sunbyte16)
- **LinkedIn**: [Sunil Kumar](https://www.linkedin.com/in/sunil-kumar-bb88bb31a/)
- **Portfolio**: [Visit Portfolio](https://lively-dodol-cc397c.netlify.app)
- **Discussions & Issues**: [GitHub Issues](https://github.com/sunbyte16/fedmed-ai-engine/issues)
