interface Props {
  techStack: Record<string, { choice: string; reason: string }>;
}

export default function TechStackView({ techStack }: Props) {
  return (
    <section className="bg-white rounded-xl shadow-md p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Recommended Tech Stack</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Object.entries(techStack).map(([category, details]) => (
          <div
            key={category}
            className="border border-gray-200 rounded-lg p-6 hover:border-blue-300 hover:shadow-md transition-all"
          >
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
              {category}
            </h3>
            <div className="text-xl font-bold text-gray-900 mb-3">
              {details.choice}
            </div>
            <p className="text-gray-600 text-sm leading-relaxed">
              {details.reason}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}