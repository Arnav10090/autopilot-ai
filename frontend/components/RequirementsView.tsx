interface Props {
  requirements: {
    functional_requirements: string[];
    non_functional_requirements: string[];
    assumptions: string[];
    missing_information: string[];
  };
}

export default function RequirementsView({ requirements }: Props) {
  return (
    <section className="bg-white rounded-xl p-6 shadow space-y-4">
      <h2 className="text-xl font-semibold">Requirements</h2>

      <div>
        <h3 className="font-medium">Functional</h3>
        <ul className="list-disc ml-6">
          {requirements.functional_requirements.map((r, i) => (
            <li key={i}>{r}</li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="font-medium">Non-Functional</h3>
        <ul className="list-disc ml-6">
          {requirements.non_functional_requirements.map((r, i) => (
            <li key={i}>{r}</li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="font-medium">Assumptions</h3>
        <ul className="list-disc ml-6">
          {requirements.assumptions.map((r, i) => (
            <li key={i}>{r}</li>
          ))}
        </ul>
      </div>

      {requirements.missing_information.length > 0 && (
        <div className="bg-yellow-50 p-3 rounded">
          <h3 className="font-medium text-yellow-800">Missing Information</h3>
          <ul className="list-disc ml-6">
            {requirements.missing_information.map((r, i) => (
              <li key={i}>{r}</li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
