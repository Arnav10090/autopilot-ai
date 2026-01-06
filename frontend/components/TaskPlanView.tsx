interface Props {
  taskPlan: {
    modules: {
      module_name: string;
      tasks: {
        task_name: string;
        estimate_days: number;
        depends_on: string[];
      }[];
    }[];
  };
}

export default function TaskPlanView({ taskPlan }: Props) {
  return (
    <section className="bg-white rounded-xl p-6 shadow">
      <h2 className="text-xl font-semibold mb-4">Execution Plan</h2>

      {taskPlan.modules.map((module, i) => (
        <div key={i} className="mb-4">
          <h3 className="font-medium">{module.module_name}</h3>
          <ul className="ml-4 list-disc">
            {module.tasks.map((task, j) => (
              <li key={j}>
                {task.task_name} — {task.estimate_days} days
              </li>
            ))}
          </ul>
        </div>
      ))}
    </section>
  );
}
