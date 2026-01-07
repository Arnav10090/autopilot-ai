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
    <section className="bg-white rounded-xl shadow-md p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Requirements Analysis</h2>

      <div className="space-y-6">
        {/* Functional Requirements */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Functional Requirements</h3>
          <ul className="space-y-2">
            {requirements.functional_requirements.map((req, i) => (
              <li key={i} className="flex items-start gap-2 text-gray-700">
                <span className="text-blue-500 mt-1">•</span>
                <span>{req}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Non-Functional Requirements */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Non-Functional Requirements</h3>
          <ul className="space-y-2">
            {requirements.non_functional_requirements.map((req, i) => (
              <li key={i} className="flex items-start gap-2 text-gray-700">
                <span className="text-blue-500 mt-1">•</span>
                <span>{req}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Assumptions */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Assumptions</h3>
          <ul className="space-y-2">
            {requirements.assumptions.map((assumption, i) => (
              <li key={i} className="flex items-start gap-2 text-gray-700">
                <span className="text-blue-500 mt-1">•</span>
                <span>{assumption}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Missing Information */}
        {requirements.missing_information.length > 0 && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-5 rounded-r-lg">
            <h3 className="text-lg font-semibold text-yellow-800 mb-3 flex items-center gap-2">
              <span>⚠</span>
              <span>Missing Information</span>
            </h3>
            <ul className="space-y-2">
              {requirements.missing_information.map((info, i) => (
                <li key={i} className="flex items-start gap-2 text-yellow-900">
                  <span className="text-yellow-600 mt-1">•</span>
                  <span>{info}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}