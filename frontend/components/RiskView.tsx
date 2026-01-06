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
  const severityConfig = {
    Low: {
      bg: "bg-green-50",
      border: "border-green-200",
      text: "text-green-700",
      badge: "bg-green-100 text-green-800"
    },
    Medium: {
      bg: "bg-yellow-50",
      border: "border-yellow-200",
      text: "text-yellow-700",
      badge: "bg-yellow-100 text-yellow-800"
    },
    High: {
      bg: "bg-red-50",
      border: "border-red-200",
      text: "text-red-700",
      badge: "bg-red-100 text-red-800"
    }
  };

  return (
    <section className="bg-white rounded-xl shadow-md p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Risk Analysis</h2>

      <div className="space-y-4">
        {risks.risks.map((risk, i) => {
          const config = severityConfig[risk.severity];
          return (
            <div
              key={i}
              className={`border rounded-lg p-5 ${config.border} ${config.bg}`}
            >
              <div className="flex items-start justify-between gap-4 mb-3">
                <h3 className="font-semibold text-gray-900 flex-1">
                  {risk.risk}
                </h3>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium flex-shrink-0 ${config.badge}`}
                >
                  {risk.severity}
                </span>
              </div>
              <div className={`text-sm ${config.text}`}>
                <span className="font-medium">Mitigation:</span> {risk.mitigation}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}