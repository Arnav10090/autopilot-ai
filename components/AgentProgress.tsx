interface Props {
  currentStep: number;
}

const steps = [
  "Analyzing requirements",
  "Selecting tech stack",
  "Planning tasks",
  "Assessing risks"
];

export default function AgentProgress({ currentStep }: Props) {
  return (
    <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md p-6 border border-gray-100">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        AI Agents at Work
      </h2>

      <div className="space-y-3">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isActive = index === currentStep;
          const isPending = index > currentStep;

          return (
            <div
              key={step}
              className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                isActive ? "bg-blue-50" : ""
              }`}
            >
              <div
                className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium ${
                  isCompleted
                    ? "bg-green-500 text-white"
                    : isActive
                    ? "bg-blue-500 text-white animate-pulse"
                    : "bg-gray-200 text-gray-400"
                }`}
              >
                {isCompleted ? "✓" : isActive ? "⋯" : index + 1}
              </div>
              <span
                className={`font-medium ${
                  isCompleted
                    ? "text-green-700"
                    : isActive
                    ? "text-blue-700"
                    : "text-gray-400"
                }`}
              >
                {step}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}