interface Props {
  risks: {
    risks: {
      risk: string;
      severity: "Low" | "Medium" | "High";
      mitigation: string;
    }[];
  };
}

export default function RiskView({ risks }: Props) {
  const color = {
    Low: "text-green-600",
    Medium: "text-yellow-600",
    High: "text-red-600"
  };

  return (
    <section className="bg-white rounded-xl p-6 shadow">
      <h2 className="text-xl font-semibold mb-4">Risk Analysis</h2>

      <ul className="space-y-3">
        {risks.risks.map((r, i) => (
          <li key={i} className="border rounded p-3">
            <p className="font-medium">{r.risk}</p>
            <p className={color[r.severity]}>
              Severity: {r.severity}
            </p>
            <p className="text-sm text-gray-600">
              Mitigation: {r.mitigation}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
