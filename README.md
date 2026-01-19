<div align="center">

# 🚀 AutoPilot AI

### Transform Vague Ideas into Execution-Ready Project Plans

[![Next.js](https://img.shields.io/badge/Next.js-16.1.1-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.3-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-4.0-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)

[Demo](#-demo) • [Features](#-features) • [Installation](#-installation) • [Usage](#-usage) • [Documentation](#-documentation)

---

</div>

## 📖 Overview

**AutoPilot AI** is an intelligent, AI-powered project planning platform that transforms vague software concepts into comprehensive, structured, and execution-ready project plans. Powered by agentic AI, it analyzes requirements, recommends optimal tech stacks, assesses risks, and creates detailed execution plans—all in minutes.

Whether you're a startup founder, project manager, or development team lead, AutoPilot AI streamlines the critical planning phase of software development, saving time and reducing uncertainty.

### 🎯 Why AutoPilot AI?

- **⚡ Lightning Fast**: Generate comprehensive project plans in minutes, not days
- **🤖 AI-Powered Intelligence**: Multiple AI agents collaborate to deliver deep insights
- **📊 Data-Driven Decisions**: Get confidence ratings, risk assessments, and performance metrics
- **🎨 Beautiful UX**: Modern, glassmorphic design with dark mode support
- **♿ Accessible First**: WCAG AA compliant with full keyboard navigation
- **📱 Fully Responsive**: Seamless experience across desktop, tablet, and mobile

---

## ✨ Features

### 🔍 **Requirements Analysis**
- **Functional Requirements Extraction**: Automatically identify core features and capabilities
- **Non-Functional Requirements**: Performance, security, scalability considerations
- **Assumptions Tracking**: Document project assumptions and dependencies
- **Missing Information Detection**: Highlight gaps that need clarification

### 🛠️ **Tech Stack Recommendations**
- **AI-Powered Suggestions**: Get technology recommendations tailored to your project
- **Confidence Ratings**: See how confident the AI is about each recommendation
- **Category-Based Organization**: Frontend, backend, database, DevOps, and more
- **Reasoning Transparency**: Understand why each technology was recommended

### ⚠️ **Risk Assessment**
- **Comprehensive Risk Analysis**: Identify technical, timeline, and resource risks
- **Severity Indicators**: Visual classification (Low, Medium, High, Critical)
- **Mitigation Strategies**: Actionable steps to reduce or eliminate risks
- **Expandable Details**: Dive deep into each risk with full context

### 📋 **Execution Planning**
- **Module-Based Task Breakdown**: Organized by feature modules
- **Time Estimates**: Task-level duration predictions
- **Progress Tracking**: Visual progress indicators for each module
- **Drag & Drop Reordering**: Easily prioritize tasks with keyboard support
- **Dependency Visualization**: Understand task relationships

### 📊 **Analytics Dashboard**
- **KPI Monitoring**: Track projects analyzed, average ratings, agent performance
- **Cost Estimation**: Budget forecasting for project execution
- **Date Range Filtering**: Analyze data by 24h, 7d, 30d, 90d periods
- **Export Capabilities**: CSV, JSON, PDF export for reporting

### 🎨 **Beautiful Design System**
- **Glassmorphism UI**: Modern design with backdrop blur effects
- **Dark Mode**: Full dark mode support with system preference detection
- **Smooth Animations**: 15+ custom keyframe animations
- **3D Accents**: Interactive floating elements with parallax effects
- **Responsive Grid Layouts**: Adaptive layouts for all screen sizes

### 🔐 **User Experience**
- **Multi-Step Forms**: Progressive disclosure with validation
- **Auto-Save Drafts**: Never lose your work
- **Template Library**: 6+ pre-built project templates
- **Search & Filters**: Find projects quickly with smart search
- **Comments & Collaboration**: Threaded comments with @mentions
- **File Attachments**: Upload and manage project documents

---

## 🏗️ Tech Stack

### Frontend
- **Framework**: [Next.js 16.1.1](https://nextjs.org/) with App Router
- **UI Library**: [React 19.2.3](https://reactjs.org/)
- **Language**: [TypeScript 5](https://www.typescriptlang.org/)
- **Styling**: [TailwindCSS 4](https://tailwindcss.com/)
- **Fonts**: Google Fonts (Inter, Poppins, Fira Code)

### Backend
- **Runtime**: Node.js
- **AI Integration**: Google Generative AI
- **File Processing**: 
  - `jsPDF` - PDF generation
  - `docx` - DOCX document creation
  - `file-saver` - Client-side file downloads

### Development Tools
- **Linting**: ESLint 9 with Next.js config
- **Package Manager**: npm
- **Build Tool**: Turbopack (Next.js)

---

## 🚀 Installation

### Prerequisites
- **Node.js** 20.x or higher
- **npm** 9.x or higher
- **Git**

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/Arnav10090/autopilot-ai.git
   cd autopilot-ai
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   # Frontend (Optional - Add any API keys or configs)
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   
   # Backend (Navigate to /backend directory)
   GOOGLE_API_KEY=your_google_ai_api_key_here
   PORT=5000
   ```

4. **Run the development server**
   
   **Frontend:**
   ```bash
   npm run dev
   ```
   
   **Backend (in a separate terminal):**
   ```bash
   cd backend
   npm install
   npm start
   ```

5. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000) 🎉

---

## 📱 Usage

### Creating Your First Project

1. **Navigate to Create Project**
   - Click "Create Project Plan" from the homepage
   - Or visit `/create` directly

2. **Fill in Project Details**
   - **Step 1**: Basic project information (name, description)
   - **Step 2**: Team size and deadline
   - **Step 3**: Technical constraints and preferences
   - **Step 4**: Quality and scope requirements
   - **Step 5**: Review and submit

3. **AI Analysis**
   - The AI agents analyze your inputs
   - Generate requirements, tech stack, and risks
   - Create an execution plan with tasks

4. **Review & Refine**
   - View the generated project plan
   - Add comments and notes
   - Export in multiple formats (PDF, DOCX, CSV, JSON, Markdown)
   - Share with your team

### Using Templates

Speed up project creation with pre-built templates:
- E-commerce Platform
- SaaS Dashboard
- Mobile App (React Native)
- AI/ML Application
- Real-time Chat Application
- Portfolio Website

Navigate to `/templates` and click "Use Template" on any option.

### Exporting Projects

1. Open any project detail page
2. Click the "Export" button
3. Select sections to include:
   - ✅ Requirements Analysis
   - ✅ Tech Stack Recommendations
   - ✅ Risk Analysis
   - ✅ Execution Plan
   - ✅ Metrics & Performance
   - ✅ Notes & Attachments
4. Choose format (PDF, DOCX, CSV, JSON, Markdown)
5. Download instantly

---

<div align="center">

### ⭐ If you find this project useful, please consider giving it a star!

**Made with ❤️ by [Arnav10090](https://github.com/Arnav10090)**

</div>
