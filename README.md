<div align="center">

# 🚀 <a href="https://drive.google.com/drive/folders/1-84TLzj0sAQjrpG2JpKtJ6hxSG7RqriY?usp=sharing" target="_blank">AutoPilot AI</a>

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
- **Smart Actions**: One-click copy for all requirements or individual items with instant feedback

### 🛠️ **Tech Stack Recommendations**
- **AI-Powered Suggestions**: Get technology recommendations tailored to your project
- **Confidence Ratings**: See how confident the AI is about each recommendation
- **Detailed Reasoning**: Transparent view of why each technology was chosen
- **Quick Copy**: Easily copy recommendations and reasons to clipboard

### ⚠️ **Risk Assessment**
- **Comprehensive Risk Analysis**: Identify technical, timeline, and resource risks
- **Severity Indicators**: Visual classification (Low, Medium, High, Critical)
- **Mitigation Strategies**: Actionable steps to reduce or eliminate risks
- **Interactive Elements**: Expandable details and copy functionality for risk items

### 📋 **Execution Planning**
- **Module-Based Task Breakdown**: Organized by feature modules
- **Smart Copy**: Copy entire modules with tasks or individual items
- **Progress Tracking**: Visual progress indicators for each module
- **Drag & Drop Reordering**: Easily prioritize tasks with keyboard support
- **Dependency Visualization**: Understand task relationships

### � **AI Chatbot Assistant**
- **Context-Aware Help**: Ask questions about your generated project plan
- **Instant Clarifications**: Get explanations for technical terms or requirements
- **Modifiable Suggestions**: Request changes to specific project sections through chat
- **Floating Interface**: Access the assistant from anywhere in the application

### �🔐 **Security & Authentication**
- **OAuth 2.0 Integration**: Sign in securely with Google or GitHub
- **Account Linking**: Link multiple providers to a single account
- **Profile Management**: Update personal details and manage passwords
- **Danger Zone**: Secure account deletion with confirmation safeguards

### 🌐 **Global Accessibility**
- **Internationalization (i18n)**: Native support for English, Spanish, French, and German
- **Global Search**: Instantly find projects, templates, and settings
- **Theme System**: Intelligent Light/Dark/System modes with smooth transitions
- **Responsive Design**: Centered layouts optimized for all viewport sizes

### 📊 **Analytics Dashboard**
- **KPI Monitoring**: Track projects analyzed, average ratings, agent performance
- **Cost Estimation**: Budget forecasting for project execution
- **Date Range Filtering**: Analyze data by 24h, 7d, 30d, 90d periods
- **Export Capabilities**: CSV, JSON, PDF export for reporting

---

## 🏗️ Tech Stack

### Frontend
- **Framework**: [Next.js 16.1.1](https://nextjs.org/) with App Router
- **UI Library**: [React 19.2.3](https://reactjs.org/)
- **State Management**: Context API (Search, Auth, Theme, Language)
- **Language**: [TypeScript 5](https://www.typescriptlang.org/)
- **Styling**: [TailwindCSS 4](https://tailwindcss.com/)
- **Fonts**: Google Fonts (Inter, Poppins, Fira Code)

### Backend
- **Runtime**: Node.js & Express
- **Authentication**: Passport.js (Google & GitHub OAuth)
- **AI Integration**: Google Generative AI (Gemini)
- **File Processing**: 
  - `jsPDF` - PDF generation
  - `html2canvas` - QR & Element capture
  - `docx` - DOCX document creation

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
   # Frontend (Optional)
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   
   # Backend (Create .env in /backend)
   PORT=5000
   GOOGLE_API_KEY=your_gemini_api_key
   
   # OAuth Configuration (Optional - for Auth)
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   GITHUB_CLIENT_ID=your_github_client_id
   GITHUB_CLIENT_SECRET=your_github_client_secret
   SESSION_SECRET=your_session_secret
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
