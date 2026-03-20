# Autopilot AI - Project Architecture & File Guide

This document is designed to help you understand the codebase structure and the significance of each file so you can confidently explain the project to an interviewer.

## 🏗️ High-Level Architecture
This project is an AI-powered project planner built with a **Full-Stack JavaScript/TypeScript architecture**:
*   **Frontend**: Next.js (App Router), React, Tailwind CSS. Focuses on the UI/UX for collecting project requirements, showing progress animations, and displaying the generated plan.
*   **Backend**: Node.js, Express.js. Handles API requests, coordinates multiple Large Language Model (LLM) agents, handles prompt structuring, JSON validation, and error fallback logic.
*   **AI Integration**: Groq API (using Llama models) for fast, free LLM inference.

---

## 🖥️ Frontend Architecture (`/`)

The frontend is a Next.js application using the App Router (`/app`).

### Main Application (`/app` & `/components`)
*   **`app/layout.tsx`**: The root layout of the entire Next.js application. It wraps the app in global providers, handles fonts, and defines the base HTML structure.
*   **`app/(main)/`**: Contains the core application pages (like the home page or dashboard) authenticated behind a layout.
*   **`app/auth/`**: Contains the authentication pages (Login, Sign up).
*   **`components/ProjectForm.tsx`**: A critical UI component. This is the multi-step form where users enter project details, team size, timeline, etc. It handles state transitions between steps and calls the backend analysis API.
*   **`components/AgentProgress.tsx`**: The loading animation component that visually simulates the AI "thinking" while the backend agents are doing their work.

### Result Displays (`/components`)
Once the AI finishes generating the plan, these components render the output:
*   **`RequirementsView.tsx`**: Displays the parsed functional/non-functional requirements and assumptions.
*   **`TechStackView.tsx`**: Renders the AI's recommendations for Frontend, Backend, Database, and Deployment.
*   **`TaskPlanView.tsx`**: Displays the detailed chronological execution plan (modules, tasks, timelines, effort hours).
*   **`RiskView.tsx`**: Displays potential project risks and their mitigations.

### Services & Reusability (`/services` & `/components/ui`)
*   **`services/api.ts`**: The central API client for the frontend. It contains functions that make `fetch` requests to your Node.js backend.
*   **`services/exportHandler.ts`**: Contains logic to export the fully generated project plan into downloadable formats (like Markdown or PDF).
*   **`components/ui/`**: A library of reusable, generic UI components (e.g., `Button.tsx`, `Card.tsx`, `Input.tsx`, `Select.tsx`). Building these separately ensures UI consistency across the app.

---

## ⚙️ Backend Architecture (`/backend/src`)

The backend is an Express Node.js application built with a service-oriented architecture, heavily focused on orchestrating LLM agents.

### Entry Points & Configuration
*   **`server.js`**: The entry point that starts the Node.js server, binds it to a port, and listens for requests.
*   **`app.js`**: Initializes the Express application, sets up middleware (CORS, body parsing, logging), and registers the API route handlers.
*   **`config/`**: Directory containing configuration files (like environment variables parsing, database credentials, etc.).
*   **`db/`**: Contains database connections and Mongoose/Prisma models (e.g., saving user profiles or generated projects).

### The Agent Orchestrator & Services (`/services`)
This is the core "brain" of the application where the AI logic lives.
*   **`services/agentOrchestrator.js`**: The conductor. It coordinates the 4 LLM agents **sequentially**, passing the output of one agent as context to the next (e.g., passing AI-generated requirements to the Tech Stack agent). It also manages rate limiting between calls.
*   **`services/requirementAgent.js`**: Prompts the LLM to take the initial user input and turn it into strict functional and non-functional requirements.
*   **`services/techStackAgent.js`**: Looks at the requirements and constraints (like team size/skill level) and asks the LLM to recommend the best technologies.
*   **`services/taskPlannerAgent.js`**: The heaviest agent. It takes the requirements and tech stack, and prompts the LLM to generate a detailed, week-by-week task execution plan with modules, dependencies, and effort estimates.
*   **`services/riskAssessmentAgent.js`**: Evaluates the entire formulated plan to identify risks and suggest mitigations.

### Utilities & AI Tooling (`/utils`)
These files make the LLM integration reliable and fault-tolerant. This is a great area to highlight in an interview to show you write "production-ready" AI code, not just basic API calls.
*   **`utils/groqClient.js`**: The wrapper around the Groq API (or Gemini). It handles the actual HTTP request to the LLM provider, manages timeouts, and actively handles HTTP 429 Rate Limit errors by sleeping and automatically retrying.
*   **`utils/executeWithGuards.js`**: A defensive wrapper for LLM calls. LLMs can be unpredictable. This utility automatically validates the LLM's JSON output against a strict schema. If the LLM generates invalid JSON, it forces a retry. If it completely fails after max retries, it returns a hardcoded "fallback" plan so the app doesn't crash.
*   **`utils/extractJSON.js`**: A robust JSON parser. LLMs often output markdown blocks (like \`\`\`json) or trailing text. This utility uses brace-matching to safely extract just the valid JSON object, preventing parsing crashes.
*   **`utils/schema.js` & `utils/fallbacks.js`**: Define the structures the AI *must* adhere to, and provide the hardcoded backup data used if `executeWithGuards.js` exhausts its retries.

---

## 🎯 How to Explain the Flow to an Interviewer

1.  **"User Input"**: The user fills out the multi-step `ProjectForm.tsx` on the frontend and clicks submit.
2.  **"API Call"**: The frontend calls `services/api.ts`, which sends the data to the Express backend router.
3.  **"Orchestration"**: The router hands the data to `agentOrchestrator.js`.
4.  **"Sequential Agents"**: The Orchestrator runs 4 AI Agents in sequence. Crucially, each agent call is mapped through `executeWithGuards.js` to ensure the API response is strictly validated JSON.
5.  **"Response & Render"**: Once all agents finish, the orchestrated JSON is sent back to the frontend, which uses the various View components (`TaskPlanView.tsx`, etc.) to beautifully render the final result.
