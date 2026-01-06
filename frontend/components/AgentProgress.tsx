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
    <div className="bg-white rounded-xl p-6 shadow space-y-3">
      <h2 className="text-lg font-semibold">AI Agents at Work</h2>

      <ul className="space-y-2">
        {steps.map((step, index) => (
          <li
            key={step}
            className={`flex items-center ${
              index <= currentStep ? "text-green-600" : "text-gray-400"
            }`}
          >
            <span className="mr-2">
              {index < currentStep ? "✔" : index === currentStep ? "⏳" : "•"}
            </span>
            {step}
          </li>
        ))}
      </ul>
    </div>
  );
}
