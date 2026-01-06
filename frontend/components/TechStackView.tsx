interface Props {
  techStack: Record<string, { choice: string; reason: string }>;
}

export default function TechStackView({ techStack }: Props) {
  return (
    <section className="bg-white rounded-xl p-6 shadow">
      <h2 className="text-xl font-semibold mb-4">Recommended Tech Stack</h2>

      <div className="grid grid-cols-2 gap-4">
        {Object.entries(techStack).map(([key, value]) => (
          <div key={key} className="border rounded p-4">
            <h3 className="font-medium capitalize">{key}</h3>
            <p className="font-semibold">{value.choice}</p>
            <p className="text-sm text-gray-600">{value.reason}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
