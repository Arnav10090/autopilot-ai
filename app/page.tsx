import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="max-w-4xl w-full">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            AutoPilot AI
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Transform vague software ideas into structured, execution-ready project plans. 
            Powered by agentic AI to analyze requirements, recommend tech stacks, and assess risks.
          </p>
        </div>

        {/* CTA Card */}
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Ready to plan your next project?
          </h2>
          <p className="text-gray-600 mb-6">
            Our AI agents will work together to create a comprehensive project plan in minutes.
          </p>
          <Link
            href="/create"
            className="inline-block bg-blue-600 text-white px-8 py-4 rounded-lg font-medium text-lg hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
          >
            Create Project Plan
          </Link>
        </div>

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <div className="bg-white rounded-lg p-6 shadow">
            <div className="text-blue-600 font-semibold mb-2">Requirements Analysis</div>
            <p className="text-gray-600 text-sm">
              Extract functional and non-functional requirements from your project description
            </p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow">
            <div className="text-blue-600 font-semibold mb-2">Tech Stack Recommendations</div>
            <p className="text-gray-600 text-sm">
              Get AI-powered technology suggestions tailored to your team and timeline
            </p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow">
            <div className="text-blue-600 font-semibold mb-2">Risk Assessment</div>
            <p className="text-gray-600 text-sm">
              Identify potential risks and mitigation strategies before you start building
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}