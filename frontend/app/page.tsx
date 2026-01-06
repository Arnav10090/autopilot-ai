import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center text-center bg-gray-50 p-6">
      <h1 className="text-4xl font-bold mb-4">AutoPilot AI</h1>
      <p className="text-gray-600 max-w-xl mb-6">
        Turn vague software ideas into structured, execution-ready plans using
        agentic AI.
      </p>

      <Link
        href="/create"
        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
      >
        Create Project Plan
      </Link>
    </main>
  );
}
